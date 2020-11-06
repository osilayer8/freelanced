import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { Currency } from '../../shared/util/currency';
import './Auth.scss';

interface authProps {
  isLoggedIn: boolean;
  userId: number | null;
  login: (userId?: number, token?: string, theme?: string) => void;
  logout: () => void;
}

const Auth: React.FC = () => {
  const auth: authProps = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      pass: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.pass.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          pass: {
            value: '',
            isValid: true,
          },
          name: {
            value: '',
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
    setIsSubmitted(false);
  };

  const authSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const countryCode = navigator.language ? navigator.language : 'en-US';

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            pass: formState.inputs.pass.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        auth.login(responseData.userId, responseData.token, responseData.theme);
      } catch (err) {}
    } else {
      try {
        await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/signup',
          'POST',
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            pass: formState.inputs.pass.value,
            language: countryCode,
            currency: Currency(countryCode),
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        setIsSubmitted(true);
        //auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="logo">
          <Link to="/">
            <svg
              width="218"
              height="255"
              viewBox="0 0 218 255"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M159.913 -5.21249C163.568 4.83026 173.606 19.7102 161.878 47.3643C150.984 73.0497 126.652 94.4939 54.912 94.4939C-2.87901 94.4939 -13.3388 139.523 19.0882 156.922C23.2217 159.139 20.301 173.046 29.9406 182.438C39.4152 191.669 51.6246 193.081 55.6626 197.185C57.4904 199.041 66.1745 193.259 66.9042 194.565C72.876 205.291 77.7966 214.128 81.6643 221.073C85.7474 228.408 91.8773 239.414 100.047 254.085C34.7135 254.085 33.6293 184.915 105.26 184.915C176.999 184.915 201.331 163.466 212.225 137.784C223.953 110.123 213.716 73.1748 195.436 44.8605L159.913 -5.21249Z"
                fill="url(#paint0_linear)"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M159.912 -5.21249C174.594 22.584 190.388 49.8489 178.66 77.4995C167.766 103.187 143.434 124.631 71.6944 124.631C0.0641975 124.631 1.1484 193.806 66.4819 193.806L83.2609 223.945C17.9327 223.945 16.8485 154.775 88.4786 154.775C160.22 154.775 184.55 133.325 195.444 107.643C207.172 79.9858 195.444 48.9836 174.594 16.7478L159.912 -5.21249Z"
                fill="url(#paint1_linear)"
              />
              <path
                d="M54.9434 129.719C54.0527 129.719 53.3672 129.924 52.8867 130.334C52.4062 130.733 52.166 131.307 52.166 132.057V133.639H55.9102V137.629H52.166V152.659H46.6641V137.629H43.8867V133.639H46.6641V132.057C46.6641 130.616 46.9512 129.391 47.5254 128.383C48.0996 127.364 48.9199 126.596 49.9863 126.081C51.0645 125.553 52.3359 125.29 53.8008 125.29C54.6211 125.29 55.5117 125.413 56.4727 125.659V129.877C56.0273 129.772 55.5176 129.719 54.9434 129.719Z"
                fill="white"
              />
              <path
                d="M67.8457 133.288C68.502 133.288 69.0352 133.358 69.4453 133.499L69.375 138.807C68.4727 138.713 67.8398 138.667 67.4766 138.667C66.5156 138.667 65.7305 138.819 65.1211 139.124C64.5234 139.428 64.084 139.885 63.8027 140.495V152.659H58.3184V133.639H63.4688L63.6445 135.977C64.125 135.11 64.7168 134.448 65.4199 133.991C66.1348 133.522 66.9434 133.288 67.8457 133.288Z"
                fill="white"
              />
              <path
                d="M88.5703 144.942H76.6348C76.8457 146.067 77.332 146.958 78.0938 147.614C78.8555 148.258 79.8281 148.581 81.0117 148.581C81.9258 148.581 82.7695 148.417 83.543 148.088C84.3164 147.76 84.9785 147.25 85.5293 146.559L88.1133 149.635C87.4453 150.584 86.4668 151.387 85.1777 152.043C83.8887 152.688 82.3828 153.01 80.6602 153.01C78.7031 153.01 76.998 152.6 75.5449 151.78C74.0918 150.948 72.9785 149.829 72.2051 148.422C71.4316 147.016 71.0449 145.469 71.0449 143.782V143.114C71.0449 141.227 71.4023 139.545 72.1172 138.069C72.832 136.581 73.8633 135.415 75.2109 134.571C76.5703 133.715 78.1875 133.288 80.0625 133.288C81.8555 133.288 83.3906 133.668 84.668 134.43C85.9453 135.18 86.9121 136.258 87.5684 137.665C88.2363 139.059 88.5703 140.706 88.5703 142.604V144.942ZM83.1914 140.864C83.1914 139.879 82.9219 139.112 82.3828 138.561C81.8555 137.999 81.0703 137.717 80.0273 137.717C78.1641 137.717 77.0391 138.913 76.6523 141.303H83.1914V140.864Z"
                fill="white"
              />
              <path
                d="M108.117 144.942H96.1816C96.3926 146.067 96.8789 146.958 97.6406 147.614C98.4023 148.258 99.375 148.581 100.559 148.581C101.473 148.581 102.316 148.417 103.09 148.088C103.863 147.76 104.525 147.25 105.076 146.559L107.66 149.635C106.992 150.584 106.014 151.387 104.725 152.043C103.436 152.688 101.93 153.01 100.207 153.01C98.25 153.01 96.5449 152.6 95.0918 151.78C93.6387 150.948 92.5254 149.829 91.752 148.422C90.9785 147.016 90.5918 145.469 90.5918 143.782V143.114C90.5918 141.227 90.9492 139.545 91.6641 138.069C92.3789 136.581 93.4102 135.415 94.7578 134.571C96.1172 133.715 97.7344 133.288 99.6094 133.288C101.402 133.288 102.938 133.668 104.215 134.43C105.492 135.18 106.459 136.258 107.115 137.665C107.783 139.059 108.117 140.706 108.117 142.604V144.942ZM102.738 140.864C102.738 139.879 102.469 139.112 101.93 138.561C101.402 137.999 100.617 137.717 99.5742 137.717C97.7109 137.717 96.5859 138.913 96.1992 141.303H102.738V140.864Z"
                fill="white"
              />
              <path
                d="M119.191 148.51C119.742 148.51 120.234 148.469 120.668 148.387V152.518C119.707 152.846 118.641 153.01 117.469 153.01C115.629 153.01 114.217 152.547 113.232 151.622C112.26 150.696 111.773 149.237 111.773 147.245V137.629H109.172V133.639H111.773V128.928H117.258V133.639H120.439V137.629H117.258V146.577C117.258 147.327 117.404 147.836 117.697 148.106C117.99 148.375 118.488 148.51 119.191 148.51Z"
                fill="white"
              />
              <path
                d="M126.064 125.922C126.979 125.922 127.717 126.186 128.279 126.713C128.842 127.229 129.123 127.903 129.123 128.735C129.123 129.555 128.842 130.229 128.279 130.756C127.717 131.272 126.979 131.53 126.064 131.53C125.15 131.53 124.412 131.272 123.85 130.756C123.299 130.229 123.023 129.555 123.023 128.735C123.023 127.903 123.299 127.229 123.85 126.713C124.412 126.186 125.15 125.922 126.064 125.922ZM123.34 152.659V133.639H128.842V152.659H123.34Z"
                fill="white"
              />
              <path
                d="M154.189 133.288C156.111 133.288 157.594 133.862 158.637 135.01C159.691 136.159 160.219 138.034 160.219 140.635V152.659H154.717V140.635C154.717 139.862 154.617 139.264 154.418 138.842C154.219 138.409 153.932 138.116 153.557 137.963C153.193 137.799 152.719 137.717 152.133 137.717C151.453 137.717 150.873 137.881 150.393 138.209C149.912 138.538 149.531 138.995 149.25 139.581V139.967V152.659H143.766V140.67C143.766 139.885 143.666 139.276 143.467 138.842C143.268 138.409 142.98 138.116 142.605 137.963C142.23 137.799 141.75 137.717 141.164 137.717C140.52 137.717 139.957 137.864 139.477 138.157C138.996 138.438 138.604 138.842 138.299 139.37V152.659H132.814V133.639H137.965L138.141 135.801C138.773 134.993 139.547 134.372 140.461 133.938C141.375 133.504 142.412 133.288 143.572 133.288C144.744 133.288 145.752 133.528 146.596 134.008C147.439 134.477 148.09 135.198 148.547 136.17C149.168 135.245 149.953 134.536 150.902 134.043C151.852 133.54 152.947 133.288 154.189 133.288Z"
                fill="white"
              />
              <path
                d="M180.785 144.942H168.85C169.061 146.067 169.547 146.958 170.309 147.614C171.07 148.258 172.043 148.581 173.227 148.581C174.141 148.581 174.984 148.417 175.758 148.088C176.531 147.76 177.193 147.25 177.744 146.559L180.328 149.635C179.66 150.584 178.682 151.387 177.393 152.043C176.104 152.688 174.598 153.01 172.875 153.01C170.918 153.01 169.213 152.6 167.76 151.78C166.307 150.948 165.193 149.829 164.42 148.422C163.646 147.016 163.26 145.469 163.26 143.782V143.114C163.26 141.227 163.617 139.545 164.332 138.069C165.047 136.581 166.078 135.415 167.426 134.571C168.785 133.715 170.402 133.288 172.277 133.288C174.07 133.288 175.605 133.668 176.883 134.43C178.16 135.18 179.127 136.258 179.783 137.665C180.451 139.059 180.785 140.706 180.785 142.604V144.942ZM175.406 140.864C175.406 139.879 175.137 139.112 174.598 138.561C174.07 137.999 173.285 137.717 172.242 137.717C170.379 137.717 169.254 138.913 168.867 141.303H175.406V140.864Z"
                fill="white"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="94.8393"
                  y1="98.9188"
                  x2="173.414"
                  y2="184.478"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3023AE" />
                  <stop offset="1" stopColor="#C86DD7" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear"
                  x1="149.187"
                  y1="223.945"
                  x2="57.5864"
                  y2="33.8871"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3023AE" />
                  <stop offset="1" stopColor="#C86DD7" />
                </linearGradient>
              </defs>
            </svg>
          </Link>
        </div>
        <h1>{isLoginMode ? 'Login' : 'Request Invite'}</h1>
        {isSubmitted ? (
          <>
            <b>Request successfully sent</b>
            <p>We will check your data and get back to you within 24 hours.</p>
          </>
        ) : (
          <form onSubmit={authSubmitHandler}>
            {!isLoginMode && (
              <div>
                <Input
                  element="input"
                  id="name"
                  type="text"
                  label="Your Name"
                  errorText="Please enter a name."
                  validators={[]}
                  onInput={inputHandler}
                  initialValid={true}
                />
              </div>
            )}
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
            />
            <Input
              element="input"
              id="pass"
              type="password"
              label="Password"
              autoComplete="current-password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid password"
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode ? 'LOGIN' : 'SEND'}
            </Button>
          </form>
        )}
        <Button onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'INVITE' : 'LOGIN'}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default Auth;

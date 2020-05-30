import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { currencies } from '../../shared/util/currency';
import '../../customers/pages/CustomerForm.scss';

const UpdateUser: React.FC = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState<any>();
  const history = useHistory();
  const languages = ['de-DE', 'en-US']

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false
      },
      pass: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${auth.userId}`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        setLoadedUser(responseData.user);
        setFormData(
          {
            name: {
              value: responseData.user.name,
              isValid: true
            },
            language: {
              value: responseData.user.language,
              isValid: true
            },
            currency: {
              value: responseData.user.currency,
              isValid: true
            },
            vat: {
              value: responseData.user.vat,
              isValid: true
            },
            pass: {
              value: '',
              isValid: false
            }
          },
          true
        );
      } catch (err) {}
    }
    fetchUser();
  }, [sendRequest, auth.userId, setFormData, auth.token]);

  const userUpdateSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/${auth.userId}`,
        'PATCH',
        JSON.stringify({
          name: formState.inputs.name.value,
          currency: formState.inputs.currency.value,
          language: formState.inputs.language.value,
          vat: formState.inputs.vat.value,
          pass: formState.inputs.pass.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/user');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedUser && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find User!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedUser && (<form className="customer-form" onSubmit={userUpdateSubmitHandler}>
        <Input
          id="name"
          element="input"
          type="text"
          label="Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
          initialValue={loadedUser.name}
          initialValid={true}
        />
        <Input
          id="language"
          element="select"
          label="Language"
          validators={[]}
          onInput={inputHandler}
          datas={languages}
          initialValue={loadedUser.language}
          initialValid={true}
        />
        <Input
          id="currency"
          element="select"
          label="Currency"
          validators={[]}
          onInput={inputHandler}
          datas={currencies}
          initialValue={loadedUser.currency}
          initialValid={true}
        />
        <Input
          id="vat"
          element="input"
          type="number"
          label="VAT (%)"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a VAT % value."
          onInput={inputHandler}
          initialValue={loadedUser.vat}
        />
        <Input
          id="pass"
          element="input"
          type="password"
          label="Passwort"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE USER
        </Button>
      </form>)}
    </React.Fragment>
  );
};

export default UpdateUser;

import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const UpdatePassword: React.FC = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const history = useHistory();

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const [formState, inputHandler] = useForm(
    {
      pass: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const passwordUpdateSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (formState.inputs.pass.value !== formState.inputs.confirm.value)
      return setShowConfirmModal(true);

    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/password/${auth.userId}`,
        'PATCH',
        JSON.stringify({
          pass: formState.inputs.pass.value,
        })
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

  if (error) {
    return (
      <div className="center">
        <div className="row">
          <h2>Could not find User!</h2>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Error occurred"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              OK
            </Button>
          </React.Fragment>
        }
      >
        <p>Passwords are not matching!</p>
      </Modal>
      {!isLoading && (
        <>
          <div className="center">
            <h1>Change password</h1>
          </div>
          <form
            className="customer-form"
            onSubmit={passwordUpdateSubmitHandler}
          >
            <div className="columns">
              <div className="col-5">
                <Input
                  id="pass"
                  element="input"
                  type="password"
                  label="Password"
                  autoComplete="new-password"
                  validators={[VALIDATOR_MINLENGTH(6)]}
                  errorText="Please enter a valid password."
                  onInput={inputHandler}
                />
              </div>
              <div className="col-5">
                <Input
                  id="confirm"
                  element="input"
                  type="password"
                  autoComplete="new-password"
                  label="Password confirm"
                  validators={[]}
                  onInput={inputHandler}
                />
              </div>
            </div>
            <Button type="submit" disabled={!formState.isValid}>
              UPDATE PASSWORD
            </Button>
          </form>
        </>
      )}
    </React.Fragment>
  );
};

export default UpdatePassword;

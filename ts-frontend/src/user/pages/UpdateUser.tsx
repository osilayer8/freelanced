import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import '../../customers/pages/CustomerForm.scss';

const UpdateUser: React.FC = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState<any>();
  const history = useHistory();
  const languages = ['de-DE', 'en-US'];

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
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
        );
        setLoadedUser(responseData.user);
        setFormData(
          {
            company: {
              value: responseData.user.company,
              isValid: true
            },
            firstName: {
              value: responseData.user.firstName,
              isValid: true
            },
            name: {
              value: responseData.user.name,
              isValid: true
            },
            language: {
              value: responseData.user.language,
              isValid: true
            }
          },
          true
        );
      } catch (err) { }
    }
    auth.userId && fetchUser();
  }, [sendRequest, auth.userId, setFormData]);

  const userUpdateSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/${auth.userId}`,
        'PATCH',
        JSON.stringify({
          company: formState.inputs.company.value,
          firstName: formState.inputs.firstName.value,
          name: formState.inputs.name.value,
          street: loadedUser.street,
          zip: loadedUser.zip,
          city: loadedUser.city,
          country: loadedUser.country,
          phone: loadedUser.phone,
          businessMail: loadedUser.businessMail,
          web: loadedUser.web,
          iban: loadedUser.iban,
          bic: loadedUser.bic,
          bank: loadedUser.bank,
          taxId: loadedUser.taxId,
          commercialRegister: loadedUser.commercialRegister,
          language: formState.inputs.language.value,
          currency: loadedUser.currency,
          vat: loadedUser.vat
        }),
      );
      history.push('/user');
    } catch (err) { }
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
        <div className="center">
          <h1>Edit profile</h1>
        </div>
        <Input
          id="company"
          element="input"
          type="text"
          label="Company Name"
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.company}
          initialValid={true}
        />
        <Input
          id="firstName"
          element="input"
          type="text"
          label="First Name"
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.firstName}
          initialValid={true}
        />
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
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE USER
        </Button>
      </form>)}
    </React.Fragment>
  );
};

export default UpdateUser;

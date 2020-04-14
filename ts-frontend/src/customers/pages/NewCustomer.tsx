import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './CustomerForm.scss';

const NewCustomer: React.FC = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      company: {
        value: '',
        isValid: false
      },
      email: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const customerSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await sendRequest(
        'http://localhost:5000/api/customers',
        'POST',
        JSON.stringify({
          company: formState.inputs.company.value,
          email: formState.inputs.email.value,
          street: formState.inputs.street.value,
          plz: formState.inputs.plz.value,
          city: formState.inputs.city.value,
          country: formState.inputs.country.value,
          phone: formState.inputs.phone.value,
          website: formState.inputs.website.value,
          creator: auth.userId
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      history.push('/');
    } catch(err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="customer-form" onSubmit={customerSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="company"
          element="input"
          type="text"
          label="Company Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid company."
          onInput={inputHandler}
        />
        <Input
          id="email"
          element="input"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          id="street"
          element="input"
          type="text"
          label="Street Name"
          validators={[]}
          onInput={inputHandler}
          initialValid={true}
        />
        <Input
          id="plz"
          element="input"
          type="text"
          label="PLZ"
          validators={[]}
          onInput={inputHandler}
          initialValid={true}
        />
        <Input
          id="city"
          element="input"
          type="text"
          label="City Name"
          validators={[]}
          onInput={inputHandler}
          initialValid={true}
        />
        <Input
          id="country"
          element="input"
          type="text"
          label="Country"
          validators={[]}
          onInput={inputHandler}
          initialValid={true}
        />
        <Input
          id="phone"
          element="input"
          type="text"
          label="Phone"
          validators={[]}
          onInput={inputHandler}
          initialValid={true}
        />
        <Input
          id="website"
          element="input"
          type="text"
          label="Website"
          validators={[]}
          onInput={inputHandler}
          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD CUSTOMER
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewCustomer;

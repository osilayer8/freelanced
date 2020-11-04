import React from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

const NewCustomer: React.FC = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      company: {
        value: '',
        isValid: false,
      },
      email: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const customerSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/customers',
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
        })
      );
      redirectToCustomer(responseData.customer.id);
    } catch (err) {}
  };

  const history = useHistory();

  const redirectToCustomer = (id: number) => {
    history.push('/customers/' + id);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="customer-form" onSubmit={customerSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="center">
          <h1>Create new customer</h1>
        </div>
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

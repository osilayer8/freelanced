import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UpdateCustomer: React.FC = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCustomer, setLoadedCustomer] = useState<any>();
  const customerId = useParams<{ customerId: string }>().customerId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
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

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/customers/${customerId}`,
          'GET'
        );
        setLoadedCustomer(responseData.customer);
        setFormData(
          {
            company: {
              value: responseData.customer.company,
              isValid: true,
            },
            email: {
              value: responseData.customer.email,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchCustomer();
  }, [sendRequest, customerId, setFormData]);

  const customerUpdateSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/customers/${customerId}`,
        'PATCH',
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
      history.push('/customers/' + customerId);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedCustomer && !error) {
    return (
      <div className="center">
        <div className="row">
          <h2>Could not find Customer!</h2>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedCustomer && (
        <form className="customer-form" onSubmit={customerUpdateSubmitHandler}>
          <div className="center">
            <h1>Edit customer</h1>
          </div>
          <Input
            id="company"
            element="input"
            type="text"
            label="Company Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid company."
            onInput={inputHandler}
            initialValue={loadedCustomer.company}
            initialValid={true}
          />
          <Input
            id="street"
            element="input"
            type="text"
            label="Street Name"
            validators={[]}
            onInput={inputHandler}
            initialValue={loadedCustomer.street}
            initialValid={true}
          />
          <div className="columns">
            <div className="col-4">
              <Input
                id="plz"
                element="input"
                type="text"
                label="PLZ"
                validators={[]}
                onInput={inputHandler}
                initialValue={loadedCustomer.plz}
                initialValid={true}
              />
            </div>
            <div className="col-8">
              <Input
                id="city"
                element="input"
                type="text"
                label="City Name"
                validators={[]}
                onInput={inputHandler}
                initialValue={loadedCustomer.city}
                initialValid={true}
              />
            </div>
          </div>
          <Input
            id="country"
            element="input"
            type="text"
            label="Country"
            validators={[]}
            onInput={inputHandler}
            initialValue={loadedCustomer.country}
            initialValid={true}
          />
          <div className="columns">
            <div className="col-5">
              <Input
                id="email"
                element="input"
                type="email"
                label="E-Mail"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email address."
                onInput={inputHandler}
                initialValue={loadedCustomer.email}
                initialValid={true}
              />
            </div>
            <div className="col-5">
              <Input
                id="phone"
                element="input"
                type="text"
                label="Phone"
                validators={[]}
                onInput={inputHandler}
                initialValue={loadedCustomer.phone}
                initialValid={true}
              />
            </div>
          </div>
          <Input
            id="website"
            element="input"
            type="text"
            label="Website"
            validators={[]}
            onInput={inputHandler}
            initialValue={loadedCustomer.website}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE CUSTOMER
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateCustomer;

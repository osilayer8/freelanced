import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_IBAN
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { currencies } from '../../shared/util/currency';
import '../../customers/pages/CustomerForm.scss';

const UpdateSettings: React.FC = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState<any>();
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm({
    currency: {
      value: '',
      isValid: false
    },
    vat: {
      value: '',
      isValid: false
    }
  },
  false);

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
            currency: {
              value: responseData.user.currency,
              isValid: true
            },
            vat: {
              value: responseData.user.vat,
              isValid: true
            },
            street: {
              value: responseData.user.street,
              isValid: true
            },
            zip: {
              value: responseData.user.zip,
              isValid: true
            },
            city: {
              value: responseData.user.city,
              isValid: true
            },
            country: {
              value: responseData.user.country,
              isValid: true
            },
            businessMail: {
              value: responseData.user.businessMail,
              isValid: true
            },
            web: {
              value: responseData.user.web,
              isValid: true
            },
            iban: {
              value: responseData.user.iban,
              isValid: true
            },
            bic: {
              value: responseData.user.bic,
              isValid: true
            },
            bank: {
              value: responseData.user.bank,
              isValid: true
            },
            taxId: {
              value: responseData.user.taxId,
              isValid: true
            },
            commercialRegister: {
              value: responseData.user.commercialRegister,
              isValid: true
            },
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
          company: loadedUser.company,
          firstName: loadedUser.firstName,
          name: loadedUser.name,
          street: formState.inputs.street.value,
          zip: formState.inputs.zip.value,
          city: formState.inputs.city.value,
          country: formState.inputs.country.value,
          phone: formState.inputs.phone.value,
          businessMail: formState.inputs.businessMail.value,
          web: formState.inputs.web.value,
          iban: formState.inputs.iban.value,
          bic: formState.inputs.bic.value,
          bank: formState.inputs.bank.value,
          taxId: formState.inputs.taxId.value,
          commercialRegister: formState.inputs.commercialRegister.value,
          language: loadedUser.language,
          currency: formState.inputs.currency.value,
          vat: formState.inputs.vat.value
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
          <h1>Edit data for PDF generation</h1>
        </div>
        <Input
          id="street"
          element="input"
          type="text"
          label="Street No."
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.street}
          initialValid={true}
        />
        <Input
          id="zip"
          element="input"
          type="text"
          label="Zip Code"
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.zip}
          initialValid={true}
        />
        <Input
          id="city"
          element="input"
          type="text"
          label="City"
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.city}
          initialValid={true}
        />
        <Input
          id="country"
          element="input"
          type="text"
          label="Country"
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.country}
          initialValid={true}
        />
        <Input
          id="phone"
          element="input"
          type="text"
          label="Phone"
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.phone}
          initialValid={true}
        />
        <Input
          id="businessMail"
          element="input"
          type="text"
          label="Business Email"
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.businessMail}
          initialValid={true}
        />
        <Input
          id="web"
          element="input"
          type="text"
          label="Website"
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.web}
          initialValid={true}
        />
        <Input
          id="iban"
          element="input"
          type="text"
          label="IBAN (Decryped)"
          validators={[VALIDATOR_IBAN()]}
          errorText='Enter a valid IBAN'
          onInput={inputHandler}
          initialValid={true}
        />
        <Input
          id="bic"
          element="input"
          type="text"
          label="BIC"
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.bic}
          initialValid={true}
        />
        <Input
          id="bank"
          element="input"
          type="text"
          label="Bank name"
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.bank}
          initialValid={true}
        />
        <Input
          id="taxId"
          element="input"
          type="text"
          label="UID / Tax No."
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.taxId}
          initialValid={true}
        />
        <Input
          id="commercialRegister"
          element="input"
          type="text"
          label="Commercial Register"
          validators={[]}
          onInput={inputHandler}
          initialValue={loadedUser.commercialRegister}
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
          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE SETTINGS
        </Button>
      </form>)}
    </React.Fragment>
  );
};

export default UpdateSettings;

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
            }
          },
          true
        );
      } catch (err) { }
    }
    fetchUser();
  }, [sendRequest, auth.userId, setFormData]);

  const userUpdateSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/${auth.userId}`,
        'PATCH',
        JSON.stringify({
          name: loadedUser.name,
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
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE SETTINGS
        </Button>
      </form>)}
    </React.Fragment>
  );
};

export default UpdateSettings;

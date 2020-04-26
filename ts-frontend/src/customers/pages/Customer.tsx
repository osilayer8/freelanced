import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import CustomerProjects from './CustomerProjects';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './CustomerForm.scss';

const Customer: React.FC = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCustomer, setLoadedCustomer] = useState<any>();
  const customerId = useParams<{customerId: string}>().customerId;

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/customers/${customerId}`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        setLoadedCustomer(responseData.customer);
      } catch (err) {}
    }
    fetchCustomer();
  }, [sendRequest, customerId, auth.token]);

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
        <Card>
          <h2>Could not find Customer!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedCustomer && (<div className="customer-form">
        <h1>{loadedCustomer.company}</h1>
        <h3>{loadedCustomer.email}</h3>
        <ul>
          <li>{loadedCustomer.street}</li>
          <li>{loadedCustomer.plz} {loadedCustomer.city}</li>
          <li>{loadedCustomer.country}</li>
          <li>{loadedCustomer.phone}</li>
          <li>{loadedCustomer.website}</li>
        </ul>
        <Button to={`/customers/${customerId}/edit`}>
          EDIT CUSTOMER
        </Button>
      </div>)}
      <CustomerProjects />
    </React.Fragment>
  );
};

export default Customer;

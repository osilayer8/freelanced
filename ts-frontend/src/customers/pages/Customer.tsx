import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import CustomerProjects from './CustomerProjects';
import CustomerItem from '../components/CustomerItem';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './CustomerForm.scss';

const Customer: React.FC = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCustomer, setLoadedCustomer] = useState<any>();
  const customerId = useParams<{ customerId: string }>().customerId;

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/customers/${customerId}`,
          'GET',
        );
        setLoadedCustomer(responseData.customer);
      } catch (err) { }
    }
    fetchCustomer();
  }, [sendRequest, customerId]);

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
      <div className="center"><h1>Projects at {loadedCustomer.company}</h1></div>
      <CustomerProjects />
      {!isLoading && loadedCustomer && (
        <CustomerItem
          id={loadedCustomer.id}
          company={loadedCustomer.company}
          email={loadedCustomer.email}
          street={loadedCustomer.street}
          plz={loadedCustomer.plz}
          city={loadedCustomer.city}
          country={loadedCustomer.country}
          phone={loadedCustomer.phone}
          website={loadedCustomer.website}
          creatorId={loadedCustomer.creator}
          onDelete={false}
          />
      )}
    </React.Fragment>
  );
};

export default Customer;

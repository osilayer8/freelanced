import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import CustomerList from '../components/CustomerList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const UserCustomers: React.FC = () => {
  const auth = useContext(AuthContext);
  const [loadedCustomers, setLoadedCustomers] = useState<any>();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams<{userId: string}>().userId;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/customers/user/${userId}`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        setLoadedCustomers(responseData.customers);
      } catch (err) {}
    }
    fetchCustomers();
  }, [sendRequest, userId]);

  const customerDeletedHandler = (deletedCustomerId: number) => {
    setLoadedCustomers((prevCustomers: any) =>
      prevCustomers.filter((customer: any) => customer.id !== deletedCustomerId)
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCustomers && <CustomerList items={loadedCustomers} onDeleteCustomer={customerDeletedHandler} />}
    </React.Fragment>
  );
};

export default UserCustomers;

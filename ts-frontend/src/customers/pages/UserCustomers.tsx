import React, { useEffect, useState, useContext } from 'react';

import CustomerList from '../components/CustomerList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Button from '../../shared/components/FormElements/Button';

const UserCustomers: React.FC = () => {
  const auth = useContext(AuthContext);
  const [loadedCustomers, setLoadedCustomers] = useState<any>([]);
  const { isLoading,  sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/customers/user/${auth.userId}`,
          'GET',
        );
        setLoadedCustomers(responseData.customers);
      } catch (err) { }
    }
    fetchCustomers();
  }, [sendRequest, auth.userId]);

  const customerDeletedHandler = (deletedCustomerId: number) => {
    setLoadedCustomers((prevCustomers: any) =>
      prevCustomers.filter((customer: any) => customer.id !== deletedCustomerId)
    );
  }

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <div className="sidebar">
        <Button to={`/customer/new`}>New Customer</Button>
      </div>
      <div className="center"><h1>My Customers</h1></div>
      {!isLoading && loadedCustomers && <CustomerList items={loadedCustomers} onDeleteCustomer={customerDeletedHandler} />}
    </React.Fragment>
  );
};

export default UserCustomers;

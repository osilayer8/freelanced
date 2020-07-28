import React from 'react';

import CustomerItem from './CustomerItem';
import Button from '../../shared/components/FormElements/Button';
import './CustomerList.scss';

const CustomerList: React.FC<any> = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="customer-list center">
        <div className="row">
          <h2>No customers found. Maybe create one?</h2>
          <Button to="/customer/new">New customer</Button>
        </div>
      </div>
    );
  }

  return (
    <ul className="customer-list">
      {props.items.reverse().map((customer: any) => (
        <CustomerItem
          key={customer.id}
          id={customer.id}
          company={customer.company}
          email={customer.email}
          street={customer.street}
          plz={customer.plz}
          city={customer.city}
          country={customer.country}
          phone={customer.phone}
          website={customer.website}
          creatorId={customer.creator}
          onDelete={props.onDeleteCustomer}
        />
      ))}
    </ul>
  );
};

export default CustomerList;

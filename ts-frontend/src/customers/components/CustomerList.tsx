import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import CustomerItem from './CustomerItem';
import Button from '../../shared/components/FormElements/Button';
import './CustomerList.scss';

const CustomerList: React.FC<any> = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="customer-list center">
        <Card>
          <h2>No customers found. Maybe create one?</h2>
          <Button to="/customers/new">New customer</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="customer-list">
      {props.items.map((customer: any) => (
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

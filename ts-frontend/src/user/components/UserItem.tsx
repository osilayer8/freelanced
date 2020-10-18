import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import './UserItem.scss';

interface Props {
  company?: string;
  firstName?: string;
  name: string;
  phone?: string;
  iban?: string;
  email: string;
  currency?: string;
  language: string;
  vat: number;
  id?: string;
}

const UserItem: React.FC<Props> = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <div className="user-item__info">
          <h1>
            <label>Company</label>
            {props.company}
          </h1>
          <h1>
            <label>Name</label>
            {props.firstName} {props.name}
          </h1>
          <h2>
            <label>Email</label>
            {props.email}
          </h2>
          <h2>
            <label>Phone</label>
            {props.phone}
          </h2>
          <h2>
            <label>IBAN</label>
            {props.iban}
          </h2>
          <h2>
            <label>Currency</label>
            {props.currency}
          </h2>
          <h2>
            <label>Language</label>
            {props.language}
          </h2>
          <h2>
            <label>VAT</label>
            {props.vat}%
          </h2>
          <div className="flex">
            <Button className="outlined" to="/user/edit">
              EDIT PROFILE
            </Button>
            <Button className="outlined" to="/user/settings">
              SETTINGS
            </Button>
            <Button className="outlined" to="/user/password">
              CHANGE PASSWORD
            </Button>
          </div>
        </div>
      </Card>
    </li>
  );
};

export default UserItem;

import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from '../../shared/components/FormElements/Button';
import "./UserItem.scss";

interface Props {
  company?: string,
  firstName?: string,
  name: string,
  phone?: string,
  iban?: string,
  email: string,
  currency?: string,
  language: string,
  vat: number,
  id?: string
}

const UserItem: React.FC<Props> = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <div className="user-item__info">
          <h1>
            {props.company}
          </h1>
          <h1>
          {props.firstName} {props.name}
          </h1>
          <h2>{props.email}</h2>
          <h2>{props.phone}</h2>
          <h2>IBAN {props.iban}</h2>
          <p>Currency: {props.currency}</p>
          <p>Language: {props.language}</p>
          <p>VAT: {props.vat}%</p>
          <Button to="/user/edit">EDIT PROFILE</Button>
          <Button to="/user/settings">EDIT PDF SETTINGS</Button>
          <Button to="/user/password">CHANGE PASSWORD</Button>
        </div>
      </Card>
    </li>
  );
};

export default UserItem;

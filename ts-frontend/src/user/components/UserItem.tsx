import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from '../../shared/components/FormElements/Button';
import "./UserItem.scss";

interface Props {
  name: string,
  email: string,
  currency?: string,
  language: string,
  id?: string
}

const UserItem: React.FC<Props> = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <div className="user-item__info">
          <h1>
            {props.name}
          </h1>
          <h2>{props.email}</h2>
          <p>Currency: {props.currency}</p>
          <p>Language: {props.language}</p>
          <Button to="/user/edit">EDIT USER</Button>
        </div>
      </Card>
    </li>
  );
};

export default UserItem;

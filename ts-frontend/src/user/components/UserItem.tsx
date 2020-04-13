import React from "react";

import Card from "../../shared/components/UIElements/Card";
import "./UserItem.scss";

interface Props {
  name: string,
  age?: string,
  email: string,
  description?: string,
  id?: string
}

const UserItem: React.FC<Props> = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <div className="user-item__info">
          <h1>
            {props.name} - {props.age}y
          </h1>
          <h2>{props.email}</h2>
          {props.description ? <p>{props.description}</p> : null}
        </div>
      </Card>
    </li>
  );
};

export default UserItem;

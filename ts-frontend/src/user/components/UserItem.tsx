import React from "react";

import Card from "../../shared/components/UIElements/Card";
import "./UserItem.scss";

interface Props {
  name: string,
  email: string,
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
        </div>
      </Card>
    </li>
  );
};

export default UserItem;

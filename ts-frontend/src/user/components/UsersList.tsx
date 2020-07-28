import React from 'react';

import UserItem from './UserItem';
import './UsersList.scss';

const UsersList: React.FC<any> = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <div className="row">
          <h2>No users found.</h2>
        </div>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((user: any) => (
        <UserItem
          key={user.id}
          id={user.id}
          name={user.name}
          email={user.email}
          language={user.language}
          currency={user.currency}
          vat={user.vat}
        />
      ))}
    </ul>
  );
};

export default UsersList;

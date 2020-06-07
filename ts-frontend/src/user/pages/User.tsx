import React, { useEffect, useState, useContext } from 'react';

import UserItem from '../components/UserItem';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import '../components/UsersList.scss';

const User: React.FC = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState<any>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${auth.userId}`,
          'GET',
        );
        setLoadedUser(responseData.user);
      } catch (err) { }
    };
    auth.userId && fetchUser();
  }, [sendRequest, auth.userId]);

  if (!isLoading && !loadedUser) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find User!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && !loadedUser && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && loadedUser && (<ul className="users-list">
      <UserItem
        key={loadedUser.id}
        id={loadedUser.id}
        company={loadedUser.company}
        firstName={loadedUser.firstName}
        name={loadedUser.name}
        iban={loadedUser.iban}
        phone={loadedUser.phone}
        email={loadedUser.email}
        currency={loadedUser.currency}
        language={loadedUser.language}
        vat={loadedUser.vat}
      />
      </ul>)}
    </React.Fragment>
  );
};

export default User;

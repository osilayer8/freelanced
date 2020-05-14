import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import styles from './BackButton.module.scss';

const BackButton: React.FC = (props: any) => {
  const history = useHistory();
  const { location } = props;
  if (location.pathname === '/customers') return null;
  
  const path = () => {
    if (location.pathname.match('projects')) {
      history.push('/customers/' + location.pathname.split('/')[2])
    } else {
      history.goBack();
    }
  }

  return (
    <button className={styles.backButton} onClick={path}>BACK</button>
  );
};

export default withRouter(BackButton);

import React from 'react';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useHttpClient } from '../../shared/hooks/http-hook';
import './CustomerItem.scss';

interface Props {
  id: number,
  title: string,
  hours?: number,
}

const TaskItem: React.FC<Props> = (props) => {
  const { isLoading, error, clearError } = useHttpClient();

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <li id={props.id.toString()} className="customer-item">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="customer-item__info">
          <h2>{props.title}</h2>
          <h3>{props.hours}</h3>
        </div>
      </li>
    </React.Fragment>
  );
};

export default TaskItem;

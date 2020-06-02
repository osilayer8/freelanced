import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useHttpClient } from '../../shared/hooks/http-hook';
import './ProjectItem.scss';

interface Array {
  title: string,
  hours: number
}

interface Props {
  name: string,
  price: number,
  status?: string,
  tasks?: any,
  id: string,
  ownerId: string,
  onDelete?: any
}

const ProjectItem: React.FC<Props> = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/projects/${props.id}`,
        'DELETE',
      );
      props.onDelete(props.id);
    } catch (err) { }
  };

  const projectCalc = () => {
    let hours = 0, item;
    for (item in props.tasks) {
      hours += props.tasks[item].hours;
    }
    const total = props.price * hours;
    return {
      hours: hours,
      costs: total
    };
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="project-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this project? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="project-item">
        <Card className="project-item__content relative">
          {isLoading && <LoadingSpinner asOverlay />}
          <button className="project-item__action" onClick={showDeleteWarningHandler}>DELETE</button>
          <Link to={`/customers/${props.ownerId}/projects/${props.id}`}>
          <div className="project-item__info">
            <h2>{props.name}</h2>
          </div>
          <div className="project-item__details">
            <p>Tasks: {props.tasks.length}</p>
            <p>Calculation: {projectCalc().hours}h</p>
            <p>Price:  {projectCalc().costs},-</p>
          </div>
          </Link>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ProjectItem;

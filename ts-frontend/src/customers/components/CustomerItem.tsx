import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import Row from '../../shared/components/UIElements/Row';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './CustomerItem.scss';

interface Props {
  company: string,
  email: string,
  street?: string,
  plz?: string,
  city?: string,
  country?: string,
  phone?: string,
  website?: string,
  id: string,
  creatorId?: string,
  onDelete?: any
}

const CustomerItem: React.FC<Props> = (props) => {
  const auth = useContext(AuthContext);
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
        process.env.REACT_APP_BACKEND_URL + `/customers/${props.id}`,
        'DELETE',
      );
      props.onDelete(props.id);
    } catch (err) { }
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="customer-item__modal-actions"
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
          Do you want to proceed and delete this customer? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="customer-item">
        <Row className="customer-item__content relative">
          {isLoading && <LoadingSpinner asOverlay />}
          {auth.userId === props.creatorId && props.onDelete && (
            <button className="customer-item__action" onClick={showDeleteWarningHandler}>DELETE</button>
          )}
          <Link to={props.onDelete ? `/customers/${props.id}` : `/customers/${props.id}/edit`}>
            <div className="customer-item__details">
              <p>{props.email}</p>
              {props.street ? <p>{props.street}</p> : null}
              {props.plz ? <p>{props.country} {props.plz} {props.city}</p> : null}
              {props.phone ? <p>{props.phone}</p> : null}
              {props.website ? <p>{props.website}</p> : null}
            </div>
            <div className="customer-item__info">
              <h2>{props.company}</h2>
            </div>
          </Link>
        </Row>
      </li>
    </React.Fragment>
  );
};

export default CustomerItem;

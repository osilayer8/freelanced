import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

const NewProject: React.FC = () => {
  const customerId = useParams<{ customerId: string }>().customerId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const projectSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/projects',
        'POST',
        JSON.stringify({
          name: formState.inputs.name.value,
          price: formState.inputs.price.value,
          owner: customerId,
        })
      );
      redirectToProject(customerId, responseData.project.id);
    } catch (err) {}
  };

  const redirectToProject = (cid: string, pid: number) => {
    history.push('/customers/' + cid + '/projects/' + pid);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="customer-form" onSubmit={projectSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="center">
          <h1>Create new Project</h1>
        </div>
        <Input
          id="name"
          element="input"
          type="text"
          label="Project Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
        />
        <div className="columns">
          <div className="col-4">
            <Input
              id="price"
              element="input"
              type="number"
              label="Price per hour"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid price."
              onInput={inputHandler}
            />
          </div>
        </div>
        <Button type="submit" disabled={!formState.isValid}>
          ADD PROJECT
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewProject;

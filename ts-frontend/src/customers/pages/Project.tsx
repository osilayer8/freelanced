import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './CustomerForm.scss';

interface Array {
  title: string,
  hours: number
}

const UpdateProject: React.FC = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProject, setLoadedProject] = useState<any>();
  const projectId = useParams<{projectId: string}>().projectId;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/projects/${projectId}`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        setLoadedProject(responseData.project);
      } catch (err) {}
    }
    fetchProject();
  }, [sendRequest, projectId]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedProject && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find Project!</h2>
        </Card>
      </div>
    );
  }

  const getTasks = (tasks: [Array]) => {
    const output = [];
    for (var i = 0; i < tasks.length; i++) {
      output.push(
        <ul key={i}>
          <li>{tasks[i].title}</li>
          <li>{tasks[i].hours}</li>
        </ul>
      );
    }
    return output;
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedProject && (
        <div className="center">
          <Card>
            <h1>{loadedProject.name}</h1>
            <h2>Price per Hour: {loadedProject.price},-</h2>
            {getTasks(loadedProject.tasks)}
          </Card>
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdateProject;

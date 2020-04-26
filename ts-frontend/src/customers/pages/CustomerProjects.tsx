import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import ProjectList from '../components/ProjectList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Button from '../../shared/components/FormElements/Button';

const UserProjects: React.FC = () => {
  const auth = useContext(AuthContext);
  const [loadedProjects, setLoadedProjects] = useState<any>([]);
  const { isLoading, sendRequest } = useHttpClient();
  let cid = useParams<{customerId: string}>().customerId;
   
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/projects/customer/${cid}`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        setLoadedProjects(responseData.projects);
      } catch (err) {}
    }
    fetchProjects();
  }, [sendRequest, cid, auth.token]);

  const projectDeletedHandler = (deletedProjectId: number) => {
    setLoadedProjects((prevProjects: any) =>
      prevProjects.filter((project: any) => project.id !== deletedProjectId)
    );
  }

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <div className="center">
        <Button to={`/customers/${cid}/projects/new`}>ADD NEW PROJECT</Button>
      </div>
      {!isLoading && loadedProjects && <ProjectList items={loadedProjects} onDeleteProject={projectDeletedHandler} />}
    </React.Fragment>
  );
};

export default UserProjects;

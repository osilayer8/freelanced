import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import TaskItem from '../components/TaskItem';
import './CustomerForm.scss';

interface Array {
  id: number,
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
  }, [sendRequest, projectId, auth.token]);

  const projectUpdateSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/projects/${projectId}`,
        'PATCH',
        JSON.stringify({
          name: loadedProject.name,
          price: loadedProject.price,
          tasks: loadedProject.tasks
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      setLoadedProject(responseData.project);
    } catch (err) {}
  };

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    
    setLoadedProject({ ...loadedProject, [name]: value });
  }

  const handleSubInputChange = (idx: number) => (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    const newTasks = loadedProject.tasks.map((task: Array, sidx: number) => {
      if (idx !== sidx) return task;
      return { ...task, [name]: value };
    });
    setLoadedProject({ ...loadedProject, tasks: newTasks });
  };
  
  const handleAddTask = () => {
    setLoadedProject({
      ...loadedProject, tasks: loadedProject.tasks.concat([{ title: '', hours: 0, id: Math.random() }])
    });
  };

  const handleRemoveTask = (idx: number) => () => {
    setLoadedProject({
      ...loadedProject, tasks: loadedProject.tasks.filter((_s: any, sidx: number) => idx !== sidx)
    });
  };

  const projectCalc = () => {
    let hours = 0, item = '';
    for(item in loadedProject.tasks) {
      const hour = parseInt(loadedProject.tasks[item].hours);
      const parse = hour >= 0 ? hour : 0;
      hours += parse;
    }
    return {
      hours: hours,
      costs: loadedProject.price * hours
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedProject && (
        <div className="center">
          <Card>
            <h1>{loadedProject.name}</h1>
            <h2>Price per Hour: {loadedProject.price},-</h2>
            <ul className="customer-list">
              {loadedProject.tasks.map((task: Array) => (
                <TaskItem
                  id={task.id}
                  key={task.id}
                  title={task.title}
                  hours={task.hours}
                />
              ))}
            </ul>
            <h3>Total costs: {projectCalc().costs},-</h3>
            <h4>Calculation: {projectCalc().hours} Hours</h4>
          </Card>
          <Card>
            <form className="customer-form" onSubmit={projectUpdateSubmitHandler}>
              <input type="text" name="name" value={loadedProject.name} onChange={handleInputChange} />
              <input type="number" name="price" value={loadedProject.price} onChange={handleInputChange} />
              {/* <Input
                id="name"
                element="input"
                type="text"
                label="Project Name"
                validators={[]}
                onInput={inputHandler}
                initialValue={loadedProject.name}
                initialValid={true}
              />
              <Input
                id="price"
                element="input"
                type="text"
                label="Price"
                validators={[]}
                onInput={inputHandler}
                initialValue={loadedProject.price}
                initialValid={true}
              /> */}
              {loadedProject.tasks.map((task: Array, idx: number) => (
                <div className="fields" key={task.id}>
                  <input type="text" name="title" value={task.title} onChange={handleSubInputChange(idx)} />
                  <input type="number" name="hours" value={task.hours === null ? 0 : task.hours} onChange={handleSubInputChange(idx)} />
                  <button
                    type="button"
                    onClick={handleRemoveTask(idx)}
                  >
                    Remove Task
                  </button>
                </div>
              ))}

              <Button type="submit">
                UPDATE PROJECT
              </Button>
            </form>
          <Button
            type="button"
            onClick={handleAddTask}>
            Add Task
          </Button>
          </Card>
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdateProject;

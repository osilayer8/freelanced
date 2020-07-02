import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Costs from '../components/Costs';
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from '../../shared/components/Invoice/Invoice';
import './CustomerForm.scss';

interface Array {
  id: number,
  title: string,
  hours: number
}

interface pdfData {
  invoiceNo: string,
  tasks: Array,
  price: number,
  currency: string,
  netto: number,
  vat: number,
  brutto: number,
  hours: number,
  customer: any
}

interface Result {
  costs: number,
  hours: number
}

function projectCalc(res: any) {
  let hours = 0, item = '';
  for(item in res.tasks) {
    const hour = parseFloat(res.tasks[item].hours);
    const parse = hour >= 0 ? hour : 0;
    hours += parse;
  }
  return({
    hours: hours,
    costs: res.price * hours
  });
};

const UpdateProject: React.FC = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProject, setLoadedProject] = useState<any>();
  const [loadedUser, setLoadedUser] = useState<any>();
  const [loadedCustomer, setLoadedCustomer] = useState<any>();
  const [result, setResult] = useState<Result>({
    costs: 0,
    hours: 0
  });
  const [show, setHide] = useState<boolean>(false);
  const [delay, setDelay] = useState<boolean>(true);
  const projectId = useParams<{projectId: string}>().projectId;
  const customerId = useParams<{customerId: string}>().customerId;

  /* fetch project data */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/projects/${projectId}`,
          'GET',
        );
        setLoadedProject(responseData.project);
        setResult(projectCalc(responseData.project));
      } catch (err) { }
    }
    fetchProject();
  }, [sendRequest, projectId]);

  /* fetch user data */
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

  /* fetch customer data */
  useEffect(() => {
    const getCustomerData = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/customers/${customerId}`,
            'GET'
        );
        setLoadedCustomer(responseData.customer);
      } catch (err) { }
    };
    getCustomerData();
  }, [sendRequest, customerId]);

  const projectUpdateSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    setHide(false);
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/projects/${projectId}`,
        'PATCH',
        JSON.stringify({
          name: loadedProject.name,
          price: loadedProject.price,
          tasks: loadedProject.tasks,
          invoiceNo: loadedProject.invoiceNo
        }),
      );
      setLoadedProject(responseData.project);
    } catch (err) { }
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
    setResult(projectCalc({ ...loadedProject, [name]: value }));
    setHide(false);
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
    setResult(projectCalc({ ...loadedProject, tasks: newTasks }));
    setHide(false);
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
    setHide(false);
  };

  const showButton = () => {
    setDelay(true);
    setTimeout(() => {
      setDelay(false);
    }, 2000);
    setHide(true);
  }

  const bruttoCalc = (costs: number, vat: number) => {
    return costs * (1 + vat / 100);
  }

  const onGeneratePdf: pdfData = {
    invoiceNo: loadedProject.invoiceNo,
    tasks: loadedProject.tasks,
    price: loadedProject.price,
    netto: result.costs,
    brutto: loadedUser && bruttoCalc(result.costs, loadedUser.vat),
    hours: result.hours,
    currency: loadedUser && loadedUser.currency,
    vat: loadedUser && loadedUser.vat,
    customer: loadedCustomer && loadedCustomer
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedProject && loadedUser && (
        <div className="text-center">
          <form className="project-content" onSubmit={projectUpdateSubmitHandler}>
            <div className="center edit-title">
              <input type="text" className="h1 inputTitle" name="name" value={loadedProject.name} onChange={handleInputChange} />
            </div>
            <label>Price per hour:</label>
            <input type="number" name="price" value={loadedProject.price} onChange={handleInputChange} className="price" />
            <span>{loadedUser.currency}</span>
            <div className="labels">
              <label>Task</label>
              <label>Calculation</label>
            </div>
            {loadedProject.tasks.map((task: Array, idx: number) => (
              <div className="fields" key={task.id}>
                <input type="text" name="title" value={task.title} onChange={handleSubInputChange(idx)} />
                <input type="number" name="hours" value={task.hours === null ? 0 : task.hours} onChange={handleSubInputChange(idx)} />
                {idx > 0 && (
                  <div className="del" title="Remove task" onClick={handleRemoveTask(idx)}>
                    <svg><use href="#trash" xlinkHref="#trash" /></svg>
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              inverse
              className="add-task"
              onClick={handleAddTask}>
              + Add Task
            </Button>

            <div className="sidebar card">
              <Button type="button" onClick={showButton} inverse hide={show}>Generate PDF</Button>
              {show && loadedUser && (
                <Button className="fadeIn" type="button" danger>
                  <PDFDownloadLink
                    document={<Invoice result={onGeneratePdf} user={loadedUser} />}
                    fileName="invoice.pdf"
                  >
                    {({ blob, url, loading, error }) =>
                      loading || delay ? "Loading document..." : "Download PDF"
                    }
                  </PDFDownloadLink>
                </Button>
              )}
              <Costs result={onGeneratePdf} />
              <hr />
              <div className="text-right">Invoice No: <input type="text" name="invoiceNo" value={loadedProject.invoiceNo} onChange={handleInputChange} className="invoice" /></div>
            </div>

            <div>
              <Button type="submit">
                SAVE
              </Button>
            </div>
          </form>
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdateProject;

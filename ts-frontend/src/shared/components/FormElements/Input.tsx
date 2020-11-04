import React, { useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { validate } from '../../util/validators';
import './Input.scss';

interface State {
  value: string;
  isTouched?: boolean;
  isValid?: boolean;
}

interface Action {
  type: string;
  val: string;
  validators: Validators;
  checkbox: HTMLInputElement;
}

interface array {
  type: string;
  val: number;
}

type Validators = array[];

const inputReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators, action.checkbox),
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

interface Props {
  initialValue?: string;
  initialValid?: boolean;
  id: string;
  onInput: (id: string, value: string, isValid: boolean) => void;
  validators?: any;
  element: string;
  type?: string;
  placeholder?: string;
  rows?: number;
  label?: string;
  errorText?: string;
  autoComplete?: string;
  to?: string;
  datas?: any;
}

const Input: React.FC<Props> = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid }: any = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators,
      checkbox: event.target as HTMLInputElement,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
      val: '',
      validators: [],
      checkbox: undefined as any,
    });
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
        autoComplete={props.autoComplete}
      />
    ) : props.element === 'select' ? (
      <select
        className="select-css"
        id={props.id}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      >
        {props.datas.map((data: string, index: number) => (
          <option key={index} value={data}>
            {data}
          </option>
        ))}
      </select>
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      <div className={props.type === 'checkbox' ? 'input-checkbox' : ''}>
        {props.label && (
          <label htmlFor={props.id}>
            {props.label}{' '}
            {props.to && (
              <>
                (<Link to={props.to}>Read</Link>)
              </>
            )}
          </label>
        )}
        {element}
      </div>
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;

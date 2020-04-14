import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.scss';setTimeout(() => {}, 500);

interface State {
  value: string,
  isTouched: boolean,
  isValid: boolean
}

interface Action {
  type: string,
  val: string,
  validators: Validators
}

interface array {
  type: string,
  val: number
}

type Validators = array[];

const inputReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      }
    }
    default:
      return state;
  }
};

interface Props {
  initialValue?: string,
  initialValid?: boolean,
  id: string,
  onInput: (id: string, value: string, isValid: boolean) => void,
  validators?: any,
  element: string,
  type: string,
  placeholder?: string,
  rows?: number,
  label?: string,
  errorText?: string
}

const Input: React.FC<Props> = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;


  useEffect(() => {
    onInput(id, value, isValid)
  }, [id, value, isValid, onInput]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
      val: '',
      validators: []
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
      />
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
      className={`form-control ${!inputState.isValid && inputState.isTouched &&
        'form-control--invalid'}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;

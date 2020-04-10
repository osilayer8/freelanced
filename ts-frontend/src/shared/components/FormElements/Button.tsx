import React from 'react';
import { Link } from 'react-router-dom';

import './Button.scss';

type ButtonType = JSX.IntrinsicElements['button']['type']

interface Props {
  href?: string,
  inverse?: boolean,
  danger?: boolean | '',
  to?: string,
  type?: ButtonType,
  onClick?: () => void,
  disabled?: boolean
}

const Button: React.FC<Props> = (props) => {
  if (props.href) {
    return (
      <a
        className={`button button--default ${props.inverse ?
          'button--inverse' : ''} ${props.danger ? 'button--danger' : ''}`}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }

  if (props.to) {
    return (
      <Link
        to={props.to}
        className={`button button--default'} ${props.inverse ?
          'button--inverse' : ''} ${props.danger ? 'button--danger' : ''}`}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`button button--default ${props.inverse ?
        'button--inverse' : ''} ${props.danger ? 'button--danger' : ''}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;

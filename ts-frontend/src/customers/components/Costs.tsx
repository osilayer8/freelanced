import React from 'react';
import './Costs.scss';

const Costs: React.FC<{result: any}> = (props) => {

  return (
    <React.Fragment>
      <div className="customer-item" >
        <h3><label>Netto costs:</label>{props.result.netto.toFixed(2)} {props.result.currency}</h3>
        <h3><label>{props.result.vat}% VAT:</label>{(props.result.brutto - props.result.netto).toFixed(2)} {props.result.currency}</h3>
        <h2><label>Total costs:</label>{props.result.brutto.toFixed(2)} {props.result.currency}</h2>
        <h4><label>Calculation:</label>{props.result.hours} Hours</h4>
      </div>
    </React.Fragment>
  );
};

export default Costs;

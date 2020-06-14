import React from 'react';
import { PDFDownloadLink } from "@react-pdf/renderer";

import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Invoice from '../../shared/components/Invoice/Invoice';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { usePdf } from '../../shared/hooks/pdf-hook';

interface Result {
  costs: number,
  hours: number
}

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
  hours: number
}

interface Props {
  result: Result,
  project: pdfData
}

const Costs: React.FC<Props> = (props) => {
  const { isLoading, error, clearError } = useHttpClient();
  const { updateState, hide } = usePdf();

  const bruttoCalc = (costs: number, vat: number) => {
    return costs * (1 + vat / 100);
  }

  const showButton = () => {
    updateState(true);
  }

  const onGeneratePdf: pdfData = {
    invoiceNo: props.project.invoiceNo,
    tasks: props.project.tasks,
    price: props.project.price,
    currency: 'EUR',
    netto: props.result.costs,
    vat: 19,
    brutto: bruttoCalc(props.result.costs, 19),
    hours: props.result.hours
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className="customer-item">
        <Button type="button" onClick={showButton} hide={hide}>Generate PDF</Button>
        {hide && (<Button className="fadeIn" type="button" danger><PDFDownloadLink
            document={<Invoice result={onGeneratePdf} />}
            fileName="invoice.pdf"
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading document..." : "Download PDF"
            }
          </PDFDownloadLink></Button>
        )}
        {isLoading && <LoadingSpinner asOverlay />}
        <h3>Netto costs: {props.result.costs.toFixed(2)} EUR</h3>
        <h3>{19}% VAT: {(bruttoCalc(props.result.costs, 19) - props.result.costs).toFixed(2)} EUR</h3>
        <h2>Total costs: {bruttoCalc(props.result.costs, 19).toFixed(2)} EUR</h2>
        <h4>Calculation: {props.result.hours} Hours</h4>
      </div>
    </React.Fragment>
  );
};

export default Costs;

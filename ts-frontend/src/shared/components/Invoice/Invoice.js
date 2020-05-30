import React from 'react';
import { Page, Document, Image, StyleSheet, Font } from '@react-pdf/renderer';
import InvoiceTitle from './InvoiceTitle'
import BillTo from './BillTo'
import InvoiceNo from './InvoiceNo'
import InvoiceItemsTable from './InvoiceItemsTable'
import InvoiceThankYouMsg from './InvoiceThankYouMsg'
import invoice from './data/invoice'

Font.register({ family: 'Roboto', src: 'https://evoleeq.com/uploads/Roboto-Regular.ttf' });
Font.register({ family: 'RobotoBold', src: 'https://evoleeq.com/uploads/Roboto-Bold.ttf' });

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Roboto',
        fontSize: 9,
        paddingTop: 30,
        paddingLeft:60,
        paddingRight:60,
        lineHeight: 1.5,
        flexDirection: 'column',
    }, 
    logo: {
        width: 74,
        height: 66,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
  });
  
  const Invoice = ({result}) => (
            <Document>
                <Page size="A4" style={styles.page}>
                    {/* <InvoiceTitle title='Invoice'/> */}
                    <BillTo invoice={invoice}/>
                    <InvoiceNo invoice={invoice} result={result}/>
                    <InvoiceItemsTable invoice={invoice} result={result} />
                    <InvoiceThankYouMsg />
                </Page>
            </Document>
        );
  
  export default Invoice
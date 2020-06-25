import React, { Fragment } from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    invoiceNoContainer: {
        flexDirection: 'row',
        marginTop: 20,
        fontFamily: 'RobotoBold'
    },
    invoiceDateContainer: {
        flexDirection: 'row',
    },
    label: {
        width: 60
    }
    
  });

  const today = new Date();
  const date = today.getDate()+'.'+(today.getMonth()+1)+'.'+today.getFullYear();

  const InvoiceNo = ({result}: any) => (
        <Fragment>
            <View style={styles.invoiceNoContainer}>
                <Text style={styles.label}>Invoice No:</Text>
                <Text style={styles.invoiceDate}>{result.invoiceNo}</Text>
            </View >
            <View style={styles.invoiceDateContainer}>
                <Text style={styles.label}>Date:</Text>
                <Text >{date}</Text>
            </View >
        </Fragment>
  );
  
  export default InvoiceNo
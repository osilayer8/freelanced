import React, { Fragment } from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
    },
    description: {
        width: '85%',
        textAlign: 'right',
        paddingRight: 8,
    },
    total: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
        fontFamily: 'RobotoBold',
    },
  });

const InvoiceTableFooter = ({result}: any) => {
    //const total = items.map((item: any) => item.qty * item.rate).reduce((accumulator: number, currentValue: number) => accumulator + currentValue , 0)
    return (    
        <Fragment>
            <View style={styles.row}>
                <Text style={styles.description}>Netto</Text>
                <Text style={styles.total}>{ result.netto.toFixed(2).toString() } {result.currency}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.description}>{ result.vat.toString() }% VAT</Text>
                <Text style={styles.total}>{ (result.brutto - result.netto).toFixed(2).toString() } {result.currency}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.description}>TOTAL</Text>
                <Text style={styles.total}>{ result.brutto.toFixed(2).toString() } {result.currency}</Text>
            </View>
        </Fragment>
    )
};
  
  export default InvoiceTableFooter
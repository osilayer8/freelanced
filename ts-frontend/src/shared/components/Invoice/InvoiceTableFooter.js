import React, { Fragment } from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
        fontFamily: 'RobotoBold',
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
    },
  });

const InvoiceTableFooter = ({items, result}) => {
    const total = items.map(item => item.qty * item.rate)
        .reduce((accumulator, currentValue) => accumulator + currentValue , 0)
    return(    
        <Fragment>
            <View style={styles.row}>
                <Text style={styles.description}>Netto</Text>
                <Text style={styles.total}>{ result.costs }</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.description}>VAT</Text>
                <Text style={styles.total}>20,-</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.description}>TOTAL</Text>
                <Text style={styles.total}>{ result.costs }</Text>
            </View>
        </Fragment>
    )
};
  
  export default InvoiceTableFooter
import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = 'red'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        color: 'black'
    },
    description: {
        width: '70%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    qty: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    amount: {
        width: '15%',
        paddingRight: 8,
        textAlign: 'right'
    },
   
  });

const InvoiceTableBlankSpace = (rowsCount: any) => {
    const blankRows = Array(rowsCount).fill(0)
    const rows = blankRows.map( (x, i) => 
        <View style={styles.row} key={`BR${i}`}>
            <Text style={styles.description}>12</Text>
            <Text style={styles.qty}>23</Text>
            <Text style={styles.amount}>45</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default InvoiceTableBlankSpace


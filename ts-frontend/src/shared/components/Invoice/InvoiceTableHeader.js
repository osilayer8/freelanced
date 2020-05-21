import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#aaaaaa',
        borderBottomWidth: 2,
        alignItems: 'center',
        height: 24,
        fontFamily: 'RobotoBold',
        flexGrow: 1
    },
    description: {
        width: '70%',
        paddingLeft: 8
    },
    qty: {
        width: '10%',
        paddingRight: 8,
        textAlign: 'right'
    },
    // rate: {
    //     width: '15%',
    //     paddingLeft: 8,
    //     textAlign: 'right'
    // },
    amount: {
        width: '20%',
        paddingRight: 8,
        textAlign: 'right'
    },
  });

  const InvoiceTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.description}>Item Description</Text>
        <Text style={styles.qty}>Qty</Text>
        <Text style={styles.amount}>Amount</Text>
    </View>
  );
  
  export default InvoiceTableHeader
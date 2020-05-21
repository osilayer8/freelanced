import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#aaaaaa',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 2
    },
    description: {
        width: '70%',
        textAlign: 'left',
        paddingLeft: 8,
    },
    qty: {
        width: '10%',
        textAlign: 'right',
        paddingRight: 8,
    },
    // rate: {
    //     width: '15%',
    //     textAlign: 'right',
    //     paddingRight: 18,
    // },
    amount: {
        width: '20%',
        textAlign: 'right',
        paddingRight: 8,
    },
  });


const InvoiceTableRow = ({items}) => {
    const rows = items.map( item => 
        <View style={styles.row} key={item.sno.toString()}>
            <Text style={styles.description}>{item.desc}</Text>
            <Text style={styles.qty}>{item.qty}</Text>
            <Text style={styles.amount}>{(item.qty * item.rate).toFixed(2)}</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
  export default InvoiceTableRow
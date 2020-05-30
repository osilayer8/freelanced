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
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
    },
    // rate: {
    //     width: '15%',
    //     textAlign: 'right',
    //     paddingRight: 18,
    // },
    amount: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
    },
  });


const InvoiceTableRow = ({items}) => {
    const rows = items.tasks.map( item => 
        <View style={styles.row} key={item.id.toString()}>
            <Text style={styles.description}>{item.title}</Text>
            <Text style={styles.qty}>{item.hours.toString()}</Text>
            <Text style={styles.amount}>{(item.hours * items.price).toFixed(2)}</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
  export default InvoiceTableRow
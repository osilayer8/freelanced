import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 80
    },
    billTo: {
        marginTop: 1,
        paddingBottom: 3
    },
  });


  const BillTo = ({invoice}) => (
    <View style={styles.headerContainer}>
        <Text>{invoice.company}</Text>
        <Text>{invoice.address}</Text>
    </View>
  );
  
  export default BillTo
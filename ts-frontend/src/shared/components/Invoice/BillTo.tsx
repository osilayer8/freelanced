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

  const BillTo = ({customer}: any) => (
    <View style={styles.headerContainer}>
        <Text>{customer.company}</Text>
        <Text>{customer.street}</Text>
    </View>
  );
  
  export default BillTo
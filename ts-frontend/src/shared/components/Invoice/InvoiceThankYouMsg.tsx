import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
   
    titleContainer:{
        flexDirection: 'row',
        position: 'absolute',
        bottom: 30,
        left: 60
    },
    reportTitle:{

    }
  });


  const InvoiceThankYouMsg = ({user}: any) => (
    <View style={styles.titleContainer}>
        <Text style={styles.reportTitle}>{user.bank}</Text>
    </View>
  );
  
  export default InvoiceThankYouMsg
import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
   
    titleContainer: {
        position: 'absolute',
        bottom: 30,
        left: 60,
        right: 60
    },
    flex: {
      flexDirection: 'row',
      flexGrow: 1,
      marginLeft: -10
    },
    cells: {
      width: '25%',
      paddingLeft: 10,
      fontSize: 7
    }
  });


  const InvoicePageFooter = ({user}: any) => (
    <View style={styles.titleContainer}>
      <View style={styles.flex}>
        <View style={styles.cells}>
          <Text>{user.company}</Text>
          <Text>{user.firstName} {user.name}</Text>
          <Text>{user.street}</Text>
          <Text>{user.country && user.country + '-'}{user.zip} {user.city}</Text>
        </View>
        <View style={styles.cells}>
          <Text>Telefon: {user.phone}</Text>
          <Text>{user.businessMail}</Text>
          <Text>{user.web}</Text>
        </View>
        <View style={styles.cells}>
          <Text>{user.firstName} {user.name}</Text>
          <Text>IBAN {user.iban}</Text>
          <Text>BIC {user.bic}</Text>
          <Text>Bank {user.bank}</Text>
        </View>
        <View style={styles.cells}>
          <Text>{user.commercialRegister}</Text>
          <Text>{user.taxId}</Text>
        </View>
      </View>
    </View>
  );
  
  export default InvoicePageFooter
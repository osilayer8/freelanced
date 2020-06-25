import React, { Fragment } from 'react';
import {View, StyleSheet } from '@react-pdf/renderer';
import InvoiceTableHeader from './InvoiceTableHeader'
import InvoiceTableRow from './InvoiceTableRow'
import InvoiceTableFooter from './InvoiceTableFooter'

const styles = StyleSheet.create({
    tableHolder: {
      position: 'absolute',
      top: 300,
      left: 60,
      right: 60
    },
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
});

  const InvoiceItemsTable = ({result}: any) => (
    <Fragment>
      <View style={styles.tableHolder}>
        <View style={styles.tableContainer}>
            <InvoiceTableHeader />
            <InvoiceTableRow items={result} />
        </View>
        <View>
            <InvoiceTableFooter result={result} />
        </View>
      </View>
    </Fragment>
  );
  
  export default InvoiceItemsTable
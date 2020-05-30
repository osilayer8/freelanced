import React, { Fragment } from 'react';
import {View, StyleSheet } from '@react-pdf/renderer';
import InvoiceTableHeader from './InvoiceTableHeader'
import InvoiceTableRow from './InvoiceTableRow'
import InvoiceTableBlankSpace from './InvoiceTableBlankSpace'
import InvoiceTableFooter from './InvoiceTableFooter'

const tableRowsCount = 5;

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

  const InvoiceItemsTable = ({invoice, result}) => (
    <Fragment>
      <View style={styles.tableHolder}>
        <View style={styles.tableContainer}>
            <InvoiceTableHeader />
            <InvoiceTableRow items={result} />
            <InvoiceTableBlankSpace rowsCount={ tableRowsCount - invoice.items.length} />
        </View>
        <View>
            <InvoiceTableFooter items={invoice.items} result={result} />
        </View>
      </View>
    </Fragment>
  );
  
  export default InvoiceItemsTable
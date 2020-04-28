import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff"
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  movieContainer: {
    backgroundColor: "#f6f6f5",
    display: "flex",
    flexDirection: "row",
    padding: 5
  },
  movieDetails: {
    display: "flex",
    marginLeft: 5
  },
  movieTitle: {
    fontSize: 15,
    marginBottom: 10
  }
});

const Pdf: React.FC<any> = (props) => {
  console.log("pdf props", props.data);
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.movieContainer}>
          <View style={styles.movieDetails}>
            <Text style={styles.movieTitle}>Costs: {props.data.costs},-</Text>
          </View>
          <View style={styles.movieDetails}>
            <Text style={styles.movieTitle}>Effort {props.data.hours}h</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default Pdf;

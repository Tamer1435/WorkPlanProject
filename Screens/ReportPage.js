import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";

const ReportPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const submitReport = () => {
    // Handle the report submission logic here
    alert('הדו"ח הוגש בהצלחה');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>דו"ח קבוצה 1</Text>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.timeText}>עד: 23:59</Text>
        <Text style={styles.detailsText}>עבודה מרחבית</Text>
        <Text style={styles.detailsText}>מקום: אונב</Text>
      </View>
      <TextInput
        style={styles.textInput}
        placeholder="כתבי כאן"
        placeholderTextColor="#888"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
        <Text style={styles.submitButtonText}>הגש את הדו"ח</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3E3E3",
    padding: 20,
    paddingTop: 60, // Move content down
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 25,
    color: "#000",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  dateContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  detailsText: {
    fontSize: 15,
    color: "#666",
  },
  textInput: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    height: 200,
    width: "100%",
    textAlign: "right",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  submitButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "600",
  },
});

export default ReportPage;

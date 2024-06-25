import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";

const ReportPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [extraField1, setExtraField1] = useState('');
  const [extraField2, setExtraField2] = useState('');
  const [extraField3, setExtraField3] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [isPastDeadline, setIsPastDeadline] = useState(false);

  const submitReport = () => {
    // Handle the report submission logic here
    Alert.alert('הדו"ח הוגש בהצלחה');
    navigation.goBack();
  };

  useEffect(() => {
    const checkDeadline = () => {
      const now = new Date();
      const deadline = new Date();
      deadline.setHours(23, 59, 59, 999); // Set the deadline to 23:59:59 today

      if (now > deadline) {
        setIsPastDeadline(true);
      }
    };

    checkDeadline();
    const intervalId = setInterval(checkDeadline, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.pageContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80} // Adjust this offset value if needed
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          style={{ height: 20, width: 30 }}
          source={require("../Images/back button.png")}
        />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>דו"ח קבוצה 1</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.timeText}>עד: 23:59</Text>
          <Text style={styles.detailsText}>עבודה מרחבית</Text>
          <Text style={styles.detailsText}>מקום: אונב</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="שם החווה שבה השתתפת"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.textInput}
          placeholder="כמה זמן עבדת"
          placeholderTextColor="#888"
          value={time}
          onChangeText={setTime}
        />
        <TextInput
          style={styles.textInput}
          placeholder="שדה נוסף 1"
          placeholderTextColor="#888"
          value={extraField1}
          onChangeText={setExtraField1}
        />
        <TextInput
          style={styles.textInput}
          placeholder="שדה נוסף 2"
          placeholderTextColor="#888"
          value={extraField2}
          onChangeText={setExtraField2}
        />
        <TextInput
          style={styles.textInput}
          placeholder="שדה נוסף 3"
          placeholderTextColor="#888"
          value={extraField3}
          onChangeText={setExtraField3}
        />
        <TextInput
          style={styles.paragraphInput}
          placeholder="כתבו פסקה כאן..."
          placeholderTextColor="#888"
          value={paragraph}
          onChangeText={setParagraph}
          multiline
        />
        <TouchableOpacity
          style={[styles.submitButton, isPastDeadline && styles.disabledButton]}
          onPress={submitReport}
          disabled={isPastDeadline}
        >
          <Text style={styles.submitButtonText}>הגש את הדו"ח</Text>
        </TouchableOpacity>
        {isPastDeadline && (
          <Text style={styles.deadlineText}>הדדליין להגשת הדו"ח עבר</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#E3E3E3",
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
    marginRight: 20,
    marginTop: 44,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
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
    height: 50,
    width: "100%",
    textAlign: "right",
    marginBottom: 30,
  },
  paragraphInput: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    height: 200,
    width: "100%",
    textAlign: "right",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#888",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  deadlineText: {
    fontSize: 16,
    color: "#FF0000",
    fontWeight: "600",
    marginTop: 10,
  },
});

export default ReportPage;

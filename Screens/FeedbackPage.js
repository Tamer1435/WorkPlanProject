import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Feedback = ({ navigation }) => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Month is zero-indexed
  const year = currentDate.getFullYear();
  const dayName = currentDate.toLocaleString("he-IL", {
    weekday: "long",
    timeZone: "UTC",
  });
  const monthName = currentDate.toLocaleString("he-IL", {
    month: "long",
    timeZone: "UTC",
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{`${monthName} ${year}`}</Text>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>יום {dayName}</Text>
        <Text style={styles.dateText}>{`${day} ${monthName}`}</Text>
      </View>
      <Text style={styles.sectionTitle}>עבודות</Text>
      <View style={styles.assignmentCard}>
        <View style={styles.assignmentHeader}>
          <Text style={styles.assignmentTime}>עד: 23:59</Text>
          <Text style={styles.assignmentGroup}>קבוצה 1 ד"ח</Text>
        </View>
        <Text style={styles.assignmentDetails}>עבודה: נוכחים</Text>
        <Text style={styles.assignmentDetails}>מקום: אונב</Text>
        <TouchableOpacity 
          style={styles.reportButton}
          onPress={() => navigation.navigate('ReportPage')}
        >
          <Text style={styles.reportButtonText}>דו"ח</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#85E1D7",
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
  monthText: {
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
  dayText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  dateText: {
    fontSize: 15,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  assignmentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    width: "100%",
  },
  assignmentHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    width: "100%",
  },
  assignmentTime: {
    fontSize: 14,
    color: "#666",
  },
  assignmentGroup: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  assignmentDetails: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
  },
  reportButton: {
    backgroundColor: "#add8e6",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-start",
  },
  reportButtonText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
});

export default Feedback;

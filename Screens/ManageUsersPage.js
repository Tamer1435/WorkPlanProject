import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const ManageUsersPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={{ height: 20, width: 30 }}
            source={require("../Images/back button.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.title}>נהל משתמשים</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SetUsers")}
        >
          <Image
            style={{ height: 55, width: 45 }}
            source={require("../Images/person.png")}
          />
          <Text style={styles.buttonText}>הגדר/ערוך משתמשים</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ReadReport")}
        >
          <Image
            style={{ height: 55, width: 45 }}
            source={require("../Images/report icon.png")}
          />
          <Text style={styles.buttonText}>הצג דוחות</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ViewAttendance")}
        >
          <Image
            style={{ height: 55, width: 50 }}
            source={require("../Images/attendance icon.png")}
          />
          <Text style={styles.buttonText}>הצג נוכחות</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: "#85E1D7",
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  bodyContainer: {
    padding: 20,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "20%",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#333",
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    textAlign: "right",
  },
});

export default ManageUsersPage;

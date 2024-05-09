import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";

const StudentPage = ({ navigation }) => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth();
  const dayName = currentDate.toLocaleString("he-IL", {
    weekday: "long",
    timeZone: "UTC",
  });
  const monthName = currentDate.toLocaleString("he-IL", {
    month: "long",
    timeZone: "UTC",
  });

  let name = "[שם סטודנטית]";

  const todayActivities = [];

  return (
    <View style={styles.container} behavior="padding">
      <View style={styles.upperContainer}>
        <Text style={styles.title}>WorkPlan</Text>
        <View style={styles.personalSection}>
          <View style={{ flex: 1, paddingLeft: 30 }}>
            <Image
              style={
                {
                  /* width: 70, height: 70 */
                }
              }
              source={require("../Images/icon clock.png")}
            />
          </View>
          <View style={{ paddingRight: 20 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                textAlign: "right",
                paddingBottom: 10,
              }}
            >
              הי {name}
            </Text>
            <Text style={{ fontSize: 15, textAlign: "right" }}>
              {" "}
              {dayName}, {day} {monthName}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.middleContainer}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            textAlign: "right",
            paddingBottom: 10,
            paddingRight: 20,
          }}
        >
          {" "}
          מה יש לנו היום
        </Text>
        <View style={styles.todaysSection}>
          {todayActivities.length === 0 ? (
            <View style={{ alignItems: "center" }}>
              <Image source={require("../Images/cal icon.png")} />
              <Text style={{ fontWeight: "600", marginTop: 5 }}>
                אין לך אירועי עבודה היום
              </Text>
            </View>
          ) : (
            <FlatList
              data={todayActivities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <Text>{item.name}</Text>}
            />
          )}
        </View>
      </View>

      <View style={styles.lowerContainer}>
        {/* <TouchableOpacity style={styles.Button}>
          <Text style={styles.buttonText}>כניסה</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#85E1D7",
  },
  upperContainer: {
    flex: 1,
    paddingTop: 30,
  },
  middleContainer: {
    flex: 1,
  },
  lowerContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
    paddingTop: 30,
  },

  personalSection: {
    flexDirection: "row",
    alignItems: "stretch",
    top: 30,
  },

  todaysSection: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    width: "90%",
    height: "80%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  //   input: {
  //     width: "70%",
  //     height: 50,
  //     borderWidth: 1,
  //     borderColor: "#ccc",
  //     backgroundColor: "#ffffff",
  //     textAlign: "right",
  //     borderRadius: 10,
  //     marginBottom: 10,

  //     paddingHorizontal: 10,
  //   },
  Button: {
    backgroundColor: "#5DBF72",
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    width: "40%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});

export default StudentPage;

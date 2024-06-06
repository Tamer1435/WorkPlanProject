import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Button,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../AuthProvider";

const MangerPage = ({ navigation }) => {
  const { user, userData, calendar } = useContext(AuthContext);
  const auth = getAuth();

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

  let name = userData.name;

  const goToCalendar = () => navigation.navigate("Calendar");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("LoginPage");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container} behavior="padding">
      <View style={styles.upperContainer}>
        <Text style={styles.title}>WorkPlan</Text>
        <View style={styles.personalSection}>
          <View style={{ flex: 1, paddingLeft: 30 }}>
            <Image source={require("../Images/icon clock.png")} />
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

      <View style={styles.lowerContainer}>
        <View style={styles.row}>
          <TouchableOpacity onPress={goToCalendar} style={styles.button}>
            <Image
              style={{ marginTop: 10 }}
              source={require("../Images/calendar icon.png")}
            />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>לוח השנה</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Image source={require("../Images/availabity icon.png")} />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>להגדיר זמינות</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button}>
            <Image
              style={{ marginTop: 15 }}
              source={require("../Images/transport icon.png")}
            />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>לנהל רכבים</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Image source={require("../Images/users icon.png")} />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>לנהל משתמשים</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button}>
            <Image
              style={{ marginTop: 10 }}
              source={require("../Images/edit jobs icon.png")}
            />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>לערוך עבודות</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Image source={require("../Images/farm icon.png")} />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>לנהל חוות</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button}>
            <Image
              style={{ marginTop: 10 }}
              source={require("../Images/contact icon.png")}
            />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>דף קשר</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Image source={require("../Images/set role icon.png")} />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>לקבוע עבודה</Text>
          </TouchableOpacity>
        </View>
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
  lowerContainer: {
    flex: 3,
    justifyContent: "flex-start",
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

  row: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    flex: 1,
    margin: 3,
    padding: 5,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 10,
  },

  buttonNull: {
    flex: 1,
    margin: 3,
    padding: 5,
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 10,
  },

  divider: {
    width: "98%",
    height: 1,
    backgroundColor: "#85E1D7",
    marginVertical: 10,
  },

  buttonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
});

export default MangerPage;

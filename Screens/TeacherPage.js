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
import OptionsModal from "./OptionsModal";

const TeacherPage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
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

  let name = "";

  if (userData) {
    name = userData.name;
  } else {
    name = "no name";
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const todayActivities = [];

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container} behavior="padding">
      <View style={styles.upperContainer}>
        <View style={styles.headerContainer}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>WorkPlan</Text>
          </View>
          <TouchableOpacity style={styles.optionButton} onPress={openModal}>
            <Image
              style={{ height: 22, width: 30 }}
              source={require("../Images/option button.png")}
            />
          </TouchableOpacity>
        </View>
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
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("RoleCalendar")}
          >
            <Image
              style={{ marginTop: 10 }}
              source={require("../Images/calendar icon.png")}
            />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>לוח השנה</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Availability")}
          >
            <Image source={require("../Images/availabity icon.png")} />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>להגדיר זמינות</Text>
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Attendance")}
          >
            <Image source={require("../Images/attendance icon.png")} />
            <View style={styles.divider} />
            <Text style={styles.buttonText}>נוכחות</Text>
          </TouchableOpacity>
        </View>
      </View>
      <OptionsModal
        visible={modalVisible}
        onLogout={handleLogout}
        onClose={closeModal}
      />
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
    justifyContent: "flex-start",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  optionButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    right: 10,
    top: 20,
    padding: 10,
    alignSelf: "flex-end",
    position: "absolute",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
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

export default TeacherPage;

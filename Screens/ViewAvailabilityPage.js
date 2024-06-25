import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase-config";

const ViewAvailabilityPage = ({ navigation }) => {
  const [weekDays, setWeekDays] = useState([
    "יום א",
    "יום ב",
    "יום ג",
    "יום ד",
    "יום ה",
    "יום ו",
  ]);
  const [availability, setAvailability] = useState({});
  const [currentWeekDates, setCurrentWeekDates] = useState([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  useEffect(() => {
    const getWeekDates = (offset = 0) => {
      const today = new Date();
      today.setDate(today.getDate() + offset * 7);
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      let dates = [];
      for (let i = 0; i < 7; i++) {
        const nextDate = new Date(startOfWeek);
        nextDate.setDate(startOfWeek.getDate() + i);
        if (i !== 6) {
          dates.push(nextDate.toLocaleDateString("he-IL"));
        }
      }
      return dates;
    };

    setCurrentWeekDates(getWeekDates(currentWeekOffset));
  }, [currentWeekOffset]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const startDate = currentWeekDates[0];
        const endDate = currentWeekDates[currentWeekDates.length - 1];
        const availabilityRef = collection(firestore, `availability/${startDate}-${endDate}/staff`);
        const snapshot = await getDocs(availabilityRef);
        const availabilityData = {};
        
        snapshot.forEach(doc => {
          const data = doc.data();
          Object.keys(data.dayJob).forEach(date => {
            if (!availabilityData[date]) {
              availabilityData[date] = [];
            }
            if (data.dayJob[date] === "available") {
              availabilityData[date].push(data.id);
            }
          });
        });
        
        setAvailability(availabilityData);
      } catch (error) {
        console.error("Error fetching availability: ", error);
      }
    };

    if (currentWeekDates.length > 0) {
      fetchAvailability();
    }
  }, [currentWeekDates]);

  const changeWeek = (direction) => {
    setCurrentWeekOffset((prev) => prev + direction);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>זמינות</Text>
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
      <View style={styles.weekNavigation}>
        <TouchableOpacity onPress={() => changeWeek(-1)}>
          <Text style={styles.navButton}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.weekText}>{`${currentWeekDates[0]} - ${currentWeekDates[currentWeekDates.length - 1]}`}</Text>
        <TouchableOpacity onPress={() => changeWeek(1)}>
          <Text style={styles.navButton}>▶</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={weekDays}
        keyExtractor={(item) => item}
        renderItem={({ item: day, index }) => (
          <View style={styles.dayRow}>
            <Text style={styles.dayText}>{day}</Text>
            <View style={styles.teacherList}>
              {availability[currentWeekDates[index]]?.map((teacher, index) => (
                <Text key={index} style={styles.teacherText}>
                  {teacher}
                </Text>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#85E1D7",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  navButton: {
    fontSize: 18,
    color: "#000",
  },
  weekText: {
    fontSize: 18,
    fontWeight: "600",
  },
  dayRow: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  dayText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "right",
  },
  teacherList: {
    marginTop: 10,
  },
  teacherText: {
    fontSize: 16,
    textAlign: "right",
  },
});

export default ViewAvailabilityPage;

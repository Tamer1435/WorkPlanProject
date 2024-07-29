import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { AuthContext } from "../AuthProvider";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

const AvailabilityPage = ({ navigation }) => {
  const [weekDates, setWeekDates] = useState([]);
  const [availability, setAvailability] = useState({});
  const [savedAvailability, setSavedAvailability] = useState({});
  const [currentWeekOffset, setCurrentWeekOffset] = useState(1); // Start with next week
  const [isPastDeadline, setIsPastDeadline] = useState(false);
  const { userData, db } = useContext(AuthContext);

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
          dates.push(nextDate);
        }
      }
      return dates;
    };

    setWeekDates(getWeekDates(currentWeekOffset));
  }, [currentWeekOffset]);

  useEffect(() => {
    const checkDeadline = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      // Check if it is past Wednesday 23:59
      if (
        currentDay > 3 ||
        (currentDay === 3 &&
          (currentHour > 23 ||
            (currentHour === 23 &&
              (currentMinute > 59 ||
                (currentMinute === 59 && currentSecond > 0)))))
      ) {
        setIsPastDeadline(true);
      } else {
        setIsPastDeadline(false);
      }
    };

    checkDeadline();
    const intervalId = setInterval(checkDeadline, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchSavedAvailability = async () => {
      try {
        const availabilityRef = doc(
          db,
          `availability/${weekDates[0]?.toLocaleDateString(
            "he-IL"
          )}-${weekDates[5]?.toLocaleDateString("he-IL")}/staff`,
          userData.name
        );
        const availabilitySnap = await getDoc(availabilityRef);

        if (availabilitySnap.exists()) {
          setSavedAvailability(availabilitySnap.data().dayJob);
        } else {
          setSavedAvailability({});
        }
      } catch (error) {
        Alert.alert("שגיאה", "לא ניתן לטעון את הזמינות שנשמרה");
      }
    };

    if (weekDates.length > 0) {
      fetchSavedAvailability();
    }
  }, [weekDates]);

  const handleAvailabilityChange = (date, status) => {
    if (!isPastDeadline || currentWeekOffset !== 0) {
      setAvailability((prev) => ({
        ...prev,
        [date]: status,
      }));
    }
  };

  const getStatusStyle = (date, status) => {
    if (savedAvailability[date] === status) {
      return status === "available"
        ? styles.savedAvailable
        : styles.savedUnavailable;
    } else if (availability[date] === status) {
      return status === "available" ? styles.available : styles.unavailable;
    }
    return styles.neutral;
  };

  const changeWeek = (direction) => {
    setCurrentWeekOffset((prev) => prev + direction);
  };

  const onPanGestureEvent = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX > 50) {
        changeWeek(-1);
      } else if (nativeEvent.translationX < -50) {
        changeWeek(1);
      }
      if (nativeEvent.velocityX > 800 && nativeEvent.absoluteX < width / 2) {
        navigation.goBack();
      }
    }
  };

  const saveAvailability = async () => {
    if (!isPastDeadline || currentWeekOffset !== 0) {
      try {
        const availabilityRef = doc(
          db,
          `availability/${weekDates[0]?.toLocaleDateString(
            "he-IL"
          )}-${weekDates[5]?.toLocaleDateString("he-IL")}/staff`,
          userData.name
        );
        await setDoc(availabilityRef, {
          id: userData.name,
          dayJob: availability,
        });
        setSavedAvailability(availability);
        Alert.alert("שמר הזמינות לשבוע");
      } catch (error) {
        Alert.alert("שגיאה", "לא שמר הזמינות");
      }
    }
  };

  const isPastWeek = new Date(weekDates[0]) < new Date();

  return (
    <PanGestureHandler onHandlerStateChange={onPanGestureEvent}>
      <View style={styles.pageContainer}>
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
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => changeWeek(-1)}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>◀</Text>
            </TouchableOpacity>
            <Text style={styles.weekText}>{`${weekDates[0]?.toLocaleDateString(
              "he-IL"
            )} - ${weekDates[5]?.toLocaleDateString("he-IL")}`}</Text>
            <TouchableOpacity
              onPress={() => changeWeek(1)}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>הזמניות:</Text>
          <View style={styles.datesContainer}>
            {weekDates.map((date) => {
              const dateString = date.toLocaleDateString("he-IL");
              const dayName = date.toLocaleString("he-IL", { weekday: "long" });
              return (
                <View key={dateString} style={styles.dateRowWrapper}>
                  <View style={styles.dateRow}>
                    <View style={styles.dateInfo}>
                      <Text style={styles.dateText}>{dateString}</Text>
                      <Text style={styles.dayText}>{dayName}</Text>
                    </View>
                    <TouchableOpacity
                      style={getStatusStyle(dateString, "available")}
                      onPress={() =>
                        handleAvailabilityChange(dateString, "available")
                      }
                    >
                      <Text style={styles.buttonText}>יכול</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={getStatusStyle(dateString, "unavailable")}
                      onPress={() =>
                        handleAvailabilityChange(dateString, "unavailable")
                      }
                    >
                      <Text style={styles.buttonText}>לא יכול</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (isPastDeadline && currentWeekOffset === 0) || isPastWeek
                ? styles.disabledButton
                : null,
            ]}
            onPress={saveAvailability}
            disabled={(isPastDeadline && currentWeekOffset === 0) || isPastWeek}
          >
            <Text style={styles.saveButtonText}>שמור</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingTop: "10%",
    backgroundColor: "#85E1D7",
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  navButton: {
    paddingHorizontal: 10,
  },
  navButtonText: {
    fontSize: 18,
    color: "#000",
  },
  weekText: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  datesContainer: {
    flex: 1,
  },
  dateRowWrapper: {
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
  },
  dateRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 20,
  },
  dayText: {
    fontSize: 20,
  },
  neutral: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    borderRadius: 10,
  },
  available: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    borderRadius: 10,
  },
  savedAvailable: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#A5D6A7", // Faded green
    alignItems: "center",
    borderRadius: 10,
  },
  unavailable: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#F44336",
    alignItems: "center",
    borderRadius: 10,
  },
  savedUnavailable: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#EF9A9A", // Faded red
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AvailabilityPage;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const AvailabilityPage = () => {
  const [weekDates, setWeekDates] = useState([]);
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    const getNextWeekDates = () => {
      const today = new Date();
      const startOfNextWeek = new Date(today.setDate(today.getDate() + (7 - today.getDay())));
      let dates = [];
      for (let i = 0; i < 7; i++) {
        const nextDate = new Date(startOfNextWeek);
        nextDate.setDate(startOfNextWeek.getDate() + i);
        dates.push(nextDate);
      }
      return dates;
    };

    setWeekDates(getNextWeekDates());
  }, []);

  const handleAvailabilityChange = (date, status) => {
    setAvailability((prev) => ({
      ...prev,
      [date]: status,
    }));
  };

  const getStatusStyle = (date, status) => {
    if (availability[date] === status) {
      return status === "available" ? styles.available : styles.unavailable;
    }
    return styles.neutral;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>הזמניות:</Text>
      <View style={styles.datesContainer}>
        {weekDates.map((date) => {
          const dateString = date.toLocaleDateString("he-IL");
          const dayName = date.toLocaleString("he-IL", { weekday: "long" });
          return (
            <View key={dateString} style={styles.dateRow}>
              <View style={styles.dateInfo}>
                <Text>{dateString}</Text>
                <Text>{dayName}</Text>
              </View>
              <TouchableOpacity
                style={getStatusStyle(dateString, "available")}
                onPress={() => handleAvailabilityChange(dateString, "available")}
              >
                <Text style={styles.buttonText}>יכול</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={getStatusStyle(dateString, "unavailable")}
                onPress={() => handleAvailabilityChange(dateString, "unavailable")}
              >
                <Text style={styles.buttonText}>לא יכול</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#85E1D7",
    padding: 20,
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
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  dateInfo: {
    flex: 1,
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
  unavailable: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#F44336",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default AvailabilityPage;

import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const daysOfWeek = [
  "יום ראשון",
  "יום א",
  "יום שני",
  "יום ב",
  "יום שלישי",
  "יום ג",
  "יום רביעי",
  "יום ד",
  "יום חמישי",
  "יום ה",
  "יום שישי",
  "יום ו",
  "יום שבת",
  "יום ש",
];

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getDayName = (date) => {
  const options = { weekday: "long" };
  return new Intl.DateTimeFormat("he-IL", options).format(date);
};

const CalendarPage = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState({
    1: ["Event 1", "Event 2"],
    2: ["Event 3"],
    3: ["Event 4", "Event 5", "Event 6"],
    // Add more events for other days
  });

  const currentDate = new Date();
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const monthName = currentDate.toLocaleString("he-IL", {
    month: "long",
    timeZone: "UTC",
  });
  const dayName = currentDate.toLocaleString("he-IL", {
    weekday: "long",
    timeZone: "UTC",
  });
  const currentYear = new Date().getFullYear();
  const preDaysInMonth = getDaysInMonth(currentMonth, currentYear);
  const daysInMonth = Array.from(
    { length: preDaysInMonth - currentDay + 1 },
    (_, i) => currentDay + i
  );
  const daysStartingFromCurrent = [
    ...daysInMonth.slice(currentDay - 1),
    ...daysInMonth.slice(0, currentDay - 1),
  ].map((day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayName = getDayName(date);
    return { day, dayName };
  });

  const renderDay = ({ item }) => (
    <TouchableOpacity
      key={`day-${item.day}`}
      style={[
        styles.dayButton,
        selectedDay === item.day && styles.selectedDayButton,
      ]}
      onPress={() => setSelectedDay(item.day)}
    >
      <Text style={styles.dayText}>{item.day}</Text>
      <Text style={styles.dayText}>
        {daysOfWeek[daysOfWeek.indexOf(item.dayName) + 1]}
      </Text>
    </TouchableOpacity>
  );

  const renderEvent = ({ item }) => (
    <View style={styles.eventContainer}>
      <Text style={styles.eventText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.headerText}>
          {monthName} {currentYear}
        </Text>
        <FlatList
          data={daysStartingFromCurrent}
          renderItem={renderDay}
          keyExtractor={(item) => {
            `day-${item.day}`;
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daysList}
        />
      </View>
      <View style={styles.bottomContainer}>
        {selectedDay ? (
          <FlatList
            data={events[selectedDay] || []}
            renderItem={renderEvent}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.noEventsText}>בחר יום לראות אירועים</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: "#5C4DFF",
  },
  topContainer: {
    flex: 1,
  },
  bottomContainer: {
    flex: 3,
    backgroundColor: "#ffffff",
    borderRadius: "35, 35, 0, 0",
  },
  headerText: {
    fontSize: 26,
    color: "#ffffff",
    fontWeight: "700",
    paddingLeft: 20,
  },
  daysList: {
    borderColor: "#ddd",
  },
  dayButton: {
    padding: 20,
    margin: 10,
    backgroundColor: "#7E8BFF",
    width: 85,
    height: 95,
    borderRadius: 15,
    alignSelf: "flex-end",
    alignItems: "center",
    alignContent: "flex-end",
  },
  selectedDayButton: {
    backgroundColor: "#FFFFFF",
  },
  dayText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  eventsContainer: {
    flex: 2,
    padding: 20,
  },
  eventContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  eventText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  noEventsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default CalendarPage;

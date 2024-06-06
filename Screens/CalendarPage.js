import React, { useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { AuthContext } from "../AuthProvider";
import { format } from "date-fns";

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

const CalendarPage = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const { user, userData, calendar } = useContext(AuthContext);
  const [ontoHeaderDay, setHeaderDay] = useState(null);
  const [indexOfSelectedDay, setIndexOfSelectedDay] = useState(null);
  const [daysEvents, setDaysEvents] = useState(null);

  // Getting date info
  const currentDate = new Date();
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const monthName = currentDate.toLocaleString("he-IL", {
    month: "long",
    timeZone: "UTC",
  });
  const currentYear = new Date().getFullYear();
  const preDaysInMonth = getDaysInMonth(currentMonth, currentYear);
  const daysInMonth = Array.from(
    { length: preDaysInMonth - currentDay + 1 },
    (_, i) => currentDay + i
  );
  const daysStartingFromCurrent = [
    ...daysInMonth.slice(0, currentDay - 1),
    ...daysInMonth.slice(currentDay - 1),
  ].map((day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayName = getDayName(date);
    return { day, dayName };
  });

  // Getting the calendar from database
  const events = calendar;
  // console.log(events[0]);
  // console.log(events[1]);

  const renderDay = ({ item }) => (
    <TouchableOpacity
      key={`day-${item.day}`}
      style={[
        styles.dayButton,
        selectedDay === item.day && styles.selectedDayButton,
      ]}
      onPress={() => {
        setSelectedDay(item.day);
        let index = -1;
        const eventsForTheDay = [];
        events.map((event) => {
          if (event.day == item.day) {
            index = events.indexOf(event);
            eventsForTheDay.push(events[index]);
          }
        });
        if (index != -1) {
          setDaysEvents(eventsForTheDay);
        } else {
          setDaysEvents(null);
        }
        console.log(eventsForTheDay);
        setHeaderDay(
          " " +
            daysOfWeek[daysOfWeek.indexOf(item.dayName)] +
            "," +
            " " +
            item.day +
            " " +
            monthName
        );
      }}
    >
      <Text style={styles.dayText}>{item.day}</Text>
      <Text style={styles.dayText}>
        {daysOfWeek[daysOfWeek.indexOf(item.dayName) + 1]}
      </Text>
    </TouchableOpacity>
  );

  const renderEvent = ({ item }) => (
    <TouchableOpacity style={styles.eventContainer}>
      <View>
        <Text style={styles.eventText}>{item.eventName}</Text>
        <Text style={styles.eventSubText}>עבודה:{item.job}</Text>
        <Text style={styles.eventSubText}>מקום:{item.location}</Text>
      </View>
      <View>
        <Text style={styles.eventSubText}>
          {format(item.timeOfMoving.toDate(), "hh:mm a")}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={{ height: 20, width: 30 }}
            source={require("../Images/back button.png")}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {monthName} {currentYear}
        </Text>
        <FlatList
          data={daysStartingFromCurrent}
          renderItem={renderDay}
          keyExtractor={(item) => {
            item.day;
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daysList}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventText}>אירועי עבודה</Text>
          <Text style={styles.dateText}>{ontoHeaderDay}</Text>
        </View>
        {selectedDay ? (
          <FlatList
            data={daysEvents}
            renderItem={renderEvent}
            keyExtractor={(item) => item.key}
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
    paddingTop: 50,
    backgroundColor: "#5C4DFF",
  },
  topContainer: {
    flex: 1,
  },
  backButton: {
    height: 20,
    width: 30,
    paddingRight: 40,
    alignSelf: "flex-end",
  },
  bottomContainer: {
    flex: 3,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: "hidden",
  },
  headerText: {
    fontSize: 26,
    color: "#ffffff",
    fontWeight: "700",
    paddingLeft: 20,
    paddingTop: 20,
    textAlign: "left",
  },
  daysList: {
    borderColor: "#ddd",
  },
  dayButton: {
    padding: 20,
    margin: 10,
    backgroundColor: "#7E8BFF",
    width: 80,
    height: 85,
    borderRadius: 15,
    alignSelf: "flex-end",
    alignItems: "center",
    alignContent: "flex-end",
  },
  selectedDayButton: {
    backgroundColor: "#FFFFFF",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  eventsContainer: {
    flex: 2,
    padding: 20,
  },
  eventHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 35,
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: "#000",
  },
  eventContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 20,
    width: "90%",
    justifyContent: "space-between",
    alignSelf: "center",
    margin: 10,
    backgroundColor: "#7E8BFF",
    opacity: 0.75,
    borderColor: "#000000",
    borderRadius: 20,
    borderWidth: 0.5,
  },
  eventText: {
    marginRight: 20,
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    textAlign: "right",
  },
  eventSubText: {
    marginRight: 20,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    textAlign: "right",
  },
  dateText: {
    marginLeft: 20,
    justifyContent: "flex-end",
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    opacity: 0.5,
  },
  noEventsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default CalendarPage;

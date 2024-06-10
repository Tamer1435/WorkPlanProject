import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const ViewAvailabilityPage = () => {
  //const [weekDays, setWeekDays] = useState(['יום א', 'יום ב', 'יום ג', 'יום ד', 'יום ה', 'יום ו']);
  const [availability, ViewAvailability] = useState({});

  useEffect(() => {
    // Mocked data for available teachers
    ViewAvailability({
      'יום א': ['מורה 1', 'מורה 2'],
      'יום ב': ['מורה 3'],
      'יום ג': ['מורה 1', 'מורה 4'],
      'יום ד': ['מורה 2'],
      'יום ה': ['מורה 1', 'מורה 3'],
      'יום ו': ['מורה 4'],
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>זמינות</Text>
      <FlatList
        data={weekDays}
        keyExtractor={(item) => item}
        renderItem={({ item: day }) => (
          <View style={styles.dayRow}>
            <Text style={styles.dayText}>{day}</Text>
            <View style={styles.teacherList}>
              {availability[day]?.map((teacher, index) => (
                <Text key={index} style={styles.teacherText}>{teacher}</Text>
              ))}
            </View>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.publishButton} onPress={() => alert('השינויים פורסמו בהצלחה')}>
          <Text style={styles.publishButtonText}>פרסם</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#85E1D7',
    padding: 20,
    paddingTop: 60, // Move content down
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  dayRow: {
    marginBottom: 20,
    padding: 20, // Increased padding
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  dayText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'right',
  },
  teacherList: {
    marginTop: 10,
  },
  teacherText: {
    fontSize: 16,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  publishButton: {
    backgroundColor: '#00008B',
    padding: 20, // Increased padding to make the button bigger
    borderRadius: 10,
    alignItems: 'center',
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default ViewAvailabilityPage;

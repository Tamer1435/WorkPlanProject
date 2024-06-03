import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AvailabilityPage = () => {
  const [weekDates, setWeekDates] = useState([]);
  const [availability, setAvailability] = useState({});
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const getWeekDates = (offset = 0) => {
      const today = new Date();
      today.setDate(today.getDate() + offset * 7);
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      let dates = [];
      for (let i = 0; i < 7; i++) {
        const nextDate = new Date(startOfWeek);
        nextDate.setDate(startOfWeek.getDate() + i);
        dates.push(nextDate);
      }
      return dates;
    };

    setWeekDates(getWeekDates(currentWeekOffset));
  }, [currentWeekOffset]);

  const handleAvailabilityChange = (date, status) => {
    setAvailability((prev) => ({
      ...prev,
      [date]: status,
    }));
  };

  const getStatusStyle = (date, status) => {
    if (availability[date] === status) {
      return status === 'available' ? styles.available : styles.unavailable;
    }
    return styles.neutral;
  };

  const changeWeek = (direction) => {
    setCurrentWeekOffset((prev) => prev + direction);
  };

  const saveAvailability = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeWeek(-1)}>
          <Text style={styles.navButton}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.weekText}>{`${weekDates[0]?.toLocaleDateString('he-IL')} - ${weekDates[6]?.toLocaleDateString('he-IL')}`}</Text>
        <TouchableOpacity onPress={() => changeWeek(1)}>
          <Text style={styles.navButton}>▶</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>הזמניות:</Text>
      <View style={styles.datesContainer}>
        {weekDates.map((date) => {
          const dateString = date.toLocaleDateString('he-IL');
          const dayName = date.toLocaleString('he-IL', { weekday: 'long' });
          return (
            <View key={dateString} style={styles.dateRowWrapper}>
              <View style={styles.dateRow}>
                <View style={styles.dateInfo}>
                  <Text>{dateString}</Text>
                  <Text>{dayName}</Text>
                </View>
                <TouchableOpacity
                  style={getStatusStyle(dateString, 'available')}
                  onPress={() => handleAvailabilityChange(dateString, 'available')}
                >
                  <Text style={styles.buttonText}>יכול</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={getStatusStyle(dateString, 'unavailable')}
                  onPress={() => handleAvailabilityChange(dateString, 'unavailable')}
                >
                  <Text style={styles.buttonText}>לא יכול</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveAvailability}>
        <Text style={styles.saveButtonText}>שמור</Text>
      </TouchableOpacity>
      {showSuccessMessage && (
        <View style={styles.successMessage}>
          <Text style={styles.successMessageText}>נשמר בהצלחה</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#85E1D7',
    padding: 20,
    paddingTop: 60, // Increased padding to move the content down
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  navButton: {
    fontSize: 18,
    color: '#000',
  },
  weekText: {
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  datesContainer: {
    flex: 1,
  },
  dateRowWrapper: {
    backgroundColor: '#E8E8E8', // Light grey background for each row
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
  },
  dateRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  neutral: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    borderRadius: 10,
  },
  available: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    borderRadius: 10,
  },
  unavailable: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#F44336',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  successMessage: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  successMessageText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AvailabilityPage;

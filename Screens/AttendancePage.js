import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const AttendancePage = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState('צוות 1');
  const [attendance, setAttendance] = useState({});

  const students = [
    'תלמיד 1',
    'תלמיד 2',
    'תלמיד 3',
    'תלמיד 4',
    'תלמיד 5',
    'תלמיד 6',
    'תלמיד 7',
    'תלמיד 8',
  ];

  const handleAttendanceChange = (student, status) => {
    setAttendance((prev) => ({
      ...prev,
      [student]: status,
    }));
  };

  const getStatusStyle = (student, status) => {
    if (attendance[student] === status) {
      return status === 'נוכח' ? styles.present : styles.absent;
    }
    return styles.neutral;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>קבוצה: {selectedClass}</Text>
        <TouchableOpacity onPress={() => alert('Class selector logic')}>
          <Text style={styles.classSelector}>שנה</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subTitle}>התלמידים:</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.studentRow}>
            <Text style={styles.studentName}>{item}</Text>
            <TouchableOpacity
              style={getStatusStyle(item, 'נוכח')}
              onPress={() => handleAttendanceChange(item, 'נוכח')}
            >
              <Text style={styles.buttonText}>נוכח</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={getStatusStyle(item, 'לא נוכח')}
              onPress={() => handleAttendanceChange(item, 'לא נוכח')}
            >
              <Text style={styles.buttonText}>לא נוכח</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#85E1D7',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  classSelector: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 20,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  studentName: {
    flex: 2,
    fontSize: 16,
    color: '#000',
  },
  neutral: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    borderRadius: 10,
  },
  present: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    borderRadius: 10,
  },
  absent: {
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
});

export default AttendancePage;

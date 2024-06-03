import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';

const AttendancePage = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState('צוות 1');
  const [attendance, setAttendance] = useState({});
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

  const classes = [
    'צוות 1',
    'צוות 2',
    'צוות 3',
    'צוות 4',
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

  const saveAttendance = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowClassPicker(true)}>
          <Text style={styles.title}>קבוצה: {selectedClass}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Class selector logic')}>
          <Text style={styles.classSelector}>שנה</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subTitle}>התלמידים:</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.studentRowWrapper}>
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
          </View>
        )}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveAttendance}>
        <Text style={styles.saveButtonText}>שמור</Text>
      </TouchableOpacity>
      {showSuccessMessage && (
        <View style={styles.successMessage}>
          <Text style={styles.successMessageText}>נשמר בהצלחה</Text>
        </View>
      )}
      <Modal
        visible={showClassPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowClassPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>בחר קבוצה</Text>
            {classes.map((className) => (
              <TouchableOpacity
                key={className}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedClass(className);
                  setShowClassPicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>{className}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#85E1D7',
    padding: 20,
    paddingTop: 60, 
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
  studentRowWrapper: {
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
  },
  studentRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentName: {
    flex: 2,
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalOption: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#E8E8E8',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 18,
  },
});

export default AttendancePage;

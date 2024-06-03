import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SetAvailability = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState('כיתה א');
  const [weekDays, setWeekDays] = useState(['יום א', 'יום ב', 'יום ג', 'יום ד', 'יום ה', 'יום ו', 'יום ש']);
  const [availability, setAvailability] = useState({});
  const [teachers, setTeachers] = useState(['מורה 1', 'מורה 2', 'מורה 3']);
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [teacherModalVisible, setTeacherModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const allStudents = ['תלמיד 1', 'תלמיד 2', 'תלמיד 3', 'תלמיד 4', 'תלמיד 5'];
  const [selectedTeachers, setSelectedTeachers] = useState({});

  const handleAvailabilityChange = (teacher, day, status) => {
    setAvailability((prev) => ({
      ...prev,
      [`${teacher}-${day}`]: status,
    }));
  };

  const addStudentToDay = (student, day) => {
    const isStudentAlreadyAdded = students.some(s => s.name === student && s.day === day);
    if (!isStudentAlreadyAdded) {
      setStudents((prev) => [
        ...prev,
        { name: student, day, teacher: selectedTeachers[day] },
      ]);
      setNewStudent('');
      setStudentModalVisible(false);
    } else {
      alert('תלמיד זה כבר נוסף ליום זה');
    }
  };

  const addTeacherToDay = (teacher, day) => {
    if (availability[`${teacher}-${day}`] === 'available') {
      setSelectedTeachers((prev) => ({
        ...prev,
        [day]: teacher,
      }));
      setTeacherModalVisible(false);
    } else {
      alert('מורה זה לא זמין ביום זה');
    }
  };

  const saveChanges = () => {
    alert('השינויים נשמרו ופורסמו בהצלחה');
  };

  const getAvailableTeachers = (day) => {
    return teachers.filter(teacher => availability[`${teacher}-${day}`] === 'available');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>הגדר זמינות</Text>
      <View style={styles.classSelector}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.classSelectorButton}>
          <Text style={styles.classSelectorText}>בחר כיתה: {selectedClass}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={weekDays}
        keyExtractor={(item) => item}
        renderItem={({ item: day }) => (
          <View style={styles.dayRow}>
            <Text style={styles.dayText}>{day}</Text>
            <TouchableOpacity onPress={() => { setSelectedDay(day); setTeacherModalVisible(true); }}>
              <Text style={styles.addButton}>בחר מורה</Text>
            </TouchableOpacity>
            <Text style={styles.selectedTeacherText}>{selectedTeachers[day] ? `מורה: ${selectedTeachers[day]}` : 'לא נבחר מורה'}</Text>
            <View style={styles.addStudentContainer}>
              <TouchableOpacity onPress={() => { setSelectedDay(day); setStudentModalVisible(true); }}>
                <Text style={styles.addButton}>הוסף תלמיד</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={students.filter(student => student.day === day)}
              keyExtractor={(student) => student.name}
              renderItem={({ item: student }) => (
                <Text style={styles.studentName}>{student.teacher} - {student.name}</Text>
              )}
            />
          </View>
        )}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveButtonText}>שמור ופרסם</Text>
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>בחר כיתה</Text>
            {['כיתה א', 'כיתה ב', 'כיתה ג'].map((className) => (
              <TouchableOpacity
                key={className}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedClass(className);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{className}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={studentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setStudentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>בחר תלמיד</Text>
            <FlatList
              data={allStudents}
              keyExtractor={(item) => item}
              renderItem={({ item: student }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => addStudentToDay(student, selectedDay)}
                >
                  <Text style={styles.modalOptionText}>{student}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setStudentModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={teacherModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTeacherModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>בחר מורה</Text>
            <FlatList
              data={getAvailableTeachers(selectedDay)}
              keyExtractor={(item) => item}
              renderItem={({ item: teacher }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => addTeacherToDay(teacher, selectedDay)}
                >
                  <Text style={styles.modalOptionText}>{teacher}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setTeacherModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>סגור</Text>
            </TouchableOpacity>
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
    paddingTop: 60, // Move content down
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  classSelector: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align the selector to the right
    marginBottom: 20,
  },
  classSelectorButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  classSelectorText: {
    fontSize: 18,
    fontWeight: '600',
  },
  picker: {
    width: 150,
    height: 40,
  },
  dayRow: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  dayText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'right',
  },
  teacherName: {
    fontSize: 18,
    textAlign: 'right',
  },
  addStudentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    fontSize: 18,
    color: '#000',
  },
  studentName: {
    fontSize: 16,
    textAlign: 'right',
  },
  selectedTeacherText: {
    fontSize: 16,
    textAlign: 'right',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
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
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SetAvailability;

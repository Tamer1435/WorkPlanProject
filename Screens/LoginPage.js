import React, { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../AuthProvider";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";

const LoginPage = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, logout } = useContext(AuthContext);

  const handleLogin = async () => {
    // Implement the login here
    setLoading(true);
    try {
      const userInfo = await login(username, password);

      //Navigate after authentication of the user data....
      if (userInfo) {
        if (userInfo.role === "student") {
          console.log(userInfo.role);
          navigation.navigate("Student");
        } else if (userInfo.role === "teacher") {
          console.log(userInfo.role);
          navigation.navigate("Teacher");
        } else if (userInfo.role === "manager") {
          console.log(userInfo.role);
          navigation.navigate("Manager");
        } else {
          console.log("User has no role.");
          Alert.alert("אין לך תפקיד", "צור קשר עם ההנהלה כדי לפתור את הבעיה");
        }
      } else {
        console.log("User document not found");
      }
    } catch (error) {
      console.log(error.message);
      switch (error.code) {
        case "auth/invalid-credential":
          Alert.alert("שגוי", "מייל או סיסמה לא נכונים", [{ text: "בסדר" }]);
          break;
        case "auth/invalid-email":
          Alert.alert("שגוי", "חשבון לא קיים", [{ text: "בסדר" }]);
          break;
        case "auth/too-many-requests":
          Alert.alert(
            "שגוי",
            "הגישה לחשבון זה הושבתה זמנית עקב ניסיונות התחברות רבים כושלים. אתה יכול לשחזר אותו מיד על ידי איפוס הסיסמה שלך או שאתה יכול לנסות שוב מאוחר יותר",
            [{ text: "בסדר" }]
          );
          break;
        default:
          console.log(error);
          Alert.alert("שגוי", "טעות בתקשורת", [{ text: "בסדר" }]);
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.upperContainer}>
          {/* You can place your image or any content here */}
          <Image
            source={require("../Images/LoginWelcome.jpg")}
            style={styles.Image}
          />
        </View>

        <View style={styles.lowerContainer}>
          <TextInput
            style={styles.input}
            placeholder="מייל:"
            onChangeText={(text) => setUsername(text.trim())}
            value={username}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="סיסמה:"
            onChangeText={(text) => setPassword(text)}
            value={password}
            autoCapitalize="none"
            secureTextEntry={true}
          />
          <TouchableOpacity
            disabled={loading}
            style={[styles.Button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>כניסה</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            style={styles.register}
          >
            <Text style={styles.registerText}>רישום למערכת</Text>
          </TouchableOpacity>
          {/* Loading popup */}
          <Modal visible={loading} transparent animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>מתחבר...</Text>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#85E1D7",
  },
  upperContainer: {
    flex: 1.2,
  },
  Image: {
    width: "100%",
    height: "100%",
  },
  lowerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    width: "70%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#ffffff",
    textAlign: "right",
    borderRadius: 10,
    marginBottom: 10,

    paddingHorizontal: 10,
  },
  Button: {
    backgroundColor: "#5DBF72",
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    width: "40%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  register: {
    borderWidth: 1,
    borderRadius: 10,
    top: 25,
    padding: 5,
    borderColor: "#fff",
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LoginPage;

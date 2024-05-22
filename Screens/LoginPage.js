import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
} from "react-native";

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Implement the login here
    try {
      const user = await signInWithEmailAndPassword(auth, username, password);

      //Navigate after authentication of the user data....
      console.log(user.user.uid);
      const userUID = user.user.uid;
      const userDocRef = doc(firestore, "/users", userUID);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists) {
        const userData = userDoc.data();

        if (userData.role === "student") {
          console.log(userData.role);
          navigation.navigate("Student");
        } else if (userData.role === "teacher") {
          console.log(userData.role);
        } else if (userData.role === "manger") {
          console.log(userData.role);
        } else {
          console.log("User has no role.");
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
            onChangeText={(text) => setUsername(text)}
            value={username}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="סיסמה:"
            onChangeText={(text) => setPassword(text)}
            value={password}
            autoCapitalize="none"
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.Button} onPress={handleLogin}>
            <Text style={styles.buttonText}>כניסה</Text>
          </TouchableOpacity>
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
});

export default LoginPage;

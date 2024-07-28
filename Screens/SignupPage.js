import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../AuthProvider";

const SignupPage = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { db, auth } = useContext(AuthContext);

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user information in preSignedUsers collection
      await setDoc(doc(db, "preSignedUsers", user.uid), {
        name: name,
        email: user.email,
        uid: user.uid,
        status: "pending",
      });

      // Reset form fields
      setEmail("");
      setPassword("");
      setError(null);

      alert("צור קשר עם ההנהלה ולאחר מכן המתן עד שהם יסיימו את הרישום שלך");

      // Navigate to another screen if needed
      navigation.goBack();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          אימייל
        >
          <Image
            style={{ height: 20, width: 30 }}
            source={require("../Images/back button.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.insiderContainer}>
        <Text style={styles.title}>רישום</Text>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <TextInput
          placeholder="שם מלא"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="אימייל"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="סיסמה"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.PassInput}
          />
          <TouchableOpacity
            style={styles.showPasswordButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.showPasswordText}>
              {showPassword ? "◡" : "◉"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSignup}>
          <Text>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.subTitle}>
          לאחר ההרשמה, צור קשר עם ההנהלה כדי לסיים את הגדרת החשבון שלך
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: "#85E1D7",
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  insiderContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: "right",
    width: "80%",
  },

  passwordContainer: {
    flexDirection: "row-reverse",
    width: "80%",
  },
  PassInput: {
    width: "85%",
    padding: 10,
    borderBottomWidth: 1,
    textAlign: "right",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  showPasswordButton: {
    width: "15%",
    borderBottomWidth: 1,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  showPasswordText: {
    color: "#1e90ff",
    fontSize: 30,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  subTitle: {
    top: 20,
    fontSize: 15,
    width: "75%",
    textAlign: "right",
  },
});

export default SignupPage;

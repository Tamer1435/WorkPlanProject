import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
} from "react-native";

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement the login here
    console.log("Username:", username);
    console.log("Password:", password);

    //Navigate after authentication of the user data....
    navigation.navigate("Student");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
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
        />
        <TextInput
          style={styles.input}
          placeholder="סיסמה:"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.Button} onPress={handleLogin}>
          <Text style={styles.buttonText}>כניסה</Text>
        </TouchableOpacity>
      </View>
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

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "./Screens/LoginPage";
import StudentPage from "./Screens/StudentPage";
import TeacherPage from "./Screens/TeacherPage";
import MangerPage from "./Screens/MangerPage";
import CalendarPage from "./Screens/CalendarPage";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Student" component={StudentPage} />
        <Stack.Screen name="Teacher" component={TeacherPage} />
        <Stack.Screen name="Manger" component={MangerPage} />
        <Stack.Screen name="Calendar" component={CalendarPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

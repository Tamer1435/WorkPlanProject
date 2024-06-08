import { StyleSheet, Text, View, StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./AuthProvider";
import LoginPage from "./Screens/LoginPage";
import StudentPage from "./Screens/StudentPage";
import TeacherPage from "./Screens/TeacherPage";
import MangerPage from "./Screens/MangerPage";
import CalendarPage from "./Screens/CalendarPage";
import SetJobsPage from "./Screens/SetJobsPage";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
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
          <Stack.Screen name="SetJobs" component={SetJobsPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

import { StyleSheet, Text, View, StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./AuthProvider";
import LoginPage from "./Screens/LoginPage";
import StudentPage from "./Screens/StudentPage";
import TeacherPage from "./Screens/TeacherPage";
import ManagerPage from "./Screens/ManagerPage";
import CalendarPage from "./Screens/CalendarPage";
import SetJobsPage from "./Screens/SetJobsPage";
import ManageFarmsPage from "./Screens/ManageFarmsPage";

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
          <Stack.Screen name="Manager" component={ManagerPage} />
          <Stack.Screen name="Calendar" component={CalendarPage} />
          <Stack.Screen name="SetJobs" component={SetJobsPage} />
          <Stack.Screen name="ManageFarms" component={ManageFarmsPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

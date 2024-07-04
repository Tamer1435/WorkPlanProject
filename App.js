import { StyleSheet, Text, View, StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./AuthProvider";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LoginPage from "./Screens/LoginPage";
import StudentPage from "./Screens/StudentPage";
import TeacherPage from "./Screens/TeacherPage";
import ManagerPage from "./Screens/ManagerPage";
import CalendarPage from "./Screens/CalendarPage";
import AttendancePage from "./Screens/AttendancePage";
import AvailabilityPage from "./Screens/AvailabilityPage";
import FeedbackPage from "./Screens/FeedbackPage";
import ReportPage from "./Screens/ReportPage";
import SetAvailability from "./Screens/SetAvailability";
import DayDetails from "./Screens/DayDetails";
import ViewAvailabilityPage from "./Screens/ViewAvailabilityPage";
import SetJobsPage from "./Screens/SetJobsPage";
import ManageFarmsPage from "./Screens/ManageFarmsPage";
import ManageVehiclesPage from "./Screens/ManageVehiclesPage";
import EditJobsPage from "./Screens/EditJobsPage";
import RoleCalendarPage from "./Screens/RoleCalendarPage";
import ManageUsersPage from "./Screens/ManageUsersPage";
import SignupPage from "./Screens/SignupPage";
import SetUsersPage from "./Screens/SetUsersPage";
import MakeReportPage from "./Screens/MakeReportPage";
import ReadReportPage from "./Screens/ReadReportPage";
import ViewAttendancePage from "./Screens/ViewAttendancePage";

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <AuthProvider>
      {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Signup" component={SignupPage} />
          <Stack.Screen name="Student" component={StudentPage} />
          <Stack.Screen name="Teacher" component={TeacherPage} />
          <Stack.Screen name="Manager" component={ManagerPage} />
          <Stack.Screen name="Calendar" component={CalendarPage} />
          <Stack.Screen name="Attendance" component={AttendancePage} />
          <Stack.Screen name="Availability" component={AvailabilityPage} />
          <Stack.Screen name="Feedback" component={FeedbackPage} />
          <Stack.Screen name="ReportPage" component={ReportPage} />
          <Stack.Screen name="SetAvailability" component={SetAvailability} />
          <Stack.Screen name="DayDetails" component={DayDetails} />
          <Stack.Screen
            name="ViewAvailability"
            component={ViewAvailabilityPage}
          />
          <Stack.Screen name="ManageFarms" component={ManageFarmsPage} />
          <Stack.Screen name="ManageVehicles" component={ManageVehiclesPage} />
          <Stack.Screen name="EditJobs" component={EditJobsPage} />
          <Stack.Screen name="SetJobs" component={SetJobsPage} />
          <Stack.Screen name="RoleCalendar" component={RoleCalendarPage} />
          <Stack.Screen name="ManageUsers" component={ManageUsersPage} />
          <Stack.Screen name="SetUsers" component={SetUsersPage} />
          <Stack.Screen name="MakeReport" component={MakeReportPage} />
          <Stack.Screen name="ReadReport" component={ReadReportPage} />
          <Stack.Screen name="ViewAttendance" component={ViewAttendancePage} />

          
          
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
    </GestureHandlerRootView>
  );
}

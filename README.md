# WorkPlan

## Project Development

- Anas Shwiki
- Tamer Dabit

## Description

WorkPlan is a react-native application for Android and iOS, it was made to help an agricultural school with their job planning and sharing the dates
with their staff and students. It helps the management with keeping all the information of each job in a reachable environment thats simple and secure,
it also allows them to export said data in the form of an Excel file to help them access and save the data on other devices and storage units.

## Database

The app integrates with Firebase Firestore as the primary database to store and retrieve real-time data, ensuring efficient data synchronization across different pages and users. Here's how the database connection works:

1. **Firebase Firestore Setup**

   - The app is connected to Firebase Firestore, a cloud-based NoSQL database. Firestore allows for real-time data syncing, which is crucial for environments where multiple users interact with the same data simultaneously.

   - Firestore Configuration: The Firebase configuration is stored in a secure file, named firebase-config.js.

2. **Real-Time Data Interaction**

   - Fetching Data: The app queries Firestore to dynamically fetch data such as attendance records, job assignments, or user availability. This allows for real-time updates based on user interactions.

   - Data Storage: The app uses Firestore to store key information including:

     - Users' info
     - Attendance records
     - Job assignments (Calendar)
     - Staff and student availability
     - Reports and feedback

   - Real-Time Updates: Firestore ensures that changes made by users, such as submitting reports or setting availability, are instantly reflected across all devices connected to the app.

3. **Connecting the App to Firebase**

   - The connection to Firestore is managed using the Firebase SDK, which is initialized in the app using configurations from the firebaseConfig.js file.

   - Data Operations: The app interacts with the Firestore database to:

     - Read data (from collections like "calendar", "attendance", "jobs", "students")
     - Write new data
     - Update existing data

4. **Security and Authentication**

   - Firebase Authentication: Firebase Authentication handles user logins securely, allowing users to authenticate with their email and password.

   - Role-Based Access: The app uses Firebase security rules to restrict access based on user roles (e.g., teachers, students, administrators). This ensures that users can only access data relevant to their role.

   - Security Rules: Firestore security rules are set up to control who can read or write specific data, ensuring sensitive information is protected.

## Pages Overview

**Page Name: app.js**

    Description: Works as the app's index page, contains the page navigating for the app.

**Page Name: screens/ManagerPage**

    Description: Manager dashboard for overseeing operations like calendar management, users, vehicles, farms, 
    and job assignments. Includes modals for logout and uses React context for managing user data. 
    Features image icons for quick navigation and alerts for important actions.

**Page Name: screens/TeacherPage**

    Description: Teacher dashboard displaying daily activities and schedules. 
    Offers access to a full calendar, availability settings, and report management. 
    Includes quick navigation to contacts and a secure logout feature.

**Page Name: screens/StudentPage**

    Description: Student dashboard with a personalized greeting and current date in both Gregorian and Hebrew formats. 
    Displays daily activities like schedules and event timings, with quick access to calendar and reports. 
    Includes refresh functionality and options for logging out.

**Page Name: screens/AttendancePage**

    Description: Allows teachers to track and update student attendance for events. 
    Features include dynamic attendance status updates and confirmation modals for submission.

**Page Name: screens/AvailabilityPage**

    Description: Staff can set and update their availability for upcoming weeks. 
    Includes weekly navigation and a save function with a submission deadline.

**Page Name: screens/CalendarPage**

    Description: Displays a monthly calendar with events. 
    Users can view details for each day, including event info such as time, location, and contacts.

**Page Name: screens/RoleCalendarPage**

    Description: Displays role-based events in a personalized calendar. 
    Users can view and tap events for detailed information and direct actions like making calls.

**Page Name: screens/EditJobsPage**

    Description: Enables event management by allowing users to edit, delete, 
    or update event details like time, location, vehicle, and participants.

**Page Name: screens/ExportExcelPage**

    Description: Facilitates the export of attendance, job records, and reports to Excel. 
    Includes date selection and modal confirmations for exporting.

**Page Name: screens/FeedbackPage**

    Description: Displays daily assignments and activities, including deadlines 
    and locations, with navigation for detailed reports on group tasks.

**Page Name: screens/LoginPage**

    Description: Provides a secure login interface with options for password visibility, 
    forgotten password recovery, and new user registration.

**Page Name: screens/ManageFarmsPage**

    Description: Manages farm entries, allowing users to view, add, and delete farms. 
    Features include a modal form for farm details and deletion confirmations.

**Page Name: screens/ManageVehiclesPage**

    Description: Administers vehicle records, allowing users to view, add, and delete vehicles. 
    Includes modals for data entry and confirmation alerts.

**Page Name: screens/ManageUsersPage**

    Description: Manages user accounts, offering options for viewing, editing, and exporting data. 
    Provides navigation to student reports, attendance, and other user-related tasks.

**Page Name: screens/OptionsModal**

    Description: Central point for user-specific actions like password change, viewing credits, and logout. 
    Includes feedback mechanisms like alerts and confirmations.

**Page Name: screens/ReadReportPage**

    Description: Allows viewing of student work reports by date and group, 
    with options to select and view detailed reports. Features a date picker and dynamic data fetching.

**Page Name: screens/ReadReportTeacherPage**

    Description: Teachers can view student reports based on selected dates and groups. 
    Displays key info like farm name, location, and work duration.

**Page Name: screens/ReportPage**

    Description: Enables students to submit daily work reports, 
    including farm name, location, and observations. Submission deadline and error handling are built-in.

**Page Name: screens/TeacherReportPage**

    Description: Teachers can submit daily reports, including start and end times, farm name, and comments. 
    Features autofill for event names, DateTime pickers, and confirmation alerts.

**Page Name: screens/SetAvailabilityPage**

    Description: Allows users to set weekly availability. 
    Features day selection and a 'Publish' button to save changes, with user feedback on successful submission.

**Page Name: screens/SetContactsPage**

    Description: Manages contact details with options to view, add, or delete contacts. 
    Includes modals for form input and feedback alerts for actions.

**Page Name: screens/SetJobsPage**

    Description: Facilitates job assignments for staff and students. 
    Users can select date, time, location, participants, and save favorite job templates for quick scheduling.

**Page Name: screens/SetUsersPage**

    Description: Manages user roles, allowing for adding, editing, and deleting users. 
    Includes modals for detailed interactions like role assignment and user details.

**Page Name: screens/SignupPage**

    Description: Provides a user registration form, with options for entering name, email, and password. 
    Features error handling and prompts for admin contact after registration.

**Page Name: screens/ViewAttendancePage**

    Description: Allows users to view attendance for selected dates and events. 
    Lists students with attendance status and updates in real-time based on selected event and date.

**Page Name: screens/ViewAvailabilityPage**

    Description: Displays staff availability for different days, 
    with weekly navigation and real-time updates from a database. 
    Features gesture-based navigation for easy week switching.

**Page Name: screens/ViewContactsPage**

    Description: A centralized hub for managing and viewing contacts. 
    Users can initiate phone calls directly from the list and receive feedback while data is being loaded.

**Page Name: screens/ViewTeacherReportPage**

    Description: Facilitates viewing teacher reports by selecting a date and event. 
    Displays detailed report information, including start time, location, and comments.

## Getting Started

This guide will walk you through the setup and installation process to get the WorkPlan app running on your local machine and ready for deployment to app stores.

### Prerequisites

Make sure you have the following installed before you begin:

### Node.js:

Install the latest stable version of Node.js, which comes with npm (Node Package Manager). You can download it here.

Verify the installation by running the following commands in your terminal:

        node -v
        npm -v

### Expo CLI:

Install Expo globally using npm if you don't have it already:

        npm install -g expo-cli

### Watchman (for Mac users):

Watchman is required for building iOS files. Install it using Homebrew:

        brew install watchman

### Xcode (for iOS development):

Download and install Xcode from the Mac App Store. Make sure to install the command line tools:

        xcode-select --install

### Android Studio (for Android development):

Download and install Android Studio, which includes the Android SDK. Set up the following:

Enable Developer Mode on your device/emulator.
Install Android SDK, Android SDK Platform, and Android SDK Tools.

## Setting Up the Project

Once the prerequisites are installed, follow these steps to set up the project:

### Clone the Repository

Clone the project repository from GitHub:

        git clone https://github.com/{username}/workplan.git
        cd workplan

### Install Dependencies

Install the required dependencies for the project:

        npm install

### Running the App in Development

You can start the Expo development server by running:

        npm start

This will open the Expo DevTools in your browser. You can either scan the QR code with the Expo Go app on your mobile device (available on iOS and Android) or run the app in an emulator.

## Uploading the App to EAS for Testing on Expo Go Using EAS Update

EAS Update allows you to push updates to your app instantly without going through the full build process. Here’s how you can use it:

(if any of the commands arent working try using "sudo npx" when running them).

1. Prerequisites

- Ensure you have the Expo CLI and EAS CLI installed globally:

        npm install -g expo-cli eas-cli

- Log in to your Expo account:

        npx expo login

2. Initialize EAS Update in Your Project

- Run the following command to set up EAS Update in your project:

        npx eas update:configure

This will configure your project to use EAS Update, creating a necessary eas.json file if it’s not already present.

3. Create a Branch

- EAS Update works with branches to manage different versions of your app. You can create a branch using:

        npx eas branch:create <branch-name>

Replace <branch-name> with the desired branch name (e.g., main, development).

4. Push an Update to the App

- After making changes to your app, you can push the update to the specified branch by running:

        sudo npx eas update --branch main

This command will push your changes to the main branch. Make sure you have the correct permissions if running sudo.

5.  Test on Expo Go
    Android: Testers can access the updated app via the Expo Go app using the link provided.
    iOS: Testers can use Expo Go on iOS as well to fetch the latest updates instantly without having to rebuild the entire app.

6.  Monitor Updates
    You can check the status and history of updates on your branch using:

        npx eas update:list

This command will display all updates made to a branch and their statuses.

## Generating Android and iOS Files

To build standalone versions of the app for Android and iOS, follow these steps:

### Prebuild for Android and iOS

Use Expo’s prebuild command to generate the necessary files for Android and iOS. This process generates the native code (Gradle for Android and Xcode project for iOS):

    npx expo prebuild

This will create android and ios folders in your project, containing the native code for each platform.

### Configure Android and iOS Settings

Open the android folder in Android Studio to customize Android settings.

Open the ios folder in Xcode to customize iOS settings.

### Building the APK (Android)

To build an Android APK or AAB (required for Play Store submission), use the following command:

    cd android
    ./gradlew assembleRelease

This will generate a release APK that you can find in android/app/build/outputs/apk/release/.

### Building the IPA (iOS)

To build an iOS IPA file (required for App Store submission), open the ios project in Xcode:

Select the target device.
Choose "Product" > "Archive" in the top menu.
Export the build as an IPA file for deployment.

## Testing on Devices

Before submitting your app to the stores, it's important to test it on real devices:

### For Android:

You can sideload the APK file to your device or use an emulator to run the app.

### For iOS:

Use Xcode to deploy the app to a physical iOS device or test on the simulator.

## Submitting to the Stores

Once your app is ready, follow these steps to submit it to the stores:

### Google Play Store:

Create a Google Play Developer account.
Submit your AAB file (preferred) to the Google Play Console.

### Apple App Store:

Create an Apple Developer account.
Use Xcode or Application Loader to submit the IPA file to App Store Connect.

## Libraries and Tools

- **React Native** - [React Native](https://reactnative.dev/)
- **Firebase** - [Firebase](https://firebase.google.com/)
- **React Navigation** - [React Navigation](https://reactnavigation.org/)
- **Expo** - [Expo](https://expo.dev/)
- **DateTimePicker** - [@react-native-community/datetimepicker](https://github.com/react-native-datetimepicker/datetimepicker)
- **ExcelJS** - [ExcelJS](https://github.com/exceljs/exceljs)
- **react-native-picker** - [@react-native-picker/picker](https://github.com/react-native-picker/picker)

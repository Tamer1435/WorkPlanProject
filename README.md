## WorkPlan

### Project Development

- Anas Shwiki
- Tamer Dabit

### Description

WorkPlan is a react-native application for Android and iOS, it was made to help an agricultural school with their job planning and sharing the dates
with their staff and students. It helps the management with keeping all the information of each job in a reachable environment thats simple and secure,
it also allows them to export said data in the form of an Excel file to help them access and save the data on other devices and storage units.

### Getting Started

This guide will walk you through the setup and installation process to get the WorkPlan app running on your local machine and ready for deployment to app stores.

**Prerequisites**
Make sure you have the following installed before you begin:

**Node.js**: Install the latest stable version of Node.js, which comes with npm (Node Package Manager). You can download it here.

Verify the installation by running the following commands in your terminal:

node -v
npm -v

**Expo CLI**: Install Expo globally using npm if you don't have it already:

npm install -g expo-cli

**Watchman (for Mac users)**: Watchman is required for building iOS files. Install it using Homebrew:

brew install watchman

**Xcode (for iOS development)**: Download and install Xcode from the Mac App Store. Make sure to install the command line tools:

xcode-select --install

**Android Studio (for Android development)**: Download and install Android Studio, which includes the Android SDK. Set up the following:

Enable Developer Mode on your device/emulator.
Install Android SDK, Android SDK Platform, and Android SDK Tools.

### Setting Up the Project

Once the prerequisites are installed, follow these steps to set up the project:

**Clone the Repository** Clone the project repository from GitHub:

git clone https://github.com/{username}/workplan.git
cd workplan

**Install Dependencies** Install the required dependencies for the project:

npm install

**Running the App in Development** You can start the Expo development server by running:

npm start

This will open the Expo DevTools in your browser. You can either scan the QR code with the Expo Go app on your mobile device (available on iOS and Android) or run the app in an emulator.

### Generating Android and iOS Files

To build standalone versions of the app for Android and iOS, follow these steps:

**Prebuild for Android and iOS** Use Expo’s prebuild command to generate the necessary files for Android and iOS. This process generates the native code (Gradle for Android and Xcode project for iOS):

npx expo prebuild

This will create android and ios folders in your project, containing the native code for each platform.

**Configure Android and iOS Settings**

Open the android folder in Android Studio to customize Android settings.

Open the ios folder in Xcode to customize iOS settings.

**Building the APK (Android)** To build an Android APK or AAB (required for Play Store submission), use the following command:

cd android
./gradlew assembleRelease

This will generate a release APK that you can find in android/app/build/outputs/apk/release/.

**Building the IPA (iOS)** To build an iOS IPA file (required for App Store submission), open the ios project in Xcode:

Select the target device.
Choose "Product" > "Archive" in the top menu.
Export the build as an IPA file for deployment.

### Testing on Devices

Before submitting your app to the stores, it's important to test it on real devices:

**For Android**: You can sideload the APK file to your device or use an emulator to run the app.

**For iOS**: Use Xcode to deploy the app to a physical iOS device or test on the simulator.

### Submitting to the Stores

Once your app is ready, follow these steps to submit it to the stores:

**Google Play Store**:

Create a Google Play Developer account.
Submit your AAB file (preferred) to the Google Play Console.

**Apple App Store**:

Create an Apple Developer account.
Use Xcode or Application Loader to submit the IPA file to App Store Connect.

### Libraries and Tools

- **React Native** - [React Native](https://reactnative.dev/)
- **Firebase** - [Firebase](https://firebase.google.com/)
- **React Navigation** - [React Navigation](https://reactnavigation.org/)
- **Expo** - [Expo](https://expo.dev/)
- **DateTimePicker** - [@react-native-community/datetimepicker](https://github.com/react-native-datetimepicker/datetimepicker)
- **ExcelJS** - [ExcelJS](https://github.com/exceljs/exceljs)
- **react-native-picker** - [@react-native-picker/picker](https://github.com/react-native-picker/picker)

import React, { createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { app } from "./firebase-config"; // Make sure to initialize your Firebase app here

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  // const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDoc = await getDoc(doc(db, "users", authUser.uid));
        setUserData(userDoc.data());
        setUser(authUser);
        // await fetchCalendarInfo();
      } else {
        setUserData(null);
        // setCalendar(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // // Get the calendar info
  // const fetchCalendarInfo = async () => {
  //   try {
  //     const currentMonth = new Date().getMonth() + 1; // Adjusting month for 1-based index
  //     const currentYear = new Date().getFullYear();
  //     const calendarId = `${currentYear}-${currentMonth}`;
  //     const daysCollectionRef = collection(db, `calendar/${calendarId}/days`);
  //     const daysQuerySnapshot = await getDocs(daysCollectionRef);

  //     const events = [];

  //     for (const dayDoc of daysQuerySnapshot.docs) {
  //       const eventsSubCollectionRef = collection(
  //         db,
  //         `calendar/${calendarId}/days/${dayDoc.id}/events`
  //       );
  //       const eventsQuerySnapshot = await getDocs(eventsSubCollectionRef);

  //       eventsQuerySnapshot.forEach((eventDoc) => {
  //         if (userData) {
  //           if (userData.role == "teacher") {
  //             if (eventDoc.data().attendant == userData.name) {
  //               events.push({
  //                 key: eventDoc.id,
  //                 day: dayDoc.id,
  //                 ...eventDoc.data(),
  //               });
  //             }
  //           } else if (userData.role == "student") {
  //             if (eventDoc.data().students.includes(userData.name)) {
  //               events.push({
  //                 key: eventDoc.id,
  //                 day: dayDoc.id,
  //                 ...eventDoc.data(),
  //               });
  //             }
  //           }
  //         }
  //       });
  //     }
  //     setCalendar(events);
  //   } catch (error) {
  //     console.error("Error fetching calendar info: ", error);
  //   }
  // };

  // // Refresh the information when needed
  // const refreshData = async () => {
  //   setLoading(true);
  //   await fetchCalendarInfo();
  //   setLoading(false);
  // };

  // Login function
  const login = async (email, password) => {
    try {
      const authUser = await signInWithEmailAndPassword(auth, email, password);
      const userUID = authUser.user.uid;
      const userDoc = await getDoc(doc(db, "users", userUID));

      const userInfo = {
        uid: userUID,
        email: authUser.user.email,
        ...userDoc.data(),
      };

      setUser(userInfo);

      return userInfo; // Return the user information
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("שגיאה במהלך התנתקות:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        // calendar,
        loading,
        login,
        logout,
        db,
        // refreshData,
        auth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

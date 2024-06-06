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

const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const calendarId =
        currentYear.toString() + "-" + (currentMonth + 1).toString();

      if (authUser) {
        const userDoc = await getDoc(doc(db, "users", authUser.uid));
        setUserData(userDoc.data());

        setUser({
          uid: authUser.uid,
          email: authUser.email,
          ...userDoc.data(),
        });

        const daysCollectionRef = collection(db, `calendar/${calendarId}/days`);
        const daysQuerySnapshot = await getDocs(daysCollectionRef);

        const daysList = daysQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDays(daysList);

        const eventsList = [];
        for (const dayDoc of daysQuerySnapshot.docs) {
          const eventsSubCollectionRef = collection(
            db,
            `calendar/${calendarId}/days/${dayDoc.id}/events`
          );
          const eventsQuerySnapshot = await getDocs(eventsSubCollectionRef);

          eventsQuerySnapshot.forEach((eventDoc) => {
            eventsList.push({
              key: eventDoc.id,
              day: dayDoc.id,
              ...eventDoc.data(),
            });
          });
        }

        setCalendar(eventsList);
      } else {
        setUserData(null);
        setCalendar(null);
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

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
      value={{ user, userData, calendar, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

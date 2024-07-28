import React, { createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { app } from "./firebase-config"; // Make sure to initialize your Firebase app here
import { Alert } from "react-native";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDoc = await getDoc(doc(db, "users", authUser.uid));
        setUserData(userDoc.data());
        setUser(authUser);
      } else {
        setUserData(null);
      }
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

  // ForgotPassword function
  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("הצלחה", "איפוס הסיסמה נשלח למייל שלך!");
    } catch (error) {
      Alert.alert("שגיאה", error.message);
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        login,
        logout,
        db,
        auth,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

import { AuthContext } from "../AuthProvider";

const ViewContactsPage = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(null);
  const { db } = useContext(AuthContext);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const contactsCollectionRef = collection(db, "contacts");
      const contactsCollection = await getDocs(contactsCollectionRef);
      setContacts(
        contactsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const renderContact = ({ item }) => (
    <TouchableOpacity
      onPress={() => makePhoneCall(item.phoneNumber)}
      style={styles.contactContainer}
    >
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={styles.contactRole}>{item.role}</Text>
      <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
    </TouchableOpacity>
  );

  const makePhoneCall = (phoneNumber) => {
    let phoneNumberFormatted = `tel:${phoneNumber}`;
    Linking.openURL(phoneNumberFormatted)
      .then((supported) => {})
      .catch((err) => console.error("Error occurred", err));
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={{ height: 20, width: 30 }}
            source={require("../Images/back button.png")}
          />
        </TouchableOpacity>
        <Text style={styles.header}>דף קשר</Text>
      </View>
      <View style={styles.bodyContainer}>
        {loading ? (
          <Text>נטען...</Text>
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={renderContact}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: "#85E1D7",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    height: 45,
    width: 45,
    borderRadius: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  bodyContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  contactContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contactRole: {
    fontSize: 16,
    color: "#555",
  },
  contactPhone: {
    fontSize: 16,
    color: "#1e90ff",
  },
});

export default ViewContactsPage;

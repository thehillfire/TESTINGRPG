import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../services/firebase';
import { collection, addDoc, query, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
// Yellow theme colors
const YELLOW_BG = '#0a0b0d';
const YELLOW_HEADER = '#ffb000';
const YELLOW_BUTTON = '#ffb000';
const YELLOW_BUTTON_TEXT = '#0a0b0d';
const YELLOW_INPUT_BG = 'rgba(255, 176, 0, 0.1)';
const YELLOW_INPUT_TEXT = '#fff';
const YELLOW_CONTACT_BG = 'rgba(255, 176, 0, 0.08)';
const YELLOW_CONTACT_TEXT = '#fff';

export default function ContactsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = collection(db, `users/${user.uid}/contacts`);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [user]);

  const addContact = async () => {
    if (!email.trim() || !user) return;
    // For demo: use email as contactId
    await setDoc(doc(db, `users/${user.uid}/contacts/${email}`), {
      email,
      addedAt: Date.now(),
    });
    setEmail('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: YELLOW_BG, padding: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: YELLOW_HEADER, marginBottom: 10, textAlign: 'center', letterSpacing: 2, textTransform: 'uppercase', textShadowColor: '#cc6600', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>
        Contacts
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TextInput
          style={{ flex: 1, backgroundColor: YELLOW_INPUT_BG, color: YELLOW_INPUT_TEXT, borderRadius: 8, padding: 10, marginRight: 8, borderWidth: 1, borderColor: YELLOW_HEADER }}
          value={email}
          onChangeText={setEmail}
          placeholder="Add contact by email..."
          placeholderTextColor="#ffd966"
        />
        <TouchableOpacity style={{ backgroundColor: YELLOW_BUTTON, borderRadius: 8, padding: 10, borderWidth: 2, borderColor: YELLOW_HEADER, shadowColor: YELLOW_HEADER, shadowOpacity: 0.6, shadowRadius: 8, elevation: 8 }} onPress={addContact}>
          <Text style={{ color: YELLOW_BUTTON_TEXT, fontWeight: '800', letterSpacing: 1, fontSize: 16 }}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 10, borderRadius: 8, backgroundColor: YELLOW_CONTACT_BG, marginVertical: 4, borderWidth: 1, borderColor: YELLOW_HEADER }}
            onPress={() => navigation.navigate('Game', { contactUsername: item.email })}
          >
            <Text style={{ color: YELLOW_CONTACT_TEXT, fontSize: 16 }}>{item.email}</Text>
          </TouchableOpacity>
        )}
        style={{ flex: 1 }}
      />
    </View>
  );
}

// Styles are now inline for yellow theme

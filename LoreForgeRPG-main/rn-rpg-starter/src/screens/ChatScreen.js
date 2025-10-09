import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { db } from '../services/firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function ChatScreen({ route }) {
  const { chatId, chatName } = route.params || {};
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [chatId]);

  const sendMessage = async () => {
    if (!input.trim() || !chatId || !user) return;
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      text: input,
      sender: user.email,
      timestamp: Date.now(),
    });
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{chatName || 'Chat'}</Text>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBox, item.sender === user.email ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
        style={styles.list}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0b0d', padding: 10 },
  header: { fontSize: 22, fontWeight: '700', color: '#00ff66', marginBottom: 10, textAlign: 'center' },
  list: { flex: 1 },
  messageBox: { padding: 10, borderRadius: 8, marginVertical: 4 },
  myMessage: { backgroundColor: '#00ff66' },
  otherMessage: { backgroundColor: '#222' },
  sender: { fontSize: 12, color: '#888' },
  text: { fontSize: 16, color: '#fff' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: { flex: 1, backgroundColor: '#222', color: '#fff', borderRadius: 8, padding: 10, marginRight: 8 },
  sendButton: { backgroundColor: '#00ff66', borderRadius: 8, padding: 10 },
  sendText: { color: '#0a0b0d', fontWeight: '700' },
});

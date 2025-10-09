import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function ChatListScreen({ navigation }) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'chats'), where('members', 'array-contains', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [user]);

  const startGroupChat = async () => {
    if (!user) return;
    const newChat = await addDoc(collection(db, 'chats'), {
      members: [user.uid],
      name: 'New Group',
      createdAt: Date.now(),
    });
    navigation.navigate('Chat', { chatId: newChat.id, chatName: 'New Group' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Chats</Text>
      <TouchableOpacity style={styles.newChatButton} onPress={startGroupChat}>
        <Text style={styles.newChatText}>Start New Group Chat</Text>
      </TouchableOpacity>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatBox} onPress={() => navigation.navigate('Chat', { chatId: item.id, chatName: item.name })}>
            <Text style={styles.chatName}>{item.name || 'Chat'}</Text>
            <Text style={styles.members}>Members: {item.members.length}</Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0b0d', padding: 10 },
  header: { fontSize: 22, fontWeight: '700', color: '#00ff66', marginBottom: 10, textAlign: 'center' },
  newChatButton: { backgroundColor: '#00ff66', borderRadius: 8, padding: 10, marginBottom: 10 },
  newChatText: { color: '#0a0b0d', fontWeight: '700', textAlign: 'center' },
  list: { flex: 1 },
  chatBox: { padding: 10, borderRadius: 8, backgroundColor: '#222', marginVertical: 4 },
  chatName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  members: { color: '#888', fontSize: 13 },
});

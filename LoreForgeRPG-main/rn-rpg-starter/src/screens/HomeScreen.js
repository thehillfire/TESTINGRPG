import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNButton from '../components/RNButton';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <Text style={[styles.h1, { color: theme.colors.onSurface }]}>Welcome, {user?.email || 'Traveler'}</Text>
      <Text style={{ color: theme.colors.muted }}>Choose your path. Your class rarity shapes your destiny.</Text>
      <View style={{ height: 12 }} />
  <RNButton label="Start Adventure" onPress={() => navigation.navigate('Game')} />
  <RNButton label="IMAGINE" variant="pink" onPress={() => navigation.navigate('Imagine')} />
  <RNButton label="Chats" variant="primary" onPress={() => navigation.navigate('ChatList')} />
  <RNButton label="Contacts" variant="primary" onPress={() => navigation.navigate('Contacts')} />
      <RNButton label="Inventory" variant="secondary" onPress={() => navigation.navigate('Inventory')} />
      <RNButton label="Theme Settings" variant="secondary" onPress={() => navigation.navigate('Settings')} />
      <RNButton label="Sign Out" variant="ghost" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  h1: { fontSize: 24, fontWeight: '700', marginBottom: 8 }
});

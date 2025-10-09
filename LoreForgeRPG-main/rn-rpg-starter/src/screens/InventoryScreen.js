import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function InventoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Your Inventory</Text>
      <Text style={styles.p}>This is a placeholder. Tie this to Firestore or local storage.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 20, justifyContent: 'center' },
  h1: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  p: { color: '#A1A7B5' }
});

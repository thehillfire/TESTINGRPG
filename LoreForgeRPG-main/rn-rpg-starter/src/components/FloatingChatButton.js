import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function FloatingChatButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Text style={styles.buttonText}>💬</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 0,
    backgroundColor: 'rgba(0,255,0,0.12)',
    borderWidth: 2,
    borderColor: '#00ff00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
    transform: [{ skewX: '-3deg' }],
  },
  buttonText: {
    fontSize: 28,
    color: '#00ff00',
    fontWeight: '800',
    textShadowColor: '#00ff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
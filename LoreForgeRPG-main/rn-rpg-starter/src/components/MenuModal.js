import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { defaultTheme as theme } from '../constants/theme';

export default function MenuModal({ visible, onClose, onChatPress, onInventoryPress, onLogoutPress, onContactsPress }) {
  // Add onContactsPress to props
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              onContactsPress();
              onClose();
            }}
          >
            <Text style={styles.menuIcon}>👥</Text>
            <Text style={styles.menuText}>CONTACTS</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              onChatPress();
              onClose();
            }}
          >
            <Text style={styles.menuIcon}>💬</Text>
            <Text style={styles.menuText}>CHAT</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              onInventoryPress();
              onClose();
            }}
          >
            <Text style={styles.menuIcon}>📖</Text>
            <Text style={styles.menuText}>STORYLOGS</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              onLogoutPress();
              onClose();
            }}
          >
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={styles.menuText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: '#0a0b0d',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#00ff66',
    shadowColor: '#00ff66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
    minWidth: 180,
    transform: [{ skewX: '-2deg' }],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'rgba(0,255,102,0.05)',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuText: {
    color: '#00ff66',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    textShadowColor: '#00ff66',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  separator: {
    height: 2,
    backgroundColor: '#00ff66',
    opacity: 0.3,
  },
});
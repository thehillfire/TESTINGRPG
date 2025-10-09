import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ClassDisplayScreen from '../screens/ClassDisplayScreen';
import CampaignScreen from '../screens/CampaignScreen';
import ImagineScreen from '../screens/ImagineScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import ContactsScreen from '../screens/ContactsScreen';
import { useAuth } from '../hooks/useAuth';
import { getRandomClass } from '../services/firestore';
import ChatModal from '../components/ChatModal';
import MenuModal from '../components/MenuModal';
import FloatingChatButton from '../components/FloatingChatButton';

const Stack = createNativeStackNavigator();

// Main Class Generation Screen Component
function MainGameScreen({ navigation }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { signOut } = useAuth();

  const getRainbowGradient = () => {
    // Rainbow colors for Eternal rarity
    return ['#ff0066', '#ff3300', '#ff6600', '#ffaa00ff', '#66ff00', '#00ff66', '#00ffcc', '#0066ff', '#3300ff', '#6600ff', '#cc00ff'];
  };

  const handleGenerateClass = async (specificRarity = null) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      console.log(`🎲 Generating RPG class${specificRarity ? ` with ${specificRarity} rarity` : ' with weighted rarity system'}...`);
      
      let newClass;
      if (specificRarity) {
        // Generate class with specific rarity for testing
        newClass = await getRandomClass();
        // Override the rarity for testing purposes
        newClass = { ...newClass, rarity: specificRarity };
      } else {
        // Generate the class using local weighted system
        newClass = await getRandomClass();
      }
      
      console.log('✅ Class generated successfully:', newClass.name);
      
      // Show success message briefly
      Alert.alert(
        'DEPLOYMENT SUCCESSFUL',
        `Your ${newClass.rarity} class "${newClass.name}" is ready for combat!`,
        [{ text: 'ACKNOWLEDGED', style: 'default' }]
      );
      
      // Wait 2 seconds then navigate to the class display screen
      setTimeout(() => {
        navigation.navigate('ClassDisplay', { classData: newClass });
      }, 2000);
      
    } catch (error) {
      console.error('❌ Failed to generate class:', error);
      Alert.alert(
        'DEPLOYMENT FAILED',
        error.message || 'Mission failed. Retry deployment.',
        [{ text: 'RETRY', style: 'default' }]
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background grid pattern */}
      <View style={styles.backgroundGrid} />
      
      {/* Menu Button (Three Lines) - Green Style */}
      <TouchableOpacity 
        style={{ position: 'absolute', top: 50, right: 20, padding: 15, zIndex: 10 }} 
        onPress={() => setMenuVisible(true)}
      >
        <View style={{ width: 25, height: 3, backgroundColor: '#00ff66', marginVertical: 2, borderRadius: 2 }} />
        <View style={{ width: 25, height: 3, backgroundColor: '#00ff66', marginVertical: 2, borderRadius: 2 }} />
        <View style={{ width: 25, height: 3, backgroundColor: '#00ff66', marginVertical: 2, borderRadius: 2 }} />
      </TouchableOpacity>
      
      <Text style={styles.title}>LOREFORGE</Text>
      <Text style={styles.subtitle}>TACTICAL CLASS GENERATOR</Text>
      
      <Pressable 
        style={[ 
          styles.button, 
          isGenerating && styles.buttonDisabled,
          buttonPressed && styles.buttonPressed
        ]} 
        onPress={() => handleGenerateClass()}
        onPressIn={() => setButtonPressed(true)}
        onPressOut={() => setButtonPressed(false)}
        disabled={isGenerating}
      >
        <View style={[styles.buttonGlow, buttonPressed && styles.buttonGlowPressed]} />
        <Text style={[styles.buttonText, buttonPressed && styles.buttonTextPressed]}>
          {isGenerating ? 'DEPLOYING...' : 'DEPLOY CLASS'}
        </Text>
      </Pressable>

      {/* IMAGINE Button */}
      <Pressable
        style={[styles.button, {
          backgroundColor: 'rgba(0,255,102,0.1)',
          borderColor: '#00ff66',
          marginTop: 24,
          borderRadius: 8,
          shadowColor: '#00ff66',
          shadowOpacity: 0.6,
          shadowRadius: 15,
          elevation: 15,
          transform: [{ skewX: '0deg' }],
        }]}
        onPress={() => navigation.navigate('Imagine')}
      >
        <View style={[styles.buttonGlow, { backgroundColor: 'rgba(0,255,102,0.15)' }]} />
        <Text style={[styles.buttonText, {
          color: '#00ff66',
          textShadowColor: '#00ff66',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 8,
        }]}>IMAGINE</Text>
      </Pressable>


      
      {isGenerating && (
        <Text style={styles.statusText}>
          ANALYZING TACTICAL DATA... STANDBY.
        </Text>
      )}

      {/* Floating Chat Button */}
      <FloatingChatButton onPress={() => setChatVisible(true)} />

      {/* Chat Modal */}
      <ChatModal 
        visible={chatVisible} 
        onClose={() => setChatVisible(false)} 
      />

      {/* Menu Modal */}
      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onChatPress={() => setChatVisible(true)}
        onContactsPress={() => navigation.navigate('Contacts')}
        onInventoryPress={() => {
          Alert.alert(
            'INVENTORY SYSTEM',
            'Inventory feature coming soon in next update!',
            [{ text: 'ACKNOWLEDGED', style: 'default' }]
          );
        }}
        onLogoutPress={() => {
          Alert.alert(
            'LOGOUT CONFIRMATION',
            'Are you sure you want to exit the mission?',
            [
              { text: 'CANCEL', style: 'cancel' },
              {
                text: 'LOGOUT',
                style: 'destructive',
                onPress: async () => {
                  await signOut();
                  // Force navigation reset to LoginScreen after logout
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                }
              }
            ]
          );
        }}
      />
    </View>
  );
}

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{ 
        headerStyle: { 
          backgroundColor: '#0a0b0d',
          borderBottomWidth: 2,
          borderBottomColor: '#ffb000',
          elevation: 0,
          shadowOpacity: 0,
        }, 
        headerTintColor: '#ffb000',
        headerTitleStyle: { 
          fontWeight: '800',
          fontSize: 20,
          letterSpacing: 2,
          textTransform: 'uppercase',
          textShadowColor: '#cc6600',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 4,
        },
        headerBackTitleVisible: false,
      }}
    >
      {user ? (
        <>
          <Stack.Screen 
            name="Home" 
            component={MainGameScreen} 
            options={{ title: 'LoreForge RPG', headerShown: false }} 
          />

          <Stack.Screen 
            name="ClassDisplay" 
            component={ClassDisplayScreen} 
            options={{ title: 'Your Class' }} 
          />

          <Stack.Screen 
            name="Campaign" 
            component={CampaignScreen} 
            options={{ 
              title: 'Mission In Progress',
              headerTintColor: '#ffb000',
            }} 
          />

          <Stack.Screen 
            name="Imagine" 
            component={ImagineScreen} 
            options={{ 
              title: 'Imagine Mode',
              headerTintColor: '#00ff66',
              headerStyle: {
                backgroundColor: '#0a0b0d',
                borderBottomWidth: 2,
                borderBottomColor: '#00ff66',
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                fontWeight: '800',
                fontSize: 20,
                letterSpacing: 2,
                textTransform: 'uppercase',
                textShadowColor: '#00ff66',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 8,
              },
            }} 
          />

          <Stack.Screen 
            name="ChatList" 
            component={ChatListScreen} 
            options={{ title: 'Chats', headerTintColor: '#00ff66' }} 
          />

          <Stack.Screen 
            name="Chat" 
            component={ChatScreen} 
            options={{ title: 'Chat', headerTintColor: '#00ff66' }} 
          />

          <Stack.Screen 
            name="Contacts" 
            component={ContactsScreen} 
            options={{ title: 'Contacts', headerTintColor: '#ffb000' }} 
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0b0d', // keep dark for contrast
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  backgroundGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,255,102,0.2)',
    borderStyle: 'solid',
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 15,
    zIndex: 10,
  },
  menuLine: {
    width: 25,
    height: 3,
    backgroundColor: '#ffb000',
    marginVertical: 2,
    borderRadius: 2,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#00ff66',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: '#00ff66',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    color: '#00ff66',
    marginBottom: 50,
    textAlign: 'center',
    fontWeight: '400',
    opacity: 0.8,
    letterSpacing: 1,
  },
  button: {
    backgroundColor: 'rgba(0,255,102,0.1)',
    borderWidth: 2,
    borderColor: '#00ff66',
    padding: 20,
    borderRadius: 8,
    width: 320,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00ff66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
    position: 'relative',
    transform: [{ skewX: '0deg' }],
    overflow: 'hidden',
  },
  buttonPressed: {
    backgroundColor: 'rgba(255, 176, 0, 0.3)',
    borderColor: '#ffcc33',
    shadowOpacity: 0.8,
    shadowRadius: 20,
    transform: [{ skewX: '-5deg' }, { scale: 0.98 }],
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 176, 0, 0.05)',
  },
  buttonGlowPressed: {
    backgroundColor: 'rgba(255, 176, 0, 0.15)',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(100, 100, 100, 0.2)',
    borderColor: '#666',
    shadowColor: '#666',
    opacity: 0.6,
  },
  buttonText: {
    color: '#00ff66',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#00ff66',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  buttonTextPressed: {
    color: '#ffcc33',
    textShadowColor: '#ff8800',
  },
  statusText: {
    color: '#ffd966',
    fontSize: 14,
    marginTop: 30,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  testingTitle: {
    color: '#ffb000',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 40,
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  rarityContainer: {
    marginTop: 10,
    maxHeight: 60,
  },
  rarityButton: {
    backgroundColor: 'rgba(255, 176, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#ffb000',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 0,
    transform: [{ skewX: '-2deg' }],
  },
  rainbowButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#0a0b0d',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ skewX: '-2deg' }],
    position: 'relative',
    overflow: 'hidden',
  },
  rainbowButtonSegment: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '9.09%', // 100% / 11 segments
    opacity: 0.7,
  },
  rainbowButtonTextContainer: {
    position: 'relative',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 0,
  },
  rainbowButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  rarityButtonText: {
    color: '#ffb000',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

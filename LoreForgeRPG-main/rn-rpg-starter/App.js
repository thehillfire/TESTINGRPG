import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { useAuth } from './src/hooks/useAuth';
import RootNavigator from './src/navigation';
import { View, Text, StyleSheet, Pressable } from 'react-native';

function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOREFORGE</Text>
      <Text style={styles.subtitle}>INITIALIZING SYSTEMS...</Text>
    </View>
  );
}

function SimpleLoginScreen() {
  const { signInAnonymously } = useAuth();
  const [buttonPressed, setButtonPressed] = useState(false);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOREFORGE</Text>
      <Text style={styles.subtitle}>TACTICAL DEPLOYMENT SYSTEM</Text>
      <Pressable 
        style={[styles.button, buttonPressed && styles.buttonPressed]} 
        onPress={signInAnonymously}
        onPressIn={() => setButtonPressed(true)}
        onPressOut={() => setButtonPressed(false)}
      >
        <Text style={[styles.buttonText, buttonPressed && styles.buttonTextPressed]}>
          ENTER MISSION
        </Text>
      </Pressable>
    </View>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  console.log('AppContent: loading =', loading, 'user =', user);

  if (loading) {
    console.log('AppContent: Showing LoadingScreen');
    return <LoadingScreen />;
  }
  if (!user) {
    console.log('AppContent: Showing SimpleLoginScreen');
    return <SimpleLoginScreen />;
  }
  console.log('AppContent: Showing NavigationContainer');
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0b0d',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffb000',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: '#cc6600',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffd966',
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.9,
  },
  button: {
    backgroundColor: 'rgba(255, 176, 0, 0.1)',
    borderWidth: 2,
    borderColor: '#ffb000',
    padding: 18,
    borderRadius: 0,
    width: 280,
    alignItems: 'center',
    shadowColor: '#ffb000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
    position: 'relative',
    overflow: 'hidden',
    transform: [{ skewX: '-3deg' }],
  },
  buttonPressed: {
    backgroundColor: 'rgba(255, 176, 0, 0.3)',
    borderColor: '#ffcc33',
    shadowOpacity: 0.8,
    transform: [{ skewX: '-3deg' }, { scale: 0.98 }],
  },
  buttonText: {
    color: '#ffb000',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#cc6600',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  buttonTextPressed: {
    color: '#ffcc33',
    textShadowColor: '#ff8800',
  },
});

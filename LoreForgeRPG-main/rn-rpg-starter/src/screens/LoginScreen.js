import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import RNButton from '../components/RNButton';
import { useAuth } from '../hooks/useAuth';
import { defaultTheme as theme } from '../constants/theme';
import { saveUserProfile, checkUsernameAvailable } from '../services/userService';

export default function LoginScreen() {
  const { signInWithEmail, signUpWithEmail, signInAnonymously, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (mode === 'login') {
      await signInWithEmail(email, password);
    } else {
      if (!username.trim()) {
        Alert.alert('Error', 'Username is required');
        return;
      }
      setLoading(true);
      try {
        const available = await checkUsernameAvailable(username.toLowerCase().trim());
        if (!available) {
          Alert.alert('Error', 'Username is already taken. Please choose another one.');
          setLoading(false);
          return;
        }
        const result = await signUpWithEmail(email, password);
        // Save username to Firestore
        await saveUserProfile(result.user.uid, {
          username: username.toLowerCase().trim(),
          email: email,
          displayName: username,
        });
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LoreForge Tactical Deployment System</Text>
      {mode === 'signup' && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#99A0AE"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#99A0AE"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#99A0AE"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <RNButton label={mode === 'login' ? (loading ? 'Signing In...' : 'Sign In') : (loading ? 'Creating...' : 'Create Account')} onPress={onSubmit} disabled={loading} />
      <RNButton
        variant="ghost"
        label={mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
        onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
      />
      <RNButton variant="secondary" label="Continue as Guest" onPress={signInAnonymously} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0b0d', padding: 20, justifyContent: 'center' },
  title: { color: '#00ff66', fontSize: 28, fontWeight: '700', marginBottom: 16, textAlign: 'center', textShadowColor: '#00ff66', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  input: {
    backgroundColor: '#111',
    color: '#00ff66',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00ff66'
  }
});

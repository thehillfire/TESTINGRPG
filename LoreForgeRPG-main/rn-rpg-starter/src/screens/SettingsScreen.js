import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import RNButton from '../components/RNButton';
import { useTheme } from '../hooks/useTheme';

export default function SettingsScreen() {
  const { apiKey, setApiKey, theme, refreshTheme } = useTheme();
  const [value, setValue] = useState(apiKey || '');

  useEffect(() => { setValue(apiKey || ''); }, [apiKey]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <Text style={[styles.h1, { color: theme.colors.onSurface }]}>Theme Settings</Text>
      <Text style={[styles.p, { color: theme.colors.muted }]}>
        Enter your UI API key to load a personalized theme.
      </Text>

      <TextInput
        style={[styles.input, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        placeholder="Enter API key (e.g., DEMO_DARK_TEAL)"
        placeholderTextColor={theme.colors.muted}
        autoCapitalize="none"
        value={value}
        onChangeText={setValue}
      />
      <RNButton label="Save Key" onPress={() => setApiKey(value.trim() || null)} />
      <RNButton variant="secondary" label="Refresh Theme" onPress={refreshTheme} />
      <RNButton variant="ghost" label="Clear Key" onPress={() => { setValue(''); setApiKey(null); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  h1: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  p: { marginBottom: 12 },
  input: { padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1 }
});

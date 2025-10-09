import React, { useState } from 'react';
import ChatModal from '../components/ChatModal';
import MenuModal from '../components/MenuModal';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { generateStory } from '../services/gemini';

export default function ImagineScreen() {
  const [identity, setIdentity] = useState('');
  const [currentStory, setCurrentStory] = useState('');
  const [userAction, setUserAction] = useState('');
  const [storyHistory, setStoryHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const navigation = typeof useNavigation === 'function' ? useNavigation() : null;
  // fallback for navigation prop if needed

  // Use Gemini API for story generation
  const handleStart = async () => {
    if (!identity.trim()) return;
    setIsGenerating(true);
    try {
      const prompt = `You are ${identity}. Begin a short immersive story (max 75 words) introducing this character and their life. Respond ONLY with valid JSON: { "story": "..." }`;
      const response = await generateStory(prompt);
      const storyData = JSON.parse(response);
      setCurrentStory(storyData.story);
      setStoryHistory([`Identity: ${identity}`, storyData.story]);
    } catch (error) {
      setCurrentStory('Failed to generate story. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUserAction = async () => {
    if (!userAction.trim()) return;
    setIsGenerating(true);
    try {
      const prompt = `Continue the story for this character. Context: ${currentStory.slice(-500)}. User action: "${userAction}". Respond with a short immersive story (max 75 words) in JSON: { "story": "..." }`;
      const response = await generateStory(prompt);
      const storyData = JSON.parse(response);
      setStoryHistory([...storyHistory, `Action: ${userAction}`, storyData.story]);
      setCurrentStory(storyData.story);
      setUserAction('');
    } catch (error) {
      setCurrentStory('Failed to generate story. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Menu Button (Three Lines) */}
      <TouchableOpacity 
        style={{ position: 'absolute', top: 50, right: 20, padding: 15, zIndex: 10 }} 
        onPress={() => setMenuVisible(true)}
      >
        <View style={{ width: 25, height: 3, backgroundColor: '#00ff66', marginVertical: 2, borderRadius: 2 }} />
        <View style={{ width: 25, height: 3, backgroundColor: '#00ff66', marginVertical: 2, borderRadius: 2 }} />
        <View style={{ width: 25, height: 3, backgroundColor: '#00ff66', marginVertical: 2, borderRadius: 2 }} />
      </TouchableOpacity>
  <Text style={styles.title}>IMAGINE</Text>
      {/* Menu Modal */}
      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onChatPress={() => { setMenuVisible(false); setChatVisible(true); }}
        onContactsPress={() => { setMenuVisible(false); if (navigation) navigation.navigate('Contacts'); }}
        onInventoryPress={() => {
          setMenuVisible(false);
          // Show StoryLogs alert or navigate to a StoryLogs screen if implemented
          if (navigation) {
            navigation.navigate('StoryLogs');
          } else {
            alert('StoryLogs feature coming soon!');
          }
        }}
        onLogoutPress={() => { setMenuVisible(false); if (navigation) navigation.navigate('Login'); }}
      />
      {/* Chat Modal */}
      <ChatModal 
        visible={chatVisible} 
        onClose={() => setChatVisible(false)} 
      />
      <Text style={styles.subtitle}>Who are you?</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="Describe yourself..."
        value={identity}
        onChangeText={setIdentity}
        editable={!currentStory}
      />
      {!currentStory && (
        <TouchableOpacity style={styles.button} onPress={handleStart} activeOpacity={0.8}>
          <Text style={{
            color: '#00ff00',
            fontSize: 18,
            fontWeight: '800',
            textAlign: 'center',
            letterSpacing: 2,
            textTransform: 'uppercase',
            textShadowColor: '#00ff00',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 8,
          }}>IMAGINE</Text>
        </TouchableOpacity>
      )}
      {currentStory && (
        <ScrollView style={styles.storyContainer}>
          <Text style={styles.storyText}>{currentStory}</Text>
        </ScrollView>
      )}
      {currentStory && (
        <View style={styles.actionContainer}>
          <TextInput
            style={styles.inputBox}
            placeholder="What do you want to do next?"
            value={userAction}
            onChangeText={setUserAction}
            editable={!isGenerating}
          />
          <TouchableOpacity style={styles.button} onPress={handleUserAction} activeOpacity={0.8}>
            <Text style={styles.buttonText}>SUBMIT ACTION</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Your Journey</Text>
        <ScrollView style={styles.historyScroll}>
          {storyHistory.map((entry, idx) => (
            <View key={idx} style={styles.historyBox}>
              <Text style={styles.historyText}>{entry}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0b0d',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#00ff66',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#00ff66',
    textAlign: 'center',
    marginBottom: 10,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#00ff66',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    color: '#fff',
    backgroundColor: '#111',
  },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 0,
    minWidth: 300,
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    borderWidth: 2,
    borderColor: '#00ff00',
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    transform: [{ skewX: '-3deg' }],
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#006600',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    color: '#00ff00',
  },
  storyContainer: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    minHeight: 60,
  },
  storyText: {
    color: '#00ff66',
    fontSize: 16,
  },
  actionContainer: {
    marginVertical: 10,
  },
  historyContainer: {
    marginTop: 20,
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#00ff66',
  },
  historyTitle: {
    color: '#00ff66',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  historyScroll: {
    maxHeight: 120,
  },
  historyBox: {
    marginBottom: 8,
    backgroundColor: '#222',
    borderRadius: 6,
    padding: 8,
  },
  historyText: {
    color: '#fff',
    fontSize: 13,
  },
});

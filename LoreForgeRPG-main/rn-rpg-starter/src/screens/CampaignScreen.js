import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { generateStory } from '../services/gemini';

export default function CampaignScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { classData } = route.params || {};
  const [currentStory, setCurrentStory] = useState('');
  const [storyChoices, setStoryChoices] = useState([]); // No longer used, but kept for fallback error handling
  const [userAction, setUserAction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameState, setGameState] = useState({
    chapter: 1,
    companions: [],
    playerStats: {
      health: 100,
      experience: 0,
      level: 1
    },
    storyHistory: []
  });

  useEffect(() => {
    if (classData) {
      initializeCampaign();
    }
  }, [classData]);

  const initializeCampaign = async () => {
    console.log('🎮 Starting campaign initialization for:', classData.name);
    setIsGenerating(true);
    
    try {
      const introPrompt = `
        Create an immersive RPG story introduction for a ${classData.rarity} class character named "${classData.name}".
        Character Details:
        - Class: ${classData.name}
        - Rarity: ${classData.rarity}
        - Theme: ${classData.theme?.name || classData.usedTheme || 'Unknown'}
        - Role: ${classData.role?.name || classData.usedRole || 'Unknown'}
        - Description: ${classData.description}
        Generate:
        1. An engaging story introduction (max 75 words) that introduces the character in their world
        2. Create 2-3 compelling side characters that will join the adventure
        3. Set up an initial conflict or mystery
        4. End with a decision point that affects the story direction
        Format the response as JSON:
        {
          "story": "The story text...",
          "companions": ["Companion 1 name and brief description", "Companion 2 name and brief description"]
        }
        Respond ONLY with valid JSON. Do not include any explanation, markdown, or text outside the JSON object. Do not use triple backticks.
      `;

      console.log('📚 Calling generateStory API...');
      const response = await generateStory(introPrompt);
      console.log('📚 Story API response received:', response ? 'Success' : 'Empty');
      
      const storyData = JSON.parse(response);
      console.log('📚 Parsed story data:', storyData ? 'Success' : 'Failed');
      
      setCurrentStory(storyData.story);
      setStoryChoices(storyData.choices);
      setGameState(prev => ({
        ...prev,
        companions: storyData.companions,
        storyHistory: [storyData.story]
      }));
      
      console.log('✅ Campaign initialized successfully');
      
    } catch (error) {
      console.error('❌ Error generating initial story:', error);
      Alert.alert(
        'Story Generation Failed', 
        `Unable to start the campaign: ${error.message}\n\nPlease check your backend configuration and try again.`,
        [{ text: 'OK', style: 'default' }]
      );
      
      // Set fallback story for testing
      setCurrentStory('Story generation failed. Please check your backend configuration and API key.');
      setStoryChoices([
        { text: 'Retry Campaign', consequence: 'Try generating the story again' },
        { text: 'Return to Base', consequence: 'Go back to character selection' },
        { text: 'Check Settings', consequence: 'Verify backend configuration' },
        { text: 'Debug Mode', consequence: 'View error details' }
      ]);
      
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUserAction = async () => {
    if (!userAction.trim()) return;
    setIsGenerating(true);
    try {
      const continuePrompt = `
        Continue the RPG story based on the user's custom input.
        Previous story context: ${currentStory.slice(-500)}
        User input: "${userAction}"
        Character: ${classData.name} (${classData.rarity} ${classData.role?.name || classData.usedRole})
        Companions: ${gameState.companions.join(', ')}
        Chapter: ${gameState.chapter}
        Generate:
        1. A story continuation (max 75 words) that follows from the user's input
        2. Show consequences of the decision with emotional depth
        3. Introduce new challenges or developments
        4. End with another decision point
        Format as JSON:
        {
          "story": "The continuation story...",
          "statsChange": { "health": 0, "experience": 10 }
        }
      `;

      const response = await generateStory(continuePrompt);
      const storyData = JSON.parse(response);

      setCurrentStory(storyData.story);
      setUserAction('');

      // Update game state
      setGameState(prev => ({
        ...prev,
        chapter: prev.chapter + 1,
        playerStats: {
          ...prev.playerStats,
          health: Math.max(0, Math.min(100, prev.playerStats.health + (storyData.statsChange?.health || 0))),
          experience: prev.playerStats.experience + (storyData.statsChange?.experience || 10),
          level: Math.floor((prev.playerStats.experience + (storyData.statsChange?.experience || 10)) / 100) + 1
        },
        storyHistory: [...prev.storyHistory, storyData.story]
      }));

    } catch (error) {
      console.error('Error continuing story:', error);
      Alert.alert('Story Generation Failed', 'Unable to continue the story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!classData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>No Character Selected</Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Return to Deployment</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        
        {/* Character Info Header */}
        <View style={styles.characterHeader}>
          <Text style={[styles.characterName, { color: theme.colors.primary }]}>
            {classData.name}
          </Text>
          <Text style={[styles.characterInfo, { color: theme.colors.textSecondary }]}>
            {classData.rarity} • Level {gameState.playerStats.level} • HP: {gameState.playerStats.health}/100
          </Text>
        </View>

        {/* Story Display */}
        <View style={[styles.storyContainer, { backgroundColor: theme.colors.backgroundSecondary }]}>
          {isGenerating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffb000" />
              <Text style={[styles.loadingText, { color: '#ffb000' }]}>
                GENERATING MISSION BRIEFING...
              </Text>
              <Text style={[styles.loadingSubtext, { color: '#ffd966' }]}>
                AI is crafting your personalized story
              </Text>
            </View>
          ) : currentStory ? (
            <Text style={[styles.storyText, { color: theme.colors.text }]}>
              {currentStory}
            </Text>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: '#ffb000' }]}>
                AWAITING MISSION DATA...
              </Text>
            </View>
          )}
        </View>

        {/* Companions Display */}
        {gameState.companions.length > 0 && (
          <View style={styles.companionsContainer}>
            <Text style={[styles.companionsTitle, { color: theme.colors.primary }]}>
              COMPANIONS
            </Text>
            {gameState.companions.map((companion, index) => (
              <Text key={index} style={[styles.companionText, { color: theme.colors.text }]}>
                • {companion}
              </Text>
            ))}
          </View>
        )}

        {/* Custom User Action Input */}
        {!isGenerating && (
          <View style={styles.choicesContainer}>
            <Text style={[styles.choicesTitle, { color: theme.colors.primary }]}>YOUR ACTION</Text>
            <TextInput
              style={[styles.inputBox, {
                color: theme.colors.text,
                borderColor: theme.colors.primary,
                backgroundColor: theme.colors.backgroundSecondary || '#fff',
              }]}
              placeholder="Type your action..."
              placeholderTextColor={theme.colors.textSecondary || '#888'}
              value={userAction}
              onChangeText={setUserAction}
              editable={!isGenerating}
              multiline
            />
            <TouchableOpacity
              style={[styles.choiceButton, { backgroundColor: theme.colors.backgroundSecondary }]}
              onPress={handleUserAction}
              disabled={isGenerating || !userAction.trim()}
            >
              <Text style={[styles.choiceText, { color: theme.colors.text }]}>Submit Action</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Game Stats */}
        <View style={styles.statsContainer}>
          <Text style={[styles.statsTitle, { color: theme.colors.primary }]}>MISSION STATUS</Text>
          <Text style={[styles.statsText, { color: theme.colors.text }]}>Chapter: {gameState.chapter} • Experience: {gameState.playerStats.experience}</Text>
        </View>

        {/* Chapter History */}
        <View style={styles.chapterHistoryContainer}>
          <Text style={[styles.chapterHistoryTitle, { color: theme.colors.primary }]}>CHAPTER HISTORY</Text>
          <ScrollView style={styles.chapterScroll} contentContainerStyle={styles.chapterScrollContent}>
            {gameState.storyHistory.map((story, idx) => (
              <View key={idx} style={styles.chapterBox}>
                <Text style={[styles.chapterLabel, { color: theme.colors.primary }]}>Chapter {idx + 1}</Text>
                <Text style={[styles.chapterSummary, { color: theme.colors.text }]}>{story}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
// ...existing code...
// Place these inside StyleSheet.create block:
// chapterHistoryContainer, chapterHistoryTitle, chapterScroll, chapterScrollContent, chapterBox, chapterLabel, chapterSummary

        {/* Back Button */}
        <TouchableOpacity 
          style={[styles.backButton, { borderColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>
            ABORT MISSION
          </Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    minHeight: 40,
    // backgroundColor is set dynamically for theme
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0b0d',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  characterHeader: {
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ffb000',
  },
  characterName: {
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
    color: '#ffb000',
  },
  characterInfo: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
    color: '#ffd966',
  },
  storyContainer: {
    padding: 25,
    borderRadius: 0,
    marginBottom: 25,
    backgroundColor: 'rgba(255, 176, 0, 0.08)',
    borderWidth: 1,
    borderColor: '#ffb000',
    minHeight: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    padding: 30,
    backgroundColor: 'rgba(255, 176, 0, 0.05)',
    borderWidth: 1,
    borderColor: '#ffb000',
    borderStyle: 'dashed',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '800',
    color: '#ffb000',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    textShadowColor: '#cc6600',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  loadingSubtext: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#ffd966',
    textAlign: 'center',
    opacity: 0.8,
    fontStyle: 'italic',
  },
  storyText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#ffffff',
    textAlign: 'left',
  },
  companionsContainer: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: 'rgba(255, 176, 0, 0.05)',
    borderWidth: 1,
    borderColor: '#ffb000',
  },
  companionsTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 15,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#ffb000',
  },
  companionText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
    color: '#ffffff',
  },
  choicesContainer: {
    marginBottom: 25,
  },
  choicesTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#ffb000',
  },
  choiceButton: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 0,
    backgroundColor: 'rgba(255, 176, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#ffb000',
    transform: [{ skewX: '-2deg' }],
  },
  choiceText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#ffffff',
    letterSpacing: 1,
  },
  consequenceText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#ffd966',
    opacity: 0.8,
  },
  statsContainer: {
    padding: 20,
    marginBottom: 25,
    backgroundColor: 'rgba(255, 176, 0, 0.05)',
    borderWidth: 1,
    borderColor: '#ffb000',
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#ffb000',
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  backButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 0,
    backgroundColor: 'rgba(255, 176, 0, 0.05)',
    borderWidth: 2,
    borderColor: '#ffb000',
    alignItems: 'center',
    transform: [{ skewX: '-2deg' }],
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#ffb000',
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  chapterHistoryContainer: {
    marginBottom: 25,
    padding: 10,
    backgroundColor: 'rgba(255, 176, 0, 0.03)',
    borderWidth: 1,
    borderColor: '#ffb000',
    borderRadius: 8,
  },
  chapterHistoryTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#ffb000',
    textAlign: 'center',
  },
  chapterScroll: {
    maxHeight: 200,
  },
  chapterScrollContent: {
    paddingBottom: 10,
  },
  chapterBox: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(255, 176, 0, 0.08)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffd966',
  },
  chapterLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
    color: '#ffb000',
  },
  chapterSummary: {
    fontSize: 13,
    color: '#fff',
  },
  chapterHistoryContainer: {
    marginBottom: 25,
    padding: 10,
    backgroundColor: 'rgba(255, 176, 0, 0.03)',
    borderWidth: 1,
    borderColor: '#ffb000',
    borderRadius: 8,
  },
  chapterHistoryTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#ffb000',
    textAlign: 'center',
  },
  chapterScroll: {
    maxHeight: 200,
  },
  chapterScrollContent: {
    paddingBottom: 10,
  },
  chapterBox: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(255, 176, 0, 0.08)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffd966',
  },
  chapterLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
    color: '#ffb000',
  },
  chapterSummary: {
    fontSize: 13,
    color: '#fff',
  },
});
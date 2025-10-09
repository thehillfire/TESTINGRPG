import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import RNButton from '../components/RNButton';
import Card from '../components/Card';
import ChatModal from '../components/ChatModal';
import { defaultTheme as theme } from '../constants/theme';
import { generateRPGClass } from '../services/gemini';

// Rarity colors matching your metadata.json
const getRarityColor = (rarity) => {
  const colors = {
    'Common': '#FFFFFF',
    'Uncommon': '#00FF00', 
    'Rare': '#0080FF',
    'Epic': '#FF00FF',
    'Legendary': '#FFD700',
    'Mythical': '#FF0000',
    'Celestial': '#00FFFF',
    'Eternal': '#RAINBOW' // Special handling needed
  };
  return colors[rarity] || '#FFFFFF';
};

export default function GameScreen({ navigation, route }) {
  const [hasGeneratedClass, setHasGeneratedClass] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);

  // Initialize database connection
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('🔥 Initializing Firebase connection...');
        const { testFirebaseConnection } = await import('../services/firestore');
        const initResult = await testFirebaseConnection();
        
        if (initResult.success) {
          setIsInitialized(true);
          console.log('✅ Database initialized successfully');
        } else {
          throw new Error(initResult.error);
        }
      } catch (error) {
        console.error('❌ Database initialization failed:', error);
        setDbError(error.message);
      }
    };

    initializeDatabase();
  }, []);

  const rollRandomClass = async () => {
    if (isGenerating || hasGeneratedClass) return;
    
    setIsGenerating(true);
    setDbError(null);
    
    try {
      if (!isInitialized) {
        throw new Error('Database not initialized. Please wait and try again.');
      }

      console.log('� Generating your one and only class from seeded database...');
      const { getRandomClass } = await import('../services/firestore');
      const newClass = await getRandomClass();
      
      if (newClass) {
        // Mark that the player has generated their class
        setHasGeneratedClass(true);
        
        console.log(`✅ Generated your class: "${newClass.name}"`);
        
        // Navigate to the class display screen
        console.log('🚀 Attempting to navigate to ClassDisplay screen...');
        console.log('Navigation object:', navigation);
        console.log('Class data:', newClass);
        
        if (navigation && navigation.navigate) {
          navigation.navigate('ClassDisplay', { classData: newClass });
          console.log('✅ Navigation called successfully');
        } else {
          console.error('❌ Navigation object is not available');
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to generate random class:', error);
      setDbError(error.message);
      
      Alert.alert(
        'Generation Failed',
        error.message,
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LoreForge RPG</Text>
      
      {/* Database Status */}
      <View style={styles.dbStatusContainer}>
        <Text style={styles.dbStatusText}>
          {dbError 
            ? `❌ ${dbError}` 
            : hasGeneratedClass 
              ? `🎯 Class Generated! • Check your class screen to see your adventure`
              : isInitialized 
                ? `🔥 Your Seeded Database • 520 themes × 240 roles = 124,800 combinations ✅`
                : '📱 Loading Database • Connecting to your seeded data...'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.generateButton, 
          { backgroundColor: (isGenerating || hasGeneratedClass) ? '#4B5563' : '#059669' },
          (isGenerating || hasGeneratedClass) && styles.disabledButton
        ]} 
        onPress={rollRandomClass}
        disabled={isGenerating || hasGeneratedClass}
      >
        <Text style={styles.generateButtonText}>
          {isGenerating 
            ? '🎯 Generating Your Class...' 
            : hasGeneratedClass 
              ? '✅ Class Generated!'
              : '🎯 Generate My Class'}
        </Text>
      </TouchableOpacity>
      
      {hasGeneratedClass && (
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>� Your Adventure Awaits!</Text>
          <Text style={styles.infoDesc}>
            Your unique class has been generated! Navigate to "Your Class" in the menu to see your role and begin your adventure.
          </Text>
        </Card>
      )}
      
      {!hasGeneratedClass && isInitialized && (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>🎲 Ready to Begin!</Text>
          <Text style={styles.emptyDesc}>
            Click "Generate My Class" above to create your one and only adventure class from our massive database of possibilities!
          </Text>
        </Card>
      )}
      
      {/* Chat Modal */}
      <ChatModal 
        visible={chatVisible} 
        onClose={() => setChatVisible(false)} 
        contactUsername={route?.params?.contactUsername || null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.bg, 
    padding: 16, 
    paddingTop: 50 
  },
  title: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: '800', 
    marginBottom: 30,
    textAlign: 'center'
  },
  dbStatusContainer: {
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151'
  },
  dbStatusText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  generateButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  emptyCard: { 
    marginTop: 20, 
    alignItems: 'center', 
    padding: 30 
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center'
  },
  emptyDesc: {
    color: '#A1A7B5',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22
  },
  infoCard: { 
    marginTop: 20, 
    alignItems: 'center', 
    padding: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10B981',
  },
  infoTitle: {
    color: '#10B981',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center'
  },
  infoDesc: {
    color: '#10B981',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9
  }
});

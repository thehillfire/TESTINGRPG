import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const GREEN = '#00ff00';
const GREEN_BG = 'rgba(0,255,0,0.1)';
const GREEN_BORDER = '#00ff00';
const GREEN_SHADOW = '#00ff00';
const GREEN_TEXT = '#00ff00';
const GREEN_SECONDARY = 'rgba(0,255,0,0.08)';

export default function ClassDisplayScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { classData } = route.params || {};
  const [backButtonPressed, setBackButtonPressed] = useState(false);

  // Fallback if no class data is provided
  if (!classData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.className, { color: theme.colors.text }]}>No Class Data</Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getRarityColor = (rarity) => GREEN; // Always green

  const getRainbowGradient = () => {
    // Rainbow colors for Eternal rarity
    return ['#ff0066', '#ff3300', '#ff6600', '#ffaa00', '#66ff00', '#00ff66', '#00ffcc', '#0066ff', '#3300ff', '#6600ff', '#cc00ff'];
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
          {/* Class Display Card */}
        <View style={[
          styles.classCard, 
          { 
            backgroundColor: theme.colors.card, 
            borderColor: getRarityColor(classData.rarity),
            ...(classData.rarity === 'Eternal' && {
              shadowColor: '#ff0066',
              shadowOpacity: 0.8,
              shadowRadius: 25,
              elevation: 20,
            })
          }
        ]}>
          
          {/* Header Bar - Rainbow for Eternal */}
          {classData.rarity === 'Eternal' ? (
            <View style={styles.rainbowHeaderBar}>
              {getRainbowGradient().map((color, index) => (
                <View 
                  key={index} 
                  style={[styles.rainbowSegment, { backgroundColor: color }]} 
                />
              ))}
            </View>
          ) : (
            <View style={[styles.headerBar, { backgroundColor: getRarityColor(classData.rarity) }]} />
          )}
          
          {/* Rarity Badge - Rainbow for Eternal */}
          {classData.rarity === 'Eternal' ? (
            <View style={styles.rainbowRarityBadge}>
              {getRainbowGradient().map((color, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.rainbowBadgeSegment, 
                    { 
                      backgroundColor: color,
                      left: `${index * 9.09}%`
                    }
                  ]} 
                />
              ))}
              <View style={styles.rarityTextContainer}>
                <Text style={[styles.rarityText, styles.eternalText]}>
                  RARITY: {classData.rarity.toUpperCase()}
                </Text>
              </View>
            </View>
          ) : (
            <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(classData.rarity) }]}>
              <Text style={styles.rarityText}>
                RARITY: {classData.rarity.toUpperCase()}
              </Text>
            </View>
          )}          {/* Class Name - Rainbow for Eternal */}
          {classData.rarity === 'Eternal' ? (
            <View style={styles.rainbowTextContainer}>
              {classData.name.split('').map((char, index) => (
                <Text 
                  key={index} 
                  style={[
                    styles.className, 
                    { 
                      color: getRainbowGradient()[index % getRainbowGradient().length],
                      textShadowColor: getRainbowGradient()[index % getRainbowGradient().length],
                    }
                  ]}
                >
                  {char}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={[styles.className, { color: theme.colors.text }]}>
              {classData.name}
            </Text>
          )}

          {/* Theme and Role */}
          <View style={styles.detailsContainer}>
            {(classData.theme?.name || classData.usedTheme) && (
              <View style={[styles.detailBadge, { backgroundColor: theme.colors.backgroundSecondary }]}>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>THEME</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>{classData.theme?.name || classData.usedTheme}</Text>
              </View>
            )}
            
            {(classData.role?.name || classData.usedRole) && (
              <View style={[styles.detailBadge, { backgroundColor: theme.colors.backgroundSecondary }]}>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>ROLE</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>{classData.role?.name || classData.usedRole}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {classData.description && (
            classData.rarity === 'Eternal' ? (
              <View style={styles.rainbowDescriptionContainer}>
                {getRainbowGradient().map((color, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.rainbowDescSegment, 
                      { 
                        backgroundColor: color,
                        left: `${index * 9.09}%`
                      }
                    ]} 
                  />
                ))}
                <View style={styles.descriptionTextContainer}>
                  <Text style={[styles.descriptionText, { color: '#ffffff' }]}>
                    {classData.description}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={[styles.descriptionContainer, { backgroundColor: theme.colors.backgroundSecondary }]}>
                <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
                  {classData.description}
                </Text>
              </View>
            )
          )}

        </View>

        {/* Start Mission Button */}
        <TouchableOpacity 
          style={[
            styles.missionButton, 
            { borderColor: theme.colors.primary },
            backButtonPressed && styles.missionButtonPressed
          ]}
          onPress={() => navigation.navigate('Campaign', { classData })}
          onPressIn={() => setBackButtonPressed(true)}
          onPressOut={() => setBackButtonPressed(false)}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.missionButtonText,
            { color: theme.colors.primary },
            backButtonPressed && styles.missionButtonTextPressed
          ]}>
            START MISSION
          </Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity 
          style={[
            styles.backButton, 
            { borderColor: theme.colors.primary },
            backButtonPressed && styles.backButtonPressed
          ]}
          onPress={handleGoBack}
          onPressIn={() => setBackButtonPressed(true)}
          onPressOut={() => setBackButtonPressed(false)}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.backButtonText,
            { color: theme.colors.primary },
            backButtonPressed && styles.backButtonTextPressed
          ]}>
            RETURN TO DEPLOYMENT
          </Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0b0d',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  classCard: {
    width: '100%',
    maxWidth: 420,
    padding: 35,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: GREEN_BORDER,
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: GREEN_SECONDARY,
    shadowColor: GREEN_SHADOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: GREEN,
    borderColor: GREEN_BORDER,
    borderWidth: 2,
    opacity: 0.8,
  },
  rarityBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: GREEN_BORDER,
    backgroundColor: GREEN_BG,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GREEN_SHADOW,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  rarityText: {
    color: GREEN_TEXT,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: GREEN_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    textTransform: 'uppercase',
  },
  className: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 42,
    color: GREEN_TEXT,
    textShadowColor: GREEN_SHADOW,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  detailsContainer: {
    width: '100%',
    gap: 18,
    marginBottom: 25,
  },
  detailBadge: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: GREEN_BG,
    borderWidth: 2,
    borderColor: GREEN_BORDER,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 6,
    color: GREEN_TEXT,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '800',
    color: GREEN_TEXT,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  descriptionContainer: {
    width: '100%',
    padding: 25,
    borderRadius: 12,
    marginTop: 15,
    backgroundColor: GREEN_BG,
    borderWidth: 2,
    borderColor: GREEN_BORDER,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    color: GREEN_TEXT,
    fontWeight: '400',
    opacity: 0.9,
  },
  backButton: {
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 12,
    minWidth: 300,
    backgroundColor: GREEN_BG,
    borderWidth: 2,
    borderColor: GREEN_BORDER,
    shadowColor: GREEN_SHADOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: GREEN_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    color: GREEN_TEXT,
  },
  missionButton: {
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 12,
    minWidth: 300,
    backgroundColor: GREEN_BG,
    borderWidth: 2,
    borderColor: GREEN_BORDER,
    shadowColor: GREEN_SHADOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 20,
  },
  missionButtonText: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: GREEN_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    color: GREEN_TEXT,
  },
  scrollContainer: {
    flex: 1,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  titleText: {
    color: GREEN_TEXT,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: GREEN_SHADOW,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
});
// ConversionScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const typeIcons = {
  length: '📏',
  weight: '⚖️',
  cooking: '🍳',
  temperature: '🌡️'
};

export default function ConversionScreen({ route, navigation }) {
  const { type } = route.params;
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  const units = {
    length: ['inches', 'cm', 'feet', 'meters'],
    weight: ['grams', 'kg', 'pounds', 'ounces'],
    cooking: ['tsp', 'tbsp', 'cups', 'ml'],
    temperature: ['Celsius', 'Fahrenheit', 'Kelvin']
  };

  const isReady = value !== '' && fromUnit !== '' && toUnit !== '';

  useEffect(() => {
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Set default units
    if (units[type].length > 0) {
      setFromUnit(units[type][0]);
      setToUnit(units[type][1] || units[type][0]);
    }
  }, []);

  useEffect(() => {
    if (result !== null) {
      Animated.spring(resultAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [result]);

  const startLoadingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(loadingAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopLoadingAnimation = () => {
    loadingAnim.stopAnimation();
    loadingAnim.setValue(0);
  };

  const API_URL = "https://unit-converter-8zk2.onrender.com";

  const handleConvert = async () => {
    if (!isReady) return;

    setIsLoading(true);
    startLoadingAnimation();
    
    try {
      const response = await fetch(`${API_URL}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: parseFloat(value),
          from_unit: fromUnit,
          to_unit: toUnit,
          conversion_type: type
        })
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      Alert.alert('Error', 'Failed to convert. Please try again.');
      console.error('Conversion error:', error);
    } finally {
      setIsLoading(false);
      stopLoadingAnimation();
    }
  };

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result !== null) {
      setResult(null);
      resultAnim.setValue(0);
    }
  };

  return (
    <LinearGradient 
      colors={['#667eea', '#764ba2', '#f093fb']} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Decorative background elements */}
      <View style={styles.circleContainer}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <View style={styles.content}>
        {/* Header */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.typeIcon}>{typeIcons[type]}</Text>
          <Text style={styles.header}>Convert {type} units</Text>
          <Text style={styles.subtitle}>Enter a value and select units</Text>
        </Animated.View>

        {/* Input Section */}
        <Animated.View 
          style={[
            styles.inputSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter Value</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              keyboardType="numeric"
              value={value}
              onChangeText={setValue}
            />
          </View>
        </Animated.View>

        {/* Unit Selection */}
        <Animated.View 
          style={[
            styles.unitsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.unitRow}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>From</Text>
              <View style={styles.pickerWrapper}>
                <Picker 
                  selectedValue={fromUnit} 
                  onValueChange={setFromUnit}
                  style={styles.picker}
                  dropdownIconColor="#333"
                >
                  {units[type].map(unit => (
                    <Picker.Item label={unit} value={unit} key={unit} color="#333" />
                  ))}
                </Picker>
              </View>
            </View>

            <TouchableOpacity style={styles.swapButton} onPress={handleSwapUnits}>
              <Text style={styles.swapIcon}>⇄</Text>
            </TouchableOpacity>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>To</Text>
              <View style={styles.pickerWrapper}>
                <Picker 
                  selectedValue={toUnit} 
                  onValueChange={setToUnit}
                  style={styles.picker}
                  dropdownIconColor="#333"
                >
                  {units[type].map(unit => (
                    <Picker.Item label={unit} value={unit} key={unit} color="#333" />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Convert Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <TouchableOpacity 
            style={[styles.convertButton, !isReady && styles.convertButtonDisabled]}
            onPress={handleConvert}
            disabled={!isReady || isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isReady ? ['#ff9a9e', '#fecfef'] : ['#ccc', '#999']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <Animated.View
                  style={[
                    styles.loadingContainer,
                    {
                      opacity: loadingAnim,
                    }
                  ]}
                >
                  <Text style={styles.buttonText}>Converting...</Text>
                </Animated.View>
              ) : (
                <Text style={styles.buttonText}>Convert</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Result Display */}
        {result !== null && (
          <Animated.View
            style={[
              styles.resultContainer,
              {
                opacity: resultAnim,
                transform: [
                  {
                    scale: resultAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
              style={styles.resultGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.resultLabel}>Result</Text>
              <Text style={styles.resultValue}>{result}</Text>
              <Text style={styles.resultUnit}>{toUnit}</Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Back Button */}
        <Animated.View
          style={[
            styles.backButtonContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back to Options</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  circleContainer: {
    position: 'absolute',
    width: width,
    height: height,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  circle1: {
    width: 160,
    height: 160,
    top: height * 0.1,
    left: -40,
  },
  circle2: {
    width: 100,
    height: 100,
    bottom: height * 0.2,
    right: -20,
  },
  circle3: {
    width: 120,
    height: 120,
    top: height * 0.5,
    right: width * 0.15,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  typeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '300',
  },
  inputSection: {
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 8,
  },
  unitsSection: {
    marginBottom: 30,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  pickerWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 60,
  },
  swapButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  swapIcon: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  convertButton: {
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  convertButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultContainer: {
    marginBottom: 30,
  },
  resultGradient: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  resultUnit: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  backButtonContainer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import axios from 'axios';

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userName] = useState('Luke Abel');
  const [userCity] = useState('La Mirada');

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    greetUser();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const onSpeechResults = (event) => {
    const text = event.value[0];
    setRecognizedText(text);
    addToHistory('user', text);
    processCommand(text.toLowerCase());
  };

  const onSpeechError = (error) => {
    console.error('Speech recognition error:', error);
    setIsListening(false);
    speak("I didn't hear you, please say that again");
  };

  const speak = (text) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.2,
      rate: 0.9,
      voice: 'com.apple.voice.premium.en-US.Samantha',
    });
    addToHistory('assistant', text);
  };

  const addToHistory = (sender, message) => {
    setConversationHistory((prev) => [
      ...prev,
      { sender, message, timestamp: new Date() },
    ]);
  };

  const greetUser = () => {
    const hour = new Date().getHours();
    let greeting = '';

    if (hour >= 0 && hour < 12) {
      greeting = `Good Morning, ${userName}!`;
    } else if (hour >= 12 && hour < 18) {
      greeting = `Good Afternoon, ${userName}!`;
    } else {
      greeting = `Good Evening, ${userName}!`;
    }

    speak(greeting);
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setRecognizedText('');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const getWeather = async (city) => {
    try {
      const apiKey = '99e68c086c34059f58d3349bd4fb694c';
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
      );

      const { temp } = response.data.main;
      const { description } = response.data.weather[0];
      const humidity = response.data.main.humidity;

      return `The temperature in ${city} is ${Math.round(temp)} degrees Fahrenheit. The humidity is ${humidity}% and the weather is ${description}.`;
    } catch (error) {
      return 'Unable to get the weather report. Please try again later.';
    }
  };

  const processCommand = async (command) => {
    if (command.includes('good bye') || command.includes('ok bye') || command.includes('turn off')) {
      speak(`Goodbye ${userName}! Have a great day in ${userCity}!`);
      return;
    }

    if (command.includes('weather')) {
      speak(`Getting weather for ${userCity}`);
      const weather = await getWeather(userCity);
      speak(weather);
      return;
    }

    if (command.includes('time')) {
      const now = new Date();
      const date = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const time = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      speak(`Today is ${date} and the current time is ${time}`);
      return;
    }

    if (command.includes('open youtube')) {
      speak('Opening YouTube, just wait for a while');
      Linking.openURL('https://youtube.com');
      return;
    }

    if (command.includes('play')) {
      const song = command.replace('play', '').trim();
      speak(`Playing ${song} on YouTube`);
      Linking.openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`);
      return;
    }

    if (command.includes('open facebook')) {
      speak('Opening Facebook, just wait for a while');
      Linking.openURL('https://facebook.com');
      return;
    }

    if (command.includes('open twitter') || command.includes('open x')) {
      speak('Opening Twitter, just wait for a while');
      Linking.openURL('https://twitter.com');
      return;
    }

    if (command.includes('open google')) {
      speak('Opening Google, just wait for a while');
      Linking.openURL('https://www.google.com');
      return;
    }

    if (command.includes('open gmail')) {
      speak('Opening Gmail, just wait for a while');
      Linking.openURL('https://gmail.com');
      return;
    }

    if (command.includes('my name') || command.includes('who am i')) {
      speak(`You are ${userName} from ${userCity}`);
      return;
    }

    if (command.includes('your name') || command.includes('who are you')) {
      speak(`I am your personal voice assistant, created for ${userName}`);
      return;
    }

    speak("I'm not sure how to help with that. Try asking about the weather, time, or to open apps.");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Voice Assistant</Text>
        <Text style={styles.subtitle}>for {userName}</Text>
        <Text style={styles.location}>{userCity}</Text>
      </View>

      <ScrollView style={styles.historyContainer}>
        {conversationHistory.map((item, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              item.sender === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <Text style={styles.messageSender}>
              {item.sender === 'user' ? 'You' : 'Assistant'}
            </Text>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.controlsContainer}>
        {recognizedText !== '' && (
          <View style={styles.recognizedTextContainer}>
            <Text style={styles.recognizedText}>{recognizedText}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.micButton, isListening && styles.micButtonActive]}
          onPress={isListening ? stopListening : startListening}
        >
          <Text style={styles.micButtonText}>
            {isListening ? '🎤 Listening...' : '🎤 Tap to Speak'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Try: "What's the weather?", "What time is it?", "Open YouTube", "Play music"
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#16213e',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
  },
  location: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },
  historyContainer: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    maxWidth: '85%',
  },
  userMessage: {
    backgroundColor: '#0f3460',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: '#16213e',
    alignSelf: 'flex-start',
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  controlsContainer: {
    padding: 20,
    backgroundColor: '#16213e',
  },
  recognizedTextContainer: {
    backgroundColor: '#0f3460',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  recognizedText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  micButton: {
    backgroundColor: '#e94560',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 50,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  micButtonActive: {
    backgroundColor: '#53a653',
  },
  micButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  helpText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 18,
  },
});

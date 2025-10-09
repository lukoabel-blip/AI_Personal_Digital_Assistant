import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const userName = 'Luke Abel';
  const userCity = 'La Mirada';

  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setRecognizedText(text);
        addToHistory('user', text);
        processCommand(text.toLowerCase());
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          speak("I didn't hear you, please say that again");
        }
      };
    }

    greetUser();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      synth.cancel();
    };
  }, []);

  const speak = (text) => {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;

    const voices = synth.getVoices();
    const femaleVoice = voices.find(voice =>
      voice.name.includes('female') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria') ||
      voice.name.includes('Karen')
    ) || voices.find(voice => voice.lang.startsWith('en'));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synth.speak(utterance);
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

    setTimeout(() => speak(greeting), 500);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setRecognizedText('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
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
      window.open('https://youtube.com', '_blank');
      return;
    }

    if (command.includes('play')) {
      const song = command.replace('play', '').trim();
      speak(`Playing ${song} on YouTube`);
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`, '_blank');
      return;
    }

    if (command.includes('open facebook')) {
      speak('Opening Facebook, just wait for a while');
      window.open('https://facebook.com', '_blank');
      return;
    }

    if (command.includes('open twitter') || command.includes('open x')) {
      speak('Opening Twitter, just wait for a while');
      window.open('https://twitter.com', '_blank');
      return;
    }

    if (command.includes('open google')) {
      speak('Opening Google, just wait for a while');
      window.open('https://www.google.com', '_blank');
      return;
    }

    if (command.includes('open gmail')) {
      speak('Opening Gmail, just wait for a while');
      window.open('https://gmail.com', '_blank');
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

  const hasSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Voice Assistant</h1>
        <p className="subtitle">for {userName}</p>
        <p className="location">{userCity}</p>
      </header>

      <div className="conversation-container">
        <div className="conversation-history">
          {conversationHistory.map((item, index) => (
            <div
              key={index}
              className={`message ${item.sender === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-sender">
                {item.sender === 'user' ? 'You' : 'Assistant'}
              </div>
              <div className="message-text">{item.message}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="controls">
        {!hasSupport && (
          <div className="error-message">
            Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
          </div>
        )}

        {recognizedText && (
          <div className="recognized-text">
            {recognizedText}
          </div>
        )}

        <button
          className={`mic-button ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
          onClick={isListening ? stopListening : startListening}
          disabled={!hasSupport || isSpeaking}
        >
          <span className="mic-icon">🎤</span>
          <span className="mic-text">
            {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Tap to Speak'}
          </span>
        </button>

        <p className="help-text">
          Try: "What's the weather?", "What time is it?", "Open YouTube", "Play music"
        </p>
      </div>
    </div>
  );
}

export default App;

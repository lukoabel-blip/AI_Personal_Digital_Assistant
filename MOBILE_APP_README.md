# Luke's Voice Assistant - React Native Mobile App

A personalized voice assistant mobile app for Luke Abel in La Mirada, California.

## Features

- 🎤 Voice recognition and command processing
- 🗣️ Female voice text-to-speech responses
- 🌤️ Weather information for La Mirada
- ⏰ Time and date information
- 🌐 Open websites (YouTube, Facebook, Twitter, Google, Gmail)
- 🎵 Play music/videos on YouTube
- 👤 Personalized greetings and responses

## Voice Commands

- "What's the weather?" - Get weather for La Mirada
- "What time is it?" - Get current date and time
- "Open YouTube" - Opens YouTube app/website
- "Play [song name]" - Searches and plays song on YouTube
- "Open Facebook/Twitter/Google/Gmail" - Opens respective apps
- "Who am I?" - Returns your personalized information
- "Good bye" - Exits the assistant

## Installation

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (download from App Store or Google Play)

### Setup Steps

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## Building for Production

### Android APK

```bash
expo build:android
```

### iOS IPA

```bash
expo build:ios
```

## Permissions Required

- **Microphone**: For voice input
- **Speech Recognition**: For processing voice commands
- **Internet**: For weather data and opening websites

## Configuration

The app is pre-configured for:
- **User**: Luke Abel
- **Location**: La Mirada, California
- **Weather API**: OpenWeatherMap (API key included)

## Customization

To customize for a different user, edit `App.js`:

```javascript
const [userName] = useState('Luke Abel');
const [userCity] = useState('La Mirada');
```

## Technical Stack

- React Native + Expo
- @react-native-voice/voice (Speech Recognition)
- expo-speech (Text-to-Speech)
- OpenWeatherMap API (Weather data)
- Axios (HTTP requests)

## Troubleshooting

### Voice recognition not working on Android
- Make sure Google app is updated
- Check microphone permissions in Settings

### Voice recognition not working on iOS
- Enable Siri & Search in Settings
- Grant microphone permission to the app

### Weather not loading
- Check internet connection
- Verify API key is valid

## Support

For issues or questions, please contact the developer.

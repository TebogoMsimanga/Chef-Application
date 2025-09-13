# React Native Meal App (Expo) 👋

A beginner-friendly Expo React Native app for browsing meals, adding to favorites, and managing a cart. Designed for learning, easy extension, and clean navigation.

## Features

- Browse meals by category (breakfast, lunch, dinner)
- Search and filter meals
- View detailed meal info
- Add/remove meals from cart and favorites
- Notification bubbles on cart and favorite icons (tab bar and meal cards)
- Simple onboarding (Splash, Login, Signup)
- Checkout flow
- Consistent navigation and status bar styling
- All logic and UI are kept simple and well-commented for beginners

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the app:**
   ```bash
   npx expo start
   ```
3. **Install required peer dependencies if prompted** (see below for common ones)

   ```if you are using expo make sure to also install
   npx expo install react-native-screens react-native-safe-area-context
   ```

   install also:
   npm install --save react-native-responsive-dimensions
   npm i react-native-toast-message
   npm install expo-speech expo-av expo-permissions
   npm install @jamsch/expo-speech-recognition

## Adding Dependencies

- Always use `npm` for package management.
- If you add a new package, update this README and `PROJECT_REQUIREMENTS.md`.

## Project Structure

- `app/` - All screens and navigation
- `components/` - Reusable UI components
- `utils/` - Data, colors, and helpers
- `assets/` - Images and fonts

## Contribution Guidelines

- **Do not remove any screens or pages.**
- Keep all code and UI beginner-friendly (see `PROJECT_REQUIREMENTS.md`).
- Use clear variable names and add comments for non-obvious logic.
- Avoid require cycles between files.
- Keep notification bubbles and navigation logic consistent.
- Match navigation bar color to StatusBar style.

## Requirements

See `PROJECT_REQUIREMENTS.md` for detailed requirements and logic.

## License

MIT

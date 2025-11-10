# Chef Application - React Native Food Ordering App

A comprehensive React Native application built with Expo Router for food ordering, built with Supabase for backend services and Sentry for error tracking.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Features](#features)
- [Screens & Navigation](#screens--navigation)
- [Change Log](#change-log)
- [Development Guidelines](#development-guidelines)

## 🎯 Project Overview

This is a full-featured food ordering application that allows users to:
- Browse menu items by category
- Search and filter menu items
- Add items to cart with customizations
- Manage favorites
- Place orders
- View profile and order history

## 🛠 Tech Stack

- **Framework**: React Native with Expo Router (file-based routing)
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage)
- **State Management**: Zustand
- **Error Tracking**: Sentry
- **UI Components**: Custom components with React Native
- **Fonts**: Quicksand font family

## 📁 Project Structure

```
Chef-Application/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout with auth routing
│   ├── (auth)/                  # Authentication screens
│   │   ├── _layout.tsx         # Auth layout
│   │   ├── sign-in.tsx         # Sign in screen
│   │   └── sign-up.tsx         # Sign up screen
│   ├── (tabs)/                  # Main app tabs
│   │   ├── _layout.tsx         # Tab navigation layout
│   │   ├── index.tsx           # Home screen
│   │   ├── search.tsx          # Search screen
│   │   ├── cart.tsx            # Cart screen
│   │   └── profile.tsx        # Profile screen
│   └── (screens)/               # Modal/Stack screens
│       ├── CategoryMeals.tsx   # Category meals list
│       ├── MenuItemDetail.tsx  # Menu item details
│       ├── checkout.tsx        # Checkout screen
│       ├── success.tsx         # Order success screen
│       ├── favorite.tsx        # Favorites screen
│       ├── edit.tsx            # Edit menu item screen
│       └── menu.tsx            # Menu screen (placeholder)
├── components/                   # Reusable components
│   ├── AddButton.tsx
│   ├── CartItem.tsx
│   ├── CreateMenuItem.tsx
│   ├── CustomButton.tsx
│   ├── CustomHeader.tsx
│   ├── CustomInput.tsx
│   ├── ErrorBoundary.tsx
│   ├── FavButton.tsx
│   ├── FavoriteItem.tsx
│   ├── Filter.tsx
│   ├── MealCard.tsx
│   └── SearchBar.tsx
├── lib/                          # Utility libraries
│   ├── supabase.ts             # Supabase client and functions
│   └── useSupabase.ts          # Custom hook for data fetching
├── store/                        # Zustand stores
│   ├── auth.store.ts           # Authentication state
│   ├── cart.store.ts           # Shopping cart state
│   └── favorite.store.ts       # Favorites state (local)
├── constants/                    # App constants
│   └── index.ts                 # Images, menu categories
├── assets/                       # Static assets
│   ├── fonts/                   # Custom fonts
│   ├── icons/                   # App icons
│   └── images/                  # App images
└── type.d.ts                     # TypeScript type definitions
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Chef-Application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## ✨ Features

### Authentication
- User sign up with email/password
- User sign in
- Session management with Supabase Auth
- Protected routes based on authentication state

### Menu & Search
- Browse menu items by category
- Search menu items by name
- Filter by category
- View menu item details with customizations

### Shopping Cart
- Add items to cart with customizations
- Update quantities
- Remove items
- Calculate totals including customizations

### Favorites
- Add/remove favorites
- View favorite items
- Sync with Supabase database

### Orders
- Create orders with delivery information
- Order history (to be implemented)
- Order confirmation screen

### Profile
- View user profile information
- Edit profile (to be implemented)
- Logout functionality

## 📱 Screens & Navigation

### Authentication Flow
1. **Splash Screen** → Auto-navigates based on auth state
2. **Sign In** → `/sign-in`
3. **Sign Up** → `/sign-up`

### Main App Flow (Tabs)
1. **Home** → `/` - Browse categories with meal counts
2. **Search** → `/search` - Search and filter menu items
3. **Cart** → `/cart` - View cart and proceed to checkout
4. **Profile** → `/profile` - View user profile

### Stack Screens
- **Category Meals** → `/(screens)/CategoryMeals` - Meals in a category
- **Menu Item Detail** → `/(screens)/MenuItemDetail` - Item details and add to cart
- **Checkout** → `/(screens)/checkout` - Order placement
- **Success** → `/(screens)/success` - Order confirmation
- **Favorites** → `/(screens)/favorite` - User favorites
- **Edit Menu Item** → `/(screens)/edit` - Create/edit menu items

## 📝 Change Log

### [Current Session] - Appwrite Removal & Supabase Migration

#### Removed
- ❌ `react-native-appwrite` package
- ❌ `lib/appwrite.ts` - All Appwrite configuration and functions
- ❌ `lib/useAppwrite.ts` - Appwrite-specific hook
- ❌ All Appwrite imports and dependencies

#### Added
- ✅ `lib/useSupabase.ts` - Generic hook for Supabase data fetching
- ✅ Comprehensive Supabase integration in `lib/supabase.ts`
- ✅ Sentry error tracking throughout the application
- ✅ Console logging for debugging

#### Updated
- ✅ All screens migrated from Appwrite to Supabase:
  - `app/(tabs)/index.tsx` - Home screen
  - `app/(tabs)/search.tsx` - Search screen
  - `app/(tabs)/cart.tsx` - Cart screen
  - `app/(tabs)/profile.tsx` - Profile screen
  - `app/(auth)/sign-in.tsx` - Sign in screen
  - `app/(auth)/sign-up.tsx` - Sign up screen
  - `app/(screens)/CategoryMeals.tsx` - Category meals
  - `app/(screens)/MenuItemDetail.tsx` - Menu item details
  - `app/(screens)/checkout.tsx` - Checkout
  - `app/(screens)/favorite.tsx` - Favorites
- ✅ `type.d.ts` - Removed Appwrite Models dependency
- ✅ `store/auth.store.ts` - Updated to use Supabase Auth
- ✅ All components updated to work with Supabase data structure

### [In Progress] - Application Debugging & Enhancement

#### Planned Improvements
- 🔄 Enhanced splash screen with proper loading states
- 🔄 Comprehensive error handling with Sentry
- 🔄 Console logging throughout for debugging
- 🔄 CRUD operations testing and fixes
- 🔄 Profile screen enhancements
- 🔄 Order history implementation
- 🔄 Image upload functionality
- 🔄 Better loading states and error messages

## 🎓 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React Native best practices
- Use functional components with hooks
- Keep components small and focused
- Add comments for complex logic

### Error Handling
- Always wrap async operations in try-catch
- Use Sentry for error tracking: `Sentry.captureException(error)`
- Add console logs for debugging: `console.log('[Component] Action:', data)`
- Show user-friendly error messages

### State Management
- Use Zustand stores for global state (auth, cart, favorites)
- Use local state for component-specific state
- Keep stores focused on single responsibilities

### Data Fetching
- Use `useSupabase` hook for data fetching
- Handle loading and error states
- Implement proper refetching on data changes

### Testing
- Test all user flows manually
- Check error scenarios
- Verify data persistence
- Test on both iOS and Android

## 🐛 Known Issues

- Profile screen shows hardcoded data (phone, address, about)
- Order history not yet implemented
- Image upload for menu items needs implementation
- Favorites sync with Supabase needs testing

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Sentry React Native](https://docs.sentry.io/platforms/react-native/)

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update this README if needed
5. Submit a pull request

## 📄 License

[Add your license here]

---

**Last Updated**: [Current Date]
**Version**: 1.0.0

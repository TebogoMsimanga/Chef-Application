import {StyleProp, TextStyle, ViewStyle} from "react-native";

export interface MenuItem {
  $id: string;
  name: string;
  price: number;
  image_id: string;
  image_url: string;
  description: string;
  calories: number;
  protein: number;
  rating: number;
  type: string;
}

export interface CustomizationItem {
  $id: string;
  name: string;
  price: number;
  image_id: string;
  image_url: string;
  type: string;
}

export interface Customization {
  name: string;
  price: number;
  type: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface User {
  account: string;
  name: string;
  email: string;
  avatar: string;
}

export interface CartCustomization {
  id: string;
  name: string;
  price: number;
  type: string;
}

export interface CartItemType {
  id: string; 
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  customizations?: CartCustomization[];
}

export interface CartStore {
  items: CartItemType[];
  addItem: (item: Omit<CartItemType, "quantity">) => void;
  removeItem: (id: string, customizations: CartCustomization[]) => void;
  increaseQty: (id: string, customizations: CartCustomization[]) => void;
  decreaseQty: (id: string, customizations: CartCustomization[]) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

interface TabBarIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
  totalItems?: number;
}

interface CustomButtonProps {
  onPress?: () => void;
  title?: string;
  style?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
}

interface CustomHeaderProps {
  title?: string;
}

interface CustomInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
}

interface ProfileFieldProps {
  label: string;
  value: string;
  icon: ImageSourcePropType;
}

interface CreateUserPrams {
  email: string;
  password: string;
  name: string;
}

interface SignInParams {
  email: string;
  password: string;
}

interface GetMenuParams {
  category: string;
  query: string;
}

interface CreateMenuItemParams {
  name: string;
  price: number;
  image_id: string;
  image_url: string;
  description: string;
  calories: number;
  protein: number;
  rating: number;
  type: string;
  category: string;
}

interface CreateMenuItemProps {
  onSuccess?: () => void;
}

 interface InfoItemProps {
  icon: string;
  label: string;
  value: string;
};


interface FavoritesStore {
  favorites: string[];  
    addFavorite: (id: string) => void;
    removeFavorite: (id: string) => void;
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    clearFavorites: () => void;
    getTotalFavorites: () => number;
};

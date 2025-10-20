import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import { images } from '@/constants';

export default function CartButton() {
  const totalItems = 10;

  return (
    <TouchableOpacity style={styles.cartBtn} onPress={() => {}}>
      <Image
        source={images.bag}
        style={styles.cartIcon}
        resizeMode="contain"
      />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cartBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20, 
    backgroundColor: '#0016FF',
  },
  cartIcon: {
    width: 20,
    height: 20,
    position: 'relative',
    top: 0,
    left: 0,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold', 
  },
});
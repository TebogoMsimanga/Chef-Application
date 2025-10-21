import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import { images } from '@/constants';

export default function AddButton() {

  return (
    <TouchableOpacity style={styles.cartBtn} onPress={() => {}}>
      <Image
        source={images.plus}
        style={styles.cartIcon}
        resizeMode="contain"
      />
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
});
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants';

export default function CartButton() {
    const totalItems = 10;
  return (
    <TouchableOpacity 
    style={styles.cartBtn}
    onPress={() => {}}
    >
        <Image source={images.bag} style={{
            width: 20,
            height: 20
        }} resizeMode='contain' />
      <Text>CartButton</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    cartBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: '#1E1E1E'
    }
})
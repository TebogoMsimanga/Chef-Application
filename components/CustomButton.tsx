import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {CustomButtonProps} from '@/type'

const CustomButton = ({
  onPress,
  title = "Click me",
  style,
  textStyle,
  leftIcon,
  isLoading = false
} : CustomButtonProps) => {
  return (
    <TouchableOpacity 
    style={[
      styles.button,
      style
    ]}
    onPress={onPress}
    >
      {leftIcon}
      <View style={styles.loaderBtn}>
        {isLoading ? (
          <ActivityIndicator size={"small"} color={"#fff"}/>
        ) : (
          <Text style={[
            styles.textBtn, textStyle
          ]}>
            {title}
          </Text>
        )}
      </View>
      
    </TouchableOpacity>
  )
}

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0a26a0ff',
    borderRadius: 9999,
    padding: 12,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loaderBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBtn: {
    color: "#fff",
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
  },
});

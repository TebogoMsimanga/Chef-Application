import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

export default function SearchBar() {
  return (
   <TextInput
      placeholder="Search menu..."
      style={styles.searchInput}
      editable={false} 
    />
  )
}

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
});
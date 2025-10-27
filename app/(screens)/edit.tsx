import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import CustomHeader from '@/components/CustomHeader'

const Edit = () => {
  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <FlatList 
      data={""}
      renderItem={() => {}}
      ListHeaderComponent={() => <CustomHeader title='Edit Menu' />}
      />
    </SafeAreaView>
  )
}

export default Edit
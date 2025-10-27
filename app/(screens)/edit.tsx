import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CreateMenuItem from '@/components/CreateMenuItem';  
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const Edit = () => {  
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
        <CreateMenuItem onSuccess={() => setRefreshKey(prev => prev + 1)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
});

export default Edit;
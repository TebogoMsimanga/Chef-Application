import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ErrorBoundaryProps } from 'expo-router';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Oops! Something went wrong</Text>
        <Text style={styles.message}>{error.message}</Text>
        {__DEV__ && (
          <View style={styles.stackContainer}>
            <Text style={styles.stackTitle}>Stack Trace:</Text>
            <Text style={styles.stack}>{error.stack}</Text>
          </View>
        )}
        <Text style={styles.retry} onPress={retry}>
          Tap to retry
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  stackContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  stackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  stack: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  retry: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    padding: 12,
    textDecorationLine: 'underline',
  },
});

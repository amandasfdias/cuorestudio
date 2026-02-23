import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const COLORS = {
  primary: '#000000',
  secondary: '#D4A574',
  background: '#FFFFFF',
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Minhas</Text>
          <Text style={styles.logoTextAccent}>Receitas</Text>
        </View>
        <Text style={styles.tagline}>Seu livro de receitas pessoal</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 72,
    color: COLORS.primary,
    lineHeight: 80,
  },
  logoTextAccent: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 72,
    color: COLORS.secondary,
    lineHeight: 80,
    marginTop: -10,
  },
  tagline: {
    fontFamily: 'AmaticSC-Regular',
    fontSize: 24,
    color: COLORS.primary,
    marginTop: 20,
    opacity: 0.7,
  },
});

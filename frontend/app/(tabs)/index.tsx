import React from 'react';
import { View, StyleSheet, SafeAreaView, Image, Text } from 'react-native';

const COLORS = {
  primary: '#000000',
  secondary: '#D4A574',
  background: '#f7f7f7',
};

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_taste-notes/artifacts/5jji4s53_Logo%20Principal%202.png';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{ uri: LOGO_URL }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Suas receitas em um só lugar</Text>
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
    paddingHorizontal: 30,
  },
  logo: {
    width: 200,
    height: 200,
  },
  tagline: {
    fontFamily: 'AmaticSC-Regular',
    fontSize: 24,
    color: COLORS.primary,
    marginTop: 20,
    textAlign: 'center',
  },
});

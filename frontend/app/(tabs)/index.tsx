import React from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';

const COLORS = {
  primary: '#000000',
  secondary: '#D4A574',
  background: '#FFFFFF',
};

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_taste-notes/artifacts/snjgfpit_Logo%20Principal.png';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{ uri: LOGO_URL }}
          style={styles.logo}
          resizeMode="contain"
        />
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
    width: '100%',
    height: 200,
  },
});

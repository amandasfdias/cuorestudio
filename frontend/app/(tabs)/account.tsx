import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#000000',
  secondary: '#D4A574',
  background: '#FFFFFF',
  lightGray: '#F5F5F5',
  gray: '#999999',
};

export default function AccountScreen() {
  const handleOptionPress = (option: string) => {
    Alert.alert(option, 'Esta funcionalidade estará disponível em breve!');
  };

  const renderOption = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle?: string,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={onPress || (() => handleOptionPress(title))}
      activeOpacity={0.7}
    >
      <View style={styles.optionIconContainer}>
        <Ionicons name={icon} size={22} color={COLORS.primary} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sua Conta</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={COLORS.gray} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Usuário</Text>
            <Text style={styles.profileSubtitle}>Seu livro de receitas pessoal</Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="book" size={24} color={COLORS.secondary} />
            <Text style={styles.statNumber}>-</Text>
            <Text style={styles.statLabel}>Receitas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="heart" size={24} color={COLORS.secondary} />
            <Text style={styles.statNumber}>-</Text>
            <Text style={styles.statLabel}>Favoritas</Text>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.optionsContainer}>
          {renderOption('notifications-outline', 'Notificações', 'Gerenciar alertas')}
          {renderOption('color-palette-outline', 'Aparência', 'Tema e cores')}
          {renderOption('language-outline', 'Idioma', 'Português')}
        </View>

        {/* Support Section */}
        <Text style={styles.sectionTitle}>Suporte</Text>
        <View style={styles.optionsContainer}>
          {renderOption('help-circle-outline', 'Ajuda', 'Perguntas frequentes')}
          {renderOption('mail-outline', 'Contato', 'Enviar feedback')}
          {renderOption('star-outline', 'Avaliar App', 'Deixe sua avaliação')}
        </View>

        {/* About Section */}
        <Text style={styles.sectionTitle}>Sobre</Text>
        <View style={styles.optionsContainer}>
          {renderOption('information-circle-outline', 'Versão', '1.0.0')}
          {renderOption('document-text-outline', 'Termos de Uso')}
          {renderOption('shield-checkmark-outline', 'Privacidade')}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Feito com</Text>
          <Ionicons name="heart" size={16} color={COLORS.secondary} />
          <Text style={styles.footerText}>para cozinheiros</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 40,
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 28,
    color: COLORS.primary,
  },
  profileSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 20,
  },
  statNumber: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 32,
    color: COLORS.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionsContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    color: COLORS.primary,
  },
  optionSubtitle: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.gray,
  },
});

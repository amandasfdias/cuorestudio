import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Constants from 'expo-constants';

const COLORS = {
  primary: '#000000',
  secondary: '#D4A574',
  background: '#f7f7f7',
  lightGray: '#F5F5F5',
  gray: '#999999',
};

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 
  process.env.EXPO_PUBLIC_BACKEND_URL || 
  'https://taste-notes.preview.emergentagent.com';

type AddOption = 'url' | 'manual' | 'photo' | null;

export default function AddScreen() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<AddOption>(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      Alert.alert('Erro', 'Por favor, insira uma URL válida');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/recipes/from-url`, {
        url: url.trim(),
      });
      Alert.alert('Sucesso', 'Receita importada com sucesso!');
      setUrl('');
      setSelectedOption(null);
      router.push(`/recipe/${response.data.id}`);
    } catch (error: any) {
      console.error('Error importing recipe:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.detail || 'Não foi possível importar a receita'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setLoading(true);
      try {
        const response = await axios.post(`${API_URL}/api/recipes/from-image`, {
          image_base64: result.assets[0].base64,
        });
        Alert.alert('Sucesso', 'Receita digitalizada com sucesso!');
        setSelectedOption(null);
        router.push(`/recipe/${response.data.id}`);
      } catch (error: any) {
        console.error('Error processing image:', error);
        Alert.alert(
          'Erro',
          error.response?.data?.detail || 'Não foi possível processar a imagem'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setLoading(true);
      try {
        const response = await axios.post(`${API_URL}/api/recipes/from-image`, {
          image_base64: result.assets[0].base64,
        });
        Alert.alert('Sucesso', 'Receita digitalizada com sucesso!');
        setSelectedOption(null);
        router.push(`/recipe/${response.data.id}`);
      } catch (error: any) {
        console.error('Error processing image:', error);
        Alert.alert(
          'Erro',
          error.response?.data?.detail || 'Não foi possível processar a imagem'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleManualAdd = () => {
    setSelectedOption(null);
    router.push('/add-recipe');
  };

  const renderOptionButton = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.optionButton} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.optionIconContainer}>
        <Ionicons name={icon} size={28} color={COLORS.primary} />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Adicionar Receita</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Como deseja adicionar?</Text>

          {renderOptionButton(
            'link-outline',
            'Colar URL',
            'Importar receita de um site',
            () => setSelectedOption('url')
          )}

          {renderOptionButton(
            'create-outline',
            'Adicionar Manualmente',
            'Criar receita do zero',
            handleManualAdd
          )}

          {renderOptionButton(
            'camera-outline',
            'Tirar Foto',
            'Fotografar uma receita',
            handleTakePhoto
          )}

          {renderOptionButton(
            'image-outline',
            'Escolher da Galeria',
            'Digitalizar foto de receita',
            handlePhotoSelect
          )}
        </ScrollView>
      )}

      {/* URL Input Modal */}
      <Modal
        visible={selectedOption === 'url'}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedOption(null)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Colar URL da Receita</Text>
              <TouchableOpacity onPress={() => setSelectedOption(null)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.urlInput}
              placeholder="https://exemplo.com/receita"
              placeholderTextColor={COLORS.gray}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              keyboardType="url"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.submitButton, !url.trim() && styles.submitButtonDisabled]}
              onPress={handleUrlSubmit}
              disabled={!url.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.submitButtonText}>Importar Receita</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  sectionTitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 20,
    marginTop: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 22,
    color: COLORS.primary,
  },
  optionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 28,
    color: COLORS.primary,
  },
  urlInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

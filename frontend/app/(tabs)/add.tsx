import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
  cream: '#F5EBE0',
  white: '#FFFFFF',
};

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 
  process.env.EXPO_PUBLIC_BACKEND_URL || 
  'https://taste-notes.preview.emergentagent.com';

export default function AddScreen() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);
  const [showUrlInput, setShowUrlInput] = useState(false);
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
      setShowUrlInput(false);
      setShowModal(false);
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
      setShowModal(false);
      try {
        const response = await axios.post(`${API_URL}/api/recipes/from-image`, {
          image_base64: result.assets[0].base64,
        });
        Alert.alert('Sucesso', 'Receita digitalizada com sucesso!');
        router.push(`/recipe/${response.data.id}`);
      } catch (error: any) {
        console.error('Error processing image:', error);
        Alert.alert(
          'Erro',
          error.response?.data?.detail || 'Não foi possível processar a imagem'
        );
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleManualAdd = () => {
    setShowModal(false);
    router.push('/add-recipe');
  };

  const handleClose = () => {
    setShowModal(false);
    setShowUrlInput(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}

      {/* Main Modal */}
      <Modal
        visible={showModal && !loading}
        animationType="fade"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.modalTitle}>Nova Receita</Text>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {/* Colar URL */}
              <TouchableOpacity 
                style={styles.optionCard} 
                onPress={() => setShowUrlInput(true)}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name="link-outline" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Colar URL</Text>
                  <Text style={styles.optionSubtitle}>Importe uma receita de um site</Text>
                </View>
              </TouchableOpacity>

              {/* Adicionar Manualmente */}
              <TouchableOpacity 
                style={styles.optionCard} 
                onPress={handleManualAdd}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name="pencil-outline" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Adicionar Manualmente</Text>
                  <Text style={styles.optionSubtitle}>Escreva sua própria receita</Text>
                </View>
              </TouchableOpacity>

              {/* Digitalizar Foto */}
              <TouchableOpacity 
                style={styles.optionCard} 
                onPress={handlePhotoSelect}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Digitalizar Foto</Text>
                  <Text style={styles.optionSubtitle}>Escaneie uma receita com a câmera</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* URL Input Modal */}
      <Modal
        visible={showUrlInput}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUrlInput(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.urlModalOverlay}
        >
          <View style={styles.urlModalContent}>
            <View style={styles.urlModalHeader}>
              <Text style={styles.urlModalTitle}>Colar URL da Receita</Text>
              <TouchableOpacity onPress={() => setShowUrlInput(false)}>
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
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Importar Receita</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  modalTitle: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 36,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    padding: 16,
  },
  optionCardCream: {
    backgroundColor: COLORS.cream,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleCream: {
    backgroundColor: COLORS.cream,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.05)',
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
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  urlModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  urlModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  urlModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  urlModalTitle: {
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
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

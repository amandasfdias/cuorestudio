import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Constants from 'expo-constants';

const COLORS = {
  primary: '#000000',
  secondary: '#D4A574',
  background: '#FFFFFF',
  lightGray: '#F5F5F5',
  gray: '#999999',
};

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 
  process.env.EXPO_PUBLIC_BACKEND_URL || 
  'https://taste-notes.preview.emergentagent.com';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export default function AddRecipeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: '', unit: '' }]);
  const [instructions, setInstructions] = useState<string[]>(['']);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Por favor, insira o título da receita');
      return;
    }

    setLoading(true);
    try {
      const filteredIngredients = ingredients.filter((ing) => ing.name.trim());
      const filteredInstructions = instructions.filter((inst) => inst.trim());

      const recipeData = {
        title: title.trim(),
        description: description.trim(),
        servings: servings.trim(),
        prep_time: prepTime.trim(),
        cook_time: cookTime.trim(),
        ingredients: filteredIngredients,
        instructions: filteredInstructions,
      };

      const response = await axios.post(`${API_URL}/api/recipes`, recipeData);
      Alert.alert('Sucesso', 'Receita salva com sucesso!');
      router.replace(`/recipe/${response.data.id}`);
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('Erro', 'Não foi possível salvar a receita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova Receita</Text>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.background} />
            ) : (
              <Text style={styles.saveButtonText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da receita"
              placeholderTextColor={COLORS.gray}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Breve descrição da receita"
              placeholderTextColor={COLORS.gray}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Porções</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 4 pessoas"
                  placeholderTextColor={COLORS.gray}
                  value={servings}
                  onChangeText={setServings}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Tempo de Preparo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 30 min"
                  placeholderTextColor={COLORS.gray}
                  value={prepTime}
                  onChangeText={setPrepTime}
                />
              </View>
            </View>

            <Text style={styles.label}>Tempo de Cozimento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 1 hora"
              placeholderTextColor={COLORS.gray}
              value={cookTime}
              onChangeText={setCookTime}
            />
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientRow}>
                <View style={styles.ingredientInputs}>
                  <TextInput
                    style={[styles.input, styles.quantityInput]}
                    placeholder="Qtd"
                    placeholderTextColor={COLORS.gray}
                    value={ingredient.quantity}
                    onChangeText={(value) => updateIngredient(index, 'quantity', value)}
                  />
                  <TextInput
                    style={[styles.input, styles.unitInput]}
                    placeholder="Unid"
                    placeholderTextColor={COLORS.gray}
                    value={ingredient.unit}
                    onChangeText={(value) => updateIngredient(index, 'unit', value)}
                  />
                  <TextInput
                    style={[styles.input, styles.nameInput]}
                    placeholder="Ingrediente"
                    placeholderTextColor={COLORS.gray}
                    value={ingredient.name}
                    onChangeText={(value) => updateIngredient(index, 'name', value)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeIngredient(index)}
                >
                  <Ionicons name="remove-circle" size={24} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.secondary} />
              <Text style={styles.addButtonText}>Adicionar Ingrediente</Text>
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Modo de Preparo</Text>
            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionRow}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.instructionInput]}
                  placeholder={`Passo ${index + 1}`}
                  placeholderTextColor={COLORS.gray}
                  value={instruction}
                  onChangeText={(value) => updateInstruction(index, value)}
                  multiline
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeInstruction(index)}
                >
                  <Ionicons name="remove-circle" size={24} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addInstruction}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.secondary} />
              <Text style={styles.addButtonText}>Adicionar Passo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 28,
    color: COLORS.primary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 28,
    color: COLORS.primary,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  quantityInput: {
    flex: 1,
    marginBottom: 0,
  },
  unitInput: {
    flex: 1,
    marginBottom: 0,
  },
  nameInput: {
    flex: 2,
    marginBottom: 0,
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    gap: 8,
  },
  addButtonText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 10,
  },
  instructionNumberText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '600',
  },
  instructionInput: {
    flex: 1,
    marginBottom: 0,
    minHeight: 48,
  },
  bottomPadding: {
    height: 40,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#000000',
  secondary: '#D4A574',
  background: '#f7f7f7',
  lightGray: '#F0F0F0',
  gray: '#888888',
  white: '#FFFFFF',
};

interface ConversionItem {
  from: string;
  to: string;
}

interface ConversionCategory {
  title: string;
  items: ConversionItem[];
}

const EQUIVALENCIAS: ConversionCategory[] = [
  {
    title: 'Volume',
    items: [
      { from: '1 xícara', to: '240 ml' },
      { from: '1/2 xícara', to: '120 ml' },
      { from: '1/4 xícara', to: '60 ml' },
      { from: '1 colher de sopa', to: '15 ml' },
      { from: '1 colher de chá', to: '5 ml' },
      { from: '1 litro', to: '4 xícaras' },
    ],
  },
  {
    title: 'Peso',
    items: [
      { from: '1 kg', to: '1000 g' },
      { from: '1 lb (libra)', to: '454 g' },
      { from: '1 oz (onça)', to: '28 g' },
    ],
  },
];

const MEDIDAS: ConversionCategory[] = [
  {
    title: 'Farinha de Trigo',
    items: [
      { from: '1 xícara', to: '120 g' },
      { from: '1/2 xícara', to: '60 g' },
      { from: '1 colher de sopa', to: '7,5 g' },
    ],
  },
  {
    title: 'Açúcar',
    items: [
      { from: '1 xícara', to: '200 g' },
      { from: '1/2 xícara', to: '100 g' },
      { from: '1 colher de sopa', to: '12,5 g' },
    ],
  },
  {
    title: 'Manteiga',
    items: [
      { from: '1 xícara', to: '225 g' },
      { from: '1/2 xícara', to: '112 g' },
      { from: '1 colher de sopa', to: '14 g' },
    ],
  },
  {
    title: 'Temperatura do Forno',
    items: [
      { from: 'Forno baixo', to: '150°C / 300°F' },
      { from: 'Forno médio', to: '180°C / 350°F' },
      { from: 'Forno alto', to: '200°C / 400°F' },
      { from: 'Forno muito alto', to: '230°C / 450°F' },
    ],
  },
];

export default function ConversionsScreen() {
  const [activeModal, setActiveModal] = useState<'equivalencias' | 'medidas' | 'calculadora' | null>(null);

  const renderConversionList = (categories: ConversionCategory[]) => (
    <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
      {categories.map((category, catIndex) => (
        <View key={catIndex} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          {category.items.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.conversionRow}>
              <Text style={styles.conversionFrom}>{item.from}</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.secondary} />
              <Text style={styles.conversionTo}>{item.to}</Text>
            </View>
          ))}
        </View>
      ))}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.pageTitle}>Conversão de Medidas</Text>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipText}>
            Para maior precisão da medição dos ingredientes secos, peneire sempre antes de medir e nunca comprima o ingrediente a ser medido.
          </Text>

          <Ionicons name="heart" size={16} color={COLORS.primary} style={styles.heartIcon} />

          <Text style={styles.tipText}>
            Para conferir a medição dos ingredientes líquidos, deve-se colocar o recipiente em uma superfície plana e verificar o nível na altura dos olhos.
          </Text>

          <Ionicons name="heart" size={16} color={COLORS.primary} style={styles.heartIcon} />

          <Text style={styles.tipText}>
            Para medir ingredientes em forma de gordura sólida, deve-se retirar o ingrediente da geladeira com antecedência para que sejam medidas em temperatura ambiente. Ao ser colocado no recipiente a ser medido, deve-se fazer uma pequena pressão para retirar o ar.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setActiveModal('equivalencias')}
            activeOpacity={0.7}
          >
            <Ionicons name="scale-outline" size={28} color={COLORS.secondary} />
            <Text style={styles.buttonText}>Equivalências</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setActiveModal('medidas')}
            activeOpacity={0.7}
          >
            <Ionicons name="cafe-outline" size={28} color={COLORS.secondary} />
            <Text style={styles.buttonText}>Medidas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setActiveModal('calculadora')}
            activeOpacity={0.7}
          >
            <Ionicons name="calculator-outline" size={28} color={COLORS.secondary} />
            <Text style={styles.buttonText}>Calculadora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Equivalencias Modal */}
      <Modal
        visible={activeModal === 'equivalencias'}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Equivalências</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            {renderConversionList(EQUIVALENCIAS)}
          </View>
        </View>
      </Modal>

      {/* Medidas Modal */}
      <Modal
        visible={activeModal === 'medidas'}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Medidas</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            {renderConversionList(MEDIDAS)}
          </View>
        </View>
      </Modal>

      {/* Calculadora Modal */}
      <Modal
        visible={activeModal === 'calculadora'}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Calculadora</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.calculatorPlaceholder}>
              <Ionicons name="calculator-outline" size={64} color={COLORS.gray} />
              <Text style={styles.placeholderText}>Em breve!</Text>
              <Text style={styles.placeholderSubtext}>
                Calculadora de conversão de medidas será disponibilizada em uma próxima atualização.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 24,
  },
  pageTitle: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 36,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  tipsContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tipText: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  heartIcon: {
    marginVertical: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 40,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 28,
    color: COLORS.primary,
  },
  modalScrollView: {
    paddingHorizontal: 20,
  },
  categorySection: {
    marginTop: 20,
  },
  categoryTitle: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 24,
    color: COLORS.secondary,
    marginBottom: 12,
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  conversionFrom: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primary,
  },
  conversionTo: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primary,
    textAlign: 'right',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
  calculatorPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  placeholderText: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 28,
    color: COLORS.primary,
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

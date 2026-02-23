import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#000000',
  secondary: '#D4A574',
  background: '#FFFFFF',
  lightGray: '#F5F5F5',
  gray: '#999999',
};

interface ConversionCategory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: { from: string; to: string }[];
}

const CONVERSIONS: ConversionCategory[] = [
  {
    id: 'volume',
    title: 'Volume',
    icon: 'beaker-outline',
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
    id: 'weight',
    title: 'Peso',
    icon: 'scale-outline',
    items: [
      { from: '1 kg', to: '1000 g' },
      { from: '1 lb (libra)', to: '454 g' },
      { from: '1 oz (onça)', to: '28 g' },
      { from: '1 xícara de farinha', to: '120 g' },
      { from: '1 xícara de açúcar', to: '200 g' },
      { from: '1 xícara de manteiga', to: '225 g' },
    ],
  },
  {
    id: 'temperature',
    title: 'Temperatura',
    icon: 'thermometer-outline',
    items: [
      { from: 'Forno baixo', to: '150°C / 300°F' },
      { from: 'Forno médio', to: '180°C / 350°F' },
      { from: 'Forno alto', to: '200°C / 400°F' },
      { from: 'Forno muito alto', to: '230°C / 450°F' },
    ],
  },
  {
    id: 'eggs',
    title: 'Ovos',
    icon: 'egg-outline',
    items: [
      { from: '1 ovo grande', to: '~50 g' },
      { from: '1 clara', to: '~30 g' },
      { from: '1 gema', to: '~20 g' },
      { from: '3 ovos médios', to: '2 ovos grandes' },
    ],
  },
  {
    id: 'yeast',
    title: 'Fermento',
    icon: 'flask-outline',
    items: [
      { from: '1 envelope fermento seco', to: '7 g' },
      { from: '1 tablete fermento fresco', to: '15 g' },
      { from: '7 g fermento seco', to: '15 g fermento fresco' },
      { from: '1 colher chá fermento químico', to: '4 g' },
    ],
  },
];

export default function ConversionsScreen() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('volume');

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guia de Medidas</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Converta facilmente as medidas das suas receitas
        </Text>

        {CONVERSIONS.map((category) => (
          <View key={category.id} style={styles.categoryContainer}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.id)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryTitleContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons name={category.icon} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              <Ionicons
                name={expandedCategory === category.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>

            {expandedCategory === category.id && (
              <View style={styles.itemsContainer}>
                {category.items.map((item, index) => (
                  <View key={index} style={styles.conversionItem}>
                    <Text style={styles.fromText}>{item.from}</Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.secondary} />
                    <Text style={styles.toText}>{item.to}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={styles.tipContainer}>
          <Ionicons name="bulb-outline" size={24} color={COLORS.secondary} />
          <Text style={styles.tipText}>
            Dica: Para medidas precisas em confeitaria, sempre prefira usar balança
            digital para pesar os ingredientes.
          </Text>
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
  description: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 20,
  },
  categoryContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontFamily: 'AmaticSC-Bold',
    fontSize: 24,
    color: COLORS.primary,
  },
  itemsContainer: {
    backgroundColor: COLORS.lightGray,
    padding: 16,
  },
  conversionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  fromText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primary,
  },
  toText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primary,
    textAlign: 'right',
    fontWeight: '500',
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#FDF8F3',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.primary,
    lineHeight: 20,
  },
});

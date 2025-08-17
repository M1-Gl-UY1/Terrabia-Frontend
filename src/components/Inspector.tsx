import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { X, Eye, Code, Palette } from 'lucide-react-native';

type InspectorProps = {
  visible: boolean;
  onClose: () => void;
  componentData: {
    name: string;
    props: Record<string, any>;
    styles: Record<string, any>;
    children: string[];
  };
};

export default function Inspector({ visible, onClose, componentData }: InspectorProps) {
  const [activeTab, setActiveTab] = useState<'props' | 'styles' | 'children'>('props');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'props':
        return (
          <ScrollView style={styles.tabContent}>
            {Object.entries(componentData.props).map(([key, value]) => (
              <View key={key} style={styles.propertyRow}>
                <Text style={styles.propertyKey}>{key}:</Text>
                <Text style={styles.propertyValue}>
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </Text>
              </View>
            ))}
          </ScrollView>
        );
      case 'styles':
        return (
          <ScrollView style={styles.tabContent}>
            {Object.entries(componentData.styles).map(([key, value]) => (
              <View key={key} style={styles.propertyRow}>
                <Text style={styles.propertyKey}>{key}:</Text>
                <Text style={styles.propertyValue}>{String(value)}</Text>
              </View>
            ))}
          </ScrollView>
        );
      case 'children':
        return (
          <ScrollView style={styles.tabContent}>
            {componentData.children.map((child, index) => (
              <View key={index} style={styles.childItem}>
                <Text style={styles.childText}>{child}</Text>
              </View>
            ))}
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🔍 Inspector - {componentData.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'props' && styles.activeTab]}
            onPress={() => setActiveTab('props')}
          >
            <Code size={16} color={activeTab === 'props' ? '#F27A22' : '#666'} />
            <Text style={[styles.tabText, activeTab === 'props' && styles.activeTabText]}>
              Props
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'styles' && styles.activeTab]}
            onPress={() => setActiveTab('styles')}
          >
            <Palette size={16} color={activeTab === 'styles' ? '#F27A22' : '#666'} />
            <Text style={[styles.tabText, activeTab === 'styles' && styles.activeTabText]}>
              Styles
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'children' && styles.activeTab]}
            onPress={() => setActiveTab('children')}
          >
            <Eye size={16} color={activeTab === 'children' ? '#F27A22' : '#666'} />
            <Text style={[styles.tabText, activeTab === 'children' && styles.activeTabText]}>
              Children
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {renderTabContent()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#F27A22',
    backgroundColor: '#FEF3C7',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#F27A22',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  propertyRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  propertyKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: '30%',
  },
  propertyValue: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    fontFamily: 'monospace',
  },
  childItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  childText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
});

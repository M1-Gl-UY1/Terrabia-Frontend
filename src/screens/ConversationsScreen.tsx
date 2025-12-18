import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MessageSquare, User, ChevronLeft } from 'lucide-react-native';
import { useAppSelector } from '../store/types';
import { selectUser } from '../store/authSlice';
import { RootStackParamList } from '../navigation/AppNavigator';
import ChatService from '../services/ChatService';
import { Conversation } from '../types/Backend';
import { logger } from '../utils/logger';

type ConversationsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function ConversationsScreen() {
  const navigation = useNavigation<ConversationsScreenNavigationProp>();
  const currentUser = useAppSelector(selectUser);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    if (!currentUser?.idUser) {
      setError('Utilisateur non connecté');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await ChatService.getConversations(currentUser.idUser);

      if (response.success && response.data) {
        // Trier par date du dernier message (plus récent en premier)
        const sorted = response.data.sort((a, b) => {
          const lastMessageA = a.messages[a.messages.length - 1];
          const lastMessageB = b.messages[b.messages.length - 1];

          if (!lastMessageA || !lastMessageB) return 0;

          return (
            new Date(lastMessageB.dateEnvoi).getTime() -
            new Date(lastMessageA.dateEnvoi).getTime()
          );
        });

        setConversations(sorted);
      } else {
        setError(response.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      logger.error('[ConversationsScreen] Erreur:', { err });
      setError('Impossible de charger les conversations');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [currentUser?.idUser])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(
      (p) => p.idUser !== currentUser?.idUser
    );
  };

  const getLastMessage = (conversation: Conversation) => {
    if (conversation.messages.length === 0) return null;
    return conversation.messages[conversation.messages.length - 1];
  };

  const hasUnreadMessages = (conversation: Conversation) => {
    if (!currentUser?.idUser) return false;

    return conversation.messages.some(
      (msg) => msg.statut !== 'LU' && msg.emetteurId !== currentUser.idUser
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 48) {
      return 'Hier';
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  };

  const renderConversationItem = ({
    item,
  }: {
    item: Conversation;
  }) => {
    const otherUser = getOtherParticipant(item);
    const lastMessage = getLastMessage(item);
    const unread = hasUnreadMessages(item);

    if (!otherUser) return null;

    return (
      <TouchableOpacity
        style={[styles.conversationCard, unread && styles.unreadCard]}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('Chat', {
            conversationId: item.idConversation,
            otherUser: otherUser,
          })
        }>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={28} color="#9CA3AF" strokeWidth={1.5} />
          </View>
          {unread && <View style={styles.unreadBadge} />}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName}>
              {otherUser.prenom} {otherUser.nom}
            </Text>
            {lastMessage && (
              <Text style={styles.timestamp}>
                {formatDate(lastMessage.dateEnvoi)}
              </Text>
            )}
          </View>

          <View style={styles.messagePreviewContainer}>
            {lastMessage ? (
              <Text
                style={[
                  styles.messagePreview,
                  unread && styles.unreadText,
                ]}
                numberOfLines={1}>
                {lastMessage.emetteurId === currentUser?.idUser
                  ? 'Vous: '
                  : ''}
                {lastMessage.contenu}
              </Text>
            ) : (
              <Text style={styles.noMessages}>Aucun message</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ChevronLeft size={24} color="#2D3748" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F48C06" />
          <Text style={styles.loadingText}>
            Chargement des conversations...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ChevronLeft size={24} color="#2D3748" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.errorContainer}>
          <MessageSquare size={64} color="#9CA3AF" strokeWidth={1.5} />
          <Text style={styles.errorTitle}>Erreur</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadConversations}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ChevronLeft size={24} color="#2D3748" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.backButton} />
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageSquare size={64} color="#9CA3AF" strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>Aucune conversation</Text>
          <Text style={styles.emptyText}>
            Vos conversations apparaîtront ici
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.idConversation.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#F48C06']}
              tintColor="#F48C06"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  errorText: {
    marginTop: 8,
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#F48C06',
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#FFF9F0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F48C06',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  timestamp: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagePreview: {
    flex: 1,
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  unreadText: {
    color: '#2D3748',
    fontWeight: '600',
  },
  noMessages: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});

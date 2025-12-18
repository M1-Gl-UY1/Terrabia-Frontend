import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, Send, User } from 'lucide-react-native';
import { useAppSelector } from '../store/types';
import { selectUser } from '../store/authSlice';
import { RootStackParamList } from '../navigation/AppNavigator';
import ChatService from '../services/ChatService';
import { Message, Utilisateur } from '../types/Backend';
import { logger } from '../utils/logger';
import { useToast } from '../hooks/useToast';

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

export default function ChatScreen() {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const route = useRoute<ChatScreenRouteProp>();
  const currentUser = useAppSelector(selectUser);
  const { showToast } = useToast();

  const { conversationId, otherUser } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadMessages = async (showLoadingIndicator = true) => {
    if (!currentUser?.idUser) return;

    try {
      if (showLoadingIndicator) {
        setIsLoading(true);
      }
      setError(null);

      const response = await ChatService.getMessages(conversationId);

      if (response.success && response.data) {
        setMessages(response.data);

        // Marquer les messages comme lus
        await ChatService.markMessagesAsRead(conversationId, currentUser.idUser);
      } else {
        setError(response.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      logger.error('[ChatScreen] Erreur:', { err });
      setError('Impossible de charger les messages');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMessages();

      // Rafraîchir les messages toutes les 5 secondes
      refreshIntervalRef.current = setInterval(() => {
        loadMessages(false);
      }, 5000);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }, [conversationId, currentUser?.idUser])
  );

  useEffect(() => {
    // Scroll vers le bas quand de nouveaux messages arrivent
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSending || !currentUser?.idUser) return;

    const trimmedMessage = messageText.trim();
    setMessageText('');
    Keyboard.dismiss();

    setIsSending(true);

    try {
      const response = await ChatService.sendMessage(currentUser.idUser, {
        idDestinataire: otherUser.idUser,
        contenu: trimmedMessage,
      });

      if (response.success && response.data) {
        // Ajouter le nouveau message à la liste
        setMessages((prev) => [...prev, response.data!]);

        // Scroll vers le bas
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        showToast(
          response.error || 'Impossible d\'envoyer le message',
          'error'
        );
        // Restaurer le message en cas d'échec
        setMessageText(trimmedMessage);
      }
    } catch (err) {
      logger.error('[ChatScreen] Erreur envoi:', { err });
      showToast('Erreur lors de l\'envoi du message', 'error');
      setMessageText(trimmedMessage);
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year:
          date.getFullYear() !== today.getFullYear()
            ? 'numeric'
            : undefined,
      });
    }
  };

  const renderDateSeparator = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return formatMessageDate(currentMessage.dateEnvoi);

    const currentDate = new Date(currentMessage.dateEnvoi).toDateString();
    const previousDate = new Date(previousMessage.dateEnvoi).toDateString();

    if (currentDate !== previousDate) {
      return formatMessageDate(currentMessage.dateEnvoi);
    }

    return null;
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isCurrentUser = item.emetteurId === currentUser?.idUser;
    const previousMessage = index > 0 ? messages[index - 1] : undefined;
    const dateSeparator = renderDateSeparator(item, previousMessage);

    return (
      <>
        {dateSeparator && (
          <View style={styles.dateSeparatorContainer}>
            <View style={styles.dateSeparatorLine} />
            <Text style={styles.dateSeparatorText}>{dateSeparator}</Text>
            <View style={styles.dateSeparatorLine} />
          </View>
        )}

        <View
          style={[
            styles.messageContainer,
            isCurrentUser
              ? styles.currentUserMessage
              : styles.otherUserMessage,
          ]}>
          <View
            style={[
              styles.messageBubble,
              isCurrentUser
                ? styles.currentUserBubble
                : styles.otherUserBubble,
            ]}>
            <Text
              style={[
                styles.messageText,
                isCurrentUser
                  ? styles.currentUserText
                  : styles.otherUserText,
              ]}>
              {item.contenu}
            </Text>
            <Text
              style={[
                styles.messageTime,
                isCurrentUser
                  ? styles.currentUserTime
                  : styles.otherUserTime,
              ]}>
              {formatMessageTime(item.dateEnvoi)}
            </Text>
          </View>
        </View>
      </>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <View style={styles.headerAvatar}>
              <User size={20} color="#F48C06" strokeWidth={1.5} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerName}>
                {otherUser.prenom} {otherUser.nom}
              </Text>
              <Text style={styles.headerRole}>
                {otherUser.role === 'VENDEUR' ? 'Producteur' : 'Client'}
              </Text>
            </View>
          </View>

          <View style={styles.backButton} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F48C06" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <View style={styles.headerAvatar}>
              <User size={20} color="#F48C06" strokeWidth={1.5} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerName}>
                {otherUser.prenom} {otherUser.nom}
              </Text>
              <Text style={styles.headerRole}>
                {otherUser.role === 'VENDEUR' ? 'Producteur' : 'Client'}
              </Text>
            </View>
          </View>

          <View style={styles.backButton} />
        </View>

        {error && !isLoading ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => loadMessages()}>
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.idMessage.toString()}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: false })
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Aucun message pour le moment
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Envoyez un message pour démarrer la conversation
                  </Text>
                </View>
              }
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Votre message..."
                placeholderTextColor="#9CA3AF"
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={500}
                editable={!isSending}
              />

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!messageText.trim() || isSending) &&
                    styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={!messageText.trim() || isSending}
                activeOpacity={0.7}>
                {isSending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Send size={20} color="#FFFFFF" strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#F48C06',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRole: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
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
  messagesContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  dateSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dateSeparatorText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  currentUserBubble: {
    backgroundColor: '#F48C06',
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: '#2D3748',
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  currentUserTime: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  otherUserTime: {
    color: '#9CA3AF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2D3748',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F48C06',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

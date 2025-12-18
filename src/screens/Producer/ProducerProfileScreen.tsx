import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAppSelector, useAppDispatch } from '../../store/types';
import { logout } from '../../store/authSlice';
import authService from '../../services/AuthService';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Shield,
  MessageSquare,
  FolderOpen,
} from 'lucide-react-native';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProducerProfileScreen = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await authService.logout();
              dispatch(logout());
              navigation.reset({
                index: 0,
                routes: [{ name: 'OnboardingInitialScreen' }],
              });
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const ProfileItem = ({
    icon: Icon,
    label,
    value,
    onPress,
    showArrow = true,
    iconColor = '#2E7D32',
  }: {
    icon: any;
    label: string;
    value?: string;
    onPress?: () => void;
    showArrow?: boolean;
    iconColor?: string;
  }) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.profileItemIcon, { backgroundColor: iconColor + '15' }]}>
        <Icon size={20} color={iconColor} />
      </View>
      <View style={styles.profileItemContent}>
        <Text style={styles.profileItemLabel}>{label}</Text>
        {value && <Text style={styles.profileItemValue}>{value}</Text>}
      </View>
      {showArrow && onPress && <ChevronRight size={20} color="#ccc" />}
    </TouchableOpacity>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header avec avatar */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.nom?.charAt(0).toUpperCase() || 'P'}
              </Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Shield size={16} color="#fff" />
            </View>
          </View>
          <Text style={styles.userName}>{user?.nom || 'Producteur'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color="#FFC107" fill="#FFC107" />
            <Text style={styles.ratingText}>4.8</Text>
            <Text style={styles.ratingLabel}>Producteur vérifié</Text>
          </View>
        </View>

        {/* Informations personnelles */}
        <Section title="Informations personnelles">
          <ProfileItem
            icon={User}
            label="Nom complet"
            value={user?.nom || 'Non renseigné'}
            showArrow={false}
          />
          <ProfileItem
            icon={Mail}
            label="Email"
            value={user?.email || 'Non renseigné'}
            showArrow={false}
          />
          <ProfileItem
            icon={Phone}
            label="Téléphone"
            value={user?.numTel || 'Non renseigné'}
            showArrow={false}
          />
          <ProfileItem
            icon={MapPin}
            label="Zone de production"
            value={user?.ville || 'Non renseigné'}
            showArrow={false}
          />
          <ProfileItem
            icon={CreditCard}
            label="Numéro CNI"
            value="••••••••••"
            showArrow={false}
          />
        </Section>

        {/* Gestion */}
        <Section title="Gestion">
          <ProfileItem
            icon={FolderOpen}
            label="Gérer les catégories"
            onPress={() => navigation.navigate('CategoriesManagement')}
            iconColor="#F59E0B"
          />
        </Section>

        {/* Paramètres */}
        <Section title="Paramètres">
          <ProfileItem
            icon={MessageSquare}
            label="Messages"
            onPress={() => navigation.navigate('Conversations')}
            iconColor="#10B981"
          />
          <ProfileItem
            icon={Settings}
            label="Paramètres du compte"
            onPress={() => {}}
            iconColor="#607D8B"
          />
          <ProfileItem
            icon={HelpCircle}
            label="Aide et support"
            onPress={() => {}}
            iconColor="#2196F3"
          />
        </Section>

        {/* Déconnexion */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut size={20} color="#E53935" />
          <Text style={styles.logoutText}>
            {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
          </Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.versionText}>Terrabia Producteur v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F57C00',
    marginLeft: 4,
  },
  ratingLabel: {
    fontSize: 13,
    color: '#F57C00',
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginLeft: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileItemContent: {
    flex: 1,
  },
  profileItemLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  profileItemValue: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53935',
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
    marginTop: 24,
  },
});

export default ProducerProfileScreen;

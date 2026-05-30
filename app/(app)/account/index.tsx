import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  LogOut,
  ChevronRight,
  Edit,
} from 'lucide-react-native';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={32} />
        </View>
        <Text style={styles.title}>John Doe</Text>
        <Text style={styles.subtitle}>john.doe@example.com</Text>

        <TouchableOpacity style={styles.editButton}>
          <Edit size={16} />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Settings size={20} />
          <Text style={styles.menuText}>Settings</Text>
          <ChevronRight size={16} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Bell size={20} />
          <Text style={styles.menuText}>Notifications</Text>
          <ChevronRight size={16} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Shield size={20} />
          <Text style={styles.menuText}>Privacy & Security</Text>
          <ChevronRight size={16} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <CreditCard size={20} />
          <Text style={styles.menuText}>Payment Methods</Text>
          <ChevronRight size={16} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={20} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#0ea5e9',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderRadius: 6,
  },
  editText: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '500',
  },
  menu: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  menuText: {
    fontSize: 16,
    color: '#0f172a',
    marginLeft: 12,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 12,
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
  },
});

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Receipt,
  DollarSign,
  Calendar,
  Filter,
  Search,
} from 'lucide-react-native';

export default function ExpensesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Receipt size={48} />
        <Text style={styles.title}>Expenses</Text>
        <Text style={styles.subtitle}>
          Recent expenses across all groups will appear here
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Search size={20} />
          <Text style={styles.actionText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Filter size={20} />
          <Text style={styles.actionText}>Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Calendar size={20} />
          <Text style={styles.actionText}>Date</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.emptyState}>
        <DollarSign size={64} />
        <Text style={styles.emptyTitle}>No expenses yet</Text>
        <Text style={styles.emptyText}>
          Start by creating a group and adding your first expense
        </Text>
      </View>

      <View style={styles.quickStats}>
        <Text style={styles.statsTitle}>Quick Stats</Text>

        <View style={styles.statItem}>
          <DollarSign size={20} />
          <Text style={styles.statLabel}>You are owed</Text>
          <Text style={styles.statValue}>$0.00</Text>
        </View>

        <View style={styles.statItem}>
          <DollarSign size={20} />
          <Text style={styles.statLabel}>You owe</Text>
          <Text style={styles.statValue}>$0.00</Text>
        </View>

        <View style={styles.statItem}>
          <Receipt size={20} />
          <Text style={styles.statLabel}>Total expenses</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
      </View>
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
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  quickStats: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
});

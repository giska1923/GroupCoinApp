import React from 'react';
import { ViewStyle } from 'react-native';
import {
  // Common icons
  Plus,
  Search, 
  Settings,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  // Navigation icons
  Home,
  Users,
  FileText,
  User,
  // Business icons
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Receipt,
  Wallet,
  CreditCard,
  // Action icons
  Edit,
  Trash2,
  Share2,
  Download,
  Upload,
  Copy,
  // Status icons
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  // App specific
  Coins,
  Split,
  UserPlus,
  UserMinus,
  LogIn,
  LogOut,
} from 'lucide-react-native';

// Type for all available icons
type IconName = 
  | 'plus' | 'search' | 'settings' | 'chevron-right' | 'chevron-left' 
  | 'chevron-down' | 'chevron-up' | 'x' | 'check'
  | 'home' | 'users' | 'file-text' | 'user'
  | 'dollar-sign' | 'trending-up' | 'trending-down' | 'calculator' 
  | 'receipt' | 'wallet' | 'credit-card'
  | 'edit' | 'trash2' | 'share2' | 'download' | 'upload' | 'copy'
  | 'alert-circle' | 'check-circle' | 'info' | 'x-circle'
  | 'coins' | 'split' | 'user-plus' | 'user-minus' | 'log-in' | 'log-out';

// Icon mapping
const iconMap: Record<IconName, React.ComponentType<any>> = {
  'plus': Plus,
  'search': Search,
  'settings': Settings,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'x': X,
  'check': Check,
  'home': Home,
  'users': Users,
  'file-text': FileText,
  'user': User,
  'dollar-sign': DollarSign,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'calculator': Calculator,
  'receipt': Receipt,
  'wallet': Wallet,
  'credit-card': CreditCard,
  'edit': Edit,
  'trash2': Trash2,
  'share2': Share2,
  'download': Download,
  'upload': Upload,
  'copy': Copy,
  'alert-circle': AlertCircle,
  'check-circle': CheckCircle,
  'info': Info,
  'x-circle': XCircle,
  'coins': Coins,
  'split': Split,
  'user-plus': UserPlus,
  'user-minus': UserMinus,
  'log-in': LogIn,
  'log-out': LogOut,
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = '#000000',
  style 
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  return <IconComponent size={size} color={color} style={style} />;
};

// Export individual icons for direct use
export {
  Plus,
  Search,
  Settings,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Home,
  Users,
  FileText,
  User,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Receipt,
  Wallet,
  CreditCard,
  Edit,
  Trash2,
  Share2,
  Download,
  Upload,
  Copy,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  Coins,
  Split,
  UserPlus,
  UserMinus,
  LogIn,
  LogOut,
} from 'lucide-react-native';
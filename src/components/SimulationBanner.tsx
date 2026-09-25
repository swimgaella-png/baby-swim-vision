import React from 'react';
import { Shield, Sparkles, AlertTriangle, Eye, RotateCcw, Play, Check, ChevronRight, Settings } from 'lucide-react';
import { User, SimulatedRole } from '../types';
import { authService } from '../services/authService';

interface SimulationBannerProps {
  currentUser: User | null;
  onNavigateToAdminTests?: () => void;
  onOpenCheckout?: () => void;
}

export const SimulationBanner: React.FC<SimulationBannerProps> = () => {
  return null;
};

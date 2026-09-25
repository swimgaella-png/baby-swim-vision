import React, { createContext, useContext, useState, useEffect } from 'react';
import { PedagogicalArticle, ExerciseItem, DemoVideoItem } from '../types';
import { articleService } from '../services/articleService';
import { exerciseService } from '../services/exerciseService';
import { demoVideoService } from '../services/demoVideoService';
import { interfaceSettingsService, InterfaceSettings } from '../services/interfaceSettingsService';
import { authService } from '../services/authService';
import { AdminPasscodeModal } from '../components/AdminPasscodeModal';

interface AdminModeContextType {
  isAdminModeActive: boolean;
  setIsAdminModeActive: (active: boolean) => void;
  toggleAdminMode: () => void;
  requestAdminMode: () => void;
  lockAdminMode: () => void;
  openPasscodeModal: () => void;
  
  // Quick editor states - Articles
  editingArticle: PedagogicalArticle | null;
  setEditingArticle: (article: PedagogicalArticle | null) => void;
  isCreatingArticle: boolean;
  setIsCreatingArticle: (creating: boolean) => void;

  // Quick editor states - Exercises
  editingExercise: ExerciseItem | null;
  setEditingExercise: (exercise: ExerciseItem | null) => void;
  isCreatingExercise: boolean;
  setIsCreatingExercise: (creating: boolean) => void;

  // Quick editor states - Demo Videos
  editingDemoVideo: DemoVideoItem | null;
  setEditingDemoVideo: (video: DemoVideoItem | null) => void;
  isCreatingDemoVideo: boolean;
  setIsCreatingDemoVideo: (creating: boolean) => void;

  // Settings
  editingSettingsField: { key: keyof InterfaceSettings; label: string; value: string } | null;
  setEditingSettingsField: (field: { key: keyof InterfaceSettings; label: string; value: string } | null) => void;

  // Direct Image changer state
  editingImageTarget: {
    type: 'article' | 'exercise' | 'settings' | 'hero';
    id?: string;
    currentUrl?: string;
    title: string;
  } | null;
  setEditingImageTarget: (target: {
    type: 'article' | 'exercise' | 'settings' | 'hero';
    id?: string;
    currentUrl?: string;
    title: string;
  } | null) => void;

  // Action helpers
  handleSaveArticle: (article: PedagogicalArticle) => void;
  handleDeleteArticle: (id: string) => void;
  handleSaveExercise: (exercise: ExerciseItem) => void;
  handleDeleteExercise: (id: string) => void;
  handleSaveDemoVideo: (video: Partial<DemoVideoItem>) => Promise<DemoVideoItem>;
  handleDeleteDemoVideo: (id: string) => Promise<boolean>;
  handleSaveSettingsField: (key: keyof InterfaceSettings, value: string) => void;
  handleSaveImage: (newUrl: string) => void;
}

const AdminModeContext = createContext<AdminModeContextType | null>(null);

export const AdminModeProvider: React.FC<{ children: React.ReactNode; userRole?: string }> = ({
  children,
  userRole,
}) => {
  const [isAdminModeActive, setAdminModeActiveState] = useState<boolean>(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState<boolean>(false);

  const [editingArticle, setEditingArticle] = useState<PedagogicalArticle | null>(null);
  const [isCreatingArticle, setIsCreatingArticle] = useState<boolean>(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseItem | null>(null);
  const [isCreatingExercise, setIsCreatingExercise] = useState<boolean>(false);
  const [editingDemoVideo, setEditingDemoVideo] = useState<DemoVideoItem | null>(null);
  const [isCreatingDemoVideo, setIsCreatingDemoVideo] = useState<boolean>(false);
  const [editingSettingsField, setEditingSettingsField] = useState<{ key: keyof InterfaceSettings; label: string; value: string } | null>(null);
  const [editingImageTarget, setEditingImageTarget] = useState<{
    type: 'article' | 'exercise' | 'settings' | 'hero';
    id?: string;
    currentUrl?: string;
    title: string;
  } | null>(null);

  // Initialize and synchronize active state with authService
  useEffect(() => {
    const unsub = authService.subscribe((user) => {
      const isUnlocked = authService.isAdminUnlocked();
      const isAdmin = Boolean(user && user.role === 'ADMIN');
      if (isAdmin && isUnlocked) {
        setAdminModeActiveState(true);
      } else {
        setAdminModeActiveState(false);
      }
    });
    return unsub;
  }, []);

  const openPasscodeModal = () => {
    setIsPasscodeModalOpen(true);
  };

  const requestAdminMode = () => {
    if (isAdminModeActive) {
      // Toggle off
      setAdminModeActiveState(false);
      return;
    }

    // Require admin authentication if not unlocked
    if (authService.isAdminUnlocked()) {
      setAdminModeActiveState(true);
    } else {
      setIsPasscodeModalOpen(true);
    }
  };

  const setIsAdminModeActive = (active: boolean) => {
    if (!active) {
      setAdminModeActiveState(false);
      return;
    }

    if (authService.isAdminUnlocked()) {
      setAdminModeActiveState(true);
    } else {
      setIsPasscodeModalOpen(true);
    }
  };

  const toggleAdminMode = () => {
    requestAdminMode();
  };

  const lockAdminMode = () => {
    authService.lockAdmin();
    setAdminModeActiveState(false);
  };

  const handlePasscodeSuccess = () => {
    setAdminModeActiveState(true);
    setIsPasscodeModalOpen(false);
  };

  const handleSaveArticle = (article: PedagogicalArticle) => {
    articleService.saveArticle(article);
    setEditingArticle(null);
    setIsCreatingArticle(false);
  };

  const handleDeleteArticle = (id: string) => {
    articleService.deleteArticle(id);
    if (editingArticle?.id === id) {
      setEditingArticle(null);
    }
  };

  const handleSaveExercise = (exercise: ExerciseItem) => {
    exerciseService.saveExercise(exercise);
    setEditingExercise(null);
    setIsCreatingExercise(false);
  };

  const handleDeleteExercise = (id: string) => {
    exerciseService.deleteExercise(id);
    if (editingExercise?.id === id) {
      setEditingExercise(null);
    }
  };

  const handleSaveDemoVideo = async (video: Partial<DemoVideoItem>): Promise<DemoVideoItem> => {
    const saved = await demoVideoService.saveDemoVideo(video);
    setEditingDemoVideo(null);
    setIsCreatingDemoVideo(false);
    return saved;
  };

  const handleDeleteDemoVideo = async (id: string): Promise<boolean> => {
    const res = await demoVideoService.deleteDemoVideo(id);
    if (editingDemoVideo?.id === id) {
      setEditingDemoVideo(null);
    }
    return res;
  };

  const handleSaveSettingsField = (key: keyof InterfaceSettings, value: string) => {
    interfaceSettingsService.updateSettings({ [key]: value });
    setEditingSettingsField(null);
  };

  const handleSaveImage = (newUrl: string) => {
    if (!editingImageTarget) return;
    if (editingImageTarget.type === 'article' && editingImageTarget.id) {
      articleService.updateArticleImage(editingImageTarget.id, newUrl);
    } else if (editingImageTarget.type === 'exercise' && editingImageTarget.id) {
      exerciseService.updateExerciseImage(editingImageTarget.id, newUrl);
    } else if (editingImageTarget.type === 'hero' || editingImageTarget.type === 'settings') {
      interfaceSettingsService.updateSettings({ heroImageUrl: newUrl });
    }
    setEditingImageTarget(null);
  };

  return (
    <AdminModeContext.Provider
      value={{
        isAdminModeActive,
        setIsAdminModeActive,
        toggleAdminMode,
        requestAdminMode,
        lockAdminMode,
        openPasscodeModal: () => setIsPasscodeModalOpen(true),
        editingArticle,
        setEditingArticle,
        isCreatingArticle,
        setIsCreatingArticle,
        editingExercise,
        setEditingExercise,
        isCreatingExercise,
        setIsCreatingExercise,
        editingDemoVideo,
        setEditingDemoVideo,
        isCreatingDemoVideo,
        setIsCreatingDemoVideo,
        editingSettingsField,
        setEditingSettingsField,
        editingImageTarget,
        setEditingImageTarget,
        handleSaveArticle,
        handleDeleteArticle,
        handleSaveExercise,
        handleDeleteExercise,
        handleSaveDemoVideo,
        handleDeleteDemoVideo,
        handleSaveSettingsField,
        handleSaveImage,
      }}
    >
      {children}

      {/* Global Admin Passcode Modal */}
      <AdminPasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        onSuccess={handlePasscodeSuccess}
      />
    </AdminModeContext.Provider>
  );
};

export const useAdminMode = () => {
  const context = useContext(AdminModeContext);
  if (!context) {
    return {
      isAdminModeActive: false,
      setIsAdminModeActive: () => {},
      toggleAdminMode: () => {},
      requestAdminMode: () => {},
      lockAdminMode: () => {},
      openPasscodeModal: () => {},
      editingArticle: null,
      setEditingArticle: () => {},
      isCreatingArticle: false,
      setIsCreatingArticle: () => {},
      editingExercise: null,
      setEditingExercise: () => {},
      isCreatingExercise: false,
      setIsCreatingExercise: () => {},
      editingDemoVideo: null,
      setEditingDemoVideo: () => {},
      isCreatingDemoVideo: false,
      setIsCreatingDemoVideo: () => {},
      editingSettingsField: null,
      setEditingSettingsField: () => {},
      editingImageTarget: null,
      setEditingImageTarget: () => {},
      handleSaveArticle: () => {},
      handleDeleteArticle: () => {},
      handleSaveExercise: () => {},
      handleDeleteExercise: () => {},
      handleSaveDemoVideo: async () => ({} as any),
      handleDeleteDemoVideo: async () => true,
      handleSaveSettingsField: () => {},
      handleSaveImage: () => {},
    };
  }
  return context;
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Play,
  RotateCcw,
  Video,
  AlertCircle,
  Clock,
  Info,
  CheckCircle2,
  RefreshCw,
  Lock,
  Smartphone,
  Check,
  Layers,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  FolderOpen,
  Tag,
  Award,
} from 'lucide-react';
import { BabyProfile, VideoMetadata, DemoVideoItem } from '../types';
import { getLocalizedSituations } from '../data/pedagogicalDatabase';
import { videoService, VideoPreparationProgress } from '../services/videoService';
import { accessControlService } from '../services/accessControlService';
import { demoVideoService } from '../services/demoVideoService';
import { useAdminMode } from '../context/AdminModeContext';
import { useTranslation } from '../i18n/LanguageContext';
import { DemoVideoPlayerModal } from './DemoVideoPlayerModal';

interface VideoRecorderUploadProps {
  activeBaby: BabyProfile | null;
  currentUser?: any;
  onVideoReady: (params: {
    videoBlob: Blob | File;
    videoUrl: string;
    durationSeconds: number;
    sizeMB: number;
    name: string;
    situationKey?: string;
    demoScenarioId?: string;
    demoVideo?: DemoVideoItem;
    metadata?: VideoMetadata;
  }) => void;
  onLaunchDemo?: (scenarioId: string) => void;
  onCancel?: () => void;
  onOpenCheckout?: () => void;
}

export const VideoRecorderUpload: React.FC<VideoRecorderUploadProps> = ({
  activeBaby,
  currentUser,
  onVideoReady,
  onLaunchDemo,
  onCancel,
  onOpenCheckout,
}) => {
  const { t, locale } = useTranslation();
  const situations = getLocalizedSituations(locale);
  const {
    isAdminModeActive,
    setEditingDemoVideo,
    setIsCreatingDemoVideo,
    handleDeleteDemoVideo,
    handleSaveDemoVideo,
  } = useAdminMode();

  const effectiveRole = accessControlService.getEffectiveRole(currentUser);
  const isFree = effectiveRole === 'USER_FREE';
  const isAdmin = isAdminModeActive || effectiveRole === 'ADMIN';

  const [activeTab, setActiveTab] = useState<'record' | 'upload' | 'demo'>('record');

  // Demo Videos state
  const [demoVideosList, setDemoVideosList] = useState<DemoVideoItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingDemoVideo, setViewingDemoVideo] = useState<DemoVideoItem | null>(null);

  // Subscribe to demo videos
  useEffect(() => {
    const loadVideos = async () => {
      const vids = await demoVideoService.getAllDemoVideos(true);
      setDemoVideosList(vids);
    };
    loadVideos();

    const unsubscribe = demoVideoService.subscribe((updated) => {
      setDemoVideosList(updated);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Camera & Recording states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // File upload state
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [prepProgress, setPrepProgress] = useState<VideoPreparationProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera on unmount or tab switch
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async (facing: 'user' | 'environment' = cameraFacing) => {
    stopCamera();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      mediaStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(t('videoRecorder.cameraError'));
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    recordedChunksRef.current = [];

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const finalBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(finalBlob);
        const duration = recordingSeconds || 15;
        const sizeMB = Number((finalBlob.size / (1024 * 1024)).toFixed(2));

        stopCamera();

        onVideoReady({
          videoBlob: finalBlob,
          videoUrl,
          durationSeconds: duration,
          sizeMB,
          name: `Recording_${new Date().toISOString().slice(0, 10)}.webm`,
        });
      };

      recorder.start(500); // chunk every 500ms
      setIsRecording(true);
      setRecordingSeconds(0);

      const maxSec = 60;
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= maxSec - 1) {
            stopRecording();
            return maxSec;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (e: any) {
      setCameraError('Erreur : ' + e.message);
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  // Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const processUploadedFile = async (file: File) => {
    setUploadError(null);
    setIsProcessingUpload(true);
    setPrepProgress({
      step: 'detecting',
      message: 'Lecture et vérification du fichier...',
      detectedFormat: file.type || file.name.split('.').pop()?.toUpperCase() || 'MP4',
      wasConverted: false,
    });

    try {
      const result = await videoService.processUploadedVideo(file, (p) => {
        setPrepProgress(p);
      });

      setTimeout(() => {
        onVideoReady({
          videoBlob: result.videoBlob,
          videoUrl: result.videoUrl,
          durationSeconds: Math.round(result.metadata.durationSeconds),
          sizeMB: result.metadata.sizeMB,
          name: result.name,
          metadata: result.metadata,
        });
      }, 700);
    } catch (err: any) {
      console.warn('Video ingestion error:', err);
      const isDuration =
        err.message &&
        (err.message.includes('durée') ||
          err.message.includes('secondes') ||
          err.message.includes('minute'));
      if (isDuration) {
        setUploadError(err.message);
      } else {
        setUploadError(
          'Cette vidéo ne peut pas être traitée automatiquement. Essayez une autre vidéo.'
        );
      }
    } finally {
      setIsProcessingUpload(false);
    }
  };

  // Demo viewing handler (Strictly pedagogical - NO AI Analysis)
  const handleOpenDemoPlayer = (video: DemoVideoItem) => {
    setViewingDemoVideo(video);
  };

  // Toggle visibility helper for Admin
  const handleToggleVisibility = async (e: React.MouseEvent, video: DemoVideoItem) => {
    e.stopPropagation();
    await handleSaveDemoVideo({
      id: video.id,
      visible: !video.visible,
    });
  };

  // Delete helper for Admin
  const handleDeleteVideo = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deletingId === id) {
      await handleDeleteDemoVideo(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 4000);
    }
  };

  // Categories list
  const allCategories = [
    'ALL',
    ...Array.from(new Set(demoVideosList.map((v) => v.category).filter(Boolean))),
  ];

  const filteredDemoVideos = demoVideosList
    .filter((v) => {
      // In non-admin mode, only show visible videos
      if (!isAdmin && v.visible === false) return false;
      if (selectedCategory !== 'ALL' && v.category !== selectedCategory) return false;
      return true;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-semibold">
          <Video className="w-3.5 h-3.5" />
          <span>{t('videoRecorder.badge')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {t('videoRecorder.title')}
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          {t('videoRecorder.subtitle', {
            name: activeBaby?.name || 'Bébé',
            months: activeBaby?.ageMonths || 8,
          })}
        </p>
      </div>

      {/* Free Account Lock Paywall Banner */}
      {isFree && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 sm:p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-up">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                Analyse vidéo par IA réservée aux membres Premium
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 mt-0.5">
                Débloquez les analyses illimitées, le calcul biomécanique et les conseils
                personnalisés pour 24,90 € à vie.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenCheckout}
            className="px-5 py-3 bg-white hover:bg-amber-50 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg transition-all hover:scale-102 cursor-pointer shrink-0"
          >
            Débloquer l'accès à vie (24,90 €)
          </button>
        </div>
      )}

      {/* Mode Selector Tabs */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => {
            stopCamera();
            setActiveTab('record');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'record'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-4 h-4 text-sky-600" />
          <span>{t('videoRecorder.tabCamera') || 'Enregistrer depuis votre téléphone'}</span>
        </button>

        <button
          onClick={() => {
            stopCamera();
            setActiveTab('upload');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-4 h-4 text-sky-600" />
          <span>{t('videoRecorder.tabUpload') || 'Choisir une vidéo'}</span>
        </button>

        <button
          onClick={() => {
            stopCamera();
            setActiveTab('demo');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'demo'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{t('videoRecorder.tabDemo') || 'Vidéos de démo'}</span>
        </button>
      </div>

      {/* Tab 1: Live Camera Recording */}
      {activeTab === 'record' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="relative aspect-16/9 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
            {isCameraActive ? (
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            ) : (
              <div className="text-center p-6 text-slate-400 space-y-3">
                <Camera className="w-12 h-12 mx-auto text-slate-600" />
                <p className="text-xs sm:text-sm">{t('videoRecorder.cameraPlaceholder')}</p>
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {t('videoRecorder.startCameraBtn')}
                </button>
              </div>
            )}

            {isCameraActive && (
              <>
                {/* Switch camera toggle */}
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="absolute top-3 right-3 p-2 bg-slate-900/60 hover:bg-slate-900/90 text-white rounded-full backdrop-blur-xs transition-colors cursor-pointer"
                  title={t('videoRecorder.switchCamera')}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Live timer badge */}
                {isRecording && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-rose-600/90 text-white text-xs font-bold rounded-full flex items-center gap-1.5 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span>00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {cameraError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{cameraError}</span>
            </div>
          )}

          {isCameraActive && (
            <div className="flex items-center justify-center gap-3 pt-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  <div className="w-3 h-3 rounded-full bg-white animate-ping" />
                  <span>{t('videoRecorder.recordBtn')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  <div className="w-3 h-3 bg-rose-500 rounded-sm" />
                  <span>{t('videoRecorder.stopRecordingBtn')}</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Universal Video & Photo Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => {
              if (isFree) {
                if (onOpenCheckout) onOpenCheckout();
                return;
              }
              fileInputRef.current?.click();
            }}
            className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer space-y-4 ${
              dragOver
                ? 'border-sky-500 bg-sky-50/50 scale-101'
                : 'border-slate-200 bg-white hover:bg-slate-50/50 hover:border-slate-300'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,.mp4,.mov,.m4v,.avi,.wmv,.mkv,.webm,.3gp,.3g2,.mpeg,.mpg,.m2ts,.ts,.flv,.ogv,image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              {isFree ? (
                <Lock className="w-8 h-8 text-amber-600" />
              ) : isProcessingUpload ? (
                <RefreshCw className="w-8 h-8 text-sky-600 animate-spin" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                {isFree
                  ? "Téléversement d'analyse réservé aux membres payants"
                  : isProcessingUpload
                  ? prepProgress?.message || 'Préparation de votre vidéo…'
                  : 'Sélectionnez ou glissez une vidéo'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isFree
                  ? "Cliquez ici pour débloquer l'accès complet à vie (24,90 €)"
                  : isProcessingUpload
                  ? "Optimisation automatique et préservation de la qualité, de la vitesse et de la durée originale pour l'analyse IA."
                  : 'Depuis votre smartphone (Galerie / Photos / iPhone / Android), tablette ou ordinateur.'}
              </p>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 max-w-md mx-auto flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{uploadError}</span>
              </div>
            )}

            {isProcessingUpload && (
              <div className="max-w-md mx-auto space-y-2 pt-2">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-sky-700">
                  {prepProgress?.step === 'ready' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
                  )}
                  <span>{prepProgress?.message || 'Préparation de votre vidéo…'}</span>
                </div>

                {prepProgress?.detectedFormat && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-semibold">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Format détecté : {prepProgress.detectedFormat}</span>
                    {prepProgress.wasConverted && (
                      <span className="text-[10px] bg-sky-200 text-sky-900 px-1.5 py-0.5 rounded-sm ml-1 font-bold">
                        Préparé
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Broad Compatibility & Supported Formats Overview */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Smartphone className="w-4 h-4 text-sky-600" />
              <span>Compatibilité universelle de formats</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Sélectionnez directement votre vidéo sans vous soucier de son extension. L'application
              accepte et adapte automatiquement les formats standards et mobiles :
            </p>

            <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-700">
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-sky-700 font-bold">
                MP4
              </span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-sky-700 font-bold">
                MOV (iPhone)
              </span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">M4V</span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">AVI</span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">WMV</span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">MKV</span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">WebM</span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">3GP</span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">MPEG / MPG</span>
              <span className="px-2 py-0.5 bg-sky-50 border border-sky-200 rounded-md text-sky-800">
                Galerie Photos
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Durée recommandée : 5 à 45 secondes (maximum 60s) • Détection automatique d'orientation
                (portrait & paysage)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Dedicated Demo Videos Library */}
      {activeTab === 'demo' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
          {/* Header & Admin Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {t('videoRecorder.demoSectionTitle')}
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                  {filteredDemoVideos.length} vidéo{filteredDemoVideos.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Vidéos de référence et repères pédagogiques pour observer les situations aquatiques types.
              </p>
            </div>

            {/* Admin Add Demo Video Button */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsCreatingDemoVideo(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Ajouter une vidéo de démonstration</span>
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          {allCategories.length > 2 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Catégories :
              </span>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'Toutes' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Demo Videos Grid */}
          {filteredDemoVideos.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <FolderOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">Aucune vidéo dans cette catégorie</p>
              {isAdmin && (
                <p className="text-xs text-slate-500">
                  Cliquez sur « + Ajouter une vidéo de démonstration » pour enregistrer une nouvelle vidéo.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {filteredDemoVideos.map((video) => {
                const isFileMissing = video.fileExists === false;

                return (
                  <div
                    key={video.id}
                    className="p-5 rounded-3xl border border-slate-200 hover:border-sky-300 bg-slate-50/70 hover:bg-sky-50/30 transition-all flex flex-col justify-between space-y-3.5 relative group"
                  >
                    <div className="space-y-2">
                      {/* Top Badges & Admin Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-100/90 px-2.5 py-0.5 rounded-full">
                            {video.category || 'IMMERSION'}
                          </span>
                          {video.recommendedAge && (
                            <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {video.recommendedAge}
                            </span>
                          )}
                          {isAdmin && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                video.visible !== false
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {video.visible !== false ? 'Visible' : 'Masquée'}
                            </span>
                          )}
                        </div>

                        {/* Admin Action Icons */}
                        {isAdmin && (
                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingDemoVideo(video);
                              }}
                              className="p-1 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                              title="Modifier la vidéo"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleToggleVisibility(e, video)}
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title={video.visible !== false ? 'Masquer' : 'Rendre visible'}
                            >
                              {video.visible !== false ? (
                                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteVideo(e, video.id)}
                              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                deletingId === video.id
                                  ? 'bg-rose-600 text-white'
                                  : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              }`}
                              title={
                                deletingId === video.id ? 'Confirmer la suppression' : 'Supprimer'
                              }
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Video Title & Description */}
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {video.title}
                        </h4>
                        {video.description && (
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {video.description}
                          </p>
                        )}
                      </div>

                      {/* Skills Tags */}
                      {video.skills && video.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {video.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/90 border border-slate-200/80 text-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Missing File Warning for Admin */}
                      {isAdmin && isFileMissing && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">Vidéo introuvable</p>
                            <p className="font-mono text-[10px] text-amber-800">
                              Fichier attendu : public/media/videos/{video.videoFileName}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500 font-medium">
                        {video.videoDuration ? `${video.videoDuration}s` : 'Démo HD'}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenDemoPlayer(video)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>▶ Voir la vidéo</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Pedagogical Recommendations Card Before Sending */}
      <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 sm:p-5 text-slate-700 space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-sky-600" />
          {t('videoRecorder.optimalRecommendationsTitle')}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
            <span>{t('videoRecorder.recLighting')}</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
            <span>{t('videoRecorder.recFraming')}</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
            <span>{t('videoRecorder.recDuration')}</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span className="font-medium text-amber-900">{t('videoRecorder.recSafety')}</span>
          </div>
        </div>
      </div>

      {/* Pedagogical Demo Video Player Modal (ZERO AI Analysis) */}
      {viewingDemoVideo && (
        <DemoVideoPlayerModal
          video={viewingDemoVideo}
          isOpen={Boolean(viewingDemoVideo)}
          onClose={() => setViewingDemoVideo(null)}
        />
      )}
    </div>
  );
};

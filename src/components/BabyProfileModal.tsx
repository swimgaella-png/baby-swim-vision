import React, { useState, useEffect, useRef } from 'react';
import { X, Baby, Check, Trash2, AlertTriangle, Upload, Image as ImageIcon, Sparkles, Scale, Ruler, Thermometer } from 'lucide-react';
import { BabyProfile } from '../types';
import { babyService } from '../services/babyService';
import { authService } from '../services/authService';
import { useTranslation } from '../i18n/LanguageContext';

interface BabyProfileModalProps {
  initialBaby?: BabyProfile | null;
  onClose: () => void;
  onSave: (baby: BabyProfile) => void;
  onDelete?: (babyId: string) => void;
}

const AVATAR_OPTIONS = [
  '👶', '🐬', '🦆', '🌊', '⭐', '🐳', '🐠', '⛵', '🤿', '🐙', '🐢', '🦭'
];

export const BabyProfileModal: React.FC<BabyProfileModalProps> = ({
  initialBaby,
  onClose,
  onSave,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialBaby?.name || '');
  const [birthDate, setBirthDate] = useState(initialBaby?.birthDate || (() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 8);
    return d.toISOString().split('T')[0];
  })());
  const [level, setLevel] = useState<'decouverte' | 'confiance' | 'autonomie' | 'exploration'>(
    initialBaby?.level || 'decouverte'
  );
  const [startDate] = useState(initialBaby?.startDate || new Date().toISOString().split('T')[0]);
  const [avatarType, setAvatarType] = useState<'avatar' | 'photo'>(
    initialBaby?.avatarType || (initialBaby?.photoUrl ? 'photo' : 'avatar')
  );
  const [avatar, setAvatar] = useState(initialBaby?.avatarUrl || '👶');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialBaby?.photoUrl);
  const [weightKg, setWeightKg] = useState<string>(initialBaby?.weightKg ? initialBaby.weightKg.toString() : '');
  const [heightCm, setHeightCm] = useState<string>(initialBaby?.heightCm ? initialBaby.heightCm.toString() : '');
  const [waterComfortLevel, setWaterComfortLevel] = useState<
    'tres_a_l_aise' | 'curieux_calme' | 'prudent_hesitant' | 'apprehensif'
  >(initialBaby?.waterComfortLevel || 'tres_a_l_aise');
  const [thermalComfort, setThermalComfort] = useState<'tres_frileux' | 'standard_32c' | 'tres_a_l_aise'>(
    initialBaby?.thermalComfort || 'standard_32c'
  );
  const [hideName, setHideName] = useState(initialBaby?.hideNameInAnalysis || false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    initialBaby?.goals || ['Flottaison dorsale détendue', 'Confiance parent-bébé dans l\'eau']
  );
  const [specialNotes, setSpecialNotes] = useState(initialBaby?.specialNotes || '');
  const [favoriteToyOrCue, setFavoriteToyOrCue] = useState(initialBaby?.favoriteToyOrCue || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ageDisplay, setAgeDisplay] = useState<{ months: number; weeks: number }>({
    months: 8,
    weeks: 35,
  });

  const availableGoals = [
    'Flottaison dorsale détendue',
    'Relâchement des tensions du corps',
    'Immersion douce et acceptée',
    'Battements de jambes propulsifs',
    'Déplacements autonomes avec appui',
    'Confiance parent-bébé dans l\'eau',
    'Jeux d\'équilibre et sauts du bord',
    'Souffle et fabrication de bulles',
  ];

  // Calculate age automatically whenever birth date changes
  useEffect(() => {
    const age = babyService.calculateAge(birthDate);
    setAgeDisplay(age);
  }, [birthDate]);

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setPhotoUrl(compressed);
          setAvatarType('photo');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUserId = authService.getCurrentUser()?.id || 'guest';
    const updated: BabyProfile = {
      id: initialBaby?.id || 'baby_' + Math.random().toString(36).substring(2, 9),
      userId: initialBaby?.userId || currentUserId,
      name: name.trim() || 'Mon Bébé',
      birthDate,
      ageMonths: ageDisplay.months,
      ageWeeks: ageDisplay.weeks,
      level,
      startDate,
      avatarType,
      avatarUrl: avatar,
      photoUrl: avatarType === 'photo' ? photoUrl : undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      waterComfortLevel,
      thermalComfort,
      specialNotes: specialNotes.trim() || undefined,
      favoriteToyOrCue: favoriteToyOrCue.trim() || undefined,
      hideNameInAnalysis: hideName,
      goals: selectedGoals,
    };
    onSave(updated);
    onClose();
  };

  const handleConfirmDelete = () => {
    if (initialBaby && onDelete) {
      onDelete(initialBaby.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold">
            <Baby className="w-3.5 h-3.5" />
            {t('babyProfile.badge')}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {initialBaby ? t('babyProfile.editTitle') : t('babyProfile.addTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('babyProfile.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar ou Photo Selector */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Illustration du profil</label>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setAvatarType('avatar')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                    avatarType === 'avatar' ? 'bg-sky-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Avatar
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarType('photo')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                    avatarType === 'photo' ? 'bg-sky-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Photo
                </button>
              </div>
            </div>

            {avatarType === 'avatar' ? (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => setAvatar(av)}
                    className={`w-10 h-10 shrink-0 rounded-2xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      avatar === av
                        ? 'bg-sky-100 border-2 border-sky-500 scale-110 shadow-xs'
                        : 'bg-white hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Bébé" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{photoUrl ? 'Changer la photo' : 'Importer une photo'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Name & Birth date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">{t('babyProfile.nameLabel')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Léo, Camille..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-sky-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700">{t('babyProfile.birthDateLabel')}</label>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                  {t('babyProfile.calculatedAge', { months: ageDisplay.months, weeks: ageDisplay.weeks })}
                </span>
              </div>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-sky-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Characteristics (Weight, Height, Comfort) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 block">Poids (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="8.5"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 block">Taille (cm)</label>
              <input
                type="number"
                step="1"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="72"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 block">Aisance eau</label>
              <select
                value={waterComfortLevel}
                onChange={(e) => setWaterComfortLevel(e.target.value as any)}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              >
                <option value="tres_a_l_aise">Très à l'aise</option>
                <option value="curieux_calme">Curieux calme</option>
                <option value="prudent_hesitant">Prudent</option>
                <option value="apprehensif">Appréhensif</option>
              </select>
            </div>
          </div>

          {/* Level */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">{t('babyProfile.levelLabel')}</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'decouverte', label: t('babyProfile.levelDiscovery') },
                { id: 'confiance', label: t('babyProfile.levelConfidence') },
                { id: 'autonomie', label: t('babyProfile.levelAutonomy') },
              ].map((lvl) => (
                <button
                  type="button"
                  key={lvl.id}
                  onClick={() => setLevel(lvl.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    level === lvl.id
                      ? 'bg-sky-50 text-sky-800 border-sky-400 ring-2 ring-sky-400/20'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goals Multi-select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">{t('babyProfile.goalsLabel')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableGoals.slice(0, 6).map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    type="button"
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <span className="line-clamp-1">{goal}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy Anonymization Checkbox */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hideName}
                onChange={(e) => setHideName(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded-sm focus:ring-sky-500 border-slate-300"
              />
              <span>{t('babyProfile.privacyCheckbox')}</span>
            </label>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              {t('babyProfile.saveBtn')}
            </button>

            {/* Delete profile option (only when editing existing baby) */}
            {initialBaby && onDelete && (
              <div className="pt-2 border-t border-slate-100">
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-2.5 px-4 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t('babyProfile.deleteProfileBtn')}</span>
                  </button>
                ) : (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 animate-fade-in">
                    <div className="flex items-start gap-2.5 text-rose-900">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-left">
                        <p className="text-xs font-bold">
                          {t('babyProfile.deleteConfirmTitle', { name: initialBaby.name })}
                        </p>
                        <p className="text-[11px] text-rose-700 leading-relaxed">
                          {t('babyProfile.deleteConfirmDesc')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold border border-slate-200 cursor-pointer"
                      >
                        {t('babyProfile.cancelDeleteBtn')}
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmDelete}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t('babyProfile.confirmDeleteBtn')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

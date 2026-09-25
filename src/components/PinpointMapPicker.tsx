import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  Layers,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Compass,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import L from 'leaflet';
import { clubService } from '../services/clubService';

interface PinpointMapPickerProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  precision?: string;
  onChange: (coords: {
    lat: number;
    lng: number;
    precision: 'exact' | 'street' | 'postal' | 'city' | 'manual';
    displayName?: string;
    address?: string;
    postalCode?: string;
    city?: string;
  }) => void;
}

export const PinpointMapPicker: React.FC<PinpointMapPickerProps> = ({
  latitude,
  longitude,
  address,
  postalCode,
  city,
  country = 'France',
  precision,
  onChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const streetLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteLayerRef = useRef<L.TileLayer | null>(null);

  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [currentLat, setCurrentLat] = useState<number>(latitude || 47.994357);
  const [currentLng, setCurrentLng] = useState<number>(longitude || -4.065705);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const defaultCoords: [number, number] = [
    typeof latitude === 'number' && !isNaN(latitude) ? latitude : 47.994357,
    typeof longitude === 'number' && !isNaN(longitude) ? longitude : -4.065705,
  ];

  // Inject Leaflet CSS
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  // Update state if props change from outside
  useEffect(() => {
    if (typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude)) {
      setCurrentLat(latitude);
      setCurrentLng(longitude);
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      }
    }
  }, [latitude, longitude]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCoords,
        zoom: 16,
        maxZoom: 19,
        scrollWheelZoom: true,
      });

      // Street Layer
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      });
      streetLayer.addTo(map);
      streetLayerRef.current = streetLayer;

      // Satellite Layer (Esri World Imagery)
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Tiles © Esri',
        }
      );
      satelliteLayerRef.current = satelliteLayer;

      // Custom Pin Icon
      const customPinIcon = L.divIcon({
        className: 'custom-pinpoint-marker',
        html: `
          <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center; transform:translate(-50%, -100%); cursor:grab;">
            <div style="position:absolute; width:16px; height:16px; background:#0284c7; border-radius:50%; animation:ping 1.8s cubic-bezier(0,0,0.2,1) infinite; opacity:0.6; bottom:0;"></div>
            <div style="width:38px; height:38px; background:linear-gradient(135deg, #0284c7, #0369a1); border:3px solid #ffffff; border-radius:50% 50% 50% 0; transform:rotate(-45deg); box-shadow:0 6px 14px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">
              <span style="transform:rotate(45deg); font-size:18px;">🏊</span>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
      });

      // Marker
      const marker = L.marker(defaultCoords, {
        draggable: true,
        icon: customPinIcon,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-size:12px; font-family:sans-serif; text-align:center; padding:4px;">
          <strong style="color:#0284c7;">🎯 Point GPS de la structure</strong><br/>
          <span>Glissez ce repère pour positionner l'entrée ou le bassin au mètre près.</span>
        </div>
      `);

      // Drag event
      marker.on('dragend', () => {
        const newPos = marker.getLatLng();
        setCurrentLat(newPos.lat);
        setCurrentLng(newPos.lng);
        onChange({
          lat: Number(newPos.lat.toFixed(7)),
          lng: Number(newPos.lng.toFixed(7)),
          precision: 'manual',
        });
        setFeedback('📍 Coordonnées ajustées manuellement au mètre près.');
      });

      // Click on map to move marker
      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        setCurrentLat(e.latlng.lat);
        setCurrentLng(e.latlng.lng);
        onChange({
          lat: Number(e.latlng.lat.toFixed(7)),
          lng: Number(e.latlng.lng.toFixed(7)),
          precision: 'manual',
        });
        setFeedback('📍 Point GPS placé sur le clic.');
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (map) {
      setTimeout(() => map.invalidateSize(), 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Layer (Plan vs Satellite)
  const toggleMapType = (type: 'street' | 'satellite') => {
    const map = mapInstanceRef.current;
    if (!map || !streetLayerRef.current || !satelliteLayerRef.current) return;

    if (type === 'satellite') {
      map.removeLayer(streetLayerRef.current);
      satelliteLayerRef.current.addTo(map);
    } else {
      map.removeLayer(satelliteLayerRef.current);
      streetLayerRef.current.addTo(map);
    }
    setMapType(type);
  };

  // Search Address Autocomplete with debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await clubService.searchAddressAutocomplete(searchQuery, country);
      setSuggestions(results);
      setIsSearching(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery, country]);

  // Select a suggestion
  const handleSelectSuggestion = (s: any) => {
    setSearchQuery(s.label);
    setSuggestions([]);
    setCurrentLat(s.lat);
    setCurrentLng(s.lng);

    if (markerRef.current) {
      markerRef.current.setLatLng([s.lat, s.lng]);
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([s.lat, s.lng], 18, { animate: true, duration: 1.0 });
    }

    onChange({
      lat: Number(s.lat.toFixed(7)),
      lng: Number(s.lng.toFixed(7)),
      precision: s.precision || 'exact',
      displayName: s.label,
      address: s.street || address,
      postalCode: s.postalCode || postalCode,
      city: s.city || city,
    });

    setFeedback(`📍 Adresse positionnée : ${s.label} (${s.precision === 'exact' ? 'Numéro de rue exact' : 'Voie'})`);
  };

  // Trigger geocode on current address fields
  const handleGeocodeCurrentAddress = async () => {
    setIsSearching(true);
    setFeedback(null);
    const res = await clubService.geocodeAddress(address, postalCode, city, country);
    setIsSearching(false);

    if (res.success && typeof res.lat === 'number' && typeof res.lng === 'number') {
      setCurrentLat(res.lat);
      setCurrentLng(res.lng);

      if (markerRef.current) {
        markerRef.current.setLatLng([res.lat, res.lng]);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([res.lat, res.lng], 18, { animate: true, duration: 1.0 });
      }

      onChange({
        lat: Number(res.lat.toFixed(7)),
        lng: Number(res.lng.toFixed(7)),
        precision: (res.precision as any) || 'exact',
        displayName: res.displayName,
      });

      setFeedback(`📍 Positionnement précis réussi : ${res.lat.toFixed(6)}, ${res.lng.toFixed(6)} (${res.precision || 'exact'})`);
    } else {
      setFeedback('⚠️ Impossible de géolocaliser automatiquement cette adresse. Vous pouvez cliquer directement sur la carte pour placer le point.');
    }
  };

  // Use browser high-accuracy GPS
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setFeedback('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }

    setIsLocating(true);
    setFeedback('Recherche de votre position GPS haute précision...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentLat(lat);
        setCurrentLng(lng);

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 18, { animate: true, duration: 1.0 });
        }

        onChange({
          lat: Number(lat.toFixed(7)),
          lng: Number(lng.toFixed(7)),
          precision: 'manual',
        });

        setFeedback(`📍 Position GPS détectée (précision ~${Math.round(pos.coords.accuracy || 10)}m)`);
      },
      (err) => {
        setIsLocating(false);
        setFeedback('Impossible de récupérer votre position GPS actuelle.');
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  // Micro-adjust coordinate (+/- step)
  const handleMicroAdjust = (coord: 'lat' | 'lng', delta: number) => {
    const newLat = coord === 'lat' ? Number((currentLat + delta).toFixed(7)) : currentLat;
    const newLng = coord === 'lng' ? Number((currentLng + delta).toFixed(7)) : currentLng;

    setCurrentLat(newLat);
    setCurrentLng(newLng);

    if (markerRef.current) {
      markerRef.current.setLatLng([newLat, newLng]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([newLat, newLng]);
    }

    onChange({
      lat: newLat,
      lng: newLng,
      precision: 'manual',
    });
  };

  return (
    <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse" />
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Positionnement GPS Exact & Toiture Bassin
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Glissez le repère 🏊 ou cliquez directement sur le bâtiment/bassin pour une précision au mètre près.
          </p>
        </div>

        {/* Map View Switcher */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => toggleMapType('street')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mapType === 'street'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Vue Plan
          </button>
          <button
            type="button"
            onClick={() => toggleMapType('satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              mapType === 'satellite'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Satellite HD</span>
          </button>
        </div>
      </div>

      {/* Address Quick Search with Auto-Complete */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une adresse exacte (ex: 12 Avenue du Rouillen, Ergué-Gabéric)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs"
            />
            {isSearching && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <span className="w-3.5 h-3.5 border-2 border-sky-600 border-t-transparent rounded-full inline-block animate-spin" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleGeocodeCurrentAddress}
            disabled={isSearching || (!address && !city)}
            className="px-3.5 py-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            title="Calculer GPS d'après l'adresse renseignée ci-dessus"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Géocoder l'adresse</span>
          </button>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            title="Utiliser la position GPS de cet appareil"
          >
            <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Mon GPS</span>
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(s)}
                className="w-full text-left px-4 py-2.5 hover:bg-sky-50/80 transition-colors flex items-center justify-between text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-slate-800">{s.label}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                  {s.precision === 'exact' ? 'Toiture/N°' : s.precision === 'street' ? 'Rue' : 'Commune'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Map Box */}
      <div className="relative w-full h-[280px] sm:h-[340px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-200">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Controls Overlay */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <a
            href={`https://www.google.com/maps?q=${currentLat},${currentLng}&t=k`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 text-xs font-bold shadow-md border border-slate-200 flex items-center gap-1.5 transition-all hover:scale-102"
            title="Ouvrir dans Google Maps (Vue satellite)"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
            <span>Google Satellite</span>
          </a>
        </div>

        {/* Precision Badge Overlay */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-xs font-mono shadow-md flex items-center gap-2 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
          </span>
          <span className="text-[10px] bg-sky-500/30 text-sky-300 font-sans font-bold px-1.5 py-0.5 rounded">
            {precision === 'manual' ? '📍 Manuel' : precision === 'exact' ? '🎯 Toiture/N°' : '📍 Voie'}
          </span>
        </div>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 text-xs font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Coordinates Fine-Tuning Micro Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Latitude */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Latitude (Nord)</span>
            <span className="text-xs font-mono font-bold text-slate-800">{currentLat.toFixed(6)}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleMicroAdjust('lat', -0.0001)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              title="Ajuster latitude -0.0001 (~10m sud)"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleMicroAdjust('lat', 0.0001)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              title="Ajuster latitude +0.0001 (~10m nord)"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Longitude */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Longitude (Est/Ouest)</span>
            <span className="text-xs font-mono font-bold text-slate-800">{currentLng.toFixed(6)}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleMicroAdjust('lng', -0.0001)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              title="Ajuster longitude -0.0001 (~10m ouest)"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleMicroAdjust('lng', 0.0001)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              title="Ajuster longitude +0.0001 (~10m est)"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

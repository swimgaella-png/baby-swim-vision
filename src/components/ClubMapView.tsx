import React, { useEffect, useRef, useState } from 'react';
import { Club } from '../types';
import L from 'leaflet';
import { Layers, Navigation, Crosshair, Sparkles } from 'lucide-react';

interface ClubMapViewProps {
  clubs: Club[];
  selectedClub: Club | null;
  onSelectClub: (club: Club) => void;
  userLocation: { lat: number; lng: number } | null;
  radiusKm?: number;
}

export const ClubMapView: React.FC<ClubMapViewProps> = ({
  clubs,
  selectedClub,
  onSelectClub,
  userLocation,
  radiusKm,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ id: string; marker: L.Marker }[]>([]);
  const userCircleRef = useRef<L.Circle | null>(null);
  const streetLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteLayerRef = useRef<L.TileLayer | null>(null);

  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');

  useEffect(() => {
    // Inject Leaflet CSS dynamically if not present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map instance once
    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [46.603354, 1.888334]; // Center of France

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: userLocation ? 11 : 6,
        maxZoom: 19,
        scrollWheelZoom: true,
      });

      // Free OpenStreetMap Standard Tiles
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      });
      streetLayer.addTo(map);
      streetLayerRef.current = streetLayer;

      // High-Resolution Satellite Layer (Esri World Imagery)
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Tiles © Esri',
        }
      );
      satelliteLayerRef.current = satelliteLayer;

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach((item) => item.marker.remove());
    markersRef.current = [];

    if (userCircleRef.current) {
      userCircleRef.current.remove();
      userCircleRef.current = null;
    }

    // Add User location marker & circle if present
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="position:relative; width:28px; height:28px;">
            <div style="position:absolute; inset:0; background:#0284c7; border-radius:50%; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite; opacity:0.4;"></div>
            <div style="position:relative; width:28px; height:28px; background:#0284c7; border:3px solid white; border-radius:50%; box-shadow:0 4px 10px rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:center; color:white; font-size:13px; font-weight:bold;">📍</div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<strong>Votre position actuelle</strong>');

      if (radiusKm && radiusKm > 0) {
        userCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
          radius: radiusKm * 1000,
          color: '#0284c7',
          fillColor: '#38bdf8',
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: '4, 4',
        }).addTo(map);
      }
    }

    const bounds = L.latLngBounds([]);
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }

    // Add Club Markers
    clubs.forEach((club) => {
      const lat = club.latitude;
      const lng = club.longitude;
      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return;

      bounds.extend([lat, lng]);

      const isRec = club.isRecommended;
      const isSelected = selectedClub?.id === club.id;
      const markerColor = isRec ? '#d97706' : isSelected ? '#0369a1' : '#0284c7';
      const markerBg = isRec ? '#fef3c7' : isSelected ? '#bae6fd' : '#e0f2fe';

      const customIcon = L.divIcon({
        className: 'custom-club-marker',
        html: `
          <div style="cursor:pointer; display:flex; align-items:center; justify-content:center; width:${isSelected ? '44px' : '38px'}; height:${isSelected ? '44px' : '38px'}; background:${markerBg}; border:${isSelected ? '3px solid #0369a1' : '2.5px solid ' + markerColor}; border-radius:50%; box-shadow:0 6px 12px rgba(0,0,0,0.22); transform:translate(-50%, -50%); transition:all 0.25s;">
            <span style="font-size:${isSelected ? '20px' : '17px'};">${isRec ? '⭐' : '🏊'}</span>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Enhanced Popup Content with GPS Directions
      const popupContent = document.createElement('div');
      popupContent.style.minWidth = '220px';
      popupContent.style.maxWidth = '280px';
      popupContent.style.fontFamily = 'inherit';
      popupContent.innerHTML = `
        <div style="padding:4px 0;">
          <div style="font-size:10px; font-weight:800; text-transform:uppercase; color:#0284c7; margin-bottom:2px; letter-spacing:0.5px;">
            ${club.city} • ${club.country}
          </div>
          <div style="font-weight:800; font-size:15px; color:#0f172a; margin-bottom:4px; line-height:1.2;">
            ${club.name}
          </div>
          ${club.address ? `<div style="font-size:11px; color:#64748b; margin-bottom:6px;">📍 ${club.address}</div>` : ''}
          <div style="font-size:11px; color:#475569; margin-bottom:10px; background:#f1f5f9; padding:4px 8px; border-radius:6px;">
            👶 <strong>${club.minAgeMonths} à ${club.maxAgeMonths} mois</strong> ${club.poolInformation?.waterTemperatureC ? `• 💧 <strong>${club.poolInformation.waterTemperatureC}°C</strong>` : ''}
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <button id="popup-btn-${club.id}" style="width:100%; padding:7px 12px; background:#0284c7; color:white; font-size:12px; font-weight:bold; border-radius:10px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
              Voir la fiche détaillée
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noreferrer" style="text-align:center; padding:6px 10px; background:#f8fafc; color:#0f172a; font-size:11px; font-weight:700; border-radius:10px; border:1px solid #cbd5e1; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:4px;">
              🚗 Itinéraire GPS exact
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${club.id}`);
        if (btn) {
          btn.onclick = () => onSelectClub(club);
        }
      });

      markersRef.current.push({ id: club.id, marker });
    });

    // Adjust view bounds or focus selected club
    if (selectedClub && typeof selectedClub.latitude === 'number' && typeof selectedClub.longitude === 'number') {
      map.flyTo([selectedClub.latitude, selectedClub.longitude], 17, { animate: true, duration: 1.0 });
      const target = markersRef.current.find((m) => m.id === selectedClub.id);
      if (target) {
        setTimeout(() => target.marker.openPopup(), 400);
      }
    } else if (bounds.isValid() && clubs.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }

    // Invalidate size on resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [clubs, userLocation, radiusKm, onSelectClub, selectedClub]);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Layer Switcher
  const toggleMapLayer = (type: 'street' | 'satellite') => {
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

  return (
    <div className="relative w-full h-[580px] rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Floating Controls (Plan vs Satellite HD) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-md">
        <button
          type="button"
          onClick={() => toggleMapLayer('street')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mapType === 'street'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          Vue Plan
        </button>
        <button
          type="button"
          onClick={() => toggleMapLayer('satellite')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            mapType === 'satellite'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Satellite HD</span>
        </button>
      </div>

      {/* Bottom Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-700 shadow-md flex items-center gap-3.5">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block border border-amber-600" />
          <span>Recommandé</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-3 h-3 rounded-full bg-sky-500 inline-block border border-sky-700" />
          <span>Structure vérifiée</span>
        </div>
        {userLocation && (
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block animate-pulse" />
            <span>Votre position</span>
          </div>
        )}
      </div>
    </div>
  );
};

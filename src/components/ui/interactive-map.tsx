import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
  Polyline,
  useMap,
  useMapEvents
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Types
interface MarkerData {
  id?: string | number;
  position: [number, number];
  color?: string;
  size?: 'small' | 'medium' | 'large';
  icon?: L.Icon;
  isHome?: boolean;
  isParking?: boolean;
  popup?: {
    title: string;
    subtitle?: string;
    content: string;
    image?: string;
    slug?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

interface PolygonData {
  id?: string | number;
  positions: [number, number][];
  style?: any;
  popup?: string;
}

interface CircleData {
  id?: string | number;
  center: [number, number];
  radius: number;
  style?: any;
  popup?: string;
}

interface PolylineData {
  id?: string | number;
  positions: [number, number][];
  style?: any;
  popup?: string;
}

interface MapLayers {
  openstreetmap: boolean;
  satellite: boolean;
  traffic: boolean;
}


// Custom marker icons
const createCustomIcon = (color = 'blue', size = 'medium') => {
  const sizes = {
    small: [20, 32],
    medium: [25, 41],
    large: [30, 50]
  };
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: sizes[size],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Custom home icon using emoji and CSS
const createHomeIcon = (size = 'large') => {
  const sizes = {
    small: 24,
    medium: 32,
    large: 40
  };
  
  const iconSize = sizes[size];
  
  return new L.DivIcon({
    html: `
      <div style="
        width: ${iconSize}px; 
        height: ${iconSize}px; 
        background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${Math.floor(iconSize * 0.6)}px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      ">🏠</div>
    `,
    className: 'custom-home-marker',
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
    popupAnchor: [0, -iconSize / 2]
  });
};

// Custom parking icon using P symbol and CSS
const createParkingIcon = (size = 'medium') => {
  const sizes = {
    small: 24,
    medium: 32,
    large: 40
  };
  
  const iconSize = sizes[size];
  
  return new L.DivIcon({
    html: `
      <div style="
        width: ${iconSize}px; 
        height: ${iconSize}px; 
        background: linear-gradient(135deg, #10B981 0%, #047857 100%);
        border: 3px solid white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${Math.floor(iconSize * 0.7)}px;
        font-weight: bold;
        color: white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      ">P</div>
    `,
    className: 'custom-parking-marker',
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
    popupAnchor: [0, -iconSize / 2]
  });
};

// Map event handler component
const MapEvents: React.FC<{
  onMapClick?: (latlng: L.LatLng) => void;
  onLocationFound?: (latlng: [number, number]) => void;
}> = ({ onMapClick, onLocationFound }) => {
  const map = useMapEvents({
    click: (e) => {
      onMapClick && onMapClick(e.latlng);
    },
    locationfound: (e) => {
      onLocationFound && onLocationFound([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return null;
};

// Search component
const SearchControl: React.FC<{
  onSearch?: (result: { latLng: [number, number], name: string }) => void;
}> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const map = useMap();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      // Using Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const results = await response.json();
      
      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const latLng: [number, number] = [parseFloat(lat), parseFloat(lon)];
        map.flyTo(latLng, 13);
        onSearch && onSearch({ latLng, name: display_name });
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  useEffect(() => {
    const control = L.control({ position: 'topleft' });
    
    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'search-control');
      div.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); display: flex; gap: 5px;">
          <input 
            id="search-input" 
            type="text" 
            placeholder="Search places..." 
            style="padding: 8px; border: 1px solid #ddd; border-radius: 3px; width: 200px;"
          />
          <button 
            id="search-btn" 
            style="padding: 8px 12px; border: none; border-radius: 3px; cursor: pointer; background: #007bff; color: white;"
          >
            🔍
          </button>
        </div>
      `;
      
      L.DomEvent.disableClickPropagation(div);
      
      const input = div.querySelector('#search-input') as HTMLInputElement;
      const button = div.querySelector('#search-btn') as HTMLButtonElement;
      
      if (input) {
        input.addEventListener('input', (e) => setQuery((e.target as HTMLInputElement).value));
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') handleSearch();
        });
      }
      if (button) {
        button.addEventListener('click', handleSearch);
      }
      
      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map, query]);

  return null;
};

// Custom control component
const CustomControls: React.FC<{
  onLocate: () => void;
  onToggleLayer: (layer: string) => void;
  layers: MapLayers;
}> = ({ onLocate, onToggleLayer, layers }) => {
  const map = useMap();

  useEffect(() => {
    const control = L.control({ position: 'topright' });
    
    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'custom-controls');
      div.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
          <button id="locate-btn" style="margin: 2px; padding: 8px; border: none; border-radius: 3px; cursor: pointer;">📍 Locate Me</button>
          <button id="satellite-btn" style="margin: 2px; padding: 8px; border: none; border-radius: 3px; cursor: pointer;">🛰️ Satellite</button>
          <button id="traffic-btn" style="margin: 2px; padding: 8px; border: none; border-radius: 3px; cursor: pointer;">🚦 Traffic</button>
        </div>
      `;
      
      L.DomEvent.disableClickPropagation(div);
      
      const locateBtn = div.querySelector('#locate-btn');
      const satelliteBtn = div.querySelector('#satellite-btn');
      const trafficBtn = div.querySelector('#traffic-btn');
      
      if (locateBtn) locateBtn.addEventListener('click', () => onLocate());
      if (satelliteBtn) satelliteBtn.addEventListener('click', () => onToggleLayer('satellite'));
      if (trafficBtn) trafficBtn.addEventListener('click', () => onToggleLayer('traffic'));
      
      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map, onLocate, onToggleLayer]);

  return null;
};


// Main AdvancedMap component props
interface AdvancedMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MarkerData[];
  polygons?: PolygonData[];
  circles?: CircleData[];
  polylines?: PolylineData[];
  onMarkerClick?: (marker: MarkerData) => void;
  onMapClick?: (latlng: L.LatLng) => void;
  enableClustering?: boolean;
  enableSearch?: boolean;
  enableControls?: boolean;
  enableDrawing?: boolean;
  mapLayers?: MapLayers;
  className?: string;
  style?: React.CSSProperties;
}

// Main AdvancedMap component
export const AdvancedMap: React.FC<AdvancedMapProps> = ({
  center = [55.6761, 12.5683], // Default to Copenhagen
  zoom = 12,
  markers = [],
  polygons = [],
  circles = [],
  polylines = [],
  onMarkerClick,
  onMapClick,
  enableClustering = true,
  enableSearch = true,
  enableControls = true,
  enableDrawing = false,
  mapLayers = {
    openstreetmap: true,
    satellite: false,
    traffic: false
  },
  className = '',
  style = { height: '500px', width: '100%' }
}) => {
  const [currentLayers, setCurrentLayers] = useState(mapLayers);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchResult, setSearchResult] = useState<{ latLng: [number, number], name: string } | null>(null);
  const [clickedLocation, setClickedLocation] = useState<L.LatLng | null>(null);

  // Handle layer toggling
  const handleToggleLayer = useCallback((layerType: string) => {
    setCurrentLayers(prev => ({
      ...prev,
      [layerType]: !prev[layerType as keyof MapLayers]
    }));
  }, []);

  // Handle geolocation
  const handleLocate = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Handle map click
  const handleMapClick = useCallback((latlng: L.LatLng) => {
    setClickedLocation(latlng);
    onMapClick && onMapClick(latlng);
  }, [onMapClick]);

  // Handle search results
  const handleSearch = useCallback((result: { latLng: [number, number], name: string }) => {
    setSearchResult(result);
  }, []);


  return (
    <div className={`advanced-map ${className}`} style={style}>
      <style>
        {`
          .advanced-map .leaflet-popup-pane {
            z-index: 1000;
          }
          .advanced-map .leaflet-popup {
            z-index: 1001;
          }
          .cluster-small {
            width: 32px !important;
            height: 32px !important;
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%) !important;
            border: 2px solid white !important;
            border-radius: 50% !important;
            box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: 11px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            line-height: 1 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .cluster-medium {
            width: 40px !important;
            height: 40px !important;
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%) !important;
            border: 2px solid white !important;
            border-radius: 50% !important;
            box-shadow: 0 3px 8px rgba(139, 92, 246, 0.3) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: 13px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            line-height: 1 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .cluster-large {
            width: 48px !important;
            height: 48px !important;
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%) !important;
            border: 2px solid white !important;
            border-radius: 50% !important;
            box-shadow: 0 3px 8px rgba(239, 68, 68, 0.3) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: 15px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            line-height: 1 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        `}
      </style>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Base tile layers */}
        {currentLayers.openstreetmap && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        
        {currentLayers.satellite && (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {/* Map events */}
        <MapEvents
          onMapClick={handleMapClick}
          onLocationFound={setUserLocation}
        />

        {/* Search control */}
        {enableSearch && <SearchControl onSearch={handleSearch} />}

        {/* Custom controls */}
        {enableControls && (
          <CustomControls
            onLocate={handleLocate}
            onToggleLayer={handleToggleLayer}
            layers={currentLayers}
          />
        )}

        {/* Markers with clustering */}
        {enableClustering ? (
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              let className, size;
              
              if (count < 10) {
                className = 'cluster-small';
                size = 32;
              } else if (count < 100) {
                className = 'cluster-medium';
                size = 40;
              } else {
                className = 'cluster-large';
                size = 48;
              }
              
              return new L.DivIcon({
                html: `${count}`,
                className: className,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2]
              });
            }}
          >
            {markers.map((marker, index) => (
              <Marker
                key={marker.id || index}
                position={marker.position}
                icon={marker.icon || (marker.isHome ? createHomeIcon(marker.size) : marker.isParking ? createParkingIcon(marker.size) : createCustomIcon(marker.color, marker.size))}
                eventHandlers={{
                  click: () => onMarkerClick && onMarkerClick(marker)
                }}
              >
                {marker.popup && (
                  <Popup>
                    <div style={{ minWidth: '250px' }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                        {marker.popup.title}
                      </h3>
                      {marker.popup.subtitle && (
                        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                          {marker.popup.subtitle}
                        </p>
                      )}
                      <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>{marker.popup.content}</p>
                      {marker.popup.slug && (
                        <div style={{ marginBottom: '12px' }}>
                          <a 
                            href={`/recommendations/${marker.popup.slug}`} 
                            style={{ 
                              color: '#3B82F6', 
                              textDecoration: 'none', 
                              fontSize: '14px', 
                              fontWeight: '500'
                            }}
                            target="_blank"
                          >
                            Read more →
                          </a>
                        </div>
                      )}
                      {marker.popup.coordinates && (
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '8px' }}>
                          <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#888' }}>Open this location in:</p>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <a 
                              href={`https://maps.apple.com/?q=${marker.popup.coordinates.lat},${marker.popup.coordinates.lng}`}
                              target="_blank"
                              style={{ 
                                color: '#3B82F6', 
                                textDecoration: 'none', 
                                fontSize: '12px',
                                padding: '4px 8px',
                                background: '#f3f4f6',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '4px'
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                              </svg>
                              Apple Maps
                            </a>
                            <a 
                              href={`https://www.google.com/maps?q=${marker.popup.coordinates.lat},${marker.popup.coordinates.lng}`}
                              target="_blank"
                              style={{ 
                                color: '#3B82F6', 
                                textDecoration: 'none', 
                                fontSize: '12px',
                                padding: '4px 8px',
                                background: '#f3f4f6',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '4px'
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.017 2.995c3.79 0 6.71 2.92 6.71 6.71 0 4.104-4.954 9.492-6.71 11.3-1.756-1.808-6.71-7.196-6.71-11.3 0-3.79 2.92-6.71 6.71-6.71zm0 2.48c-2.336 0-4.23 1.894-4.23 4.23s1.894 4.23 4.23 4.23 4.23-1.894 4.23-4.23-1.894-4.23-4.23-4.23zm0 2.48c.966 0 1.75.784 1.75 1.75s-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75.784-1.75 1.75-1.75z"/>
                              </svg>
                              Google Maps
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </Popup>
                )}
              </Marker>
            ))}
          </MarkerClusterGroup>
        ) : (
          markers.map((marker, index) => (
            <Marker
              key={marker.id || index}
              position={marker.position}
              icon={marker.icon || createCustomIcon(marker.color, marker.size)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(marker)
              }}
            >
              {marker.popup && (
                <Popup>
                  <div style={{ minWidth: '250px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                      {marker.popup.title}
                    </h3>
                    {marker.popup.subtitle && (
                      <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                        {marker.popup.subtitle}
                      </p>
                    )}
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>{marker.popup.content}</p>
                    {marker.popup.slug && (
                      <div style={{ marginBottom: '12px' }}>
                        <a 
                          href={`/recommendations/${marker.popup.slug}`} 
                          style={{ 
                            color: '#3B82F6', 
                            textDecoration: 'none', 
                            fontSize: '14px', 
                            fontWeight: '500'
                          }}
                          target="_blank"
                        >
                          Read more →
                        </a>
                      </div>
                    )}
                    {marker.popup.coordinates && (
                      <div style={{ borderTop: '1px solid #eee', paddingTop: '8px' }}>
                        <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#888' }}>Open this location in:</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <a 
                            href={`https://maps.apple.com/?q=${marker.popup.coordinates.lat},${marker.popup.coordinates.lng}`}
                            target="_blank"
                            style={{ 
                              color: '#3B82F6', 
                              textDecoration: 'none', 
                              fontSize: '12px',
                              padding: '4px 8px',
                              background: '#f3f4f6',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginTop: '0.5px' }}>
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            Apple Maps
                          </a>
                          <a 
                            href={`https://www.google.com/maps?q=${marker.popup.coordinates.lat},${marker.popup.coordinates.lng}`}
                            target="_blank"
                            style={{ 
                              color: '#3B82F6', 
                              textDecoration: 'none', 
                              fontSize: '12px',
                              padding: '4px 8px',
                              background: '#f3f4f6',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginTop: '0.5px' }}>
                              <path d="M12.017 2.995c3.79 0 6.71 2.92 6.71 6.71 0 4.104-4.954 9.492-6.71 11.3-1.756-1.808-6.71-7.196-6.71-11.3 0-3.79 2.92-6.71 6.71-6.71zm0 2.48c-2.336 0-4.23 1.894-4.23 4.23s1.894 4.23 4.23 4.23 4.23-1.894 4.23-4.23-1.894-4.23-4.23-4.23zm0 2.48c.966 0 1.75.784 1.75 1.75s-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75.784-1.75 1.75-1.75z"/>
                            </svg>
                            Google Maps
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </Popup>
              )}
            </Marker>
          ))
        )}

        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={createCustomIcon('red', 'medium')}
          >
            <Popup>Your current location</Popup>
          </Marker>
        )}

        {/* Search result marker */}
        {searchResult && (
          <Marker 
            position={searchResult.latLng}
            icon={createCustomIcon('green', 'large')}
          >
            <Popup>{searchResult.name}</Popup>
          </Marker>
        )}

        {/* Clicked location marker */}
        {clickedLocation && (
          <Marker 
            position={[clickedLocation.lat, clickedLocation.lng]}
            icon={createCustomIcon('orange', 'small')}
          >
            <Popup>
              Lat: {clickedLocation.lat.toFixed(6)}<br/>
              Lng: {clickedLocation.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}

        {/* Polygons */}
        {polygons.map((polygon, index) => (
          <Polygon
            key={polygon.id || index}
            positions={polygon.positions}
            pathOptions={polygon.style || { color: 'purple', weight: 2, fillOpacity: 0.3 }}
          >
            {polygon.popup && <Popup>{polygon.popup}</Popup>}
          </Polygon>
        ))}

        {/* Circles */}
        {circles.map((circle, index) => (
          <Circle
            key={circle.id || index}
            center={circle.center}
            radius={circle.radius}
            pathOptions={circle.style || { color: 'blue', weight: 2, fillOpacity: 0.2 }}
          >
            {circle.popup && <Popup>{circle.popup}</Popup>}
          </Circle>
        ))}

        {/* Polylines */}
        {polylines.map((polyline, index) => (
          <Polyline
            key={polyline.id || index}
            positions={polyline.positions}
            pathOptions={polyline.style || { color: 'red', weight: 3 }}
          >
            {polyline.popup && <Popup>{polyline.popup}</Popup>}
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
};
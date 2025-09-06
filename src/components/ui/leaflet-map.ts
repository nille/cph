import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

// Fix for default markers in bundler environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Types
export interface MarkerData {
  id?: string | number;
  position: [number, number];
  color?: string;
  size?: 'small' | 'medium' | 'large';
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

export interface MapOptions {
  center?: [number, number];
  zoom?: number;
  markers?: MarkerData[];
  enableClustering?: boolean;
  className?: string;
  style?: Partial<CSSStyleDeclaration>;
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

// Custom home icon
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

// Custom parking icon
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

export class LeafletMap {
  private map: L.Map | null = null;
  private markersLayer: L.MarkerClusterGroup | L.LayerGroup | null = null;
  
  constructor(
    private containerId: string,
    private options: MapOptions = {}
  ) {}

  initialize(): LeafletMap {
    const {
      center = [55.6761, 12.5683], // Copenhagen coordinates
      zoom = 12,
      enableClustering = true
    } = this.options;

    // Create map
    this.map = L.map(this.containerId, {
      center,
      zoom,
      scrollWheelZoom: true,
      zoomControl: true,
      attributionControl: true
    });

    // Add tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Create markers layer
    if (enableClustering) {
      this.markersLayer = (L as any).markerClusterGroup({
        maxClusterRadius: 80,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      });
    } else {
      this.markersLayer = L.layerGroup();
    }

    this.markersLayer.addTo(this.map);

    return this;
  }

  addMarkers(markers: MarkerData[]): LeafletMap {
    if (!this.markersLayer) return this;

    // Clear existing markers
    this.markersLayer.clearLayers();

    markers.forEach(markerData => {
      const { position, color = 'blue', size = 'medium', isHome, isParking, popup } = markerData;
      
      // Choose icon based on marker type
      let icon: L.Icon | L.DivIcon;
      if (isHome) {
        icon = createHomeIcon(size);
      } else if (isParking) {
        icon = createParkingIcon(size);
      } else {
        icon = createCustomIcon(color, size);
      }

      const marker = L.marker(position, { icon });

      // Add popup if provided
      if (popup) {
        const popupContent = `
          <div style="min-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
              ${popup.title}
            </h3>
            ${popup.subtitle ? `
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; font-style: italic;">
                ${popup.subtitle}
              </p>
            ` : ''}
            <p style="margin: 0 0 12px 0; font-size: 14px;">${popup.content}</p>
            ${popup.slug ? `
              <div style="margin-bottom: 12px;">
                <a 
                  href="/recommendations/${popup.slug}" 
                  style="
                    color: #3B82F6; 
                    text-decoration: none; 
                    font-size: 14px; 
                    font-weight: 500;
                  "
                  target="_blank"
                >
                  Read more →
                </a>
              </div>
            ` : ''}
            ${popup.coordinates ? `
              <div style="border-top: 1px solid #eee; padding-top: 8px;">
                <p style="margin: 0 0 6px 0; font-size: 12px; color: #888;">Open this location in:</p>
                <div style="display: flex; gap: 8px;">
                  <a 
                    href="https://maps.apple.com/?q=${popup.coordinates.lat},${popup.coordinates.lng}"
                    target="_blank"
                    style="
                      color: #3B82F6; 
                      text-decoration: none; 
                      font-size: 12px;
                      padding: 4px 8px;
                      background: #f3f4f6;
                      border-radius: 4px;
                    "
                  >
                    Apple Maps
                  </a>
                  <a 
                    href="https://www.google.com/maps?q=${popup.coordinates.lat},${popup.coordinates.lng}"
                    target="_blank"
                    style="
                      color: #3B82F6; 
                      text-decoration: none; 
                      font-size: 12px;
                      padding: 4px 8px;
                      background: #f3f4f6;
                      border-radius: 4px;
                    "
                  >
                    Google Maps
                  </a>
                </div>
              </div>
            ` : ''}
          </div>
        `;
        marker.bindPopup(popupContent);
      }

      this.markersLayer!.addLayer(marker);
    });

    return this;
  }

  getMap(): L.Map | null {
    return this.map;
  }

  destroy(): void {
    if (this.markersLayer) {
      this.markersLayer.clearLayers();
      this.markersLayer = null;
    }
    
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

// Factory function for easy initialization
export function createLeafletMap(containerId: string, options: MapOptions = {}): LeafletMap {
  return new LeafletMap(containerId, options).initialize();
}
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { getEmojiFromTags } from '../../config/emoji-mappings';

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
  title: string; // For hover tooltip
  size?: 'small' | 'medium' | 'large';
  isHome?: boolean;
  isParking?: boolean;
  type?: string;
  tags?: string[];
  popup?: {
    title: string;
    subtitle?: string;
    content: string;
    image?: string;
    slug?: string;
    website?: string;
    instagram?: string;
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

// Create emoji-based marker icon using the new mapping system
const createEmojiIcon = (
  tags: string[] = [], 
  type?: string, 
  size: 'small' | 'medium' | 'large' = 'medium'
) => {
  const sizes = {
    small: 28,
    medium: 36,
    large: 44
  };
  
  const iconSize = sizes[size];
  const { emoji, label } = getEmojiFromTags(tags, type);
  
  return new L.DivIcon({
    html: `
      <div style="
        width: ${iconSize}px; 
        height: ${iconSize}px; 
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: 2px solid #333;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${Math.floor(iconSize * 0.5)}px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        position: relative;
        cursor: pointer;
      ">${emoji}</div>
    `,
    className: `emoji-marker emoji-marker-${label.toLowerCase().replace(' ', '-')}`,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
    popupAnchor: [0, -iconSize / 2]
  });
};

// Custom marker icons (legacy - keeping for fallback)
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
  private isFullScreen = false;
  private keyboardHandler: ((e: KeyboardEvent) => void) | null = null;
  
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
        zoomToBoundsOnClick: true,
        iconCreateFunction: function(cluster: any) {
          const childCount = cluster.getChildCount();
          let c = ' marker-cluster-';
          if (childCount < 10) {
            c += 'small';
          } else if (childCount < 100) {
            c += 'medium';
          } else {
            c += 'large';
          }
          
          return new (L as any).DivIcon({ 
            html: '<div title="Click to expand"><span>' + childCount + '</span></div>', 
            className: 'marker-cluster' + c, 
            iconSize: new (L as any).Point(40, 40) 
          });
        }
      });
    } else {
      this.markersLayer = L.layerGroup();
    }

    this.markersLayer.addTo(this.map);

    // Add custom full screen control
    this.addFullScreenControl();

    // Add keyboard event listener for Esc key
    this.keyboardHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isFullScreen) {
        e.preventDefault();
        this.toggleFullScreen();
      }
    };
    document.addEventListener('keydown', this.keyboardHandler);

    return this;
  }

  addMarkers(markers: MarkerData[]): LeafletMap {
    if (!this.markersLayer) return this;

    // Clear existing markers
    this.markersLayer.clearLayers();

    markers.forEach(markerData => {
      const { position, title, type, tags = [], size = 'medium', isHome, isParking, popup } = markerData;
      
      // Determine icon based on tags and type
      let icon: L.Icon | L.DivIcon;
      if (isHome) {
        // Force home emoji for home location
        icon = createEmojiIcon(['home', 'nørrebro', 'local'], 'location', size);
      } else if (isParking) {
        // Force parking emoji for parking
        icon = createEmojiIcon(['parking'], 'parking', size);
      } else {
        // Use smart emoji detection based on tags
        icon = createEmojiIcon(tags, type, size);
      }

      const marker = L.marker(position, { icon });

      // Add hover tooltip with place name
      marker.bindTooltip(title, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'place-tooltip'
      });

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
                  href="/places/${popup.slug}" 
                  style="
                    color: #3B82F6; 
                    text-decoration: none; 
                    font-size: 14px; 
                    font-weight: 500;
                  "
                >
                  Read more →
                </a>
              </div>
            ` : ''}
            ${popup.website || popup.instagram ? `
              <div style="border-top: 1px solid #eee; padding-top: 8px; margin-bottom: 8px;">
                <p style="margin: 0 0 6px 0; font-size: 12px; color: #888;">Find online:</p>
                <div style="display: flex; gap: 8px;">
                  ${popup.website ? `
                    <a 
                      href="${popup.website}"
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
                      🌐 Website ↗
                    </a>
                  ` : ''}
                  ${popup.instagram ? `
                    <a 
                      href="https://instagram.com/${popup.instagram}"
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
                      📷 Instagram ↗
                    </a>
                  ` : ''}
                </div>
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
                    Apple Maps ↗
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
                    Google Maps ↗
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

  private addFullScreenControl(): void {
    if (!this.map) return;

    // Create full screen control
    const FullScreenControl = L.Control.extend({
      options: {
        position: 'topright'
      },

      onAdd: () => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        
        const button = L.DomUtil.create('a', 'leaflet-control-fullscreen', container);
        button.innerHTML = '⛶';
        button.href = '#';
        button.title = 'Enter Full Screen (Esc to exit)';
        button.setAttribute('role', 'button');
        button.setAttribute('aria-label', 'Enter full screen');
        
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.lineHeight = '30px';
        button.style.textAlign = 'center';
        button.style.textDecoration = 'none';
        button.style.color = '#333';
        button.style.fontSize = '18px';
        button.style.display = 'block';

        L.DomEvent.on(button, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          this.toggleFullScreen();
        });

        return container;
      }
    });

    this.map.addControl(new FullScreenControl());
  }

  private toggleFullScreen(): void {
    const mapContainer = document.getElementById(this.containerId);
    const mapWrapper = mapContainer?.closest('.bg-white') as HTMLElement;
    
    if (!mapContainer || !mapWrapper) return;

    this.isFullScreen = !this.isFullScreen;

    if (this.isFullScreen) {
      // Enter full screen
      mapWrapper.style.position = 'fixed';
      mapWrapper.style.top = '0';
      mapWrapper.style.left = '0';
      mapWrapper.style.width = '100vw';
      mapWrapper.style.height = '100vh';
      mapWrapper.style.zIndex = '9999';
      mapWrapper.style.margin = '0';
      mapWrapper.style.borderRadius = '0';
      mapContainer.style.height = 'calc(100vh - 2rem)';
      
      // Update button text and title
      const button = document.querySelector('.leaflet-control-fullscreen') as HTMLElement;
      if (button) {
        button.innerHTML = '⛶';
        button.title = 'Exit Full Screen (Esc)';
        button.setAttribute('aria-label', 'Exit full screen');
      }
    } else {
      // Exit full screen
      mapWrapper.style.position = '';
      mapWrapper.style.top = '';
      mapWrapper.style.left = '';
      mapWrapper.style.width = '';
      mapWrapper.style.height = '';
      mapWrapper.style.zIndex = '';
      mapWrapper.style.margin = '';
      mapWrapper.style.borderRadius = '';
      mapContainer.style.height = '600px';
      
      // Update button text and title
      const button = document.querySelector('.leaflet-control-fullscreen') as HTMLElement;
      if (button) {
        button.innerHTML = '⛶';
        button.title = 'Enter Full Screen (Esc to exit)';
        button.setAttribute('aria-label', 'Enter full screen');
      }
    }

    // Resize map to fit new container
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);
  }

  getMap(): L.Map | null {
    return this.map;
  }

  destroy(): void {
    // Remove keyboard event listener
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
      this.keyboardHandler = null;
    }

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
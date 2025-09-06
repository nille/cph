# Leaflet.js Comprehensive Development Guide

This document contains comprehensive information about Leaflet.js gathered from extensive research, covering everything from core concepts to advanced implementation patterns and performance optimization techniques.

## Table of Contents

1. [Core Concepts & API](#core-concepts--api)
2. [Map Creation & Configuration](#map-creation--configuration)
3. [Layers & Layer Management](#layers--layer-management)
4. [Markers & UI Elements](#markers--ui-elements)
5. [Popular Plugins & Extensions](#popular-plugins--extensions)
6. [Comprehensive Plugin Directory](#comprehensive-plugin-directory)
7. [Design & Layout Configuration](#design--layout-configuration)
8. [Clustering Solutions](#clustering-solutions)
9. [Performance Optimization](#performance-optimization)
10. [Event Handling Best Practices](#event-handling-best-practices)
11. [Memory Management](#memory-management)
12. [Integration with Modern Frameworks](#integration-with-modern-frameworks)
13. [Best Practices & Patterns](#best-practices--patterns)
14. [Troubleshooting & Common Issues](#troubleshooting--common-issues)

## Core Concepts & API

### What is Leaflet.js?

Leaflet is a lightweight, open-source JavaScript library for mobile-friendly interactive maps. It's provider-agnostic, meaning you can use any tile provider (OpenStreetMap, MapBox, Google, etc.) without being locked into a specific service.

**Official Documentation**: https://leafletjs.com/  
**Official API Reference**: https://leafletjs.com/reference.html  
**Official Plugin Database**: https://leafletjs.com/plugins.html

### Key Features

- **Lightweight**: ~42KB of gzipped JS code
- **Mobile-friendly**: Multi-touch support, hardware acceleration
- **Provider-agnostic**: Works with any tile service
- **Plugin ecosystem**: Extensive collection of third-party plugins
- **Modern browser support**: IE7-11, Chrome, Firefox, Safari, Opera, mobile browsers

### Basic Architecture

Leaflet uses a layered architecture:
- **Map**: The main container
- **Layers**: Raster (tiles), Vector (shapes), UI layers (markers, popups)
- **Controls**: UI elements (zoom, layers control)
- **Events**: User interactions and map events

## Map Creation & Configuration

### Basic Map Setup

```javascript
// Create a map
const map = L.map('mapId', {
  center: [lat, lng],
  zoom: 13,
  zoomControl: false,        // Disable default zoom control
  attributionControl: true, // Keep attribution
  maxZoom: 18,
  minZoom: 1
});

// Add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
```

### Advanced Configuration Options

```javascript
const map = L.map('mapId', {
  // View options
  center: [51.505, -0.09],
  zoom: 13,
  maxZoom: 18,
  minZoom: 2,
  maxBounds: [[40.712, -74.227], [40.774, -74.125]], // Restrict panning
  
  // Control options
  zoomControl: false,
  attributionControl: true,
  
  // Interaction options
  dragging: true,
  touchZoom: true,
  doubleClickZoom: true,
  scrollWheelZoom: true,
  
  // Performance options
  preferCanvas: false,        // Use SVG by default
  renderer: L.canvas(),       // Force canvas renderer for better performance
  
  // Animation options
  zoomAnimation: true,
  markerZoomAnimation: true,
  fadeAnimation: true
});
```

## Layers & Layer Management

### Raster Layers (Tile Layers)

```javascript
// OpenStreetMap
const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
});

// MapBox (requires API key)
const mapboxLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: '© Mapbox © OpenStreetMap',
  tileSize: 512,
  zoomOffset: -1,
  id: 'mapbox/streets-v11',
  accessToken: 'your.mapbox.access.token'
});
```

### Vector Layers

```javascript
// Polyline
const polyline = L.polyline([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047]
], { color: 'red' }).addTo(map);

// Polygon
const polygon = L.polygon([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047]
], { color: 'blue', fillColor: '#f03', fillOpacity: 0.5 }).addTo(map);

// Circle
const circle = L.circle([51.508, -0.11], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 500
}).addTo(map);
```

### GeoJSON Layer

```javascript
const geojsonLayer = L.geoJSON(geojsonData, {
  style: function (feature) {
    return {
      color: feature.properties.color,
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.5
    };
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  },
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  }
}).addTo(map);
```

### Layer Groups & Control

```javascript
// Create layer groups
const baseLayers = {
  "OpenStreetMap": osmLayer,
  "Mapbox": mapboxLayer
};

const overlayLayers = {
  "Cities": citiesLayer,
  "Routes": routesLayer
};

// Add layers control
L.control.layers(baseLayers, overlayLayers, {
  position: 'topright',
  collapsed: false
}).addTo(map);

// FeatureGroup for batch operations
const featureGroup = L.featureGroup([marker1, marker2, polygon]).addTo(map);
map.fitBounds(featureGroup.getBounds());
```

## Markers & UI Elements

### Basic Markers

```javascript
// Simple marker
const marker = L.marker([51.5, -0.09]).addTo(map);

// Marker with custom icon
const customIcon = L.icon({
  iconUrl: 'path/to/icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'path/to/shadow.png',
  shadowSize: [41, 41]
});

const customMarker = L.marker([51.5, -0.09], { icon: customIcon }).addTo(map);
```

### DivIcon for HTML Content

```javascript
const htmlIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#4838cc;' class='marker-pin'></div><i class='material-icons'>location_on</i>",
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

const divMarker = L.marker([51.5, -0.09], { icon: htmlIcon }).addTo(map);
```

### Popups & Tooltips

```javascript
// Popup
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

// Tooltip
marker.bindTooltip("I am a tooltip", {
  permanent: false,
  direction: 'top',
  offset: [0, -20]
});

// Advanced popup options
const popup = L.popup({
  maxWidth: 300,
  minWidth: 100,
  maxHeight: 200,
  autoPan: true,
  closeOnClick: false,
  autoClose: false
}).setLatLng([51.5, -0.09]).setContent("Custom popup content");

map.openPopup(popup);
```

## Popular Plugins & Extensions

### Essential Plugins

#### 1. Leaflet.markercluster
**Purpose**: Cluster markers for better performance and UX
```javascript
// Installation
npm install leaflet.markercluster

// Usage
const markerClusterGroup = L.markerClusterGroup({
  maxClusterRadius: 80,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true
});

markers.forEach(marker => markerClusterGroup.addLayer(marker));
map.addLayer(markerClusterGroup);
```

#### 2. Leaflet-providers
**Purpose**: Easy access to multiple tile providers
```javascript
// Installation
npm install leaflet-providers

// Usage
const Esri_WorldImagery = L.tileLayer.provider('Esri.WorldImagery');
map.addLayer(Esri_WorldImagery);
```

#### 3. Leaflet.draw
**Purpose**: Drawing and editing tools
```javascript
// Installation
npm install leaflet-draw

// Usage
const drawControl = new L.Control.Draw({
  draw: {
    polygon: true,
    polyline: true,
    rectangle: true,
    circle: true,
    marker: true
  },
  edit: {
    featureGroup: drawnItems
  }
});
map.addControl(drawControl);
```

#### 4. Leaflet.heat
**Purpose**: Heatmap visualization
```javascript
// Installation
npm install leaflet.heat

// Usage
const heatmapData = [[lat, lng, intensity], ...];
const heat = L.heatLayer(heatmapData, {
  radius: 25,
  blur: 15,
  maxZoom: 17
}).addTo(map);
```

#### 5. Leaflet-gesture-handling
**Purpose**: Improve mobile UX by preventing accidental map interactions
```javascript
// Installation
npm install leaflet-gesture-handling

// Usage
const map = L.map('mapid', {
  gestureHandling: true
});
```

### Performance-Oriented Plugins

#### Leaflet.Canvas-Markers
**Purpose**: Render thousands of markers using canvas for better performance
```javascript
const ciLayer = L.canvasIconLayer({}).addTo(map);
const marker = L.marker([lat, lng], { icon: icon });
ciLayer.addMarker(marker);
```

#### Leaflet.VectorGrid
**Purpose**: Display vector tiles efficiently
```javascript
const vectorTileOptions = {
  rendererFactory: L.canvas.tile,
  vectorTileLayerStyles: styleFunction
};
const vectorLayer = L.vectorGrid.protobuf(url, vectorTileOptions).addTo(map);
```

## Comprehensive Plugin Directory

Based on the [official Leaflet plugin database](https://leafletjs.com/plugins.html) and extensive research, here's a comprehensive directory of available plugins organized by category. As of 2024, there are **551+ plugins** available in the Leaflet ecosystem.

### Tile & Image Layers

#### Basemap Providers
- **[Leaflet-providers](https://github.com/leaflet-extras/leaflet-providers)** - Configurations for various tile providers (Stamen, CartoDB, Esri, etc.)
- **[Leaflet.GridLayer.GoogleMutant](https://github.com/Leaflet/Leaflet.GridLayer.GoogleMutant)** - Display Google Maps as a Leaflet layer
- **[Leaflet-plugins](https://github.com/shramov/leaflet-plugins)** - Google, Bing, and Yandex layers

```javascript
// Leaflet-providers example
npm install leaflet-providers
import 'leaflet-providers';

L.tileLayer.provider('CartoDB.Positron').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
```

#### Vector Tiles
- **[Leaflet.VectorGrid](https://github.com/Leaflet/Leaflet.VectorGrid)** - Display vector tiles efficiently
- **[leaflet-maptiler-sdk](https://github.com/maptiler/leaflet-maptilersdk)** - MapTiler vector tiles support

```javascript
// Vector tiles example
const vectorTileLayer = L.vectorGrid.protobuf(
  'https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key={apikey}',
  {
    vectorTileLayerStyles: {
      'water': { fill: true, fillColor: '#06cccc' },
      'transportation': { color: 'white', weight: 2 }
    }
  }
).addTo(map);
```

### Overlay Display

#### Markers & Renderers
- **[Leaflet.ExtraMarkers](https://github.com/coryasilva/Leaflet.ExtraMarkers)** - Enhanced markers with more shapes and colors
- **[Leaflet.awesome-markers](https://github.com/lvoogdt/Leaflet.awesome-markers)** - FontAwesome icon markers
- **[Leaflet.Canvas-Markers](https://github.com/eJuke/Leaflet.Canvas-Markers)** - High-performance canvas marker rendering
- **[Leaflet.PixiOverlay](https://github.com/manubb/Leaflet.PixiOverlay)** - PIXI.js integration for high-performance graphics

```javascript
// ExtraMarkers example
npm install leaflet-extramarkers
import 'leaflet-extramarkers';

const redMarker = L.ExtraMarkers.icon({
  icon: 'fa-coffee',
  markerColor: 'red',
  shape: 'square',
  prefix: 'fa'
});

L.marker([lat, lng], { icon: redMarker }).addTo(map);
```

#### Clustering & Decluttering
- **[Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)** - Beautiful animated marker clustering
- **[Leaflet.MarkerCluster.PlacementStrategies](https://github.com/adammertel/Leaflet.MarkerCluster.PlacementStrategies)** - Advanced cluster styling
- **[OverlappingMarkerSpiderfier](https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet)** - Spiderfy overlapping markers
- **[Leaflet.FeatureGroup.SubGroup](https://github.com/ghybs/Leaflet.FeatureGroup.SubGroup)** - Enhanced layer grouping

#### Heatmaps
- **[Leaflet.heat](https://github.com/Leaflet/Leaflet.heat)** - Heatmap layer implementation
- **[leaflet-heatmap](https://github.com/pa7/heatmap.js)** - Alternative heatmap with more features

```javascript
// Heatmap example
npm install leaflet.heat
import 'leaflet.heat';

const heatData = [
  [50.5, 30.5, 0.2], // lat, lng, intensity
  [50.6, 30.4, 0.5]
];

L.heatLayer(heatData, {
  radius: 20,
  blur: 15,
  maxZoom: 17
}).addTo(map);
```

### Map Interaction

#### Drawing & Editing
- **[Leaflet.draw](https://github.com/Leaflet/Leaflet.draw)** - Drawing and editing geometries
- **[Leaflet-Geoman](https://github.com/geoman-io/leaflet-geoman)** - Advanced drawing and editing (2.3k+ stars)
- **[Leaflet.Editable](https://github.com/Leaflet/Leaflet.Editable)** - Make geometries editable
- **[Leaflet.Snap](https://github.com/makinacorpus/Leaflet.Snap)** - Snap to layers while drawing

```javascript
// Leaflet-Geoman example
npm install @geoman-io/leaflet-geoman-free
import '@geoman-io/leaflet-geoman-free';

map.pm.addControls({
  position: 'topleft',
  drawCircle: true,
  drawMarker: true,
  drawPolygon: true
});
```

#### Controls & UI
- **[Leaflet.fullscreen](https://github.com/brunob/leaflet.fullscreen)** - Fullscreen control
- **[Leaflet.zoomhome](https://github.com/torfsen/leaflet.zoomhome)** - Zoom to home control
- **[L.EasyButton](https://github.com/CliffCloud/Leaflet.EasyButton)** - Easy custom buttons
- **[Leaflet.MiniMap](https://github.com/Norkart/Leaflet-MiniMap)** - Overview minimap
- **[Leaflet-sidebar-v2](https://github.com/nickpeihl/leaflet-sidebar-v2)** - Responsive sidebar

```javascript
// EasyButton example
npm install leaflet-easybutton
import 'leaflet-easybutton';

L.easyButton('fa-home', function(btn, map) {
  map.setView([50.5, 30.5], 10);
}).addTo(map);
```

#### Search & Geocoding
- **[leaflet-search](https://github.com/stefanocudini/leaflet-search)** - Search features in layers
- **[Leaflet.Geocoder.Nominatim](https://github.com/perliedman/leaflet-control-geocoder)** - Geocoding control
- **[leaflet-fusesearch](https://github.com/naomap/leaflet-fusesearch)** - Fuzzy search with Fuse.js

#### Measurement & Tools
- **[leaflet-measure](https://github.com/ljagis/leaflet-measure)** - Measurement control
- **[Leaflet.Coordinates](https://github.com/MrMufflon/Leaflet.Coordinates)** - Display coordinates
- **[Leaflet.MousePosition](https://github.com/ardhi/Leaflet.MousePosition)** - Mouse position display

### Data Visualization

#### Advanced Overlays
- **[leaflet-choropleth](https://github.com/timwis/leaflet-choropleth)** - Choropleth layer
- **[Leaflet.TimeDimension](https://github.com/socib/Leaflet.TimeDimension)** - Time-enabled layers
- **[leaflet-elevation](https://github.com/Raruto/leaflet-elevation)** - Elevation profiles with D3.js
- **[Leaflet-semicircle](https://github.com/jieter/Leaflet-semicircle)** - Semicircle markers for direction

#### File Handling
- **[leaflet-gpx](https://github.com/mpetazzoni/leaflet-gpx)** - GPX track display
- **[Leaflet.FileLayer](https://github.com/makinacorpus/Leaflet.FileLayer)** - Load local files (GeoJSON, KML, GPX)
- **[leaflet-kml](https://github.com/windycom/leaflet-kml)** - KML layer support

### Framework Integration

#### React
- **[react-leaflet](https://github.com/PaulLeCam/react-leaflet)** - React components (5k+ stars)
- **[react-leaflet-markercluster](https://github.com/yuzhva/react-leaflet-markercluster)** - Clustering for React

#### Vue
- **[vue2-leaflet](https://github.com/KoRiGaN/Vue2Leaflet)** - Vue 2 integration
- **[vue-leaflet](https://github.com/vue-leaflet/vue-leaflet)** - Vue 3 integration

#### Angular
- **[@asymmetrik/ngx-leaflet](https://github.com/Asymmetrik/ngx-leaflet)** - Angular integration

### Mobile & Touch
- **[Leaflet.GestureHandling](https://github.com/Raruto/leaflet-gesture-handling)** - Improve mobile UX
- **[Leaflet.TouchHover](https://github.com/nbumbarger/leaflet.touchhover)** - Touch hover events

### Styling & Theming
- **[Leaflet.Control.Opacity](https://github.com/dayjournal/Leaflet.Control.Opacity)** - Control layer opacity
- **[leaflet-color-markers](https://github.com/pointhi/leaflet-color-markers)** - Colored default markers

### Installation Examples

Most plugins can be installed via npm:

```bash
# Essential plugins
npm install leaflet.markercluster
npm install leaflet-providers
npm install @geoman-io/leaflet-geoman-free
npm install leaflet.heat
npm install leaflet-gesture-handling

# Framework-specific
npm install react-leaflet  # React
npm install vue2-leaflet   # Vue 2
npm install @asymmetrik/ngx-leaflet  # Angular
```

### Plugin Ecosystem Statistics (2024)

According to research, the Leaflet plugin ecosystem includes:

- **551+ plugins** in the official database
- **Top 3 categories by count**: Map interaction (138), Overlay display (133), Tile layers (84)
- **Top 3 categories by popularity**: Overlay display (21k+ stars), Tile layers (13k+ stars), Map interaction (11k+ stars)
- **14 plugins** with 1000+ GitHub stars

### Popular Plugin Combinations

For comprehensive mapping applications, consider these plugin combinations:

#### Basic Setup
```javascript
// Core plugins for most applications
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';

import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-gesture-handling';
import 'leaflet-providers';
```

#### Advanced Setup
```javascript
// Advanced mapping with drawing and analysis
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet.heat';
import 'leaflet-draw';
import '@geoman-io/leaflet-geoman-free';
import 'leaflet-search';
```

## Design & Layout Configuration

Leaflet offers extensive customization options for styling, theming, and layout configuration. This section covers all aspects of visual customization.

### CSS Styling & Theming

#### Basic Map Styling

```css
/* Map container styling */
.leaflet-container {
  background: #f0f0f0;
  outline: none;
  font: 12px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif;
}

/* Custom map size and border */
#map {
  height: 600px;
  width: 100%;
  border: 2px solid #333;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
```

#### Dark Mode Implementation

Several approaches for implementing dark mode:

**Method 1: CSS Filters (Automatic)**
```css
/* Automatic dark mode based on system preference */
:root {
  --leaflet-tile-filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
}

@media (prefers-color-scheme: dark) {
  .leaflet-tile {
    filter: var(--leaflet-tile-filter, none);
  }
  
  .leaflet-container {
    background: #303030;
  }
  
  .leaflet-control-layers,
  .leaflet-control-zoom-in,
  .leaflet-control-zoom-out,
  .leaflet-control-attribution {
    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
  }
}
```

**Method 2: Manual Dark Mode Toggle**
```css
/* Dark theme classes */
.dark-theme .leaflet-layer,
.dark-theme .leaflet-control-zoom-in,
.dark-theme .leaflet-control-zoom-out,
.dark-theme .leaflet-control-attribution {
  filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
}

.dark-theme .leaflet-container {
  background: #1a1a1a;
}

.dark-theme .leaflet-popup-content-wrapper,
.dark-theme .leaflet-popup-tip {
  background: #333;
  color: #fff;
}
```

**Method 3: Dark Tile Layers**
```javascript
// Use dedicated dark tile layers
const darkLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  attribution: '© CartoDB'
});

const lightLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
});

// Theme switching
function toggleTheme() {
  const isDark = map.hasLayer(darkLayer);
  if (isDark) {
    map.removeLayer(darkLayer);
    map.addLayer(lightLayer);
  } else {
    map.removeLayer(lightLayer);
    map.addLayer(darkLayer);
  }
}
```

### Control Positioning & Styling

#### Control Positions

Leaflet provides four corner positions for controls:

```javascript
// Available positions: 'topleft', 'topright', 'bottomleft', 'bottomright'
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.control.scale({ position: 'bottomleft' }).addTo(map);
L.control.attribution({ position: 'bottomright' }).addTo(map);
```

#### Custom Control Positioning

```css
/* Offset controls from corners */
.leaflet-top {
  top: 20px;
}

.leaflet-left {
  left: 20px;
}

.leaflet-bottom {
  bottom: 20px;
}

.leaflet-right {
  right: 20px;
}

/* Custom control positioning */
.leaflet-control-custom {
  position: absolute;
  top: 50px;
  right: 10px;
  z-index: 1000;
}
```

#### Custom Zoom Control Styling

```css
/* Modern zoom control */
.leaflet-control-zoom {
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.leaflet-control-zoom-in,
.leaflet-control-zoom-out {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.leaflet-control-zoom-in:hover,
.leaflet-control-zoom-out:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

/* Custom zoom icons */
.leaflet-control-zoom-in::before {
  content: '🔍+';
}

.leaflet-control-zoom-out::before {
  content: '🔍-';
}
```

### Layer Control Styling

```css
/* Modern layers control */
.leaflet-control-layers {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border: none;
  min-width: 200px;
}

.leaflet-control-layers-expanded {
  padding: 15px;
}

.leaflet-control-layers-separator {
  height: 1px;
  background: #ddd;
  margin: 10px 0;
}

/* Custom checkboxes and radio buttons */
.leaflet-control-layers input[type="checkbox"],
.leaflet-control-layers input[type="radio"] {
  margin-right: 8px;
  transform: scale(1.2);
}
```

### Popup & Tooltip Styling

#### Custom Popup Styles

```css
/* Modern popup design */
.leaflet-popup-content-wrapper {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  padding: 0;
  border: none;
}

.leaflet-popup-content {
  margin: 15px;
  font-size: 14px;
  line-height: 1.5;
}

.leaflet-popup-tip {
  background: #fff;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Popup with image header */
.popup-with-image .leaflet-popup-content {
  margin: 0;
}

.popup-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

.popup-body {
  padding: 15px;
}
```

#### Dynamic Popup Styling

```javascript
// Style popups based on data
function createStyledPopup(feature) {
  const type = feature.properties.type;
  const colors = {
    restaurant: '#e74c3c',
    hotel: '#3498db',
    attraction: '#f39c12'
  };
  
  const popupContent = `
    <div class="custom-popup" style="border-left: 4px solid ${colors[type]}">
      <h3>${feature.properties.name}</h3>
      <p>${feature.properties.description}</p>
    </div>
  `;
  
  return L.popup({
    maxWidth: 300,
    className: `popup-${type}`
  }).setContent(popupContent);
}
```

### Marker Styling & Icons

#### Custom Marker Icons

```javascript
// Font Awesome icons
const restaurantIcon = L.divIcon({
  html: '<i class="fas fa-utensils"></i>',
  className: 'custom-marker restaurant-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// SVG icons
const svgIcon = L.divIcon({
  html: `
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path fill="#e74c3c" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle fill="#fff" cx="12" cy="9" r="2.5"/>
    </svg>
  `,
  className: 'svg-marker',
  iconSize: [24, 32],
  iconAnchor: [12, 32]
});
```

#### Marker Clustering Styles

```css
/* Custom cluster styles */
.marker-cluster {
  background: linear-gradient(45deg, #3498db, #2980b9);
  border: 3px solid #fff;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  text-align: center;
  font-size: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.marker-cluster div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Different sizes */
.marker-cluster-small {
  background: #51cf66;
  width: 40px;
  height: 40px;
}

.marker-cluster-medium {
  background: #ffd43b;
  width: 50px;
  height: 50px;
}

.marker-cluster-large {
  background: #ff6b6b;
  width: 60px;
  height: 60px;
}
```

### Map Panes & Layer Ordering

Custom panes allow control over layer z-index ordering:

```javascript
// Create custom panes
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';

map.createPane('roads');
map.getPane('roads').style.zIndex = 400;

// Use panes in layers
const labelsLayer = L.tileLayer(labelsUrl, {
  pane: 'labels'
});

const roadsLayer = L.tileLayer(roadsUrl, {
  pane: 'roads'
});
```

### Responsive Design

#### Mobile-First Approach

```css
/* Mobile-first responsive design */
.leaflet-container {
  height: 300px;
}

/* Tablet */
@media (min-width: 768px) {
  .leaflet-container {
    height: 400px;
  }
  
  .leaflet-control-layers {
    max-width: 250px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .leaflet-container {
    height: 600px;
  }
}
```

#### Touch-Friendly Controls

```css
/* Larger touch targets for mobile */
.leaflet-touch .leaflet-control-layers-toggle {
  width: 44px;
  height: 44px;
}

.leaflet-touch .leaflet-control-zoom-in,
.leaflet-touch .leaflet-control-zoom-out {
  width: 44px;
  height: 44px;
  font-size: 20px;
}
```

### Animation & Transitions

```css
/* Smooth transitions */
.leaflet-zoom-anim .leaflet-zoom-animated {
  transition: transform 0.25s cubic-bezier(0,0,0.25,1);
}

.leaflet-fade-anim .leaflet-tile {
  transition: opacity 0.2s ease;
}

/* Custom marker animations */
.marker-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.marker-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 82, 82, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); }
}
```

### Theme Configuration Examples

#### Complete Theme System

```javascript
class MapThemeManager {
  constructor(map) {
    this.map = map;
    this.currentTheme = 'light';
    this.themes = {
      light: {
        tiles: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap',
        className: 'light-theme'
      },
      dark: {
        tiles: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        attribution: '© CartoDB',
        className: 'dark-theme'
      },
      satellite: {
        tiles: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '© Esri',
        className: 'satellite-theme'
      }
    };
    
    this.currentLayer = null;
    this.initTheme();
  }
  
  initTheme() {
    this.setTheme(this.currentTheme);
  }
  
  setTheme(themeName) {
    if (this.currentLayer) {
      this.map.removeLayer(this.currentLayer);
    }
    
    const theme = this.themes[themeName];
    this.currentLayer = L.tileLayer(theme.tiles, {
      attribution: theme.attribution,
      className: theme.className
    }).addTo(this.map);
    
    // Update body class for CSS theming
    document.body.className = document.body.className
      .replace(/\b\w+-theme\b/g, '')
      .trim() + ` ${theme.className}`;
    
    this.currentTheme = themeName;
  }
  
  getAvailableThemes() {
    return Object.keys(this.themes);
  }
}

// Usage
const themeManager = new MapThemeManager(map);

// Add theme switcher control
const themeSwitcher = L.control({ position: 'topright' });
themeSwitcher.onAdd = function() {
  const div = L.DomUtil.create('div', 'leaflet-control-theme');
  const select = L.DomUtil.create('select', '', div);
  
  themeManager.getAvailableThemes().forEach(theme => {
    const option = L.DomUtil.create('option', '', select);
    option.value = theme;
    option.text = theme.charAt(0).toUpperCase() + theme.slice(1);
  });
  
  select.addEventListener('change', (e) => {
    themeManager.setTheme(e.target.value);
  });
  
  return div;
};

themeSwitcher.addTo(map);
```

This comprehensive design and layout configuration section provides everything needed to create beautiful, responsive, and highly customized Leaflet maps with modern styling approaches.

## Clustering Solutions

### 1. Leaflet.markercluster (Most Popular)

```javascript
const markers = L.markerClusterGroup({
  // Basic options
  showCoverageOnHover: true,      // Show cluster bounds on hover
  zoomToBoundsOnClick: true,      // Zoom to cluster bounds on click
  spiderfyOnMaxZoom: true,        // Spiderfy markers at max zoom
  removeOutsideVisibleBounds: true, // Remove markers outside viewport
  
  // Performance options
  maxClusterRadius: 80,           // Cluster radius in pixels
  disableClusteringAtZoom: 15,    // Disable clustering at zoom level
  
  // Styling options
  iconCreateFunction: function(cluster) {
    const count = cluster.getChildCount();
    let className = 'marker-cluster-';
    
    if (count < 10) className += 'small';
    else if (count < 100) className += 'medium';
    else className += 'large';
    
    return new L.DivIcon({
      html: `<div><span>${count}</span></div>`,
      className: className,
      iconSize: new L.Point(40, 40)
    });
  }
});

// Add markers to cluster group
markers.addLayers(markerArray);
map.addLayer(markers);
```

### 2. Supercluster (High Performance)

Supercluster is a very fast geospatial point clustering library that can be integrated with Leaflet for handling millions of points.

```javascript
// Installation
npm install supercluster

// Usage
import Supercluster from 'supercluster';

const index = new Supercluster({
  radius: 40,        // Cluster radius in pixels
  maxZoom: 16,       // Maximum zoom level to cluster
  minZoom: 0,        // Minimum zoom level
  minPoints: 2,      // Minimum points to form cluster
  extent: 512,       // Tile extent
  nodeSize: 64       // Size of KD-tree leaf node
});

// Load points (GeoJSON features)
index.load(points);

// Get clusters for current map bounds and zoom
function updateClusters() {
  const bounds = map.getBounds();
  const zoom = map.getZoom();
  
  const clusters = index.getClusters([
    bounds.getWest(),
    bounds.getSouth(),
    bounds.getEast(),
    bounds.getNorth()
  ], zoom);
  
  // Render clusters on map
  clusters.forEach(cluster => {
    if (cluster.properties.cluster) {
      // Render cluster marker
      const marker = L.marker([
        cluster.geometry.coordinates[1],
        cluster.geometry.coordinates[0]
      ], {
        icon: createClusterIcon(cluster.properties.point_count)
      });
      marker.addTo(map);
    } else {
      // Render individual point
      const marker = L.marker([
        cluster.geometry.coordinates[1],
        cluster.geometry.coordinates[0]
      ]);
      marker.addTo(map);
    }
  });
}
```

### 3. use-supercluster (React Hook)

For React applications, use-supercluster provides a convenient hook:

```javascript
// Installation
npm install use-supercluster supercluster

// Usage in React component
import useSupercluster from 'use-supercluster';

function MapComponent({ points }) {
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);
  
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });
  
  return (
    <div>
      {clusters.map(point => {
        const [longitude, latitude] = point.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } = point.properties;
        
        if (isCluster) {
          return (
            <ClusterMarker
              key={`cluster-${point.id}`}
              latitude={latitude}
              longitude={longitude}
              pointCount={pointCount}
              onClick={() => {
                const expansionZoom = Math.min(
                  supercluster.getClusterExpansionZoom(point.id),
                  maxZoom
                );
                // Zoom to expansion zoom level
              }}
            />
          );
        }
        
        return (
          <PointMarker
            key={`point-${point.properties.id}`}
            latitude={latitude}
            longitude={longitude}
          />
        );
      })}
    </div>
  );
}
```

### Clustering Performance Comparison

| Library | Performance | Features | Use Case |
|---------|------------|----------|----------|
| Leaflet.markercluster | Good (< 10K points) | Rich UI, animations | Standard web apps |
| Supercluster | Excellent (millions) | Fast, minimal | High-performance apps |
| Canvas-based clustering | Very Good | Custom rendering | Large datasets, mobile |

## Performance Optimization

### 1. Marker Performance

#### Problem: Too Many DOM Elements
Each Leaflet marker creates a DOM element, which becomes expensive with many markers.

**Solutions:**

1. **Use Canvas Renderer**:
```javascript
const map = L.map('mapId', {
  preferCanvas: true,
  renderer: L.canvas({ padding: 0.5 })
});
```

2. **Marker Clustering**:
```javascript
const markers = L.markerClusterGroup();
// Add thousands of markers without performance issues
```

3. **Viewport Culling**:
```javascript
// Only add markers visible in current viewport
function addVisibleMarkers() {
  const bounds = map.getBounds();
  const visibleMarkers = allMarkers.filter(marker => 
    bounds.contains(marker.getLatLng())
  );
  
  // Clear existing markers
  markersLayer.clearLayers();
  
  // Add only visible markers
  visibleMarkers.forEach(marker => markersLayer.addLayer(marker));
}

map.on('moveend', addVisibleMarkers);
```

4. **Use DivIcon for Simple Icons**:
```javascript
const simpleIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div class="marker-pin"></div>',
  iconSize: [20, 20]
});
// Lighter than image-based icons
```

### 2. Large Dataset Optimization

#### Techniques:

1. **Data Pagination/Chunking**:
```javascript
// Load data in chunks based on zoom/bounds
async function loadDataChunk(bounds, zoom) {
  const response = await fetch(`/api/markers?bounds=${bounds}&zoom=${zoom}`);
  return response.json();
}

map.on('moveend zoomend', async () => {
  const bounds = map.getBounds();
  const zoom = map.getZoom();
  const data = await loadDataChunk(bounds, zoom);
  updateMarkers(data);
});
```

2. **Level-of-Detail (LOD)**:
```javascript
// Show different detail levels based on zoom
function getMarkersByZoom(zoom) {
  if (zoom < 10) return majorMarkers;      // Cities only
  if (zoom < 15) return mediumMarkers;     // Cities + towns
  return allMarkers;                       // All locations
}
```

3. **Debounced Updates**:
```javascript
const debouncedUpdate = debounce(() => {
  updateMarkers();
}, 300);

map.on('moveend', debouncedUpdate);
```

### 3. Memory Management

#### Prevent Memory Leaks:

1. **Remove Event Listeners**:
```javascript
// When removing layers or destroying map
marker.off();                    // Remove all event listeners
map.off();                      // Remove map event listeners
map.remove();                   // Destroy map instance
```

2. **Clear Layer Groups**:
```javascript
layerGroup.clearLayers();       // Remove all layers from group
markerClusterGroup.clearLayers(); // Clear cluster group
```

3. **Dispose of Resources**:
```javascript
// When component unmounts (React example)
useEffect(() => {
  return () => {
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }
  };
}, []);
```

### 4. Tile Loading Optimization

```javascript
const tileLayer = L.tileLayer(tileUrl, {
  maxZoom: 18,
  tileSize: 512,           // Larger tiles = fewer requests
  zoomOffset: -1,
  updateWhenIdle: true,    // Only update tiles when map is idle
  updateWhenZooming: false, // Don't update during zoom animation
  keepBuffer: 2            // Keep tiles in buffer for smooth panning
});
```

## Event Handling Best Practices

### 1. Efficient Event Binding

```javascript
// Use event delegation for multiple markers
const markerGroup = L.featureGroup().addTo(map);

markerGroup.on('click', function(e) {
  const marker = e.layer;
  // Handle click for any marker in the group
  console.log('Marker clicked:', marker.options.id);
});

// Add markers to group instead of individual event binding
markers.forEach(marker => markerGroup.addLayer(marker));
```

### 2. Throttle/Debounce Heavy Operations

```javascript
// Throttle map move events
const throttledMoveHandler = throttle((e) => {
  updateVisibleMarkers();
}, 100);

map.on('move', throttledMoveHandler);

// Debounce zoom end events
const debouncedZoomHandler = debounce((e) => {
  loadNewData();
}, 300);

map.on('zoomend', debouncedZoomHandler);

// Helper functions
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
```

### 3. Custom Event Handling

```javascript
// Create custom events
map.fire('customEvent', { data: customData });

// Listen for custom events
map.on('customEvent', function(e) {
  console.log('Custom event fired:', e.data);
});

// Event delegation pattern for dynamic content
function setupEventDelegation(map) {
  map.on('click', function(e) {
    if (e.layer && e.layer.options && e.layer.options.type === 'marker') {
      handleMarkerClick(e.layer);
    }
  });
}
```

## Memory Management

### 1. Proper Cleanup

```javascript
class LeafletMapManager {
  constructor(containerId) {
    this.map = L.map(containerId);
    this.layers = [];
    this.eventListeners = [];
  }
  
  addLayer(layer) {
    this.layers.push(layer);
    layer.addTo(this.map);
  }
  
  addEventListener(event, handler) {
    this.map.on(event, handler);
    this.eventListeners.push({ event, handler });
  }
  
  destroy() {
    // Remove all event listeners
    this.eventListeners.forEach(({ event, handler }) => {
      this.map.off(event, handler);
    });
    
    // Remove all layers
    this.layers.forEach(layer => {
      if (layer.clearLayers) layer.clearLayers();
      this.map.removeLayer(layer);
    });
    
    // Clear arrays
    this.layers = [];
    this.eventListeners = [];
    
    // Destroy map
    this.map.remove();
    this.map = null;
  }
}
```

### 2. Layer Management

```javascript
// Use LayerGroup for batch operations
const markersGroup = L.layerGroup();

// Add markers to group
markers.forEach(marker => markersGroup.addLayer(marker));

// Add entire group to map
markersGroup.addTo(map);

// Remove all markers at once
markersGroup.clearLayers();

// Or remove from map
map.removeLayer(markersGroup);
```

### 3. Monitoring Memory Usage

```javascript
// Monitor memory usage (development only)
function logMemoryUsage() {
  if (window.performance && window.performance.memory) {
    const memory = window.performance.memory;
    console.log({
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
    });
  }
}

// Call periodically during development
setInterval(logMemoryUsage, 5000);
```

## Integration with Modern Frameworks

### React Integration (Without React-Leaflet)

For better performance, integrate Leaflet directly instead of using React-Leaflet:

```javascript
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

function LeafletMap({ center, zoom, markers }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayerRef = useRef(null);
  
  // Initialize map
  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: center,
        zoom: zoom,
        preferCanvas: true
      });
      
      // Add tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
      
      // Create markers layer
      markersLayerRef.current = L.layerGroup().addTo(mapInstance.current);
    }
    
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);
  
  // Update markers when data changes
  useEffect(() => {
    if (markersLayerRef.current && markers) {
      markersLayerRef.current.clearLayers();
      
      markers.forEach(markerData => {
        const marker = L.marker([markerData.lat, markerData.lng]);
        markersLayerRef.current.addLayer(marker);
      });
    }
  }, [markers]);
  
  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
}
```

### Vue Integration

```javascript
// Vue 3 Composition API
import { onMounted, onUnmounted, ref, watch } from 'vue';
import L from 'leaflet';

export default {
  setup(props) {
    const mapContainer = ref(null);
    let map = null;
    let markersLayer = null;
    
    onMounted(() => {
      map = L.map(mapContainer.value, {
        center: props.center,
        zoom: props.zoom
      });
      
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      markersLayer = L.layerGroup().addTo(map);
    });
    
    onUnmounted(() => {
      if (map) {
        map.remove();
        map = null;
      }
    });
    
    watch(() => props.markers, (newMarkers) => {
      if (markersLayer) {
        markersLayer.clearLayers();
        newMarkers.forEach(markerData => {
          L.marker([markerData.lat, markerData.lng]).addTo(markersLayer);
        });
      }
    });
    
    return { mapContainer };
  }
};
```

## Best Practices & Patterns

### 1. Configuration Management

```javascript
// Centralized map configuration
const mapConfig = {
  defaultView: {
    center: [51.505, -0.09],
    zoom: 13
  },
  tileLayer: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }
  },
  controls: {
    zoom: { position: 'topleft' },
    scale: { position: 'bottomleft' },
    attribution: { position: 'bottomright' }
  },
  performance: {
    preferCanvas: true,
    updateWhenIdle: true,
    keepBuffer: 2
  }
};

function createMap(containerId, customConfig = {}) {
  const config = { ...mapConfig, ...customConfig };
  
  const map = L.map(containerId, {
    ...config.defaultView,
    ...config.performance,
    zoomControl: false
  });
  
  L.tileLayer(config.tileLayer.url, config.tileLayer.options).addTo(map);
  
  // Add controls
  if (config.controls.zoom) {
    L.control.zoom(config.controls.zoom).addTo(map);
  }
  
  return map;
}
```

### 2. Layer Factory Pattern

```javascript
class LayerFactory {
  static createMarkerLayer(data, options = {}) {
    const markers = data.map(item => 
      L.marker([item.lat, item.lng], {
        icon: this.createIcon(item.type),
        ...options
      }).bindPopup(item.name)
    );
    
    return L.layerGroup(markers);
  }
  
  static createClusterLayer(data, options = {}) {
    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      ...options
    });
    
    data.forEach(item => {
      const marker = L.marker([item.lat, item.lng])
        .bindPopup(item.name);
      clusterGroup.addLayer(marker);
    });
    
    return clusterGroup;
  }
  
  static createIcon(type) {
    const iconConfig = {
      restaurant: { color: 'red', icon: 'restaurant' },
      hotel: { color: 'blue', icon: 'hotel' },
      default: { color: 'gray', icon: 'location_on' }
    };
    
    const config = iconConfig[type] || iconConfig.default;
    
    return L.divIcon({
      className: `custom-marker ${config.color}`,
      html: `<i class="material-icons">${config.icon}</i>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });
  }
}
```

### 3. Service Layer Pattern

```javascript
class MapService {
  constructor() {
    this.map = null;
    this.layers = new Map();
    this.eventHandlers = new Map();
  }
  
  initialize(containerId, options = {}) {
    this.map = createMap(containerId, options);
    return this;
  }
  
  addLayer(name, layer) {
    if (this.layers.has(name)) {
      this.removeLayer(name);
    }
    
    this.layers.set(name, layer);
    layer.addTo(this.map);
    return this;
  }
  
  removeLayer(name) {
    const layer = this.layers.get(name);
    if (layer) {
      this.map.removeLayer(layer);
      this.layers.delete(name);
    }
    return this;
  }
  
  on(event, handler, context = null) {
    const boundHandler = context ? handler.bind(context) : handler;
    this.map.on(event, boundHandler);
    
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push({ original: handler, bound: boundHandler });
    
    return this;
  }
  
  off(event, handler = null) {
    if (!handler) {
      this.map.off(event);
      this.eventHandlers.delete(event);
    } else {
      const handlers = this.eventHandlers.get(event) || [];
      const handlerInfo = handlers.find(h => h.original === handler);
      if (handlerInfo) {
        this.map.off(event, handlerInfo.bound);
        const index = handlers.indexOf(handlerInfo);
        handlers.splice(index, 1);
      }
    }
    return this;
  }
  
  destroy() {
    // Remove all event handlers
    for (const [event, handlers] of this.eventHandlers) {
      this.map.off(event);
    }
    this.eventHandlers.clear();
    
    // Remove all layers
    for (const [name, layer] of this.layers) {
      if (layer.clearLayers) layer.clearLayers();
      this.map.removeLayer(layer);
    }
    this.layers.clear();
    
    // Destroy map
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

// Usage
const mapService = new MapService()
  .initialize('mapId')
  .addLayer('markers', LayerFactory.createMarkerLayer(data))
  .on('click', handleMapClick)
  .on('zoomend', handleZoomChange);
```

## Troubleshooting & Common Issues

### 1. Icon Loading Issues

```javascript
// Fix default marker icons in webpack environments
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
```

### 2. Container Size Issues

```javascript
// Ensure container has explicit dimensions before initializing map
const container = document.getElementById('mapId');
if (container.offsetHeight === 0) {
  container.style.height = '400px';
}

const map = L.map('mapId');

// Call invalidateSize() if container size changes after initialization
window.addEventListener('resize', () => {
  map.invalidateSize();
});
```

### 3. Tile Loading Problems

```javascript
// Handle tile loading errors
const tileLayer = L.tileLayer(url, options);

tileLayer.on('tileerror', function(e) {
  console.warn('Tile loading error:', e);
  // Fallback to different tile source or show error message
});

// Retry failed tiles
tileLayer.on('tileerror', function(e) {
  const tile = e.tile;
  const url = e.target._url;
  
  setTimeout(() => {
    tile.src = url; // Retry loading
  }, 1000);
});
```

### 4. Performance Debugging

```javascript
// Monitor map performance
function debugMapPerformance(map) {
  let lastUpdate = performance.now();
  
  map.on('movestart zoomstart', () => {
    lastUpdate = performance.now();
  });
  
  map.on('moveend zoomend', () => {
    const duration = performance.now() - lastUpdate;
    console.log(`Map update took ${duration.toFixed(2)}ms`);
    
    if (duration > 100) {
      console.warn('Slow map performance detected!');
    }
  });
  
  // Monitor layer count
  const originalAddLayer = map.addLayer;
  map.addLayer = function(layer) {
    console.log('Layers on map:', Object.keys(this._layers).length);
    return originalAddLayer.call(this, layer);
  };
}
```

### 5. Mobile Optimization Issues

```javascript
// Mobile-specific optimizations
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const mobileOptions = {
  tap: true,
  tapTolerance: 15,
  touchZoom: true,
  bounceAtZoomLimits: false,
  maxBoundsViscosity: 0.3
};

const map = L.map('mapId', {
  ...(isMobile ? mobileOptions : {}),
  // Disable animations on slower devices
  zoomAnimation: !isMobile || window.devicePixelRatio < 2,
  fadeAnimation: !isMobile
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    map.invalidateSize();
  }, 100);
});
```

---

## Summary

This comprehensive guide covers all aspects of Leaflet.js development, from basic concepts to advanced optimization techniques. Key takeaways:

1. **Choose the right clustering solution** based on your data size and performance requirements
2. **Optimize performance** through proper layer management, event handling, and memory cleanup
3. **Use appropriate plugins** to extend functionality without reinventing the wheel
4. **Follow best practices** for integration with modern frameworks
5. **Monitor and debug** performance issues proactively

For Copenhagen recommendations project specifically, consider:
- Using Supercluster for high-performance marker clustering
- Implementing viewport-based data loading
- Optimizing for mobile devices with gesture handling
- Using canvas renderer for better performance with many markers

This documentation should serve as a comprehensive reference for all future Leaflet.js development needs.
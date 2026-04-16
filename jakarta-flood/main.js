// ============================================
// PMTILES PROTOCOL REGISTRATION
// ============================================

const protocol = new pmtiles.Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

// Respect reduced motion preference for map animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// COLOR PALETTES (colorblind-safe)
// ============================================

// YlOrRd ramp for flood risk (dm_risk) — sequential, low-to-high
const RISK_STOPS = [
    [0,   '#ffffcc'],
    [0.2, '#ffeda0'],
    [0.4, '#feb24c'],
    [0.6, '#f03b20'],
    [0.8, '#bd0026'],
];

// Binary colors for AI prediction gap
const COLOR_HAS_PREDICTION = '#2166ac';  // blue
const COLOR_NO_PREDICTION = '#d6604d';   // muted red

// Ethnographic accent
const COLOR_ETHNO_ACCENT = '#f5c542';    // bright gold (high contrast on satellite)

// AI-predicted building typology palettes (colorblind-safe)
// Construction material (Set2, 8 categories)
const CONSTRUCTION_COLORS = {
    1: '#66c2a5', 2: '#fc8d62', 3: '#e78ac3', 4: '#8da0cb',
    5: '#a6d854', 6: '#ffd92f', 7: '#b3b3b3', 8: '#e5c494',
};
const CONSTRUCTION_LABELS = {
    1: 'Wood', 2: 'Stone', 3: 'Brick', 4: 'Steel',
    5: 'Reinforced Concrete', 6: 'Other Metal', 7: 'Other Natural', 8: 'Other Man-Made',
};

// Current use (Paired, 12 categories)
const CURRENTUSE_COLORS = {
    1: '#a6cee3', 2: '#1f78b4', 3: '#b2df8a', 4: '#33a02c',
    5: '#fb9a99', 6: '#e31a1c', 7: '#fdbf6f', 8: '#ff7f00',
    9: '#cab2d6', 10: '#6a3d9a', 11: '#ffff99', 12: '#b15928',
};
const CURRENTUSE_LABELS = {
    1: 'Mixed-use', 2: 'Residential', 3: 'Retail', 4: 'Industry & Businesses',
    5: 'Community Services', 6: 'Recreation & Leisure', 7: 'Transport',
    8: 'Utilities & Infrastructure', 9: 'Defence', 10: 'Agriculture',
    11: 'Vacant & Derelict', 12: 'Unclassified',
};

// Storeys (YlGnBu, 6 categories)
const STOREYS_COLORS = {
    1: '#ffffcc', 2: '#c7e9b4', 3: '#7fcdbb',
    4: '#41b6c4', 5: '#2c7fb8', 6: '#253494',
};
const STOREYS_LABELS = {
    1: '1 floor', 2: '2\u20133', 3: '4\u20137',
    4: '8\u201310', 5: '11\u201339', 6: '40+',
};

// ============================================
// STEP CONFIGURATION (10 scroll steps)
// ============================================

const STEP_CONFIG = {
    'sinking-city': {
        center: [106.845, -6.215],
        zoom: 11,
        mobileZoom: 9, // same city-scale view as both-ways; needs ~-2 levels on 50vh viewport
        pitch: 0,
        bearing: 0,
        layers: ['subsidence-layer', 'kelurahan-outline', 'kelurahan-labels'],
        legend: 'subsidence',
        duration: 2000,
    },
    'algorithm-risk': {
        center: [106.79, -6.12],
        zoom: 13,
        pitch: 40,
        bearing: -15,
        layers: ['buildings-risk', 'kelurahan-outline', 'kelurahan-labels'],
        legend: 'risk',
        duration: 2000,
    },
    'algorithm-gap': {
        center: [106.7476, -6.0986],
        zoom: 14,
        pitch: 30,
        bearing: 0,
        layers: ['buildings-construction', 'penjaringan-outline', 'penjaringan-label', 'study-area-outline', 'study-area-labels', 'kelurahan-outline', 'kelurahan-labels'],
        legend: 'construction',
        showTypologySelector: true,
        duration: 1800,
    },
    'the-gap': {
        center: [106.7267, -6.0936],
        zoom: 14.5,
        pitch: 0,
        bearing: 0,
        layers: ['satellite-layer', 'buildings-gap', 'penjaringan-outline', 'penjaringan-label', 'study-area-outline', 'study-area-labels', 'kelurahan-outline', 'kelurahan-labels'],
        gapOpacity: 0.5,
        legend: 'gap',
        duration: 1500,
    },
    'gap-explanation': {
        center: [106.7686, -6.1036],
        zoom: 14.5,
        pitch: 0,
        bearing: 0,
        layers: ['satellite-layer', 'buildings-gap', 'penjaringan-outline', 'penjaringan-label', 'study-area-outline', 'study-area-labels', 'kelurahan-outline', 'kelurahan-labels'],
        gapOpacity: 0.5,
        legend: 'gap',
        duration: 800,
    },
    'the-flip': {
        center: [106.769, -6.105],
        zoom: 16,
        pitch: 0,
        bearing: 0,
        layers: ['satellite-layer'],
        legend: null,
        showFlip: true,
        duration: 1200,
    },
    'kampung-joy': {
        center: [106.769, -6.105],
        zoom: 16.5,
        pitch: 0,
        bearing: 0,
        layers: ['quote-markers-glow', 'quote-markers', 'penjaringan-outline', 'penjaringan-label', 'study-area-outline', 'study-area-labels', 'satellite-layer'],
        legend: null,
        activeQuotes: ['Q1', 'Q2', 'Q3', 'Q4'],
        duration: 1500,
    },
    'kampung-care': {
        center: [106.748, -6.097],
        zoom: 14,
        mobileZoom: 12.5, // -1.5: 50vh viewport needs ~1.4 levels out to match desktop extent
        pitch: 0,
        bearing: 0,
        layers: ['quote-markers-glow', 'quote-markers', 'penjaringan-outline', 'penjaringan-label', 'study-area-outline', 'study-area-labels', 'satellite-layer'],
        legend: null,
        activeQuotes: ['Q5', 'Q6', 'Q7'],
        duration: 1500,
    },
    'kampung-exclusion': {
        center: [106.726, -6.089],
        zoom: 16.5,
        pitch: 0,
        bearing: 0,
        layers: ['quote-markers-glow', 'quote-markers', 'penjaringan-outline', 'penjaringan-label', 'study-area-outline', 'study-area-labels', 'satellite-layer'],
        legend: null,
        activeQuotes: ['Q8'],
        duration: 1500,
    },
    'both-ways': {
        center: [106.845, -6.215],
        zoom: 11,
        mobileZoom: 9, // -2: city scale needs ~2 levels out on 50vh to show all Jakarta unclipped
        pitch: 0,
        bearing: 0,
        layers: ['buildings-risk', 'quote-markers-glow', 'quote-markers', 'penjaringan-outline', 'penjaringan-label', 'kelurahan-outline', 'kelurahan-labels'],
        legend: 'risk',
        duration: 2500,
    },
};

// All layer IDs for toggling
const ALL_LAYERS = [
    'satellite-layer',
    'subsidence-layer',
    'buildings-risk',
    'buildings-gap',
    'buildings-construction',
    'buildings-currentuse',
    'buildings-storeys',
    'kelurahan-outline', 'kelurahan-labels',
    'penjaringan-outline', 'penjaringan-label',
    'study-area-outline',
    'study-area-labels',
    'quote-markers-glow',
    'quote-markers',
];

let baseStyleLayerIds = [];

// ============================================
// CHAPTER NAV
// ============================================

const PART_TO_SECTION = {
    '1': 'part-1',
    '2': 'part-2',
    '3': 'part-3',
    '4': 'part-4',
    '5': 'part-5',
    '6': 'part-6',
};

const SECTION_NAV_IDS = ['tech-stack', 'methods'];
const chapterNavLinks = Array.from(document.querySelectorAll('.chapter-nav-link'));

function setActiveChapter(targetId) {
    chapterNavLinks.forEach((link) => {
        const isActive = link.dataset.navTarget === targetId;
        link.classList.toggle('is-active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function getFixedUiOffset() {
    const styles = getComputedStyle(document.documentElement);
    const projectNavHeight = parseFloat(styles.getPropertyValue('--project-nav-height')) || 56;
    const chapterNavHeight = parseFloat(styles.getPropertyValue('--chapter-nav-height')) || 52;

    return projectNavHeight + chapterNavHeight + 12;
}

function initChapterNav() {
    if (!chapterNavLinks.length) return;

    const hashTarget = window.location.hash.replace('#', '');
    const validTargets = new Set([
        ...Object.values(PART_TO_SECTION),
        ...SECTION_NAV_IDS,
    ]);

    setActiveChapter(validTargets.has(hashTarget) ? hashTarget : 'part-1');

    chapterNavLinks.forEach((link) => {
        link.addEventListener('click', () => {
            setActiveChapter(link.dataset.navTarget);
        });
    });

    let sectionObserver;

    const mountSectionObserver = () => {
        if (sectionObserver) {
            sectionObserver.disconnect();
        }

        const sectionStates = new Map();
        sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                sectionStates.set(entry.target.id, entry);
            });

            const visibleSections = Array.from(sectionStates.values())
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

            if (visibleSections.length > 0) {
                setActiveChapter(visibleSections[0].target.id);
            }
        }, {
            rootMargin: `-${getFixedUiOffset()}px 0px -55% 0px`,
            threshold: [0.15, 0.35, 0.6],
        });

        SECTION_NAV_IDS.forEach((id) => {
            const sectionEl = document.getElementById(id);
            if (sectionEl) {
                sectionObserver.observe(sectionEl);
            }
        });
    };

    mountSectionObserver();
    window.addEventListener('resize', mountSectionObserver);
}

// ============================================
// LEGEND CONTENT TEMPLATES
// ============================================

const LEGENDS = {
    subsidence: `
        <button class="legend-toggle" aria-expanded="false">
            <span class="legend-title">Land Subsidence (2024 avg)</span>
            <span class="legend-chevron" aria-hidden="true"></span>
        </button>
        <div class="legend-body">
            <div class="legend-row"><span class="legend-swatch" style="background:rgba(97,26,102,0.95)"></span> &lt; -25 mm/yr (severe)</div>
            <div class="legend-row"><span class="legend-swatch" style="background:rgba(140,82,147,0.7)"></span> -15 to -25 mm/yr</div>
            <div class="legend-row"><span class="legend-swatch" style="background:rgba(189,153,199,0.5)"></span> -5 to -15 mm/yr</div>
            <div class="legend-row"><span class="legend-swatch" style="background:rgba(245,240,247,0.0);border:1px solid #ccc"></span> Near zero</div>
        </div>
    `,
    risk: `
        <button class="legend-toggle" aria-expanded="false">
            <span class="legend-title">Flood Risk Index</span>
            <span class="legend-chevron" aria-hidden="true"></span>
        </button>
        <div class="legend-body">
            <div class="legend-row"><span class="legend-swatch" style="background:#bd0026"></span> High</div>
            <div class="legend-row"><span class="legend-swatch" style="background:#f03b20"></span></div>
            <div class="legend-row"><span class="legend-swatch" style="background:#feb24c"></span> Moderate</div>
            <div class="legend-row"><span class="legend-swatch" style="background:#ffeda0"></span></div>
            <div class="legend-row"><span class="legend-swatch" style="background:#ffffcc"></span> Low</div>
        </div>
    `,
    gap: `
        <button class="legend-toggle" aria-expanded="false">
            <span class="legend-title">AI Building Predictions in Penjaringan</span>
            <span class="legend-chevron" aria-hidden="true"></span>
        </button>
        <div class="legend-body">
            <div class="legend-row"><span class="legend-swatch" style="background:${COLOR_HAS_PREDICTION}"></span> Has prediction</div>
            <div class="legend-row"><span class="legend-swatch" style="background:${COLOR_NO_PREDICTION}"></span> No prediction</div>
        </div>
    `,
};

// Build typology legend HTML from color/label maps
function buildTypologyLegend(title, colorMap, labelMap) {
    let html = `<button class="legend-toggle" aria-expanded="false">
        <span class="legend-title">${title}</span>
        <span class="legend-chevron" aria-hidden="true"></span>
    </button>
    <div class="legend-body">`;
    for (const [code, color] of Object.entries(colorMap)) {
        html += `<div class="legend-row"><span class="legend-swatch" style="background:${color}"></span> ${labelMap[code]}</div>`;
    }
    html += `</div>`;
    return html;
}

LEGENDS.construction = buildTypologyLegend('Construction Material', CONSTRUCTION_COLORS, CONSTRUCTION_LABELS);
LEGENDS.currentuse = buildTypologyLegend('Current Use', CURRENTUSE_COLORS, CURRENTUSE_LABELS);
LEGENDS.storeys = buildTypologyLegend('Storeys', STOREYS_COLORS, STOREYS_LABELS);

// Set legend to default expanded/collapsed state based on viewport
function resetLegendExpandState(legendEl) {
    if (window.innerWidth > 768) {
        legendEl.classList.add('is-expanded');
    } else {
        legendEl.classList.remove('is-expanded');
    }
    const toggle = legendEl.querySelector('.legend-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', String(window.innerWidth > 768));
}

initChapterNav();

// ============================================
// THEME SYSTEM
// ============================================

const BASEMAP_STYLES = {
    light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
};

// Theme-dependent colors for map layers
const THEME_COLORS = {
    light: {
        lineColor: '#1a1a1a',
        textColor: '#4a4a4a',
        haloColor: 'rgba(255, 255, 255, 0.85)',
        haloColorStrong: 'rgba(255, 255, 255, 0.9)',
        studyAreaText: '#1a1a1a',
        quoteStroke: '#1a1a1a',
    },
    dark: {
        lineColor: '#e8e6e3',
        textColor: '#c0c0c0',
        haloColor: 'rgba(18, 18, 18, 0.85)',
        haloColorStrong: 'rgba(18, 18, 18, 0.9)',
        studyAreaText: '#e8e6e3',
        quoteStroke: '#e8e6e3',
    },
};

const THEME_STORAGE_KEY = 'portfolio-theme';
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

function getStoredTheme() {
    return localStorage.getItem(THEME_STORAGE_KEY);
}

function getPreferredTheme() {
    return getStoredTheme() || (systemThemeQuery.matches ? 'dark' : 'light');
}

function syncThemeToggleLabel(theme) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

let currentTheme = getPreferredTheme();
let currentStepId = null;
let isStyleSwap = false;
let scrollamaInitialized = false;
const MOBILE_BREAKPOINT = 768;
const mapTouchLockState = {
    active: false,
    dragPanEnabled: false,
    touchZoomRotateEnabled: false,
};
const TYPOLOGY_LABELS = {
    construction: 'Material',
    currentuse: 'Use',
    storeys: 'Storeys',
};
const typologySelector = document.getElementById('typology-selector');
const typologySelectorToggle = document.getElementById('typology-selector-toggle');
const typologySelectorOptions = document.getElementById('typology-selector-options');
const typologySelectorCurrent = document.getElementById('typology-selector-current');

function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
}

function lockMapTouchGestures() {
    if (!isMobileViewport() || mapTouchLockState.active) return;

    mapTouchLockState.dragPanEnabled = map.dragPan.isEnabled();
    mapTouchLockState.touchZoomRotateEnabled = map.touchZoomRotate.isEnabled();

    if (mapTouchLockState.dragPanEnabled) {
        map.dragPan.disable();
    }

    if (mapTouchLockState.touchZoomRotateEnabled) {
        map.touchZoomRotate.disable();
    }

    mapTouchLockState.active = true;
}

function unlockMapTouchGestures() {
    if (!mapTouchLockState.active) return;

    if (mapTouchLockState.dragPanEnabled) {
        map.dragPan.enable();
    }

    if (mapTouchLockState.touchZoomRotateEnabled) {
        map.touchZoomRotate.enable();
    }

    mapTouchLockState.active = false;
    mapTouchLockState.dragPanEnabled = false;
    mapTouchLockState.touchZoomRotateEnabled = false;
}

function bindMapControlTouchLock(controlEl) {
    if (!controlEl) return;

    controlEl.addEventListener('touchstart', () => {
        lockMapTouchGestures();
    }, { passive: true });
}

function syncTypologySelectorLabel(selected) {
    if (!typologySelectorCurrent) return;
    typologySelectorCurrent.textContent = TYPOLOGY_LABELS[selected] || TYPOLOGY_LABELS.construction;
}

function setTypologySelectorExpanded(expanded) {
    if (!typologySelector || !typologySelectorToggle) return;

    const shouldExpand = expanded;
    typologySelector.classList.toggle('is-expanded', shouldExpand);
    typologySelectorToggle.setAttribute('aria-expanded', String(shouldExpand));

    if (typologySelectorOptions) {
        typologySelectorOptions.hidden = !shouldExpand;
    }
}

// Apply theme to the HTML root (for CSS vars)
document.documentElement.setAttribute('data-theme', currentTheme);
syncThemeToggleLabel(currentTheme);

// ============================================
// INITIALIZE THE MAP
// ============================================

const map = new maplibregl.Map({
    container: 'map',
    style: BASEMAP_STYLES[currentTheme],
    center: [106.845, -6.215],
    zoom: 11,
    pitch: 0,
    bearing: 0,
});

map.addControl(new maplibregl.NavigationControl({
    visualizePitch: true,
    showZoom: false,
    showCompass: true,
}), 'top-right');

// 3D pitch toggle control (bird's eye <-> oblique view)
class PitchToggleControl {
    constructor({ pitch = 45, duration = 600 } = {}) {
        this._pitch = pitch;
        this._duration = duration;
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group pitch-toggle';

        this._button = document.createElement('button');
        this._button.type = 'button';
        this._button.className = 'pitch-toggle-btn';
        this._updateLabel();

        this._button.addEventListener('click', () => {
            const targetPitch = this._map.getPitch() > 0 ? 0 : this._pitch;
            if (prefersReducedMotion) {
                this._map.jumpTo({ pitch: targetPitch });
            } else {
                this._map.easeTo({ pitch: targetPitch, duration: this._duration });
            }
        });

        this._onPitch = () => this._updateLabel();
        this._map.on('pitch', this._onPitch);

        this._container.appendChild(this._button);
        return this._container;
    }

    onRemove() {
        this._map.off('pitch', this._onPitch);
        this._container.remove();
        this._map = undefined;
    }

    _updateLabel() {
        const is3D = this._map.getPitch() > 0;
        this._button.textContent = is3D ? '2D' : '3D';
        this._button.setAttribute('aria-label',
            is3D ? 'Switch to flat 2D view' : 'Switch to tilted 3D view');
    }
}

map.addControl(new PitchToggleControl({ pitch: 45 }), 'top-right');

// ============================================
// MAP SOURCES, LAYERS, AND INTERACTIVITY
// ============================================

// Helper to build a match expression from a color map
function buildMatchExpr(prop, colorMap) {
    const expr = ['match', ['to-number', ['get', prop]]];
    for (const [code, color] of Object.entries(colorMap)) {
        expr.push(Number(code), color);
    }
    expr.push('#cccccc'); // fallback
    return expr;
}

function addAllSources() {
    map.addSource('buildings', {
        type: 'vector',
        url: 'pmtiles://data/processed/buildings.pmtiles',
    });

    map.addSource('buildings-penjaringan', {
        type: 'vector',
        url: 'pmtiles://data/processed/buildings_penjaringan.pmtiles',
    });

    map.addSource('subsidence', {
        type: 'image',
        url: 'data/processed/subsidence_styled.png',
        coordinates: [
            [106.685531, -6.073325],
            [106.974039, -6.073325],
            [106.974039, -6.373493],
            [106.685531, -6.373493],
        ],
    });

    map.addSource('study-areas', {
        type: 'geojson',
        data: 'data/processed/study_areas.geojson',
    });

    map.addSource('quotes', {
        type: 'geojson',
        data: 'data/processed/quotes_locations.geojson',
    });

    map.addSource('kelurahan', {
        type: 'geojson',
        data: 'data/processed/kelurahan.geojson',
    });

    map.addSource('penjaringan', {
        type: 'geojson',
        data: 'data/processed/penjaringan_boundary.geojson',
    });

    map.addSource('penjaringan-label-pt', {
        type: 'geojson',
        data: 'data/processed/penjaringan_label.geojson',
    });

    map.addSource('satellite', {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Esri, Maxar, Earthstar Geographics',
        maxzoom: 19,
    });
}

function addAllLayers(theme) {
    const tc = THEME_COLORS[theme];

    // --- Layers (bottom to top) ---

    map.addLayer({
        id: 'satellite-layer',
        type: 'raster',
        source: 'satellite',
        paint: { 'raster-opacity': 1 },
        layout: { 'visibility': 'none' },
    });

    map.addLayer({
        id: 'subsidence-layer',
        type: 'raster',
        source: 'subsidence',
        paint: { 'raster-opacity': 0.7, 'raster-fade-duration': 300 },
        layout: { 'visibility': 'none' },
    });

    map.addLayer({
        id: 'buildings-risk',
        type: 'fill',
        source: 'buildings',
        'source-layer': 'buildings',
        paint: {
            'fill-color': ['interpolate', ['linear'], ['get', 'dm_risk'], ...RISK_STOPS.flat()],
            'fill-opacity': 0.75,
        },
        layout: { 'visibility': 'none' },
    });

    map.addLayer({
        id: 'buildings-gap',
        type: 'fill',
        source: 'buildings-penjaringan',
        'source-layer': 'buildings',
        paint: {
            'fill-color': [
                'case',
                ['any', ['==', ['get', 'has_ai_prediction'], 1], ['==', ['get', 'has_ai_prediction'], '1']],
                COLOR_HAS_PREDICTION,
                COLOR_NO_PREDICTION,
            ],
            'fill-opacity': 0.8,
        },
        layout: { 'visibility': 'none' },
    });

    // AI-predicted building typology layers
    map.addLayer({
        id: 'buildings-construction',
        type: 'fill',
        source: 'buildings',
        'source-layer': 'buildings',
        filter: ['has', 'ai_construction'],
        paint: { 'fill-color': buildMatchExpr('ai_construction', CONSTRUCTION_COLORS), 'fill-opacity': 0.8 },
        layout: { 'visibility': 'none' },
    });

    map.addLayer({
        id: 'buildings-currentuse',
        type: 'fill',
        source: 'buildings',
        'source-layer': 'buildings',
        filter: ['has', 'ai_currentuse'],
        paint: { 'fill-color': buildMatchExpr('ai_currentuse', CURRENTUSE_COLORS), 'fill-opacity': 0.8 },
        layout: { 'visibility': 'none' },
    });

    map.addLayer({
        id: 'buildings-storeys',
        type: 'fill',
        source: 'buildings',
        'source-layer': 'buildings',
        filter: ['has', 'ai_storeys'],
        paint: { 'fill-color': buildMatchExpr('ai_storeys', STOREYS_COLORS), 'fill-opacity': 0.8 },
        layout: { 'visibility': 'none' },
    });

    map.addLayer({
        id: 'kelurahan-outline',
        type: 'line',
        source: 'kelurahan',
        paint: { 'line-color': tc.lineColor, 'line-width': 0.8, 'line-opacity': 0.4 },
        layout: { 'visibility': 'none' },
    });

    map.addLayer({
        id: 'kelurahan-labels',
        type: 'symbol',
        source: 'kelurahan',
        layout: {
            'text-field': ['get', 'kelurahan'],
            'text-font': ['Open Sans Regular'],
            'text-size': ['interpolate', ['linear'], ['zoom'], 11, 9, 14, 12],
            'text-anchor': 'center',
            'text-max-width': 6,
            'visibility': 'none',
        },
        paint: { 'text-color': tc.textColor, 'text-halo-color': tc.haloColor, 'text-halo-width': 1.5 },
    });

    map.addLayer({
        id: 'penjaringan-outline',
        type: 'line',
        source: 'penjaringan',
        paint: { 'line-color': '#2166ac', 'line-width': 2.5, 'line-opacity': 0.7, 'line-dasharray': [6, 3] },
        layout: { 'visibility': 'none' },
    });

    map.addLayer({
        id: 'penjaringan-label',
        type: 'symbol',
        source: 'penjaringan-label-pt',
        layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Bold'],
            'text-size': 14,
            'text-anchor': 'center',
            'visibility': 'none',
        },
        paint: { 'text-color': '#2166ac', 'text-halo-color': tc.haloColorStrong, 'text-halo-width': 2 },
    });

    map.addLayer({
        id: 'study-area-outline',
        type: 'line',
        source: 'study-areas',
        paint: { 'line-color': tc.studyAreaText, 'line-width': 2.5, 'line-dasharray': [3, 2] },
        layout: { 'visibility': 'none' },
    });

    map.addLayer({
        id: 'study-area-labels',
        type: 'symbol',
        source: 'study-areas',
        layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Bold'],
            'text-size': 13,
            'text-anchor': 'center',
            'text-offset': [0, -2],
            'visibility': 'none',
        },
        paint: { 'text-color': tc.studyAreaText, 'text-halo-color': tc.haloColorStrong, 'text-halo-width': 2 },
    });

    map.addLayer({
        id: 'quote-markers-glow',
        type: 'circle',
        source: 'quotes',
        paint: { 'circle-radius': 18, 'circle-color': 'rgba(0, 0, 0, 0.35)', 'circle-blur': 1 },
        layout: { 'visibility': 'none' },
    });

    map.addLayer({
        id: 'quote-markers',
        type: 'circle',
        source: 'quotes',
        paint: {
            'circle-radius': 10,
            'circle-color': COLOR_ETHNO_ACCENT,
            'circle-stroke-color': tc.quoteStroke,
            'circle-stroke-width': 2.5,
            'circle-opacity': 0.9,
        },
        layout: { 'visibility': 'none' },
    });
}

function addInteractivity() {
    if (addInteractivity.hasBoundHandlers) return;

    map.on('click', 'quote-markers', handleQuoteMarkerClick);
    map.on('mouseenter', 'quote-markers', handleQuoteMarkerMouseEnter);
    map.on('mouseleave', 'quote-markers', handleQuoteMarkerMouseLeave);
    addInteractivity.hasBoundHandlers = true;
}

function buildQuotePopupContent(props) {
    const wrapper = document.createElement('div');
    wrapper.className = 'quote-popup-body';

    const quote = document.createElement('blockquote');
    quote.className = 'quote-popup-quote';
    quote.textContent = `"${props.quote}"`;

    const location = document.createElement('p');
    location.className = 'quote-popup-location';
    location.textContent = props.location;

    wrapper.append(quote, location);
    return wrapper;
}

function handleQuoteMarkerClick(e) {
    const props = e.features[0].properties;
    new maplibregl.Popup({ offset: 12, maxWidth: '280px', className: 'quote-popup' })
        .setLngLat(e.lngLat)
        .setDOMContent(buildQuotePopupContent(props))
        .addTo(map);
}

function handleQuoteMarkerMouseEnter() {
    map.getCanvas().style.cursor = 'pointer';
}

function handleQuoteMarkerMouseLeave() {
    map.getCanvas().style.cursor = '';
}

addInteractivity.hasBoundHandlers = false;

// Re-apply current scroll step visibility after a style swap
function reapplyCurrentStep() {
    if (!currentStepId) return;
    const config = STEP_CONFIG[currentStepId];
    if (!config) return;

    // Capture new base style layer IDs
    baseStyleLayerIds = (map.getStyle().layers || [])
        .map((l) => l.id)
        .filter((id) => !ALL_LAYERS.includes(id));

    ALL_LAYERS.forEach((layerId) => {
        if (map.getLayer(layerId)) {
            const vis = config.layers.includes(layerId) ? 'visible' : 'none';
            map.setLayoutProperty(layerId, 'visibility', vis);
        }
    });

    // Hide basemap labels when satellite is active
    const showBase = !config.layers.includes('satellite-layer');
    baseStyleLayerIds.forEach((layerId) => {
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', showBase ? 'visible' : 'none');
        }
    });

    // Re-apply gap opacity
    if (map.getLayer('buildings-gap')) {
        map.setPaintProperty('buildings-gap', 'fill-opacity', config.gapOpacity !== undefined ? config.gapOpacity : 0.8);
    }

    // Re-apply flip overlay state
    const flipOverlay = document.getElementById('flip-overlay');
    flipOverlay.classList.toggle('is-active', !!config.showFlip);

    // Re-apply legend
    const legendEl = document.getElementById('legend');
    if (config.legend && LEGENDS[config.legend]) {
        legendEl.innerHTML = LEGENDS[config.legend]; // eslint-disable-line no-unsanitized/property
        legendEl.classList.add('is-visible');
        resetLegendExpandState(legendEl);
    } else {
        legendEl.classList.remove('is-visible');
    }

    // Re-apply typology selector state
    const typologySelector = document.getElementById('typology-selector');
    if (config.showTypologySelector) {
        typologySelector.classList.add('is-visible');
        applyTypologySelection(currentTypology);
    } else {
        typologySelector.classList.remove('is-visible');
        setTypologySelectorExpanded(false);
    }
}

// ============================================
// LOAD DATA AND ADD LAYERS
// ============================================

map.on('load', () => {
    baseStyleLayerIds = (map.getStyle().layers || []).map((layer) => layer.id);
    addAllSources();
    addAllLayers(currentTheme);
    addInteractivity();
    initScrollama();
    scrollamaInitialized = true;
});

// Handle style swap (dark/light mode toggle reloads the basemap style).
// MapLibre GL JS 4.x does not fire 'style.load' after setStyle(); the
// 'idle' event reliably fires once the new base style has rendered.
map.on('idle', () => {
    if (!isStyleSwap) return;
    isStyleSwap = false;
    addAllSources();
    addAllLayers(currentTheme);
    addInteractivity();
    reapplyCurrentStep();
});

// ============================================
// THEME TOGGLE
// ============================================

function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    syncThemeToggleLabel(theme);
}

function applyThemeSelection(theme, { persist = false } = {}) {
    applyTheme(theme);
    if (persist) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    // Swap basemap (the idle handler re-adds sources/layers once the new style renders)
    isStyleSwap = true;
    map.setStyle(BASEMAP_STYLES[theme]);
}

document.getElementById('theme-toggle')?.addEventListener('click', () => {
    applyThemeSelection(currentTheme === 'dark' ? 'light' : 'dark', { persist: true });
});

// Listen for system theme changes (only if no manual override)
systemThemeQuery.addEventListener('change', (e) => {
    if (!getStoredTheme()) {
        applyThemeSelection(e.matches ? 'dark' : 'light');
    }
});

// ============================================
// SCROLLAMA SETUP
// ============================================

// Typology layer names mapped to selector values
const TYPOLOGY_LAYERS = {
    construction: 'buildings-construction',
    currentuse: 'buildings-currentuse',
    storeys: 'buildings-storeys',
};

const DEFAULT_TYPOLOGY = 'construction';
let currentTypology = DEFAULT_TYPOLOGY;
syncTypologySelectorLabel(currentTypology);
setTypologySelectorExpanded(false);

function applyTypologySelection(selected) {
    const nextTypology = TYPOLOGY_LAYERS[selected] ? selected : DEFAULT_TYPOLOGY;
    const stepConfig = currentStepId ? STEP_CONFIG[currentStepId] : null;
    const shouldShowTypology = !!stepConfig?.showTypologySelector;
    const legendEl = document.getElementById('legend');
    const input = document.querySelector(`input[name="typology"][value="${nextTypology}"]`);

    currentTypology = nextTypology;
    if (input) input.checked = true;
    syncTypologySelectorLabel(nextTypology);

    for (const [key, layerId] of Object.entries(TYPOLOGY_LAYERS)) {
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', shouldShowTypology && key === nextTypology ? 'visible' : 'none');
        }
    }

    if (shouldShowTypology && LEGENDS[nextTypology]) {
        legendEl.innerHTML = LEGENDS[nextTypology]; // eslint-disable-line no-unsanitized/property
        legendEl.classList.add('is-visible');
        resetLegendExpandState(legendEl);
        setTypologySelectorExpanded(!isMobileViewport());
    } else {
        setTypologySelectorExpanded(false);
    }
}

function initScrollama() {
    const scroller = scrollama();
    const flipOverlay = document.getElementById('flip-overlay');
    const legendEl = document.getElementById('legend');

    bindMapControlTouchLock(legendEl);
    bindMapControlTouchLock(typologySelector);
    window.addEventListener('touchend', (e) => {
        if (e.touches.length === 0) {
            unlockMapTouchGestures();
        }
    }, { passive: true });
    window.addEventListener('touchcancel', (e) => {
        if (e.touches.length === 0) {
            unlockMapTouchGestures();
        }
    }, { passive: true });

    // Collapsible legend toggle
    legendEl.addEventListener('click', (e) => {
        const toggle = e.target.closest('.legend-toggle');
        if (!toggle) return;
        const expanded = legendEl.classList.toggle('is-expanded');
        toggle.setAttribute('aria-expanded', String(expanded));
    });

    typologySelectorToggle?.addEventListener('click', () => {
        if (!typologySelector?.classList.contains('is-visible')) return;
        setTypologySelectorExpanded(!typologySelector.classList.contains('is-expanded'));
    });

    typologySelector?.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || !isMobileViewport() || !typologySelector.classList.contains('is-expanded')) return;
        setTypologySelectorExpanded(false);
        typologySelectorToggle?.focus();
    });

    function setBaseStyleVisibility(visible) {
        baseStyleLayerIds.forEach((layerId) => {
            if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
            }
        });
    }

    scroller
        .setup({
            step: '.step',
            offset: 0.5,
            progress: false,
        })
        .onStepEnter((response) => {
            const stepId = response.element.dataset.step;
            const config = STEP_CONFIG[stepId];
            if (!config) return;

            // Track current step for reapplyCurrentStep() after theme swap
            currentStepId = stepId;

            // Update active step styling
            document.querySelectorAll('.step').forEach((el) => {
                el.classList.remove('is-active');
            });
            response.element.classList.add('is-active');
            setActiveChapter(PART_TO_SECTION[response.element.dataset.part]);

            // On mobile the map is 50vh tall instead of full-height, so pull
            // back to keep the same geographic framing. Use mobileZoom if the
            // step defines one; otherwise fall back to zoom - 1.
            const isMobile = window.innerWidth <= 768;
            const zoom = isMobile
                ? (config.mobileZoom !== undefined ? config.mobileZoom : Math.max(config.zoom - 1, 8))
                : config.zoom;

            // Fly the map to the new camera position
            if (prefersReducedMotion) {
                map.jumpTo({
                    center: config.center,
                    zoom,
                    pitch: config.pitch,
                    bearing: config.bearing,
                });
            } else {
                map.flyTo({
                    center: config.center,
                    zoom,
                    pitch: config.pitch,
                    bearing: config.bearing,
                    duration: config.duration,
                    essential: true,
                });
            }

            // Toggle layer visibility
            ALL_LAYERS.forEach((layerId) => {
                if (map.getLayer(layerId)) {
                    const vis = config.layers.includes(layerId) ? 'visible' : 'none';
                    map.setLayoutProperty(layerId, 'visibility', vis);
                }
            });

            setBaseStyleVisibility(!config.layers.includes('satellite-layer'));

            if (map.getLayer('buildings-gap')) {
                map.setPaintProperty(
                    'buildings-gap',
                    'fill-opacity',
                    config.gapOpacity !== undefined ? config.gapOpacity : 0.8,
                );
            }

            // Toggle flip overlay (Part 4: The Flip)
            if (config.showFlip) {
                flipOverlay.classList.add('is-active');
            } else {
                flipOverlay.classList.remove('is-active');
            }

            // Update legend (content is hardcoded template strings, not user input)
            if (config.legend && LEGENDS[config.legend]) {
                legendEl.innerHTML = LEGENDS[config.legend]; // eslint-disable-line no-unsanitized/property
                legendEl.classList.add('is-visible');
                resetLegendExpandState(legendEl);
            } else {
                legendEl.classList.remove('is-visible');
            }

            // Toggle typology selector (only at algorithm-gap step)
            if (config.showTypologySelector) {
                typologySelector.classList.add('is-visible');
                applyTypologySelection(currentTypology);
            } else {
                typologySelector.classList.remove('is-visible');
                setTypologySelectorExpanded(false);
            }
        });

    // Typology radio change handler
    document.querySelectorAll('input[name="typology"]').forEach((radio) => {
        radio.addEventListener('change', (e) => {
            applyTypologySelection(e.target.value);
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        scroller.resize();

        if (!typologySelector) return;

        if (typologySelector.classList.contains('is-visible')) {
            setTypologySelectorExpanded(!isMobileViewport());
        } else {
            setTypologySelectorExpanded(false);
        }
    });
}

// ============================================
// VIDEO AUDIO TOGGLES
// ============================================

document.querySelectorAll('.video-audio-toggle').forEach((btn) => {
    const video = btn.closest('.video-wrapper').querySelector('video');
    btn.addEventListener('click', () => {
        video.muted = !video.muted;
        const nowMuted = video.muted;
        btn.classList.toggle('is-unmuted', !nowMuted);
        btn.setAttribute('aria-label', nowMuted ? 'Unmute video' : 'Mute video');
    });
});

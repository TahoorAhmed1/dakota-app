'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LatestNews from '@/components/NewsEvent';
import OurPartners from '@/components/ourPartners';
import type { DivIcon, LatLngExpression, LatLngTuple, Map as LeafletMap } from 'leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(m => m.Tooltip), { ssr: false });

type CampData = {
  id: string;
  number: string;
  name: string;
  location: string;
  county: string;
  region: string;
  description: string;
  position: LatLngExpression;
  href: string;
  directionsUrl: string;
};

const camps: CampData[] = [
  {
    id: 'faulkton',
    number: '01',
    name: 'Faulkton Pheasant Camp',
    location: 'Faulkton, South Dakota',
    county: 'Faulk County',
    region: 'Central Plains',
    description:
      'Rolling wheat fields and shelter belts in the heart of central South Dakota pheasant country. Strong bird populations all season long with comfortable on-site lodging.',
    position: [45.034, -99.148],
    href: 'https://www.uguidesdpheasants.com/pheasant-hunts/faulkton/',
    directionsUrl: 'https://www.google.com/maps?q=45.034,-99.148',
  },
  {
    id: 'gunners-haven',
    number: '02',
    name: "Gunner's Haven Pheasant Camp",
    location: 'Selby, South Dakota',
    county: 'Walworth County',
    region: 'North-Central',
    description:
      'Prime north-central habitat with quick access to multiple shelterbelt blocks and excellent mixed grain field edges. A favorite among returning UGUIDE hunters.',
    position: [45.509, -99.990],
    href: 'https://www.uguidesdpheasants.com/pheasant-hunts/gunners-haven/',
    directionsUrl: 'https://www.google.com/maps?q=45.509,-99.990',
  },
  {
    id: 'meadow-creek',
    number: '03',
    name: 'Meadow Creek Pheasant Camp',
    location: 'Meadow, South Dakota',
    county: 'Perkins County',
    region: 'Northwest Prairie',
    description:
      'Expansive native grass and crop land in Perkins County with low hunting pressure. Outstanding late-season pheasant movement across wide-open northwest prairie.',
    position: [45.857, -102.199],
    href: 'https://www.uguidesdpheasants.com/pheasant-hunts/meadow-creek/',
    directionsUrl: 'https://www.google.com/maps?q=45.857,-102.199',
  },
  {
    id: 'pheasant-camp-lodge',
    number: '04',
    name: 'Pheasant Camp Lodge',
    location: 'Lake Andes, South Dakota',
    county: 'Charles Mix County',
    region: 'Southeast River Country',
    description:
      'South-central river corridor access with cut corn, milo, and cattail slough properties. Full lodge amenities for the most discerning upland hunting group.',
    position: [43.157, -98.543],
    href: 'https://www.uguidesdpheasants.com/pheasant-hunts/pheasant-camp-lodge/',
    directionsUrl: 'https://www.google.com/maps?q=43.157,-98.543',
  },
  {
    id: 'west-river',
    number: '05',
    name: 'West River Adventures Pheasant Camp',
    location: 'Timberlake, South Dakota',
    county: 'Dewey County',
    region: 'Missouri River Break',
    description:
      'Classic west-river terrain with Missouri River breaks, large wheat fields, and native grasslands. An authentic western South Dakota fair-chase pheasant hunt.',
    position: [45.430, -101.071],
    href: 'https://www.uguidesdpheasants.com/pheasant-hunts/west-river-adventures/',
    directionsUrl: 'https://www.google.com/maps?q=45.430,-101.071',
  },
];

type ViewMode = 'map' | 'satellite';
const mapTile = {
  map: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
};

function MapSkeleton() {
  return (
    <div className="relative h-80 w-full overflow-hidden rounded-xl bg-[#d6ebe2] sm:h-105 lg:h-135">
      <div className="absolute left-3 top-3 flex overflow-hidden rounded border border-[#cfcfcf] bg-white text-xs font-semibold text-[#444] shadow-sm sm:left-4 sm:top-4">
        <span className="border-r border-[#d9d9d9] px-3 py-2 sm:px-4">Map</span>
        <span className="px-3 py-2 text-[#777] sm:px-4">Satellite</span>
      </div>
      <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded border border-[#d9d9d9] bg-white shadow-sm sm:bottom-4 sm:right-4">
        <span className="border-b border-[#d9d9d9] px-3 py-2 text-lg text-[#777]">+</span>
        <span className="px-3 py-2 text-lg text-[#777]">-</span>
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold uppercase tracking-widest text-[#517562]/70 sm:text-3xl">
        South Dakota
      </div>
    </div>
  );
}

type MapProps = {
  selectedId: string | null;
  onSelectCamp: (id: string) => void;
};

function PropertyMap({ selectedId, onSelectCamp }: MapProps) {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [markerIcon, setMarkerIcon] = useState<DivIcon | null>(null);
  const [activeMarkerIcon, setActiveMarkerIcon] = useState<DivIcon | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const mapWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let active = true;
    import('leaflet').then((L) => {
      if (!active) return;
      const makeIcon = (bg: string) =>
        L.divIcon({
          className: 'uguide-house-marker',
          html: `<span class="uguide-house-marker__pin" style="background:${bg}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10.2L12 4L20 10.2V19C20 19.5523 19.5523 20 19 20H15C14.4477 20 14 19.5523 14 19V14H10V19C10 19.5523 9.55228 20 9 20H5C4.44772 20 4 19.5523 4 19V10.2Z" fill="white"/></svg></span>`,
          iconSize: [34, 46],
          iconAnchor: [17, 42],
          popupAnchor: [0, -34],
          tooltipAnchor: [0, -38],
        });
      setMarkerIcon(makeIcon('#df4436'));
      setActiveMarkerIcon(makeIcon('#f26f2d'));
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const camp = camps.find(c => c.id === selectedId);
    if (camp) {
      mapRef.current.flyTo(camp.position as LatLngTuple, 10, { duration: 0.8 });
    }
  }, [selectedId]);

  const bounds = useMemo(() => camps.map(c => c.position as LatLngTuple), []);
  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  const toggleFullscreen = async () => {
    const el = mapWrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await el.requestFullscreen();
  };

  if (!mounted || !markerIcon || !activeMarkerIcon) return <MapSkeleton />;

  return (
    <div ref={mapWrapRef} className="relative h-80 w-full overflow-hidden rounded-xl sm:h-105 lg:h-135">
      <div className="absolute left-3 top-3 z-1000 flex overflow-hidden rounded border border-[#cfcfcf] bg-white text-xs font-semibold text-[#444] shadow-sm sm:left-4 sm:top-4">
        <button type="button" onClick={() => setViewMode('map')} aria-pressed={viewMode === 'map'} className={`border-r border-[#d9d9d9] px-3 py-2 transition-colors sm:px-4 ${viewMode === 'map' ? 'bg-white text-[#3d3d3d]' : 'bg-[#f6f6f6] text-[#7c7c7c]'}`}>Map</button>
        <button type="button" onClick={() => setViewMode('satellite')} aria-pressed={viewMode === 'satellite'} className={`px-3 py-2 transition-colors sm:px-4 ${viewMode === 'satellite' ? 'bg-white text-[#3d3d3d]' : 'bg-[#f6f6f6] text-[#7c7c7c]'}`}>Satellite</button>
      </div>
      <button type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen" className="absolute right-14 top-3 z-1000 rounded border border-[#d9d9d9] bg-white px-3 py-2 text-[#777] shadow-sm transition hover:bg-[#fafafa] sm:right-16 sm:top-4">&#9974;</button>
      <div className="absolute right-3 top-3 z-1000 flex flex-col overflow-hidden rounded border border-[#d9d9d9] bg-white shadow-sm sm:right-4 sm:top-4">
        <button type="button" onClick={zoomIn} aria-label="Zoom in" className="border-b border-[#d9d9d9] px-3 py-1.5 text-lg text-[#777] transition hover:bg-[#fafafa]">+</button>
        <button type="button" onClick={zoomOut} aria-label="Zoom out" className="px-3 py-1.5 text-lg text-[#777] transition hover:bg-[#fafafa]">-</button>
      </div>
      <MapContainer bounds={bounds} boundsOptions={{ padding: [50, 50] }} scrollWheelZoom={false} zoomControl={false} className="h-full w-full" ref={instance => { mapRef.current = instance; }}>
        <TileLayer url={mapTile[viewMode].url} attribution={mapTile[viewMode].attribution} maxZoom={18} />
        {camps.map(camp => (
          <Marker key={camp.id} position={camp.position} icon={selectedId === camp.id ? activeMarkerIcon : markerIcon} title={camp.name} eventHandlers={{ click: () => onSelectCamp(camp.id) }}>
            <Tooltip direction="top" offset={[0, -26]} opacity={1}>{camp.name}</Tooltip>
            <Popup minWidth={240}>
              <div className="space-y-2 p-1 text-left text-sm leading-snug text-[#2e2b28]">
                <div>
                  <p className="font-bold text-[#281703]">{camp.name}</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#F16724]">{camp.region}</p>
                </div>
                <p className="text-xs leading-relaxed">{camp.description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a href={camp.href} target="_blank" rel="noreferrer" className="rounded bg-[#281703] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#3a2510]">View Details</a>
                  <a href={camp.directionsUrl} target="_blank" rel="noreferrer" className="rounded border border-[#d9c8b5] px-3 py-1.5 text-xs font-semibold text-[#281703] transition hover:bg-[#f7efe6]">Directions</a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function CampCard({ camp, isSelected, onSelect }: { camp: CampData; isSelected: boolean; onSelect: () => void }) {
  return (
    <div onClick={onSelect} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }} aria-pressed={isSelected} className={`group cursor-pointer rounded-xl border bg-white p-5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 sm:p-6 ${isSelected ? 'border-orange-400 shadow-lg shadow-orange-100' : 'border-[#e0d3c4] shadow-sm hover:border-orange-300 hover:shadow-md'}`}>
      <div className="flex items-start gap-4">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors ${isSelected ? 'bg-orange-500 text-white' : 'bg-[#f5ece0] text-[#e67b35] group-hover:bg-orange-100'}`}>{camp.number}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <h3 className="text-sm font-bold leading-snug text-[#281703] sm:text-base">{camp.name}</h3>
            <span className="shrink-0 rounded-full bg-[#f0e8de] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#a0724d]">{camp.region}</span>
          </div>
          <p className="mt-0.5 text-xs text-[#281703]/55">{camp.location} &middot; {camp.county}</p>
          <p className="mt-2 text-xs leading-relaxed text-[#281703]/70">{camp.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={camp.href} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-orange-400">
              View Camp Details
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <a href={camp.directionsUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1.5 rounded-lg border border-[#d7c8b6] bg-white px-4 py-2 text-xs font-bold text-[#281703] transition hover:border-orange-300 hover:bg-[#fdf5ee]">
              Get Directions
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CampsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const toggleSelected = (id: string) => setSelectedId(prev => (prev === id ? null : id));

  return (
    <>
      <main className="flex flex-col text-[#281703]">
        <section className="CampsImage relative isolate flex min-h-90 items-center justify-center overflow-hidden bg-cover bg-center px-4 pt-20 sm:min-h-110 sm:px-6 md:min-h-125 lg:min-h-148 lg:px-8">
          <div className="absolute inset-0" />
          <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
            <h1 className="text-[46px] font-bold uppercase leading-none tracking-[-0.03em] text-[#231305] sm:text-[64px] lg:text-[78px]">Camps &amp; Map</h1>
            <nav aria-label="Breadcrumb" className="mt-5 sm:mt-6">
              <ol className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#281703] sm:gap-3 sm:text-[11px]">
                <li><Link href="/" className="inline-flex items-center gap-2 transition-colors hover:text-[#e67b35]"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.172 3 10.2V21h6v-6h6v6h6V10.2l-9-7.028Z" /></svg><span>Home</span></Link></li>
                <li aria-hidden="true" className="text-[#6c5240]">&#8250;</li>
                <li aria-current="page">Camps &amp; Map</li>
              </ol>
            </nav>
          </div>
        </section>

        <section className="bg-[#e7dccf] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center sm:mb-12">
              <p className="mb-2 text-xs font-bold tracking-widest uppercase text-orange-500">5 Properties &middot; South Dakota</p>
              <h2 className="text-3xl font-bold uppercase text-[#281703] sm:text-4xl">Pheasant Camp Locations</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#281703]/70 sm:text-base">Select a camp card to fly the map to that location, or click a map pin to highlight the camp. Each property has unique habitat, lodging, and group capacity.</p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              <div className="w-full lg:sticky lg:top-24 lg:w-7/12">
                <PropertyMap selectedId={selectedId} onSelectCamp={toggleSelected} />
                <p className="mt-3 text-center text-xs text-[#281703]/45">
                  {selectedId ? `Showing: ${camps.find(c => c.id === selectedId)?.name}` : 'Click a pin or camp card to explore'}
                </p>
              </div>

              <div className="w-full space-y-4 lg:w-5/12">
                {camps.map(camp => (
                  <CampCard key={camp.id} camp={camp} isSelected={selectedId === camp.id} onSelect={() => toggleSelected(camp.id)} />
                ))}
                <div className="pt-2 text-center">
                  <Link href="/quote-reserve" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-400">
                    Book Your Hunt Online
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <OurPartners />
        <LatestNews />
      </main>

      <style jsx global>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        .leaflet-container { font-family: inherit; background: #d6ebe2; outline: none; }
        .leaflet-container a { color: inherit; }
        .leaflet-tooltip { border: 0; border-radius: 4px; background: rgba(26,26,26,0.9); color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.15); font-size: 12px; font-weight: 600; padding: 7px 10px; }
        .leaflet-tooltip-top:before { border-top-color: rgba(26,26,26,0.9); }
        .leaflet-popup-content-wrapper { border-radius: 8px; box-shadow: 0 16px 40px rgba(0,0,0,0.18); padding: 0; }
        .leaflet-popup-content { margin: 12px 14px; min-width: 220px; }
        .leaflet-popup-tip { box-shadow: none; }
        .leaflet-control-attribution { background: rgba(255,255,255,0.86) !important; font-size: 10px; padding: 2px 6px !important; color: #4b4b4b; }
        .leaflet-control-attribution a { color: #4b4b4b !important; }
        .uguide-house-marker { background: transparent; border: 0; }
        .uguide-house-marker__pin { align-items: center; border-radius: 999px 999px 999px 0; box-shadow: 0 8px 18px rgba(0,0,0,0.24); display: inline-flex; height: 34px; justify-content: center; position: relative; transform: rotate(-45deg); width: 34px; }
        .uguide-house-marker__pin::after { background: rgba(255,255,255,0.3); border-radius: 999px; content: ''; height: 10px; left: 50%; position: absolute; top: 50%; transform: translate(-50%,-50%); width: 10px; }
        .uguide-house-marker__pin svg { height: 15px; position: relative; transform: rotate(45deg); width: 15px; z-index: 1; }
      `}</style>
    </>
  );
}

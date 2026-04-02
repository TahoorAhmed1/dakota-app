'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LatestNews from '@/components/NewsEvent';
import OurPartners from '@/components/ourPartners';
import type { DivIcon, LatLngExpression, LatLngTuple, Map as LeafletMap } from 'leaflet';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
);

const properties: {
  id: string;
  name: string;
  position: LatLngExpression;
  description: string;
  region: string;
  href: string;
  directionsUrl: string;
}[] = [
  {
    id: 'northwest-lodge',
    name: 'Northwest Lodge',
    position: [45.9232, -102.1568],
    description:
      'Large wheat-field and grassland access near the northwest edge of South Dakota.',
    region: 'Lemmon Area',
    href: '/camps?location=northwest-lodge',
    directionsUrl: 'https://www.google.com/maps?q=45.9232,-102.1568',
  },
  {
    id: 'standing-rock-camp',
    name: 'Standing Rock Camp',
    position: [45.7788, -101.2256],
    description:
      'Central-north hunting access with quick entry to multiple shelterbelt blocks.',
    region: 'Mobridge Area',
    href: '/camps?location=standing-rock-camp',
    directionsUrl: 'https://www.google.com/maps?q=45.7788,-101.2256',
  },
  {
    id: 'prairie-ridge',
    name: 'Prairie Ridge Camp',
    position: [45.2091, -99.8564],
    description:
      'Mixed crop edges and native grass parcels with strong late-season bird movement.',
    region: 'Redfield Area',
    href: '/camps?location=prairie-ridge',
    directionsUrl: 'https://www.google.com/maps?q=45.2091,-99.8564',
  },
  {
    id: 'river-breaks',
    name: 'River Breaks Camp',
    position: [44.3781, -99.7857],
    description:
      'South-central property access near river corridors and cut corn travel routes.',
    region: 'Miller Area',
    href: '/camps?location=river-breaks',
    directionsUrl: 'https://www.google.com/maps?q=44.3781,-99.7857',
  },
  {
    id: 'southeast-lodge',
    name: 'Southeast Lodge',
    position: [43.1117, -97.4012],
    description:
      'Southeast base camp with easy access to corn, milo, and cattail slough properties.',
    region: 'Yankton Area',
    href: '/camps?location=southeast-lodge',
    directionsUrl: 'https://www.google.com/maps?q=43.1117,-97.4012',
  },
];

type ViewMode = 'map' | 'satellite';

const mapTile = {
  map: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
  },
};

function MapSkeleton() {
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-[6px] bg-[#d6ebe2] sm:h-[420px] md:h-[520px] lg:h-[580px]">
      <div className="absolute left-3 top-3 flex overflow-hidden rounded-[4px] border border-[#cfcfcf] bg-white text-[12px] font-semibold text-[#444] shadow-sm sm:left-4 sm:top-4 sm:text-[14px]">
        <span className="border-r border-[#d9d9d9] px-3 py-2 sm:px-5">Map</span>
        <span className="px-3 py-2 text-[#777] sm:px-5">Satellite</span>
      </div>
      <div className="absolute right-3 top-3 rounded-[4px] border border-[#d9d9d9] bg-white px-3 py-2 text-[#777] shadow-sm sm:right-4 sm:top-4">
        ⛶
      </div>
      <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-[4px] border border-[#d9d9d9] bg-white shadow-sm sm:bottom-4 sm:right-4">
        <span className="border-b border-[#d9d9d9] px-4 py-2 text-lg text-[#777]">+</span>
        <span className="px-4 py-2 text-lg text-[#777]">−</span>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.55),transparent_17%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.45),transparent_16%),radial-gradient(circle_at_58%_75%,rgba(255,255,255,0.45),transparent_18%),radial-gradient(circle_at_25%_68%,rgba(255,255,255,0.35),transparent_15%)]" />
      <div className="absolute left-[36%] top-0 h-full w-[2px] bg-[#8bd1dc]/70" />
      <div className="absolute left-[54%] top-0 h-full w-[2px] bg-[#8bd1dc]/55" />
      <div className="absolute left-[18%] top-[22%] h-[2px] w-[68%] bg-[#d9d9d9]/70" />
      <div className="absolute left-[8%] top-[44%] h-[2px] w-[84%] bg-[#d9d9d9]/70" />
      <div className="absolute left-[25%] top-[72%] h-[2px] w-[54%] bg-[#d9d9d9]/70" />
      <div className="absolute left-[38%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-[20px] font-bold uppercase tracking-[0.18em] text-[#517562]/80 sm:text-[26px] md:text-[34px]">
        South Dakota
      </div>
    </div>
  );
}

function PropertyMap() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [markerIcon, setMarkerIcon] = useState<DivIcon | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const mapWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;

    import('leaflet').then((L) => {
      if (!active) return;

      const icon = L.divIcon({
        className: 'uguide-house-marker',
        html: `
          <span class="uguide-house-marker__pin" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 10.2L12 4L20 10.2V19C20 19.5523 19.5523 20 19 20H15C14.4477 20 14 19.5523 14 19V14H10V19C10 19.5523 9.55228 20 9 20H5C4.44772 20 4 19.5523 4 19V10.2Z" fill="white"/>
            </svg>
          </span>
        `,
        iconSize: [34, 46],
        iconAnchor: [17, 42],
        popupAnchor: [0, -34],
        tooltipAnchor: [0, -38],
      });

      setMarkerIcon(icon);
    });

    return () => {
      active = false;
    };
  }, []);

  const bounds = useMemo(
    () => properties.map((property) => property.position as LatLngTuple),
    []
  );

  const toggleFullscreen = async () => {
    const element = mapWrapRef.current;
    if (!element) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await element.requestFullscreen();
  };

  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();

  if (!mounted || !markerIcon) {
    return <MapSkeleton />;
  }

  return (
    <div ref={mapWrapRef} className="relative h-[320px] w-full overflow-hidden rounded-[6px] sm:h-[420px] md:h-[520px] lg:h-[580px]">
      <div className="absolute left-3 top-3 z-[1000] flex overflow-hidden rounded-[4px] border border-[#cfcfcf] bg-white text-[12px] font-semibold text-[#444] shadow-sm sm:left-4 sm:top-4 sm:text-[14px]">
        <button
          type="button"
          onClick={() => setViewMode('map')}
          className={`border-r border-[#d9d9d9] px-3 py-2 transition-colors sm:px-5 ${
            viewMode === 'map' ? 'bg-white text-[#3d3d3d]' : 'bg-[#f6f6f6] text-[#7c7c7c]'
          }`}
          aria-pressed={viewMode === 'map'}
        >
          Map
        </button>
        <button
          type="button"
          onClick={() => setViewMode('satellite')}
          className={`px-3 py-2 transition-colors sm:px-5 ${
            viewMode === 'satellite'
              ? 'bg-white text-[#3d3d3d]'
              : 'bg-[#f6f6f6] text-[#7c7c7c]'
          }`}
          aria-pressed={viewMode === 'satellite'}
        >
          Satellite
        </button>
      </div>

      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute right-3 top-3 z-[1000] rounded-[4px] border border-[#d9d9d9] bg-white px-3 py-2 text-[#777] shadow-sm transition hover:bg-[#fafafa] sm:right-4 sm:top-4"
        aria-label="Toggle fullscreen map"
      >
        ⛶
      </button>

      <div className="absolute bottom-3 right-3 z-[1000] flex flex-col overflow-hidden rounded-[4px] border border-[#d9d9d9] bg-white shadow-sm sm:bottom-4 sm:right-4">
        <button
          type="button"
          onClick={zoomIn}
          className="border-b border-[#d9d9d9] px-4 py-2 text-lg text-[#777] transition hover:bg-[#fafafa]"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomOut}
          className="px-4 py-2 text-lg text-[#777] transition hover:bg-[#fafafa]"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>

      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [30, 30] }}
        center={[44.5, -100.0]}
        zoom={7}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        ref={(instance) => {
          mapRef.current = instance;
        }}
      >
        <TileLayer
          url={mapTile[viewMode].url}
          attribution={mapTile[viewMode].attribution}
          maxZoom={18}
        />

        {properties.map((property) => (
          <Marker
            key={property.id}
            position={property.position}
            icon={markerIcon}
            title={property.name}
          >
            <Tooltip direction="top" offset={[0, -26]} opacity={1}>
              {property.name}
            </Tooltip>
            <Popup minWidth={240}>
              <div className="space-y-3 p-1 text-left text-[13px] leading-5 text-[#2e2b28]">
                <div>
                  <p className="text-[15px] font-bold text-[#281703]">{property.name}</p>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#F16724]">
                    {property.region}
                  </p>
                </div>
                <p>{property.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={property.href}
                    className="inline-flex items-center rounded-[4px] bg-[#281703] px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-[#3a2510]"
                  >
                    View Camp Details
                  </Link>
                  <a
                    href={property.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-[4px] border border-[#d9c8b5] px-3 py-2 text-[12px] font-semibold text-[#281703] transition hover:bg-[#f7efe6]"
                  >
                    Open Directions
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default function MapPage() {
  return (
    <>
      <main className="flex flex-col ">
        <section className="MapImage relative flex min-h-[320px] items-center justify-center overflow-hidden bg-cover bg-center px-4 pb-20 pt-24 sm:min-h-[420px] sm:px-6 sm:pb-24 sm:pt-28 md:min-h-[520px] md:pb-28 md:pt-34 lg:min-h-[560px] md:px-8">
          <div className="absolute inset-0 " />
          <div className="absolute inset-0 " />

          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-[38px] font-bold uppercase leading-none tracking-[-0.02em] text-[#281703] sm:text-[54px] md:text-[72px] lg:text-[78px]">
              MAP
            </h1>

            <nav
              aria-label="Breadcrumb"
              className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#281703] sm:gap-3 sm:text-[12px]"
            >
              <Link
                href="/"
                className="flex items-center gap-2 transition-colors hover:text-[#F16724]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 3.172 3 10.2V21h6v-6h6v6h6V10.2l-9-7.028Z" />
                </svg>
                <span>Home</span>
              </Link>
              <span aria-hidden="true">›</span>
              <span>Map</span>
            </nav>
          </div>

          {/* <div className="absolute bottom-0 left-1/2 z-10 w-[120%] -translate-x-1/2 translate-y-[56%]">
            <div className="h-20 w-full rounded-t-[100%] border-t-[4px] border-[#281703] bg-[#E7DCCF] sm:h-24 md:h-28" />
          </div> */}
        </section>

        <section className="bg-[#e8ded1] px-4 pb-16 pt-16 sm:px-6 md:pb-20 md:pt-20">
          <div className="mx-auto max-w-[980px] text-center">
            <h2 className="text-[34px] font-bold leading-[1.08] tracking-[-0.02em] text-[#281703] sm:text-[42px] md:text-[56px]">
              UGUIDE Property Locations
            </h2>

            <p className="mx-auto mt-3 max-w-[760px] text-[14px] font-medium leading-[1.55] text-[#2f2b27] sm:text-[15px]">
              Mouse over the property locations for details or click the house for
              detailed page with camp information, photos and video.
            </p>

            <div className="mx-auto mt-8 max-w-[706px] border-[3px] border-[#bcae9f] bg-white p-[4px] shadow-[0_1px_0_rgba(0,0,0,0.05)] sm:mt-10 sm:p-[8px]">
              <PropertyMap />
            </div>
          </div>
        </section>

        <OurPartners />
        <LatestNews />
      </main>

      <style jsx global>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

        .leaflet-container {
          font-family: inherit;
          background: #d6ebe2;
          outline: none;
        }

        .leaflet-container a {
          color: inherit;
        }

        .leaflet-tooltip {
          border: 0;
          border-radius: 4px;
          background: rgba(26, 26, 26, 0.9);
          color: #fff;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          font-size: 12px;
          font-weight: 600;
          padding: 7px 10px;
        }

        .leaflet-tooltip-top:before {
          border-top-color: rgba(26, 26, 26, 0.9);
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
          padding: 0;
        }

        .leaflet-popup-content {
          margin: 12px 14px;
          min-width: 220px;
        }

        .leaflet-popup-tip {
          box-shadow: none;
        }

        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.86) !important;
          font-size: 10px;
          padding: 2px 6px !important;
          color: #4b4b4b;
        }

        .leaflet-control-attribution a {
          color: #4b4b4b !important;
        }

        .uguide-house-marker {
          background: transparent;
          border: 0;
        }

        .uguide-house-marker__pin {
          align-items: center;
          background: #df4436;
          border-radius: 999px 999px 999px 0;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.24);
          display: inline-flex;
          height: 34px;
          justify-content: center;
          position: relative;
          transform: rotate(-45deg);
          width: 34px;
        }

        .uguide-house-marker__pin::after {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 999px;
          content: '';
          height: 10px;
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
        }

        .uguide-house-marker__pin svg {
          height: 15px;
          position: relative;
          transform: rotate(45deg);
          width: 15px;
          z-index: 1;
        }
      `}</style>
    </>
  );
}

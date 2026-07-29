import { useEffect, useRef, useState } from "react";
import { Search, MapPin, X, Check, Loader2 } from "lucide-react";

declare global {
  interface Window {
    L: any;
  }
}

type LocationPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialLat: number;
  initialLng: number;
  onConfirm: (data: {
    latitude: number;
    longitude: number;
    addressLine: string;
    city: string;
    postalCode: string;
  }) => void;
};

export function LocationPickerModal({
  isOpen,
  onClose,
  initialLat,
  initialLng,
  onConfirm,
}: LocationPickerModalProps) {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [lat, setLat] = useState(initialLat || 22.5726);
  const [lng, setLng] = useState(initialLng || 88.3639);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Kolkata");
  const [postalCode, setPostalCode] = useState("700091");
  const [geocoding, setGeocoding] = useState(false);

  // Initialize or update map when modal opens
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || !window.L) return;

    // Small delay to ensure modal DOM is mounted
    const timer = setTimeout(() => {
      if (!mapRef.current) {
        const L = window.L;
        const map = L.map(mapContainerRef.current).setView([lat, lng], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const customIcon = L.divIcon({
          className: "custom-map-pin",
          html: `<div style="background-color: #3ca55c; color: white; width: 36px; height: 36px; borderRadius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 3px solid white;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        const marker = L.marker([lat, lng], {
          draggable: true,
          icon: customIcon,
        }).addTo(map);

        marker.on("dragend", () => {
          const position = marker.getLatLng();
          updatePosition(position.lat, position.lng);
        });

        map.on("click", (e: any) => {
          marker.setLatLng(e.latlng);
          updatePosition(e.latlng.lat, e.latlng.lng);
        });

        mapRef.current = map;
        markerRef.current = marker;
      } else {
        mapRef.current.invalidateSize();
        mapRef.current.setView([lat, lng], 14);
        markerRef.current.setLatLng([lat, lng]);
      }
      reverseGeocode(lat, lng);
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const updatePosition = (newLat: number, newLng: number) => {
    const fixedLat = Number(newLat.toFixed(6));
    const fixedLng = Number(newLng.toFixed(6));
    setLat(fixedLat);
    setLng(fixedLng);
    reverseGeocode(fixedLat, fixedLng);
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const street =
          addr.road ||
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.amenity ||
          data.display_name.split(",")[0] ||
          "";
        const cityName = addr.city || addr.town || addr.county || addr.state_district || "Kolkata";
        const postcode = addr.postcode || "700091";

        setAddressLine(street);
        setCity(cityName);
        setPostalCode(postcode);
      }
    } catch (e) {
      console.error("Reverse geocoding error:", e);
    } finally {
      setGeocoding(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&countrycodes=in`
      );
      const results = await res.json();
      setSearchResults(results || []);
    } catch (err) {
      console.error("Search location error:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    const newLat = Number(parseFloat(result.lat).toFixed(6));
    const newLng = Number(parseFloat(result.lon).toFixed(6));

    setLat(newLat);
    setLng(newLng);
    setSearchResults([]);

    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([newLat, newLng], 15);
      markerRef.current.setLatLng([newLat, newLng]);
    }
    reverseGeocode(newLat, newLng);
  };

  const handleConfirmLocation = () => {
    onConfirm({
      latitude: lat,
      longitude: lng,
      addressLine: addressLine || "Pinned Location",
      city: city || "Kolkata",
      postalCode: postalCode || "700091",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl dark:bg-[#0f2215] overflow-hidden border border-black/10 dark:border-white/10">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-white/10">
          <div>
            <h3 className="text-lg font-bold text-leaf-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-leaf-500" /> Select Delivery Location on Map
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag the pin or click anywhere on the map to set the exact delivery address (for you or a gift recipient).
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative flex-1 p-4 space-y-3 overflow-y-auto">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search area, landmark, street, or city (e.g. Park Street Kolkata)..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-leaf-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="rounded-lg bg-leaf-500 px-4 py-2 text-xs font-bold text-white hover:bg-leaf-600 disabled:opacity-50"
              >
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-11 z-20 rounded-lg bg-white p-2 shadow-lg dark:bg-[#152e1d] border border-slate-200 dark:border-white/10 max-h-48 overflow-y-auto">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSearchResult(item)}
                    className="block w-full rounded-md px-3 py-2 text-left text-xs hover:bg-leaf-50 dark:hover:bg-white/10 dark:text-slate-200"
                  >
                    📍 {item.display_name}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Interactive Map Container */}
          <div className="relative h-64 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner">
            <div ref={mapContainerRef} className="h-full w-full" />
            <div className="absolute bottom-2 left-2 z-[400] rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold shadow dark:bg-black/80 dark:text-white">
              Pin: {lat}° N, {lng}° E
            </div>
          </div>

          {/* Address & Geocoding Details */}
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-white/5 space-y-2 border border-slate-200/60 dark:border-white/10">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span>📍 Location Details</span>
              {geocoding && <span className="text-[11px] text-leaf-600 animate-pulse">Extracting address...</span>}
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Street / Area</label>
                <input
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Street / Building / Area"
                  className="w-full rounded border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-leaf-500 dark:border-white/10 dark:bg-transparent dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full rounded border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-leaf-500 dark:border-white/10 dark:bg-transparent dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLocation}
            className="flex items-center gap-1.5 rounded-lg bg-leaf-500 px-5 py-2 text-xs font-bold text-white shadow hover:bg-leaf-600 transition"
          >
            <Check className="h-4 w-4" /> Confirm Location Pin
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Star } from "lucide-react";
const GeolocationComponent = () => {
  const HERE_API_KEY = import.meta.env.VITE_HERE_API_KEY;

  const [locationSource, setLocationSource] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [manualAddress, setManualAddress] = useState('');
  const [nearestItems, setNearestItems] = useState([]);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // To track which items have already been processed for deletion
  const expiredProcessed = useRef(new Set());

  const mapRef = useRef(null);
  const platformRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const uiRef = useRef(null);

  // Initialize the map
  useEffect(() => {
    if (!window.H) {
      setError('HERE Maps API is not loaded.');
      return;
    }
    platformRef.current = new window.H.service.Platform({ apikey: HERE_API_KEY });
    const defaultLayers = platformRef.current.createDefaultLayers();
    mapInstanceRef.current = new window.H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      { center: { lat: 19.076, lng: 72.8777 }, zoom: 12 }
    );
    new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapInstanceRef.current));
    uiRef.current = window.H.ui.UI.createDefault(mapInstanceRef.current, defaultLayers);
    return () => mapInstanceRef.current.dispose();
  }, [HERE_API_KEY]);

  // Update currentTime every second for countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // On initial mount, fetch all marketplace items (unsorted)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/itemlist/marketplace/');
        // Display the items as they are (unsorted)
        setNearestItems(response.data);
      } catch (err) {
        setError('Error fetching marketplace items: ' + err.message);
      }
    };
    fetchItems();
  }, []);

  // Monitor each item's countdown and delete from the database as soon as expiry is reached
  useEffect(() => {
    const now = new Date();

    const deleteExpiredItems = async () => {
      const updatedItems = nearestItems.filter((item) => {
        const expiryTime = new Date(item.expiryDate);
        return expiryTime > now; // Keep only non-expired items
      });

      setNearestItems(updatedItems);

      const expiredItems = nearestItems.filter((item) => {
        const expiryTime = new Date(item.expiryDate);
        return expiryTime <= now && !expiredProcessed.current.has(item.id);
      });

      for (const item of expiredItems) {
        console.log(item);
        try {
          await axios.delete(`http://localhost:5000/itemlist/mktplc/${item._id}`);
          expiredProcessed.current.add(item._id);
        } catch (err) {
          console.error('Error deleting expired item:', err.message);
        }
      }
    };

    deleteExpiredItems();
  }, [currentTime, nearestItems]);

  const addMarker = (location, color) => {
    const icon = new window.H.map.Icon(
      `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="${color}" /></svg>`
    );
    const marker = new window.H.map.Marker(location, { icon });
    mapInstanceRef.current.addObject(marker);
  };

  const getUserGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          addMarker(loc, 'blue');
          mapInstanceRef.current.setCenter(loc);
        },
        (err) => setError('Geolocation error: ' + err.message)
      );
    } else {
      setError('Geolocation is not supported.');
    }
  };

  const fetchMarketplaceItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/itemlist/marketplace/');
      return response.data;
    } catch (error) {
      setError('Error fetching marketplace items: ' + error.message);
      return [];
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await axios.get('https://geocode.search.hereapi.com/v1/geocode', {
        params: { q: address, apiKey: HERE_API_KEY },
      });
      if (response.data.items.length > 0) {
        return response.data.items[0].position;
      }
      throw new Error('Address not found');
    } catch (err) {
      throw new Error('Geocoding error: ' + err.message);
    }
  };

  const getRouteDetails = async (origin, destination) => {
    try {
      const response = await axios.get('https://router.hereapi.com/v8/routes', {
        params: {
          transportMode: 'car',
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          return: 'summary,polyline',
          apiKey: HERE_API_KEY,
        },
      });
      if (response.data.routes.length > 0) {
        return {
          distance: response.data.routes[0].sections[0].summary.length,
          polyline: response.data.routes[0].sections[0].polyline,
          destination,
        };
      }
      throw new Error('Route not found');
    } catch (err) {
      throw new Error('Routing error: ' + err.message);
    }
  };

  // Handle form submission: fetch items again, then calculate distances and sort them
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Optionally clear out the unsorted list during the sorted fetch
    setNearestItems([]);

    try {
      let origin = userLocation;
      if (locationSource === 'manual') {
        if (!manualAddress.trim()) {
          setError('Please enter an address.');
          return;
        }
        origin = await geocodeAddress(manualAddress);
        setUserLocation(origin);
        addMarker(origin, 'blue');
      }

      // Re-fetch items so that the latest list is used for distance calculation
      const items = await fetchMarketplaceItems();
      if (items.length === 0) {
        setNearestItems([{ itemName: 'No items available', distance: 'N/A' }]);
        return;
      }

      // For each item, geocode its address and get route details from the origin
      const distances = await Promise.all(
        items.map(async (item) => {
          const destination = await geocodeAddress(item.location);
          addMarker(destination, 'green');
          const details = await getRouteDetails(origin, destination);
          return { ...item, details };
        })
      );

      // Sort the items by the calculated distance
      distances.sort((a, b) => a.details.distance - b.details.distance);
      setNearestItems(distances);

      // Optionally add route markers for the top 3 nearest items
      const colors = ['red', 'orange', 'pink'];
      distances.slice(0, 3).forEach(({ details }, index) => {
        addMarker(details.destination, colors[index]);
        const lineString = window.H.geo.LineString.fromFlexiblePolyline(details.polyline);
        const routeLine = new window.H.map.Polyline(lineString, { style: { strokeColor: colors[index], lineWidth: 5 } });
        mapInstanceRef.current.addObject(routeLine);
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Helper function to format countdown (hh:mm:ss)
  const formatCountdown = (expiry) => {
    const utcExpiry = new Date(expiry);
    // Convert UTC expiry to local time (if needed)
    const localExpiry = new Date(utcExpiry.getTime());
    let diff = localExpiry - currentTime;
    if (diff < 0) diff = 0;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ width: '400px', margin: '0 auto' }}>
      <h2>Find Marketplace Items</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            name="locationSource"
            value="geolocation"
            checked={locationSource === 'geolocation'}
            onChange={() => { setLocationSource('geolocation'); getUserGeolocation(); }}
          />
          Use my current location
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="locationSource"
            value="manual"
            checked={locationSource === 'manual'}
            onChange={() => setLocationSource('manual')}
          />
          Enter my address manually
        </label>
        <br />
        {locationSource === 'manual' && (
          <input
            type="text"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            required
          />
        )}
        <br />
        <button type="submit">Find & Sort Items</button>
      </form>

      <div ref={mapRef} style={{ width: '100%', height: '400px', border: '1px solid #ccc', marginTop: '20px' }}></div>
      {/* Marketplace items list */}
      {/* Marketplace items list */}
{nearestItems.length > 0 && (
  <div
    style={{
      display: 'flex',
      overflowX: 'auto',
      gap: '1rem',
      marginTop: '20px',
      padding: '0 10px'
    }}
  >
    {nearestItems.map((item, i) => (
      <div
        key={i}
        style={{ minWidth: '250px', flex: '0 0 auto' }}
        className="overflow-hidden border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
      >
        {/* Image Section */}
        <div className="relative w-full h-48 bg-gray-200">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.itemName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {item.itemName}
          </h3>

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            {item.itemType === "Non-Perishable" && (
              <span>Expires on: {new Date(item.expiryDate).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}</span>
            )}

            {item.itemType === "Perishable" && (() => {
              const expiryDate = new Date(item.expiryDate);
              const now = new Date();
              const timeDiff = expiryDate - now;
              if (timeDiff <= 0) return <span>Expired</span>;
              const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
              return <span>Expires in: {daysLeft} {daysLeft === 1 ? "day" : "days"}</span>;
            })()}
            {item.details && item.details.distance
              ? <span style={{ color: 'blue' }}>Distance: {item.details.distance}m</span>
              : <span style={{ color: 'gray' }}></span>}
          </div>

          <div className="flex justify-between items-center text-sm">
            {/* Served By Section */}
            <div>
              <div className="text-gray-500">Served By</div>
              <div className="font-medium">{item.name}</div>
            </div>

            {/* Ratings Section */}
            <div className="flex items-center">
              {item.listedByType === "Resturant" && <span className="mr-1 text-gray-500">{item.ratings}</span>}
              <div className="flex">
                {[...Array(1)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < item.ratings ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Cost Section (Visible Only for Non-Donations) */}
          {item.type !== "Donation" && (
            <div className="mt-2 text-right text-sm font-semibold text-gray-800">
              Cost: ${item.cost?.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default GeolocationComponent;

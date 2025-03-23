import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import AddItems from './AddItems';
import ItemCard from './ItemListingForm';
import '../MarketPlace.css';

const MarketplacePage = () => {
  const HERE_API_KEY = import.meta.env.VITE_HERE_API_KEY;
  const [selectedItem, setSelectedItem] = useState(null);
  const [locationSource, setLocationSource] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [manualAddress, setManualAddress] = useState('');
  const [nearestItems, setNearestItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const [mapReady, setMapReady] = useState(false); // Track map script readiness
  const authToken = localStorage.getItem('authToken');
  const expiredProcessed = useRef(new Set());
  const mapRef = useRef(null);
  const platformRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const uiRef = useRef(null);

  // Load HERE Maps script dynamically
  useEffect(() => {
    if (!window.H) {
      const script = document.createElement('script');
      script.src = `https://js.api.here.com/v3/3.1/mapsjs-core.js`;
      script.async = true;
      script.onload = () => {
        const uiScript = document.createElement('script');
        uiScript.src = `https://js.api.here.com/v3/3.1/mapsjs-ui.js`;
        uiScript.async = true;
        uiScript.onload = () => setMapReady(true);
        document.body.appendChild(uiScript);
      };
      document.body.appendChild(script);
    } else {
      setMapReady(true);
    }
  }, []);

  // Initialize Map when script is ready
  useEffect(() => {
    if (!mapReady || !HERE_API_KEY) return;

    const platform = new window.H.service.Platform({ apikey: HERE_API_KEY });
    platformRef.current = platform;
    const defaultLayers = platform.createDefaultLayers();

    if (!defaultLayers) {
      setError('Failed to load map layers. Check API key.');
      return;
    }

    const map = new window.H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      { center: { lat: 19.076, lng: 72.8777 }, zoom: 12 }
    );
    mapInstanceRef.current = map;
    new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
    uiRef.current = window.H.ui.UI.createDefault(map, defaultLayers);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
        mapInstanceRef.current = null; // Ensure null after dispose
      }
    };
  }, [mapReady, HERE_API_KEY]);

  // Update currentTime
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch User Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/getUserData', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.data.users) throw new Error('Invalid user data');
        setUser(response.data.users);
      } catch (error) {
        setError('Failed to fetch user data: ' + error.message);
      }
    };
    if (authToken) fetchProfile();
  }, [authToken]);

  // Fetch Initial Items
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/itemlist/marketplace/');
        setNearestItems(response.data || []);
      } catch (err) {
        setError('Error fetching marketplace items: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Handle Expired Items
  useEffect(() => {
    const deleteExpiredItems = async () => {
      const now = new Date();
      const expired = nearestItems.filter(
        (item) => new Date(item.expiryDate) <= now && !expiredProcessed.current.has(item._id)
      );

      if (expired.length === 0) return;

      const updatedItems = [...nearestItems];
      for (const item of expired) {
        try {
          await axios.delete(`http://localhost:5000/itemlist/mktplc/${item._id}`);
          expiredProcessed.current.add(item._id);
          const index = updatedItems.findIndex((i) => i._id === item._id);
          if (index !== -1) updatedItems.splice(index, 1);
        } catch (err) {
          console.error('Error deleting expired item:', err.message);
        }
      }
      setNearestItems(updatedItems);
    };

    deleteExpiredItems();
    const interval = setInterval(deleteExpiredItems, 30000);
    return () => clearInterval(interval);
  }, [nearestItems]);

  const addMarker = (location, color) => {
    if (!mapInstanceRef.current) return; // Prevent null errors
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
          if (mapInstanceRef.current) mapInstanceRef.current.setCenter(loc);
        },
        (err) => setError('Geolocation error: ' + err.message)
      );
    } else {
      setError('Geolocation is not supported.');
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await axios.get('https://geocode.search.hereapi.com/v1/geocode', {
        params: { q: address, apiKey: HERE_API_KEY },
      });
      if (response.data.items.length > 0) return response.data.items[0].position;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let origin = userLocation;
      if (locationSource === 'manual') {
        if (!manualAddress.trim()) {
          setError('Please enter an address.');
          setLoading(false);
          return;
        }
        origin = await geocodeAddress(manualAddress);
        setUserLocation(origin);
        addMarker(origin, 'blue');
      }

      const items = await axios.get('http://localhost:5000/itemlist/marketplace/').then(res => res.data || []);
      if (!items.length) {
        setNearestItems([{ itemName: 'No items available', distance: 'N/A' }]);
        setLoading(false);
        return;
      }

      const distances = await Promise.all(
        items.map(async (item) => {
          const destination = await geocodeAddress(item.location);
          addMarker(destination, 'green');
          const details = await getRouteDetails(origin, destination);
          return { ...item, details };
        })
      );

      distances.sort((a, b) => a.details.distance - b.details.distance);
      setNearestItems(distances);

      const colors = ['red', 'orange', 'pink'];
      distances.slice(0, 3).forEach(({ details }, index) => {
        addMarker(details.destination, colors[index]);
        if (mapInstanceRef.current) {
          const lineString = window.H.geo.LineString.fromFlexiblePolyline(details.polyline);
          const routeLine = new window.H.map.Polyline(lineString, { style: { strokeColor: colors[index], lineWidth: 5 } });
          mapInstanceRef.current.addObject(routeLine);
        }
      });
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (expiry) => {
    const utcExpiry = new Date(expiry);
    const diff = utcExpiry - currentTime;
    if (diff < 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleItemClick = (item) => {
    console.log(item, ' \ngot clicked');
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
      <div className="flex justify-evenly">
        <div className="flex flex-col justify-center items-center">
          <h2>Find Marketplace Items</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {loading && <p>Loading...</p>}
          <form onSubmit={handleSubmit}>
            <label>
              <input
                type="radio"
                name="locationSource"
                value="geolocation"
                checked={locationSource === 'geolocation'}
                onChange={() => { setLocationSource('geolocation'); getUserGeolocation(); }}
                className="mr-2"
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
                className="mr-2"
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
            <button className="border b-2 p-2 rounded-xl hover:cursor-pointer" type="submit" disabled={loading}>
              Find & Sort Items
            </button>
          </form>
        </div>
        <div ref={mapRef} style={{ zIndex: '-1', width: '400px', height: '400px', border: '1px solid #ccc', marginTop: '20px' }}></div>
      </div>

      {!loading && nearestItems.length > 0 && (
        <div className="grid-container">
          {nearestItems.map((item) => (
            <div key={item._id || Math.random()} className="card" onClick={() => handleItemClick(item)}>
              <div className="image-container">
                {item.photo ? (
                  <img src={item.photo} alt={item.itemName} className="w-90 h-55 object-cover" />
                ) : (
                  <div className="no-image">No Image Available</div>
                )}
              </div>
              <div className="content">
                <h3 className="item-name">{item.itemName}</h3>
                <div className="item-details">
                  {item.itemType === 'Non-Perishable' && (
                    <span>
                      Expires on: {new Date(item.expiryDate).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  {item.itemType === 'Perishable' && <span>{formatCountdown(item.expiryDate)}</span>}
                  {item.details && item.details.distance ? (
                    <span className="distance">Distance: {item.details.distance}m</span>
                  ) : (
                    <span className="no-distance"></span>
                  )}
                </div>
                <div className="served-by">
                  <div>
                    <div className="label">Served By</div>
                    <div className="value">{item.name || 'Unknown'}</div>
                  </div>
                  <div className="ratings">
                    <span className="rating-value">{item.rating || 'N/A'}</span>
                    <div className="stars">
                      {[...Array(1)].map((_, i) => (
                        <Star
                          key={i}
                          className={`star ${i < (item.ratings || 0) ? 'active' : 'inactive'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {item.type !== 'Donation' && (
                  <div className="cost">
                    Cost: {typeof item.cost === 'number' ? item.cost.toFixed(2) : item.cost || 'N/A'} Rupees
                  </div>
                )}
              </div>
            </div>
          ))}
          {selectedItem && <ItemCard item={selectedItem} onClose={handleCloseModal} />}
        </div>
      )}

      {user && (
        <AddItems
          name={user.name || 'Unknown'}
          contact={user.contact || ''}
          address={user.location || 'No Address'}
          id={user._id}
          className="z-10 relative"
        />
      )}
    </div>
  );
};

export default MarketplacePage;
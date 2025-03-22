import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const GeolocationComponent = () => {
  const HERE_API_KEY = import.meta.env.VITE_HERE_API_KEY;

  const [locationSource, setLocationSource] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [manualAddress, setManualAddress] = useState('');
  const [nearestItems, setNearestItems] = useState([]);
  const [error, setError] = useState('');

  const mapRef = useRef(null);
  const platformRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const uiRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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

      const items = await fetchMarketplaceItems();
      if (items.length === 0) {
        setNearestItems([{ itemName: 'No items available', distance: 'N/A' }]);
        return;
      }

      const distances = await Promise.all(items.map(async (item) => {
        const destination = await geocodeAddress(item.location);
        addMarker(destination, 'green');
        const details = await getRouteDetails(origin, destination);
        return { ...item, details };
      }));

      distances.sort((a, b) => a.details.distance - b.details.distance);
      setNearestItems(distances);

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
        <button type="submit">Find Items</button>
      </form>
      
      {/* Marketplace items list */}
      {nearestItems.length > 0 && (
        <ul style={{ padding: 0, listStyle: 'none', marginTop: '20px' }}>
          {nearestItems.map((item, i) => (
            <li key={i} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              <strong>{item.itemName}</strong> ({item.quantity}) - {item.cost} Rs
              <br />Seller: {item.name} | Contact: {item.contact}
              <br />Location: {item.location} | Expiry: {item.expiryDate}
              <br /><span style={{ color: 'blue' }}>Distance: {item.details.distance}m</span>
            </li>
          ))}
        </ul>
      )}
      
      <div ref={mapRef} style={{ width: '100%', height: '400px', border: '1px solid #ccc', marginTop: '20px' }}></div>
    </div>
  );
};

export default GeolocationComponent;

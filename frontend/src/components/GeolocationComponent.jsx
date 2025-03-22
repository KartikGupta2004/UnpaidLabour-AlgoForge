import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const GeolocationComponent = () => {
  const HERE_API_KEY = import.meta.env.VITE_HERE_API_KEY;

  const [locationSource, setLocationSource] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [manualAddress, setManualAddress] = useState('');
  const [nearestAddresses, setNearestAddresses] = useState([]);
  const [error, setError] = useState('');

  const mapRef = useRef(null);
  const platformRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const uiRef = useRef(null);

  const candidateAddresses = [
    'Gajalee, Kadamgiri Complex, Vile Parle East, Mumbai',
    '1441 Pizzeria Lokhandwala, Andheri West, Mumbai',
    "The Table, Colaba, Mumbai, Maharashtra, India",
    "Trishna, 7, Maheshwari Marg, Fort, Mumbai, Maharashtra, India",
    "Gajalee, Santacruz West, Mumbai, Maharashtra, India",
    "BadeMiya, Apollo Bunder, Mumbai, Maharashtra, India",
    "Bombay Canteen, Kamala Mills Compound, Lower Parel, Mumbai, Maharashtra, India",
    "Masala Library, Pali Hill, Mumbai, Maharashtra, India",
    "Hakkasan, Juhu, Mumbai, Maharashtra, India",
    "Yauatcha, Galleria Mall, Bandra Kurla Complex, Mumbai, Maharashtra, India",
    "Khyber, Linking Road, Bandra West, Mumbai, Maharashtra, India",
    "The Bombay Salad Bar, Linking Road, Bandra West, Mumbai, Maharashtra, India"
  ];

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
    setNearestAddresses([]);

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
      
      if (candidateAddresses.length === 0) {
        setNearestAddresses(['No current restaurants available']);
        return;
      }
      
      const distances = [];
      for (const address of candidateAddresses) {
        const destination = await geocodeAddress(address);
        addMarker(destination, 'green');
        const details = await getRouteDetails(origin, destination);
        distances.push({ address, details });
      }

      distances.sort((a, b) => a.details.distance - b.details.distance);
      const nearestList = distances.slice(0, candidateAddresses.length);
      setNearestAddresses(nearestList);

      const colors = ['red', 'orange', 'pink'];
      nearestList.forEach(({ details }, index) => {
        if (index < colors.length) {
          addMarker(details.destination, colors[index]);
          const lineString = window.H.geo.LineString.fromFlexiblePolyline(details.polyline);
          const routeLine = new window.H.map.Polyline(lineString, { style: { strokeColor: colors[index], lineWidth: 5 } });
          mapInstanceRef.current.addObject(routeLine);
        }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ width: '400px', margin: '0 auto' }}>
      <h2>Find Nearest Address</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          <input type="radio" name="locationSource" value="geolocation" checked={locationSource === 'geolocation'} onChange={() => { setLocationSource('geolocation'); getUserGeolocation(); }} />
          Use my current location
        </label>
        <br />
        <label>
          <input type="radio" name="locationSource" value="manual" checked={locationSource === 'manual'} onChange={() => setLocationSource('manual')} />
          Enter my address manually
        </label>
        <br/>
        {locationSource === 'manual' && <input type="text" value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} required />}
        <br/><button type="submit">Find Nearest Address</button>
      </form>
      {nearestAddresses.length > 0 && <ul>{nearestAddresses.map((addr, i) => <li key={i} style={{ color: 'black' }}><span style={{ color: ['red', 'orange', 'pink'][i] }}>●</span> {addr.address} - {addr.details.distance}m</li>)}</ul>}
      <div ref={mapRef} style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}></div>
    </div>
  );
};
export default GeolocationComponent;

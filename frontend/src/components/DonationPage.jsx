import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Star } from "lucide-react"; import { Plus } from 'lucide-react';
import AddItems from './AddItems';
import '../MarketPlace.css'
const DonationPage = () => {
  const HERE_API_KEY = import.meta.env.VITE_HERE_API_KEY;

  const [locationSource, setLocationSource] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [manualAddress, setManualAddress] = useState('');
  const [nearestItems, setNearestItems] = useState([]);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const role = localStorage.getItem('userType')
  // To track which items have already been processed for deletion
  const expiredProcessed = useRef(new Set());
  const [flag, setFlag] = useState(false);
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
        const response = await axios.get('http://localhost:5000/itemlist/donations/');
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
    const deleteExpiredItems = async () => {
      const now = new Date();
  
      const expiredItems = nearestItems.filter((item) => {
        const expiryTime = new Date(item.expiryDate);
        return expiryTime <= now && !expiredProcessed.current.has(item._id);
      });
  
      if (expiredItems.length === 0) return; // ✅ Prevent unnecessary updates
  
      for (const item of expiredItems) {
        console.log(item);
        try {
          await axios.delete(`http://localhost:5000/itemlist/mktplc/${item._id}`);
          expiredProcessed.current.add(item._id);
        } catch (err) {
          console.error('Error deleting expired item:', err.message);
        }
      }
  
      setNearestItems((prevItems) =>
        prevItems.filter((item) => new Date(item.expiryDate) > now)
      ); // ✅ Update state without causing infinite loops
    };
  
    const interval = setInterval(deleteExpiredItems, 30000); // ✅ Run every 30 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [nearestItems]); // ✅ Only runs when `nearestItems` change
  

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
      const response = await axios.get('http://localhost:5000/itemlist/donations/');
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
    <>
    <div style={{display:'flex', flexDirection: 'column', margin: '0 auto' }}>
      <div className='flex justify-evenly'>
        <div className='flex flex-col justify-center items-center'>
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
            className='mr-2'
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
            className='mr-2'
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
        <button className='border b-2 p-2 rounded-xl hover: cursor-pointer' type="submit">Find & Sort Items</button>
      </form>
      </div>
      <div ref={mapRef} style={{ zIndex: '-1', width: '400px', height: '400px', border: '1px solid #ccc', marginTop: '20px' }}></div>
      </div>
      {/* Marketplace items list */}
      {/* Marketplace items list */}
      {nearestItems.length > 0 && (
  <div className="grid-container">
    {nearestItems.map((item, i) => (
      <div key={i} className="card">
        {/* Image Section */}
        <div className="image-container">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.itemName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="no-image">No Image Available</div>
          )}
        </div>

        {/* Content Section */}
        <div className="content">
          <h3 className="item-name">{item.itemName}</h3>

          <div className="item-details">
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
              ? <span className="distance">Distance: {item.details.distance}m</span>
              : <span className="no-distance"></span>}
          </div>

          <div className="served-by">
            <div>
              <div className="label">Served By</div>
              <div className="value">{item.name}</div>
            </div>

            <div className="ratings">
              {item.listedByType === "Resturant" && <span className="rating-value">{item.ratings}</span>}
              <div className="stars">
                {[...Array(1)].map((_, i) => (
                  <Star
                    key={i}
                    className={`star ${i < item.ratings ? "active" : "inactive"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          
        </div>
      </div>
    ))}
  </div>
)}
    </div>
    {role !== 'ngo' && <AddItems className= "z-10 block relative"/>}
    {/* <button>
      <div className='flex justify-end items-end mt-10 mr-10 mb-10'>
        <Plus className='bg-red-400 w-12 h-12 rounded-full p-2 hover:cursor-pointer'/>
      </div> 
      </button> */}
      </>
  );
};

export default DonationPage;

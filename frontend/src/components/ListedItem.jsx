import React, { useEffect, useState } from "react";
import axios from "axios";
import "../ListedItem.css";

const ListedItem = () => {
  const itemId = "67defecaec1898d9491f90ef"; // Hardcoded item ID
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/itemlist/${itemId}`);
        
        const fetchedItem = response.data;
        
        setItems([
          {
            itemId: fetchedItem._id,
            itemName: fetchedItem.itemName,
            itemType: fetchedItem.itemType,
            quantity: fetchedItem.quantity,
            cost: fetchedItem.cost,
            expiresAt: new Date(fetchedItem.expiryDate).getTime(),
          },
        ]);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prevItems) =>
        prevItems
          .map((item) => {
            const newTimeLeft = Math.floor((item.expiresAt - new Date().getTime()) / 1000);
            return newTimeLeft <= 0 ? null : { ...item, expiresAt: item.expiresAt };
          })
          .filter(Boolean)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const carouselInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(carouselInterval);
  }, [items]);

  if (items.length === 0) {
    return <p>All items have expired and are no longer available.</p>;
  }

  const handleOrder = (item) => {
    alert(`Order placed for ${item.itemName}`);
  };

  return (
    <div className="carousel-container">
      <div className="item-container">
        <div className="image-placeholder">Image</div>
        <div className="info">
          <p className="timer">
            {Math.floor((items[currentIndex].expiresAt - new Date().getTime()) / 1000) > 0
              ? `${Math.floor((items[currentIndex].expiresAt - new Date().getTime()) / 60000)}m ${Math.floor(((items[currentIndex].expiresAt - new Date().getTime()) / 1000) % 60)}s left`
              : "Not available anymore"}
          </p>
          <h2>{items[currentIndex].itemName}</h2>
          <p>Type: {items[currentIndex].itemType}</p>
          <p>Quantity: {items[currentIndex].quantity}</p>
          <p className="cost">Cost: ${items[currentIndex].cost}</p>
          <button className="order-now" onClick={() => handleOrder(items[currentIndex])}>
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListedItem;

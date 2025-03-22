import React, { useEffect, useState } from "react";
import axios from "axios";
import "../ListedItem.css";

const dummyItems = [
  {
    itemId: "item1", 
    itemName: "Fresh Apples", 
    itemType: "Perishable",
    quantity: 10,
    cost: 15,
    expiresAt: new Date().getTime() + 9000, // 1.5 min
  },
  {
    itemId: "item2",
    itemName: "Canned Beans",
    itemType: "Non-Perishable",
    quantity: 7,
    cost: 8,
    expiresAt: new Date().getTime() + 12000, // 2 min
  },
  {
    itemId: "item3",
    itemName: "Rice Packets",
    itemType: "Non-Perishable",
    quantity: 5,
    cost: 12,
    expiresAt: new Date().getTime() + 6000, // 1 min
  },
  {
    itemId: "item4",
    itemName: "Milk Bottles",
    itemType: "Perishable",
    quantity: 6,
    cost: 10,
    expiresAt: new Date().getTime() + 15000, // 2.5 min
  },
];

const ListedItem = () => {
  const [items, setItems] = useState(dummyItems);
  const [currentIndex, setCurrentIndex] = useState(0);

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
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 3000); // Move every 3 sec
  
    return () => clearInterval(interval);
  }, [items]);
  
  return (
    <div className="carousel-container">
      <div
        className="item-container"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="carousel-item">
            <div className="image-placeholder">Image</div>
            <div className="info">
              <p className="timer">
                {Math.floor((item.expiresAt - new Date().getTime()) / 1000) > 0
                  ? `${Math.floor((item.expiresAt - new Date().getTime()) / 60000)}m ${Math.floor(((item.expiresAt - new Date().getTime()) / 1000) % 60)}s left`
                  : "Not available anymore"}
              </p>
              <h2>{item.itemName}</h2>
              <p>Type: {item.itemType}</p>
              <p>Quantity: {item.quantity}</p>
              <p className="cost">Cost: ${item.cost}</p>
              <button className="order-now" onClick={() => handleOrder(item)}>
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default ListedItem;

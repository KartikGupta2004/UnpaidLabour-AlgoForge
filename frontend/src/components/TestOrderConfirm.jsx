import React, { useState } from "react";

const ConfirmButtons = ({ transactionId, serverUserId, receiverUserId }) => {
  const [serverConfirmed, setServerConfirmed] = useState(false);
  const [receiverConfirmed, setReceiverConfirmed] = useState(false);

  const handleConfirm = async (userId, role) => {
    try {
      const response = await fetch(`http://localhost:5000/transactions/confirm/${transactionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (response.ok) {
        if (role === "server") {
          setServerConfirmed(true);
        } else {
          setReceiverConfirmed(true);
        }
        alert(`${role} confirmation successful!`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error confirming transaction:", error);
    }
  };

  return (
    <div>
      <h3>Confirm Delivery</h3>
      <button onClick={() => handleConfirm(serverUserId, "server")} disabled={serverConfirmed}>
        {serverConfirmed ? "Server Confirmed" : "Server Confirm"}
      </button>

      <button onClick={() => handleConfirm(receiverUserId, "receiver")} disabled={receiverConfirmed}>
        {receiverConfirmed ? "Receiver Confirmed" : "Receiver Confirm"}
      </button>
    </div>
  );
};

export default ConfirmButtons;

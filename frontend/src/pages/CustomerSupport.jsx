import { useState } from "react";

export default function CustomerService() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ name: "", transactionId: "", details: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.transactionId || !form.details) return;
    setComplaints([...complaints, form]);
    setForm({ name: "", transactionId: "", details: "" });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "24px", backgroundColor: "#f3f4f6", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ padding: "24px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", width: "100%", backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px", textAlign: "center", color: "#374151" }}>Raise a Complaint</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", width: "100%" }}
          />
          <input
            name="transactionId"
            placeholder="Transaction ID"
            value={form.transactionId}
            onChange={handleChange}
            required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", width: "100%" }}
          />
          <textarea
            name="details"
            placeholder="Describe your complaint"
            value={form.details}
            onChange={handleChange}
            required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", width: "100%", height: "100px" }}
          />
          <button type="submit" style={{ width: "100%", padding: "12px", color: "white", backgroundColor: "#2563eb", borderRadius: "8px", cursor: "pointer", border: "none" }}>Submit Complaint</button>
        </form>
      </div>

      <div style={{ marginTop: "24px", width: "100%" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", textAlign: "center", color: "#374151" }}>Previous Complaints</h2>
        {complaints.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>No complaints submitted yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {complaints.map((comp, index) => (
              <div key={index} style={{ padding: "16px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <p style={{ color: "#374151" }}><strong>Name:</strong> {comp.name}</p>
                <p style={{ color: "#374151" }}><strong>Transaction ID:</strong> {comp.transactionId}</p>
                <p style={{ color: "#374151" }}><strong>Complaint:</strong> {comp.details}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

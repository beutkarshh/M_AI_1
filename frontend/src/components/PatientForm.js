import React, { useState } from "react";

function PatientForm({ setData }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    symptoms: "",
    duration: "",
    history: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setData(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Enter Patient Details</h2>
      {["name", "age", "gender", "symptoms", "duration", "history"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block capitalize">{field}</label>
          <input
            type="text"
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
      ))}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Analyze
      </button>
    </form>
  );
}

export default PatientForm;

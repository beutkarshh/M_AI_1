import React from "react";

function AgentSummary({ data }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Agent Analysis</h2>
      <p><strong>Symptoms:</strong> {data.symptoms.join(", ")}</p>
      <p><strong>Duration:</strong> {data.duration}</p>
      <p><strong>History:</strong> {data.patient_history}</p>
      <h3 className="mt-4 font-semibold">Possible Diseases:</h3>
      <ul className="list-disc ml-6">
        {data.possible_diseases.map((d, i) => (
          <li key={i}>{d.disease} ({(d.confidence * 100).toFixed(0)}%)</li>
        ))}
      </ul>
    </div>
  );
}

export default AgentSummary;

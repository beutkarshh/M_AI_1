import React from "react";

function SummaryPanel({ summary }) {
  const downloadPDF = () => {
    const element = document.createElement("a");
    const file = new Blob([summary], { type: "application/pdf" });
    element.href = URL.createObjectURL(file);
    element.download = "report.pdf";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Final Summary</h2>
      <p>{summary}</p>
      <button onClick={downloadPDF} className="mt-4 bg-green-600 text-white py-2 px-4 rounded">
        Download PDF
      </button>
    </div>
  );
}

export default SummaryPanel;

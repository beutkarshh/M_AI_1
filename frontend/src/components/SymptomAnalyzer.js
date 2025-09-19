import React, { useState } from 'react';
import ApiService from '../services/ApiService';

const SymptomAnalyzer = () => {
  const [patientReport, setPatientReport] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!patientReport.trim()) {
      setError('Please enter a patient report');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await ApiService.analyzeSymptoms(patientReport);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Medical AI Symptom Analyzer</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Patient Report
        </label>
        <textarea
          value={patientReport}
          onChange={(e) => setPatientReport(e.target.value)}
          placeholder="Describe the patient's symptoms, medical history, and any relevant information..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Analysis Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(analysis.analysis, null, 2)}
            </pre>
          </div>

          {/* Literature Review */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Literature Review</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(analysis.literature, null, 2)}
            </pre>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="prose max-w-none">
              {analysis.summary?.summary ? (
                <div dangerouslySetInnerHTML={{ __html: analysis.summary.summary.replace(/\n/g, '<br />') }} />
              ) : (
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify(analysis.summary, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomAnalyzer;
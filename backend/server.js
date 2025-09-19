import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/analyze", (req, res) => {
  const { name, age, gender, symptoms, duration, history } = req.body;

  res.json({
    analysis: {
      symptoms: symptoms.split(","),
      duration,
      patient_history: history,
      possible_diseases: [
        { disease: "Migraine", confidence: 0.7 },
        { disease: "Fibromyalgia", confidence: 0.6 },
        { disease: "Viral Infection", confidence: 0.5 }
      ]
    },
    summary: `Patient ${name}, ${age}, ${gender}, shows symptoms of ${symptoms}. Further evaluation needed.`
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

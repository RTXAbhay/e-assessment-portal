// backend/seed.js
import mongoose from "mongoose";
import Exam from "./models/Exam.js";

// your original five subjects & questions
const initialExams = [
  {
    subject: "Mathematics",
    questions: [
      { text: "7 × 8 = ?", options: ["54","56","64","48"], answer: "56" },
      { text: "√49 = ?", options: ["5","6","7","8"], answer: "7" },
      { text: "12 + 15 = ?", options: ["25","26","27","28"], answer: "27" },
      { text: "9² = ?", options: ["81","72","79","90"], answer: "81" },
      { text: "15 − 9 = ?", options: ["4","5","6","7"], answer: "6" },
    ],
  },
  {
    subject: "Physics",
    questions: [
      { text: "Speed of light in vacuum?", options: ["3×10⁸","1.5×10⁸","3×10⁶","1×10⁹"], answer: "3×10⁸" },
      { text: "Unit of force?", options: ["Joule","Newton","Pascal","Watt"], answer: "Newton" },
      { text: "Acceleration due to gravity on Earth?", options: ["9.8 m/s²","8.9","10.8","11.2"], answer: "9.8 m/s²" },
      { text: "What is work?", options: ["F×d","m×a","v×t","P×V"], answer: "F×d" },
      { text: "SI unit of pressure?", options: ["Pa","atm","bar","psi"], answer: "Pa" },
    ],
  },
  {
    subject: "Chemistry",
    questions: [
      { text: "H₂O is?", options: ["Salt","Water","Acid","Base"], answer: "Water" },
      { text: "Atomic number of O?", options: ["6","7","8","9"], answer: "8" },
      { text: "pH of neutral solution?", options: ["7","0","14","1"], answer: "7" },
      { text: "Formula of table salt?", options: ["KCl","NaCl","CaCl₂","MgCl₂"], answer: "NaCl" },
      { text: "Gas evolved in reaction of acid + metal?", options: ["O₂","H₂","CO₂","N₂"], answer: "H₂" },
    ],
  },
  {
    subject: "Biology",
    questions: [
      { text: "Basic unit of life?", options: ["Cell","Tissue","Organ","Organism"], answer: "Cell" },
      { text: "Photosynthesis occurs in?", options: ["Mitochondria","Chloroplast","Nucleus","Ribosome"], answer: "Chloroplast" },
      { text: "Blood group with no antigens?", options: ["A","B","AB","O"], answer: "O" },
      { text: "Human DNA shape?", options: ["Z-helix","Double helix","Single strand","Triple helix"], answer: "Double helix" },
      { text: "Site of protein synthesis?", options: ["Golgi","ER","Ribosome","Lysosome"], answer: "Ribosome" },
    ],
  },
  {
    subject: "History",
    questions: [
      { text: "First President of USA?", options: ["Lincoln","Jefferson","Washington","Adams"], answer: "Washington" },
      { text: "Year India got independence?", options: ["1947","1950","1945","1939"], answer: "1947" },
      { text: "Battle of Hastings year?", options: ["1066","1215","1415","1688"], answer: "1066" },
      { text: "Who wrote the Iliad?", options: ["Virgil","Homer","Ovid","Plato"], answer: "Homer" },
      { text: "Roman Empire capital?", options: ["Rome","Athens","Carthage","Constantinople"], answer: "Rome" },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect("mongodb://localhost:27017/eassessment");
    console.log("🔌 Connected to MongoDB");

    // wipe existing exams so we don’t duplicate
    await Exam.deleteMany({});
    console.log("🗑️  Cleared existing exams");

    // insert your initial set
    const docs = await Exam.insertMany(initialExams);
    console.log(`✅ Seeded ${docs.length} exams`);

  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔒 Disconnected");
  }
}

seed();

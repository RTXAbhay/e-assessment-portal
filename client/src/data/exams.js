// File: src/data/exams.js
export const exams = [
  {
    subject: 'Mathematics',
    questions: [
      { id: 1, text: '7 × 8 = ?', options: ['54', '56', '64', '48'], answer: '56' },
      { id: 2, text: '√49 = ?', options: ['5', '6', '7', '8'], answer: '7' },
      { id: 3, text: '12 + 15 = ?', options: ['25', '26', '27', '28'], answer: '27' },
      { id: 4, text: '9² = ?', options: ['81', '72', '79', '90'], answer: '81' },
      { id: 5, text: '15 − 9 = ?', options: ['4', '5', '6', '7'], answer: '6' },
    ],
  },
  {
    subject: 'Physics',
    questions: [
      { id: 1, text: 'Speed of light in vacuum?', options: ['3×10⁸', '1.5×10⁸', '3×10⁶', '1×10⁹'], answer: '3×10⁸' },
      { id: 2, text: 'Unit of force?', options: ['Joule', 'Newton', 'Pascal', 'Watt'], answer: 'Newton' },
      { id: 3, text: 'Acceleration due to gravity on Earth?', options: ['9.8 m/s²', '8.9', '10.8', '11.2'], answer: '9.8 m/s²' },
      { id: 4, text: 'What is work?', options: ['F×d', 'm×a', 'v×t', 'P×V'], answer: 'F×d' },
      { id: 5, text: 'SI unit of pressure?', options: ['Pa', 'atm', 'bar', 'psi'], answer: 'Pa' },
    ],
  },
  {
    subject: 'Chemistry',
    questions: [
      { id: 1, text: 'H₂O is?', options: ['Salt', 'Water', 'Acid', 'Base'], answer: 'Water' },
      { id: 2, text: 'Atomic number of O?', options: ['6', '7', '8', '9'], answer: '8' },
      { id: 3, text: 'pH of neutral solution?', options: ['7', '0', '14', '1'], answer: '7' },
      { id: 4, text: 'Formula of table salt?', options: ['KCl', 'NaCl', 'CaCl₂', 'MgCl₂'], answer: 'NaCl' },
      { id: 5, text: 'Gas evolved in acid + metal reaction?', options: ['O₂', 'H₂', 'CO₂', 'N₂'], answer: 'H₂' },
    ],
  },
  {
    subject: 'Biology',
    questions: [
      { id: 1, text: 'Basic unit of life?', options: ['Cell', 'Tissue', 'Organ', 'Organism'], answer: 'Cell' },
      { id: 2, text: 'Photosynthesis occurs in?', options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'], answer: 'Chloroplast' },
      { id: 3, text: 'Blood group with no antigens?', options: ['A', 'B', 'AB', 'O'], answer: 'O' },
      { id: 4, text: 'Human DNA shape?', options: ['Z-helix', 'Double helix', 'Single strand', 'Triple helix'], answer: 'Double helix' },
      { id: 5, text: 'Site of protein synthesis?', options: ['Golgi', 'ER', 'Ribosome', 'Lysosome'], answer: 'Ribosome' },
    ],
  },
  {
    subject: 'History',
    questions: [
      { id: 1, text: 'First President of USA?', options: ['Lincoln', 'Jefferson', 'Washington', 'Adams'], answer: 'Washington' },
      { id: 2, text: 'Year India got independence?', options: ['1947', '1950', '1945', '1939'], answer: '1947' },
      { id: 3, text: 'Battle of Hastings year?', options: ['1066', '1215', '1415', '1688'], answer: '1066' },
      { id: 4, text: 'Who wrote the Iliad?', options: ['Virgil', 'Homer', 'Ovid', 'Plato'], answer: 'Homer' },
      { id: 5, text: 'Capital of the Roman Empire?', options: ['Rome', 'Athens', 'Carthage', 'Constantinople'], answer: 'Rome' },
    ],
  }
];
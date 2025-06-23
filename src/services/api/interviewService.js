import interviewNotesData from '@/services/mockData/interviewNotes.json';
import interviewQuestionsData from '@/services/mockData/interviewQuestions.json';

// Notes data management
let notesData = [...interviewNotesData];
let lastNoteId = Math.max(...notesData.map(note => note.Id), 0);

// Questions data management
let questionsData = [...interviewQuestionsData];
let lastQuestionId = Math.max(...questionsData.map(question => question.Id), 0);

// Utility function to simulate API delay
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Interview Notes Service Functions
export const getAllNotes = async () => {
  await delay();
  return [...notesData];
};

export const getNoteById = async (id) => {
  await delay();
  const noteId = parseInt(id);
  if (isNaN(noteId)) return null;
  
  const note = notesData.find(note => note.Id === noteId);
  return note ? { ...note } : null;
};

export const createNote = async (noteData) => {
  await delay();
  const newNote = {
    ...noteData,
    Id: ++lastNoteId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  notesData.push(newNote);
  return { ...newNote };
};

export const updateNote = async (id, noteData) => {
  await delay();
  const noteId = parseInt(id);
  if (isNaN(noteId)) throw new Error('Invalid note ID');
  
  const index = notesData.findIndex(note => note.Id === noteId);
  if (index === -1) throw new Error('Note not found');
  
  const updatedNote = {
    ...notesData[index],
    ...noteData,
    Id: noteId, // Prevent ID modification
    updatedAt: new Date().toISOString()
  };
  
  notesData[index] = updatedNote;
  return { ...updatedNote };
};

export const deleteNote = async (id) => {
  await delay();
  const noteId = parseInt(id);
  if (isNaN(noteId)) throw new Error('Invalid note ID');
  
  const index = notesData.findIndex(note => note.Id === noteId);
  if (index === -1) throw new Error('Note not found');
  
  notesData.splice(index, 1);
  return true;
};

// Interview Questions Service Functions
export const getAllQuestions = async () => {
  await delay();
  return [...questionsData];
};

export const getQuestionById = async (id) => {
  await delay();
  const questionId = parseInt(id);
  if (isNaN(questionId)) return null;
  
  const question = questionsData.find(question => question.Id === questionId);
  return question ? { ...question } : null;
};

export const createQuestion = async (questionData) => {
  await delay();
  const newQuestion = {
    ...questionData,
    Id: ++lastQuestionId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  questionsData.push(newQuestion);
  return { ...newQuestion };
};

export const updateQuestion = async (id, questionData) => {
  await delay();
  const questionId = parseInt(id);
  if (isNaN(questionId)) throw new Error('Invalid question ID');
  
  const index = questionsData.findIndex(question => question.Id === questionId);
  if (index === -1) throw new Error('Question not found');
  
  const updatedQuestion = {
    ...questionsData[index],
    ...questionData,
    Id: questionId, // Prevent ID modification
    updatedAt: new Date().toISOString()
  };
  
  questionsData[index] = updatedQuestion;
  return { ...updatedQuestion };
};

export const deleteQuestion = async (id) => {
  await delay();
  const questionId = parseInt(id);
  if (isNaN(questionId)) throw new Error('Invalid question ID');
  
  const index = questionsData.findIndex(question => question.Id === questionId);
  if (index === -1) throw new Error('Question not found');
  
  questionsData.splice(index, 1);
  return true;
};
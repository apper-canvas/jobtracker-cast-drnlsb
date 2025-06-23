import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import SearchBar from '@/components/molecules/SearchBar';
import EmptyState from '@/components/molecules/EmptyState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '@/services/api/interviewService';

const Interview = () => {
  const [activeTab, setActiveTab] = useState('notes');
  
  // Notes state
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState(null);
  const [noteSearchTerm, setNoteSearchTerm] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  
  // Questions state
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState(null);
  const [questionSearchTerm, setQuestionSearchTerm] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Load data
  useEffect(() => {
    loadNotes();
    loadQuestions();
  }, []);

  const loadNotes = async () => {
    try {
      setNotesLoading(true);
      setNotesError(null);
      const data = await getAllNotes();
      setNotes(data);
    } catch (error) {
      setNotesError('Failed to load notes');
      toast.error('Failed to load notes');
    } finally {
      setNotesLoading(false);
    }
  };

  const loadQuestions = async () => {
    try {
      setQuestionsLoading(true);
      setQuestionsError(null);
      const data = await getAllQuestions();
      setQuestions(data);
    } catch (error) {
      setQuestionsError('Failed to load questions');
      toast.error('Failed to load questions');
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Note handlers
  const handleNoteSubmit = async (noteData) => {
    try {
      if (editingNote) {
        const updatedNote = await updateNote(editingNote.Id, noteData);
        setNotes(prev => prev.map(note => note.Id === editingNote.Id ? updatedNote : note));
        toast.success('Note updated successfully');
      } else {
        const newNote = await createNote(noteData);
        setNotes(prev => [...prev, newNote]);
        toast.success('Note created successfully');
      }
      setShowNoteForm(false);
      setEditingNote(null);
    } catch (error) {
      toast.error(editingNote ? 'Failed to update note' : 'Failed to create note');
    }
  };

  const handleNoteEdit = (note) => {
    setEditingNote(note);
    setShowNoteForm(true);
  };

  const handleNoteDelete = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await deleteNote(noteId);
      setNotes(prev => prev.filter(note => note.Id !== noteId));
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  // Question handlers
  const handleQuestionSubmit = async (questionData) => {
    try {
      if (editingQuestion) {
        const updatedQuestion = await updateQuestion(editingQuestion.Id, questionData);
        setQuestions(prev => prev.map(question => question.Id === editingQuestion.Id ? updatedQuestion : question));
        toast.success('Question updated successfully');
      } else {
        const newQuestion = await createQuestion(questionData);
        setQuestions(prev => [...prev, newQuestion]);
        toast.success('Question created successfully');
      }
      setShowQuestionForm(false);
      setEditingQuestion(null);
    } catch (error) {
      toast.error(editingQuestion ? 'Failed to update question' : 'Failed to create question');
    }
  };

  const handleQuestionEdit = (question) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const handleQuestionDelete = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await deleteQuestion(questionId);
      setQuestions(prev => prev.filter(question => question.Id !== questionId));
      toast.success('Question deleted successfully');
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  // Filter data based on search
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(noteSearchTerm.toLowerCase()) ||
    note.company.toLowerCase().includes(noteSearchTerm.toLowerCase()) ||
    note.position.toLowerCase().includes(noteSearchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(noteSearchTerm.toLowerCase())
  );

  const filteredQuestions = questions.filter(question =>
    question.question.toLowerCase().includes(questionSearchTerm.toLowerCase()) ||
    question.category.toLowerCase().includes(questionSearchTerm.toLowerCase()) ||
    question.answer.toLowerCase().includes(questionSearchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Preparation</h1>
        <p className="text-gray-600">Organize your interview notes and practice questions</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ApperIcon name="BookOpen" size={16} className="inline mr-2" />
            Interview Notes
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'questions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ApperIcon name="HelpCircle" size={16} className="inline mr-2" />
            Practice Questions
          </button>
        </nav>
      </div>

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {/* Notes Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchBar
              value={noteSearchTerm}
              onChange={setNoteSearchTerm}
              placeholder="Search notes by title, company, or content..."
              className="max-w-md"
            />
            <Button
              onClick={() => {
                setEditingNote(null);
                setShowNoteForm(true);
              }}
              leftIcon="Plus"
            >
              Add Note
            </Button>
          </div>

          {/* Notes Content */}
          {notesLoading ? (
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <SkeletonLoader key={i} height="h-48" />
              ))}
            </div>
          ) : notesError ? (
            <Card className="text-center py-12">
              <ApperIcon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
              <p className="text-gray-600">{notesError}</p>
              <Button onClick={loadNotes} variant="outline" className="mt-4">
                Try Again
              </Button>
            </Card>
          ) : filteredNotes.length === 0 ? (
            <EmptyState
              icon="BookOpen"
              title={noteSearchTerm ? "No notes found" : "No interview notes yet"}
              description={noteSearchTerm ? "Try adjusting your search terms" : "Create your first interview note to get started"}
              action={!noteSearchTerm && (
                <Button
                  onClick={() => {
                    setEditingNote(null);
                    setShowNoteForm(true);
                  }}
                  leftIcon="Plus"
                >
                  Add Note
                </Button>
              )}
            />
          ) : (
            <div className="grid gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.Id}
                  note={note}
                  onEdit={handleNoteEdit}
                  onDelete={handleNoteDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Questions Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchBar
              value={questionSearchTerm}
              onChange={setQuestionSearchTerm}
              placeholder="Search questions by content, category, or answer..."
              className="max-w-md"
            />
            <Button
              onClick={() => {
                setEditingQuestion(null);
                setShowQuestionForm(true);
              }}
              leftIcon="Plus"
            >
              Add Question
            </Button>
          </div>

          {/* Questions Content */}
          {questionsLoading ? (
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <SkeletonLoader key={i} height="h-48" />
              ))}
            </div>
          ) : questionsError ? (
            <Card className="text-center py-12">
              <ApperIcon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
              <p className="text-gray-600">{questionsError}</p>
              <Button onClick={loadQuestions} variant="outline" className="mt-4">
                Try Again
              </Button>
            </Card>
          ) : filteredQuestions.length === 0 ? (
            <EmptyState
              icon="HelpCircle"
              title={questionSearchTerm ? "No questions found" : "No practice questions yet"}
              description={questionSearchTerm ? "Try adjusting your search terms" : "Create your first practice question to get started"}
              action={!questionSearchTerm && (
                <Button
                  onClick={() => {
                    setEditingQuestion(null);
                    setShowQuestionForm(true);
                  }}
                  leftIcon="Plus"
                >
                  Add Question
                </Button>
              )}
            />
          ) : (
            <div className="grid gap-6">
              {filteredQuestions.map((question) => (
                <QuestionCard
                  key={question.Id}
                  question={question}
                  onEdit={handleQuestionEdit}
                  onDelete={handleQuestionDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Note Form Modal */}
      {showNoteForm && (
        <NoteForm
          note={editingNote}
          onSubmit={handleNoteSubmit}
          onClose={() => {
            setShowNoteForm(false);
            setEditingNote(null);
          }}
        />
      )}

      {/* Question Form Modal */}
      {showQuestionForm && (
        <QuestionForm
          question={editingQuestion}
          onSubmit={handleQuestionSubmit}
          onClose={() => {
            setShowQuestionForm(false);
            setEditingQuestion(null);
          }}
        />
      )}
    </div>
  );
};

// Note Card Component
const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{note.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <ApperIcon name="Building" size={14} />
              {note.company}
            </span>
            <span className="flex items-center gap-1">
              <ApperIcon name="Briefcase" size={14} />
              {note.position}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(note)}
            leftIcon="Edit"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(note.Id)}
            leftIcon="Trash2"
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">{note.content}</p>
      </div>
      
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
};

// Question Card Component
const QuestionCard = ({ question, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
              {question.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.question}</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(question)}
            leftIcon="Edit"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(question.Id)}
            leftIcon="Trash2"
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Answer:</h4>
          <p className={`text-gray-700 whitespace-pre-wrap ${!isExpanded ? 'line-clamp-2' : ''}`}>
            {question.answer}
          </p>
        </div>
        
        {question.notes && (
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Notes:</h4>
            <p className={`text-gray-600 text-sm whitespace-pre-wrap ${!isExpanded ? 'line-clamp-1' : ''}`}>
              {question.notes}
            </p>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          leftIcon={isExpanded ? "ChevronUp" : "ChevronDown"}
          className="text-blue-600 hover:text-blue-700"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </div>
    </Card>
  );
};

// Note Form Component
const NoteForm = ({ note, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    company: note?.company || '',
    position: note?.position || '',
    content: note?.content || '',
    tags: note?.tags ? note.tags.join(', ') : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {note ? 'Edit Note' : 'Add New Note'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} leftIcon="X" />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Software Engineer at Tech Corp"
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Company name"
                required
              />
              
              <Input
                label="Position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Job position"
                required
              />
            </div>
            
            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your interview notes here..."
              rows={6}
              required
            />
            
            <Input
              label="Tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., technical, react, nodejs (comma-separated)"
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {note ? 'Update Note' : 'Create Note'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Question Form Component
const QuestionForm = ({ question, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    question: question?.question || '',
    category: question?.category || 'General',
    difficulty: question?.difficulty || 'Medium',
    answer: question?.answer || '',
    notes: question?.notes || ''
  });

  const categories = ['General', 'Technical', 'Behavioral', 'Situational', 'Company-Specific'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {question ? 'Edit Question' : 'Add New Question'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} leftIcon="X" />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              label="Question"
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Enter the interview question..."
              rows={3}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                options={categories.map(cat => ({ value: cat, label: cat }))}
                required
              />
              
              <Select
                label="Difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                options={difficulties.map(diff => ({ value: diff, label: diff }))}
                required
              />
            </div>
            
            <Textarea
              label="Answer"
              value={formData.answer}
              onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="Write your prepared answer..."
              rows={4}
              required
            />
            
            <Textarea
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or tips for this question..."
              rows={2}
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {question ? 'Update Question' : 'Create Question'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Interview;
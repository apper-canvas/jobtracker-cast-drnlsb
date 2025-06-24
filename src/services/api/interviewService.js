const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

// ApperClient setup
let apperClient = null;

const initClient = () => {
  if (typeof window !== 'undefined' && window.ApperSDK && !apperClient) {
    const { ApperClient } = window.ApperSDK;
    apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }
};

// Interview Notes Service Functions
export const getAllNotes = async () => {
  await delay();
  if (!apperClient) initClient();
  
  const params = {
    fields: [
      { field: { Name: "Name" } },
      { field: { Name: "title" } },
      { field: { Name: "company" } },
      { field: { Name: "position" } },
      { field: { Name: "content" } },
      { field: { Name: "created_at" } },
      { field: { Name: "updated_at" } }
    ],
    orderBy: [{ fieldName: "created_at", sorttype: "DESC" }]
  };

  const response = await apperClient.fetchRecords('interview_note', params);
  
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch interview notes');
  }

  return response.data || [];
};

export const getNoteById = async (id) => {
  await delay();
  if (!apperClient) initClient();
  
  const noteId = parseInt(id);
  if (isNaN(noteId)) return null;

  const params = {
    fields: [
      { field: { Name: "Name" } },
      { field: { Name: "title" } },
      { field: { Name: "company" } },
      { field: { Name: "position" } },
      { field: { Name: "content" } },
      { field: { Name: "created_at" } },
      { field: { Name: "updated_at" } }
    ]
  };

  const response = await apperClient.getRecordById('interview_note', noteId, params);
  
  if (!response.success) {
    return null;
  }

  return response.data;
};

export const createNote = async (noteData) => {
  await delay();
  if (!apperClient) initClient();

  const params = {
    records: [{
      Name: noteData.title || '',
      title: noteData.title || '',
      company: noteData.company || '',
      position: noteData.position || '',
      content: noteData.content || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]
  };

  const response = await apperClient.createRecord('interview_note', params);
  
  if (!response.success) {
    throw new Error(response.message || 'Failed to create interview note');
  }

  if (response.results) {
    const successfulRecords = response.results.filter(result => result.success);
    const failedRecords = response.results.filter(result => !result.success);
    
    if (failedRecords.length > 0) {
      console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      throw new Error(failedRecords[0].message || 'Failed to create interview note');
    }
    
    return successfulRecords[0]?.data;
  }

  return response.data;
};

export const updateNote = async (id, noteData) => {
  await delay();
  if (!apperClient) initClient();
  
  const noteId = parseInt(id);
  if (isNaN(noteId)) throw new Error('Invalid note ID');

  const params = {
    records: [{
      Id: noteId,
      Name: noteData.title,
      title: noteData.title,
      company: noteData.company,
      position: noteData.position,
      content: noteData.content,
      updated_at: new Date().toISOString()
    }]
  };

  const response = await apperClient.updateRecord('interview_note', params);
  
  if (!response.success) {
    throw new Error(response.message || 'Failed to update interview note');
  }

  if (response.results) {
    const successfulRecords = response.results.filter(result => result.success);
    const failedRecords = response.results.filter(result => !result.success);
    
    if (failedRecords.length > 0) {
      console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      throw new Error(failedRecords[0].message || 'Failed to update interview note');
    }
    
    return successfulRecords[0]?.data;
  }

  return response.data;
};

export const deleteNote = async (id) => {
  await delay();
  if (!apperClient) initClient();
  
  const noteId = parseInt(id);
  if (isNaN(noteId)) throw new Error('Invalid note ID');

  const params = {
    RecordIds: [noteId]
  };

  const response = await apperClient.deleteRecord('interview_note', params);
  
  if (!response.success) {
    throw new Error(response.message || 'Failed to delete interview note');
  }

  if (response.results) {
    const failedRecords = response.results.filter(result => !result.success);
    
    if (failedRecords.length > 0) {
      console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      throw new Error(failedRecords[0].message || 'Failed to delete interview note');
    }
  }

  return true;
};

// Interview Questions Service Functions
export const getAllQuestions = async () => {
  await delay();
  if (!apperClient) initClient();
  
  const params = {
    fields: [
      { field: { Name: "Name" } },
      { field: { Name: "question" } },
      { field: { Name: "category" } },
      { field: { Name: "difficulty" } },
      { field: { Name: "answer" } },
      { field: { Name: "notes" } },
      { field: { Name: "created_at" } },
      { field: { Name: "updated_at" } }
    ],
    orderBy: [{ fieldName: "created_at", sorttype: "DESC" }]
  };

  const response = await apperClient.fetchRecords('interview_question', params);
  
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch interview questions');
  }

  return response.data || [];
};

export const getQuestionById = async (id) => {
  await delay();
  if (!apperClient) initClient();
  
  const questionId = parseInt(id);
  if (isNaN(questionId)) return null;

  const params = {
    fields: [
      { field: { Name: "Name" } },
      { field: { Name: "question" } },
      { field: { Name: "category" } },
      { field: { Name: "difficulty" } },
      { field: { Name: "answer" } },
      { field: { Name: "notes" } },
      { field: { Name: "created_at" } },
      { field: { Name: "updated_at" } }
    ]
  };

  const response = await apperClient.getRecordById('interview_question', questionId, params);
  
  if (!response.success) {
    return null;
  }

  return response.data;
};

export const createQuestion = async (questionData) => {
  await delay();
  if (!apperClient) initClient();

  const params = {
    records: [{
      Name: questionData.question ? questionData.question.substring(0, 50) + '...' : '',
      question: questionData.question || '',
      category: questionData.category || 'General',
      difficulty: questionData.difficulty || 'Medium',
      answer: questionData.answer || '',
      notes: questionData.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]
  };

  const response = await apperClient.createRecord('interview_question', params);
  
  if (!response.success) {
    throw new Error(response.message || 'Failed to create interview question');
  }

  if (response.results) {
    const successfulRecords = response.results.filter(result => result.success);
    const failedRecords = response.results.filter(result => !result.success);
    
    if (failedRecords.length > 0) {
      console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      throw new Error(failedRecords[0].message || 'Failed to create interview question');
    }
    
    return successfulRecords[0]?.data;
  }

  return response.data;
};

export const updateQuestion = async (id, questionData) => {
  await delay();
  if (!apperClient) initClient();
  
  const questionId = parseInt(id);
  if (isNaN(questionId)) throw new Error('Invalid question ID');

  const params = {
    records: [{
      Id: questionId,
      Name: questionData.question ? questionData.question.substring(0, 50) + '...' : '',
      question: questionData.question,
      category: questionData.category,
      difficulty: questionData.difficulty,
      answer: questionData.answer,
      notes: questionData.notes,
      updated_at: new Date().toISOString()
    }]
  };

  const response = await apperClient.updateRecord('interview_question', params);
  
  if (!response.success) {
    throw new Error(response.message || 'Failed to update interview question');
  }

  if (response.results) {
    const successfulRecords = response.results.filter(result => result.success);
    const failedRecords = response.results.filter(result => !result.success);
    
    if (failedRecords.length > 0) {
      console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      throw new Error(failedRecords[0].message || 'Failed to update interview question');
    }
    
    return successfulRecords[0]?.data;
  }

  return response.data;
};

export const deleteQuestion = async (id) => {
  await delay();
  if (!apperClient) initClient();
  
  const questionId = parseInt(id);
  if (isNaN(questionId)) throw new Error('Invalid question ID');

  const params = {
    RecordIds: [questionId]
  };

  const response = await apperClient.deleteRecord('interview_question', params);
  
  if (!response.success) {
    throw new Error(response.message || 'Failed to delete interview question');
  }

  if (response.results) {
    const failedRecords = response.results.filter(result => !result.success);
    
    if (failedRecords.length > 0) {
      console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      throw new Error(failedRecords[0].message || 'Failed to delete interview question');
    }
  }

  return true;
};

// Scheduled Interviews Service Functions (Mock implementation for now)
let scheduledInterviewsData = [
  {
    Id: 1,
    title: 'Frontend Developer Interview',
    company: 'TechCorp Inc.',
    position: 'Senior Frontend Developer',
    date: '2024-01-25',
    time: '14:00',
    type: 'interview',
    location: 'Virtual - Zoom',
    interviewerName: 'Sarah Johnson',
    interviewerEmail: 'sarah.johnson@techcorp.com',
    notes: 'Prepare React and TypeScript questions',
    status: 'scheduled',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z'
  },
  {
    Id: 2,
    title: 'Backend Engineer Interview',
    company: 'StartupXYZ',
    position: 'Backend Engineer',
    date: '2024-01-28',
    time: '10:30',
    type: 'interview',
    location: '123 Tech Street, San Francisco',
    interviewerName: 'Mike Chen',
    interviewerEmail: 'mike@startupxyz.com',
    notes: 'Focus on Node.js and database design',
    status: 'scheduled',
    createdAt: '2024-01-16T09:30:00.000Z',
    updatedAt: '2024-01-16T09:30:00.000Z'
  }
];
let lastScheduledInterviewId = Math.max(...scheduledInterviewsData.map(interview => interview.Id), 0);

export const getScheduledInterviews = async () => {
  await delay();
  return [...scheduledInterviewsData];
};

export const getScheduledInterviewById = async (id) => {
  await delay();
  const interviewId = parseInt(id);
  if (isNaN(interviewId)) return null;
  
  const interview = scheduledInterviewsData.find(interview => interview.Id === interviewId);
  return interview ? { ...interview } : null;
};

export const scheduleInterview = async (interviewData) => {
  await delay();
  const newInterview = {
    ...interviewData,
    Id: ++lastScheduledInterviewId,
    type: 'interview',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  scheduledInterviewsData.push(newInterview);
  return { ...newInterview };
};

export const updateScheduledInterview = async (id, interviewData) => {
  await delay();
  const interviewId = parseInt(id);
  if (isNaN(interviewId)) throw new Error('Invalid interview ID');
  
  const index = scheduledInterviewsData.findIndex(interview => interview.Id === interviewId);
  if (index === -1) throw new Error('Interview not found');
  
  const updatedInterview = {
    ...scheduledInterviewsData[index],
    ...interviewData,
    Id: interviewId,
    updatedAt: new Date().toISOString()
  };
  
  scheduledInterviewsData[index] = updatedInterview;
  return { ...updatedInterview };
};

export const deleteScheduledInterview = async (id) => {
  await delay();
  const interviewId = parseInt(id);
  if (isNaN(interviewId)) throw new Error('Invalid interview ID');
  
  const index = scheduledInterviewsData.findIndex(interview => interview.Id === interviewId);
  if (index === -1) throw new Error('Interview not found');
  
  scheduledInterviewsData.splice(index, 1);
  return true;
};
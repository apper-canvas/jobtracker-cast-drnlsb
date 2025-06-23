import { jobApplications } from '@/services/mockData/jobApplications.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class JobApplicationService {
  constructor() {
    this.data = [...jobApplications];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const parsedId = parseInt(id, 10);
    const item = this.data.find(app => app.Id === parsedId);
    if (!item) {
      throw new Error('Application not found');
    }
    return { ...item };
  }

  async create(application) {
    await delay(400);
    const maxId = this.data.length > 0 ? Math.max(...this.data.map(app => app.Id)) : 0;
    const newApplication = {
      ...application,
      Id: maxId + 1,
      appliedDate: application.appliedDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.push(newApplication);
    return { ...newApplication };
  }

  async update(id, updates) {
    await delay(300);
    const parsedId = parseInt(id, 10);
    const index = this.data.findIndex(app => app.Id === parsedId);
    if (index === -1) {
      throw new Error('Application not found');
    }
    
    const updatedApplication = {
      ...this.data[index],
      ...updates,
      Id: parsedId, // Preserve ID
      updatedAt: new Date().toISOString()
    };
    
    this.data[index] = updatedApplication;
    return { ...updatedApplication };
  }

  async delete(id) {
    await delay(250);
    const parsedId = parseInt(id, 10);
    const index = this.data.findIndex(app => app.Id === parsedId);
    if (index === -1) {
      throw new Error('Application not found');
    }
    
    this.data.splice(index, 1);
    return true;
  }

  async getByStatus(status) {
    await delay(200);
    return this.data.filter(app => app.status === status).map(app => ({ ...app }));
  }

  async getStatusCounts() {
    await delay(150);
    const counts = this.data.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    return counts;
  }
}

export default new JobApplicationService();
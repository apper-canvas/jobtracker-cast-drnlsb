import { documents } from '@/services/mockData/documents.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DocumentService {
  constructor() {
    this.data = [...documents];
  }

  async getAll() {
    await delay(250);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const parsedId = parseInt(id, 10);
    const item = this.data.find(doc => doc.Id === parsedId);
    if (!item) {
      throw new Error('Document not found');
    }
    return { ...item };
  }

  async create(document) {
    await delay(400);
    const maxId = this.data.length > 0 ? Math.max(...this.data.map(doc => doc.Id)) : 0;
    const newDocument = {
      ...document,
      Id: maxId + 1,
      uploadDate: new Date().toISOString(),
      version: 1
    };
    this.data.push(newDocument);
    return { ...newDocument };
  }

  async update(id, updates) {
    await delay(300);
    const parsedId = parseInt(id, 10);
    const index = this.data.findIndex(doc => doc.Id === parsedId);
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    const updatedDocument = {
      ...this.data[index],
      ...updates,
      Id: parsedId
    };
    
    this.data[index] = updatedDocument;
    return { ...updatedDocument };
  }

  async delete(id) {
    await delay(250);
    const parsedId = parseInt(id, 10);
    const index = this.data.findIndex(doc => doc.Id === parsedId);
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    this.data.splice(index, 1);
    return true;
  }

  async getByType(type) {
    await delay(200);
    return this.data.filter(doc => doc.type === type).map(doc => ({ ...doc }));
  }

  async getByApplicationId(applicationId) {
    await delay(200);
    const parsedAppId = parseInt(applicationId, 10);
    return this.data.filter(doc => 
      doc.applicationIds && doc.applicationIds.includes(parsedAppId)
    ).map(doc => ({ ...doc }));
  }
}

export default new DocumentService();
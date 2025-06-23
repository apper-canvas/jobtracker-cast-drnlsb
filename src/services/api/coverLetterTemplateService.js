import { v4 as uuidv4 } from 'uuid';
import mockTemplates from '../mockData/coverLetterTemplates.json';

class CoverLetterTemplateService {
  constructor() {
    this.templates = [...mockTemplates];
    this.lastId = Math.max(...this.templates.map(t => t.Id));
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.templates];
  }

  async getById(id) {
    await this.delay();
    const template = this.templates.find(t => t.Id === parseInt(id));
    return template ? { ...template } : null;
  }

  async getByCategory(category) {
    await this.delay();
    return this.templates.filter(t => t.category === category).map(t => ({ ...t }));
  }

  async create(templateData) {
    await this.delay();
    
    const newTemplate = {
      Id: ++this.lastId,
      name: templateData.name,
      category: templateData.category || 'General',
      subject: templateData.subject || '',
      content: templateData.content || '',
      variables: this.extractVariables(templateData.content || '', templateData.subject || ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.templates.push(newTemplate);
    return { ...newTemplate };
  }

  async update(id, templateData) {
    await this.delay();
    
    const index = this.templates.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Template not found');
    }

    const updatedTemplate = {
      ...this.templates[index],
      name: templateData.name,
      category: templateData.category,
      subject: templateData.subject,
      content: templateData.content,
      variables: this.extractVariables(templateData.content || '', templateData.subject || ''),
      updatedAt: new Date().toISOString()
    };

    this.templates[index] = updatedTemplate;
    return { ...updatedTemplate };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.templates.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Template not found');
    }

    this.templates.splice(index, 1);
    return true;
  }

  async search(query) {
    await this.delay();
    
    const lowercaseQuery = query.toLowerCase();
    return this.templates.filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.category.toLowerCase().includes(lowercaseQuery) ||
      template.content.toLowerCase().includes(lowercaseQuery)
    ).map(t => ({ ...t }));
  }

  async getCategories() {
    await this.delay();
    const categories = [...new Set(this.templates.map(t => t.category))];
    return categories.sort();
  }

  extractVariables(content, subject = '') {
    const text = `${content} ${subject}`;
    const matches = text.match(/\{([^}]+)\}/g) || [];
    const variables = matches.map(match => match.slice(1, -1));
    return [...new Set(variables)];
  }

  populateTemplate(template, variables) {
    let populatedContent = template.content;
    let populatedSubject = template.subject;

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      populatedContent = populatedContent.replace(new RegExp(placeholder, 'g'), value || `{${key}}`);
      populatedSubject = populatedSubject.replace(new RegExp(placeholder, 'g'), value || `{${key}}`);
    });

    return {
      subject: populatedSubject,
      content: populatedContent
    };
  }
}

export default new CoverLetterTemplateService();
import { reminders } from '@/services/mockData/reminders.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ReminderService {
  constructor() {
    this.data = [...reminders];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const parsedId = parseInt(id, 10);
    const item = this.data.find(reminder => reminder.Id === parsedId);
    if (!item) {
      throw new Error('Reminder not found');
    }
    return { ...item };
  }

  async create(reminder) {
    await delay(300);
    const maxId = this.data.length > 0 ? Math.max(...this.data.map(r => r.Id)) : 0;
    const newReminder = {
      ...reminder,
      Id: maxId + 1,
      completed: false,
      createdAt: new Date().toISOString()
    };
    this.data.push(newReminder);
    return { ...newReminder };
  }

  async update(id, updates) {
    await delay(250);
    const parsedId = parseInt(id, 10);
    const index = this.data.findIndex(r => r.Id === parsedId);
    if (index === -1) {
      throw new Error('Reminder not found');
    }
    
    const updatedReminder = {
      ...this.data[index],
      ...updates,
      Id: parsedId
    };
    
    this.data[index] = updatedReminder;
    return { ...updatedReminder };
  }

  async delete(id) {
    await delay(200);
    const parsedId = parseInt(id, 10);
    const index = this.data.findIndex(r => r.Id === parsedId);
    if (index === -1) {
      throw new Error('Reminder not found');
    }
    
    this.data.splice(index, 1);
    return true;
  }

  async getUpcoming(days = 7) {
    await delay(200);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return this.data.filter(reminder => 
      new Date(reminder.date) <= futureDate && !reminder.completed
    ).map(reminder => ({ ...reminder }));
  }

  async getByApplicationId(applicationId) {
    await delay(150);
    const parsedAppId = parseInt(applicationId, 10);
    return this.data.filter(reminder => 
      reminder.applicationId === parsedAppId
    ).map(reminder => ({ ...reminder }));
  }
}

export default new ReminderService();
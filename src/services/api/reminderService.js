const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ReminderService {
  constructor() {
    this.client = null;
    this.initClient();
  }

  initClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    await delay(200);
    if (!this.client) this.initClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "date" } },
        { field: { Name: "type" } },
        { field: { Name: "message" } },
        { field: { Name: "completed" } },
        { field: { Name: "created_at" } },
        { field: { Name: "application_id" } }
      ],
      orderBy: [{ fieldName: "date", sorttype: "ASC" }]
    };

    const response = await this.client.fetchRecords('reminder', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch reminders');
    }

    return response.data || [];
  }

  async getById(id) {
    await delay(150);
    if (!this.client) this.initClient();
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Invalid reminder ID');

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "date" } },
        { field: { Name: "type" } },
        { field: { Name: "message" } },
        { field: { Name: "completed" } },
        { field: { Name: "created_at" } },
        { field: { Name: "application_id" } }
      ]
    };

    const response = await this.client.getRecordById('reminder', parsedId, params);
    
    if (!response.success) {
      throw new Error(response.message || 'Reminder not found');
    }

    return response.data;
  }

  async create(reminder) {
    await delay(300);
    if (!this.client) this.initClient();

    const params = {
      records: [{
        Name: reminder.message || '',
        date: reminder.date || new Date().toISOString(),
        type: reminder.type || 'follow_up',
        message: reminder.message || '',
        completed: reminder.completed || false,
        created_at: new Date().toISOString(),
        application_id: reminder.applicationId ? parseInt(reminder.applicationId) : null
      }]
    };

    const response = await this.client.createRecord('reminder', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create reminder');
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create reminder');
      }
      
      return successfulRecords[0]?.data;
    }

    return response.data;
  }

  async update(id, updates) {
    await delay(250);
    if (!this.client) this.initClient();
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Invalid reminder ID');

    const params = {
      records: [{
        Id: parsedId,
        Name: updates.message || updates.Name,
        date: updates.date,
        type: updates.type,
        message: updates.message,
        completed: updates.completed,
        application_id: updates.applicationId ? parseInt(updates.applicationId) : updates.application_id
      }]
    };

    const response = await this.client.updateRecord('reminder', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update reminder');
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update reminder');
      }
      
      return successfulRecords[0]?.data;
    }

    return response.data;
  }

  async delete(id) {
    await delay(200);
    if (!this.client) this.initClient();
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Invalid reminder ID');

    const params = {
      RecordIds: [parsedId]
    };

    const response = await this.client.deleteRecord('reminder', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete reminder');
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete reminder');
      }
    }

    return true;
  }

  async getUpcoming(days = 7) {
    await delay(200);
    if (!this.client) this.initClient();
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "date" } },
        { field: { Name: "type" } },
        { field: { Name: "message" } },
        { field: { Name: "completed" } },
        { field: { Name: "created_at" } },
        { field: { Name: "application_id" } }
      ],
      where: [
        { FieldName: "date", Operator: "LessThanOrEqualTo", Values: [futureDate.toISOString()] },
        { FieldName: "completed", Operator: "EqualTo", Values: [false] }
      ],
      orderBy: [{ fieldName: "date", sorttype: "ASC" }]
    };

    const response = await this.client.fetchRecords('reminder', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch upcoming reminders');
    }

    return response.data || [];
  }

  async getByApplicationId(applicationId) {
    await delay(150);
    if (!this.client) this.initClient();
    
    const parsedAppId = parseInt(applicationId, 10);
    if (isNaN(parsedAppId)) return [];
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "date" } },
        { field: { Name: "type" } },
        { field: { Name: "message" } },
        { field: { Name: "completed" } },
        { field: { Name: "created_at" } },
        { field: { Name: "application_id" } }
      ],
      where: [{ FieldName: "application_id", Operator: "EqualTo", Values: [parsedAppId] }],
      orderBy: [{ fieldName: "date", sorttype: "ASC" }]
    };

    const response = await this.client.fetchRecords('reminder', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch reminders by application');
    }

    return response.data || [];
  }
}

export default new ReminderService();
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DocumentService {
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
        { field: { Name: "type" } },
        { field: { Name: "filename" } },
        { field: { Name: "version" } },
        { field: { Name: "upload_date" } },
        { field: { Name: "content" } },
        { field: { Name: "application_ids" } }
      ],
      orderBy: [{ fieldName: "upload_date", sorttype: "DESC" }]
    };

    const response = await this.client.fetchRecords('document', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch documents');
    }

    return response.data || [];
  }

  async getById(id) {
    await delay(200);
    if (!this.client) this.initClient();
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Invalid document ID');

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "type" } },
        { field: { Name: "filename" } },
        { field: { Name: "version" } },
        { field: { Name: "upload_date" } },
        { field: { Name: "content" } },
        { field: { Name: "application_ids" } }
      ]
    };

    const response = await this.client.getRecordById('document', parsedId, params);
    
    if (!response.success) {
      throw new Error(response.message || 'Document not found');
    }

    return response.data;
  }

  async create(document) {
    await delay(300);
    if (!this.client) this.initClient();

    const params = {
      records: [{
        Name: document.filename || document.Name || '',
        type: document.type || 'other',
        filename: document.filename || '',
        version: document.version || 1,
        upload_date: new Date().toISOString(),
        content: document.content || '',
        application_ids: document.applicationIds ? document.applicationIds.join(',') : ''
      }]
    };

    const response = await this.client.createRecord('document', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create document');
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create document');
      }
      
      return successfulRecords[0]?.data;
    }

    return response.data;
  }

  async update(id, updates) {
    await delay(300);
    if (!this.client) this.initClient();
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Invalid document ID');

    const params = {
      records: [{
        Id: parsedId,
        Name: updates.filename || updates.Name,
        type: updates.type,
        filename: updates.filename,
        version: updates.version,
        content: updates.content,
        application_ids: updates.applicationIds ? updates.applicationIds.join(',') : updates.application_ids
      }]
    };

    const response = await this.client.updateRecord('document', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update document');
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update document');
      }
      
      return successfulRecords[0]?.data;
    }

    return response.data;
  }

  async delete(id) {
    await delay(250);
    if (!this.client) this.initClient();
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Invalid document ID');

    const params = {
      RecordIds: [parsedId]
    };

    const response = await this.client.deleteRecord('document', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete document');
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete document');
      }
    }

    return true;
  }

  async getByType(type) {
    await delay(200);
    if (!this.client) this.initClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "type" } },
        { field: { Name: "filename" } },
        { field: { Name: "version" } },
        { field: { Name: "upload_date" } },
        { field: { Name: "content" } },
        { field: { Name: "application_ids" } }
      ],
      where: [{ FieldName: "type", Operator: "EqualTo", Values: [type] }]
    };

    const response = await this.client.fetchRecords('document', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch documents by type');
    }

    return response.data || [];
  }

  async getByApplicationId(applicationId) {
    await delay(200);
    if (!this.client) this.initClient();
    
    const parsedAppId = parseInt(applicationId, 10);
    if (isNaN(parsedAppId)) return [];
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "type" } },
        { field: { Name: "filename" } },
        { field: { Name: "version" } },
        { field: { Name: "upload_date" } },
        { field: { Name: "content" } },
        { field: { Name: "application_ids" } }
      ],
      where: [{ FieldName: "application_ids", Operator: "Contains", Values: [parsedAppId.toString()] }]
    };

    const response = await this.client.fetchRecords('document', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch documents by application');
    }

    return response.data || [];
  }
}

export default new DocumentService();
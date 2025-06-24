const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class JobApplicationService {
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
        { field: { Name: "title" } },
        { field: { Name: "company" } },
        { field: { Name: "status" } },
        { field: { Name: "applied_date" } },
        { field: { Name: "salary_min" } },
        { field: { Name: "salary_max" } },
        { field: { Name: "salary_currency" } },
        { field: { Name: "location" } },
        { field: { Name: "notes" } },
        { field: { Name: "job_url" } },
        { field: { Name: "documents" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ],
      orderBy: [{ fieldName: "created_at", sorttype: "DESC" }]
    };

    const response = await this.client.fetchRecords('job_application', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch applications');
    }

    return response.data || [];
  }

  async getById(id) {
    await delay(200);
    if (!this.client) this.initClient();
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Invalid application ID');

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "company" } },
        { field: { Name: "status" } },
        { field: { Name: "applied_date" } },
        { field: { Name: "salary_min" } },
        { field: { Name: "salary_max" } },
        { field: { Name: "salary_currency" } },
        { field: { Name: "location" } },
        { field: { Name: "notes" } },
        { field: { Name: "job_url" } },
        { field: { Name: "documents" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ]
    };

    const response = await this.client.getRecordById('job_application', parsedId, params);
    
    if (!response.success) {
      throw new Error(response.message || 'Application not found');
    }

    return response.data;
  }

  async create(application) {
    await delay(300);
    if (!this.client) this.initClient();

    const params = {
      records: [{
        Name: application.title || '',
        title: application.title || '',
        company: application.company || '',
        status: application.status || 'applied',
        applied_date: application.appliedDate || new Date().toISOString().split('T')[0],
        salary_min: application.salary?.min ? parseInt(application.salary.min) : null,
        salary_max: application.salary?.max ? parseInt(application.salary.max) : null,
        salary_currency: application.salary?.currency || 'USD',
        location: application.location || '',
        notes: application.notes || '',
        job_url: application.jobUrl || '',
        documents: application.documents || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]
    };

    const response = await this.client.createRecord('job_application', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create application');
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create application');
      }
      
      return successfulRecords[0]?.data;
    }

    return response.data;
  }

  async update(id, updates) {
    await delay(300);
    if (!this.client) this.initClient();
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Invalid application ID');

    const params = {
      records: [{
        Id: parsedId,
        Name: updates.title || updates.Name,
        title: updates.title,
        company: updates.company,
        status: updates.status,
        applied_date: updates.appliedDate || updates.applied_date,
        salary_min: updates.salary?.min ? parseInt(updates.salary.min) : updates.salary_min,
        salary_max: updates.salary?.max ? parseInt(updates.salary.max) : updates.salary_max,
        salary_currency: updates.salary?.currency || updates.salary_currency,
        location: updates.location,
        notes: updates.notes,
        job_url: updates.jobUrl || updates.job_url,
        documents: updates.documents,
        updated_at: new Date().toISOString()
      }]
    };

    const response = await this.client.updateRecord('job_application', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update application');
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update application');
      }
      
      return successfulRecords[0]?.data;
    }

    return response.data;
  }

  async delete(id) {
    await delay(250);
    if (!this.client) this.initClient();
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Invalid application ID');

    const params = {
      RecordIds: [parsedId]
    };

    const response = await this.client.deleteRecord('job_application', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete application');
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete application');
      }
    }

    return true;
  }

  async getByStatus(status) {
    await delay(200);
    if (!this.client) this.initClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "company" } },
        { field: { Name: "status" } },
        { field: { Name: "applied_date" } },
        { field: { Name: "salary_min" } },
        { field: { Name: "salary_max" } },
        { field: { Name: "salary_currency" } },
        { field: { Name: "location" } },
        { field: { Name: "notes" } },
        { field: { Name: "job_url" } }
      ],
      where: [{ FieldName: "status", Operator: "EqualTo", Values: [status] }]
    };

    const response = await this.client.fetchRecords('job_application', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch applications by status');
    }

    return response.data || [];
  }

  async getStatusCounts() {
    await delay(150);
    if (!this.client) this.initClient();
    
    const params = {
      fields: [
        { field: { Name: "status" }, Function: "Count", Alias: "count" }
      ],
      groupBy: ["status"]
    };

    const response = await this.client.fetchRecords('job_application', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch status counts');
    }

    const counts = {};
    if (response.data) {
      response.data.forEach(item => {
        counts[item.status] = item.count;
      });
    }

    return counts;
  }
}

export default new JobApplicationService();
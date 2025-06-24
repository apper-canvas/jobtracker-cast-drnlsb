const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CoverLetterTemplateService {
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
    await delay(300);
    if (!this.client) this.initClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "category" } },
        { field: { Name: "subject" } },
        { field: { Name: "content" } },
        { field: { Name: "variables" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ],
      orderBy: [{ fieldName: "created_at", sorttype: "DESC" }]
    };

    const response = await this.client.fetchRecords('cover_letter_template', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch templates');
    }

    return response.data || [];
  }

  async getById(id) {
    await delay(200);
    if (!this.client) this.initClient();
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Invalid template ID');

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "category" } },
        { field: { Name: "subject" } },
        { field: { Name: "content" } },
        { field: { Name: "variables" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ]
    };

    const response = await this.client.getRecordById('cover_letter_template', parsedId, params);
    
    if (!response.success) {
      throw new Error(response.message || 'Template not found');
    }

    return response.data;
  }

  async getByCategory(category) {
    await delay(200);
    if (!this.client) this.initClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "category" } },
        { field: { Name: "subject" } },
        { field: { Name: "content" } },
        { field: { Name: "variables" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ],
      where: [{ FieldName: "category", Operator: "EqualTo", Values: [category] }]
    };

    const response = await this.client.fetchRecords('cover_letter_template', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch templates by category');
    }

    return response.data || [];
  }

  async create(templateData) {
    await delay(300);
    if (!this.client) this.initClient();

    const variables = this.extractVariables(templateData.content || '', templateData.subject || '');

    const params = {
      records: [{
        Name: templateData.name || '',
        category: templateData.category || 'General',
        subject: templateData.subject || '',
        content: templateData.content || '',
        variables: variables.join(','),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]
    };

    const response = await this.client.createRecord('cover_letter_template', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create template');
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create template');
      }
      
      return successfulRecords[0]?.data;
    }

    return response.data;
  }

  async update(id, templateData) {
    await delay(300);
    if (!this.client) this.initClient();
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Invalid template ID');

    const variables = this.extractVariables(templateData.content || '', templateData.subject || '');

    const params = {
      records: [{
        Id: parsedId,
        Name: templateData.name,
        category: templateData.category,
        subject: templateData.subject,
        content: templateData.content,
        variables: variables.join(','),
        updated_at: new Date().toISOString()
      }]
    };

    const response = await this.client.updateRecord('cover_letter_template', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update template');
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update template');
      }
      
      return successfulRecords[0]?.data;
    }

    return response.data;
  }

  async delete(id) {
    await delay(250);
    if (!this.client) this.initClient();
    
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new Error('Invalid template ID');

    const params = {
      RecordIds: [parsedId]
    };

    const response = await this.client.deleteRecord('cover_letter_template', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete template');
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete template');
      }
    }

    return true;
  }

  async search(query) {
    await delay(200);
    if (!this.client) this.initClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "category" } },
        { field: { Name: "subject" } },
        { field: { Name: "content" } },
        { field: { Name: "variables" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ],
      whereGroups: [{
        operator: "OR",
        subGroups: [
          {
            conditions: [{ fieldName: "Name", operator: "Contains", values: [query] }],
            operator: "OR"
          },
          {
            conditions: [{ fieldName: "category", operator: "Contains", values: [query] }],
            operator: "OR"
          },
          {
            conditions: [{ fieldName: "content", operator: "Contains", values: [query] }],
            operator: "OR"
          }
        ]
      }]
    };

    const response = await this.client.fetchRecords('cover_letter_template', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to search templates');
    }

    return response.data || [];
  }

  async getCategories() {
    await delay(200);
    if (!this.client) this.initClient();
    
    const params = {
      fields: [
        { field: { Name: "category" } }
      ],
      groupBy: ["category"]
    };

    const response = await this.client.fetchRecords('cover_letter_template', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch categories');
    }

    const categories = response.data ? response.data.map(item => item.category).filter(Boolean) : [];
    return [...new Set(categories)].sort();
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
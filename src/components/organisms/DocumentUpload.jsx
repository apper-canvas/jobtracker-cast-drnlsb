import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import documentService from '@/services/api/documentService';

const DocumentUpload = ({ documents = [], onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const documentTypes = {
    resume: { label: 'Resume', color: 'primary', icon: 'FileText' },
    cover_letter: { label: 'Cover Letter', color: 'secondary', icon: 'Mail' },
    portfolio: { label: 'Portfolio', color: 'info', icon: 'Folder' },
    other: { label: 'Other', color: 'default', icon: 'File' }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        // Determine document type based on filename
        let type = 'other';
        const filename = file.name.toLowerCase();
        
        if (filename.includes('resume') || filename.includes('cv')) {
          type = 'resume';
        } else if (filename.includes('cover') || filename.includes('letter')) {
          type = 'cover_letter';
        } else if (filename.includes('portfolio')) {
          type = 'portfolio';
        }

        const newDocument = {
          type,
          filename: file.name,
          content: `Document content for ${file.name}`, // In real app, this would be file content
          applicationIds: []
        };

        await documentService.create(newDocument);
      }

      toast.success(`${files.length} document(s) uploaded successfully`);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error('Failed to upload documents');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentService.delete(documentId);
      toast.success('Document deleted successfully');
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.type]) {
      acc[doc.type] = [];
    }
    acc[doc.type].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragging 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <motion.div
            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon 
              name={uploading ? "Loader2" : "Upload"} 
              size={48} 
              className={`mx-auto mb-4 ${
                uploading ? "animate-spin text-primary" : "text-gray-400"
              }`} 
            />
          </motion.div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {uploading ? 'Uploading...' : 'Upload Documents'}
          </h3>
          <p className="text-gray-500 mb-4">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Supports PDF, DOC, DOCX, TXT files
          </p>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="primary"
            icon="Plus"
          >
            Choose Files
          </Button>
        </div>
      </Card>

      {/* Document List */}
      {Object.keys(groupedDocuments).length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedDocuments).map(([type, docs]) => {
            const typeConfig = documentTypes[type] || documentTypes.other;
            
            return (
              <div key={type}>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant={typeConfig.color} icon={typeConfig.icon}>
                    {typeConfig.label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {docs.length} document{docs.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {docs.map((document, index) => (
                      <motion.div
                        key={document.Id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card hover className="group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                <ApperIcon 
                                  name={typeConfig.icon} 
                                  size={24} 
                                  className="text-gray-400" 
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0">
<h4 className="font-medium text-gray-900 truncate">
                                  {document.filename}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                  <span>Version {document.version}</span>
                                  <span>
                                    Uploaded {new Date(document.upload_date || document.uploadDate).toLocaleDateString()}
                                  </span>
{(document.application_ids || document.applicationIds)?.length > 0 && (
                                    <span>
                                      Used in {(document.application_ids?.split(',') || document.applicationIds).length} application{(document.application_ids?.split(',') || document.applicationIds).length !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                icon="Download"
                                onClick={() => toast.info('Download functionality would be implemented here')}
                              />
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                icon="Eye"
                                onClick={() => toast.info('Preview functionality would be implemented here')}
                              />
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                icon="Trash2"
                                onClick={() => handleDelete(document.Id)}
                                className="text-error hover:text-error"
                              />
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
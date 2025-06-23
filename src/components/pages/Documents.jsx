import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import DocumentUpload from '@/components/organisms/DocumentUpload';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import documentService from '@/services/api/documentService';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await documentService.getAll();
      setDocuments(data);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="bg-white rounded-xl p-8 border-2 border-dashed border-gray-200">
          <div className="h-16 bg-gray-200 rounded w-16 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
        </div>
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Manage your resumes, cover letters, and portfolios</p>
        </div>

        <ErrorState 
          title="Failed to Load Documents"
          message={error}
          onRetry={loadDocuments}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">
            {documents.length > 0 
              ? `${documents.length} document${documents.length !== 1 ? 's' : ''} uploaded`
              : 'Upload and manage your job application documents'
            }
          </p>
        </div>
      </div>

      {/* Document Upload Component */}
      <DocumentUpload 
        documents={documents}
        onUpdate={loadDocuments}
      />

      {documents.length === 0 && (
        <EmptyState
          icon="FileText"
          title="No documents uploaded"
          description="Upload your resumes, cover letters, and portfolios to keep them organized and easily accessible for your job applications."
          className="mt-12"
        />
      )}
    </motion.div>
  );
};

export default Documents;
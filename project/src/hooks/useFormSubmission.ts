import { useState } from 'react';
import { submitDonation, submitRequest } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';

export const useFormSubmission = (userType: 'donor' | 'community') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { userData } = useAuth();

  const submitForm = async (formData: any): Promise<boolean> => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Add user metadata
      const submissionData = {
        ...formData,
        userId: userData?.uid || '',
        location_lowercase: formData.location.toLowerCase(),
        createdAt: new Date()
      };

      if (userType === 'donor') {
        await submitDonation(submissionData);
      } else {
        await submitRequest(submissionData);
      }

      setSuccess(true);
      return true;
    } catch (error: any) {
      console.error('Form submission error:', error);
      setError(error.message || 'Failed to submit form. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError('');
    setSuccess(false);
    setLoading(false);
  };

  return {
    submitForm,
    loading,
    error,
    success,
    resetForm
  };
};
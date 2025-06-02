import { useState, useCallback } from 'react';
import { get, post, put, del } from 'aws-amplify/api';
import { toast } from 'react-toastify';

interface ApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiGet = useCallback(async <T>(path: string, options?: ApiOptions): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await get({
        apiName: 'TaskBuddyAPI',
        path
      }).response;
      
      const data = await response.body.json();
      
      if (options?.showSuccessToast) {
        toast.success(options.successMessage || 'Request successful');
      }
      
      return data as T;
    } catch (err) {
      console.error(`API GET error for ${path}:`, err);
      setError(err as Error);
      
      if (options?.showErrorToast) {
        toast.error(options.errorMessage || 'An error occurred. Please try again.');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const apiPost = useCallback(async <T>(path: string, data: any, options?: ApiOptions): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await post({
        apiName: 'TaskBuddyAPI',
        path,
        options: {
          body: data
        }
      }).response;
      
      const responseData = await response.body.json();
      
      if (options?.showSuccessToast) {
        toast.success(options.successMessage || 'Successfully created');
      }
      
      return responseData as T;
    } catch (err) {
      console.error(`API POST error for ${path}:`, err);
      setError(err as Error);
      
      if (options?.showErrorToast) {
        toast.error(options.errorMessage || 'Failed to create. Please try again.');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const apiPut = useCallback(async <T>(path: string, data: any, options?: ApiOptions): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await put({
        apiName: 'TaskBuddyAPI',
        path,
        options: {
          body: data
        }
      }).response;
      
      const responseData = await response.body.json();
      
      if (options?.showSuccessToast) {
        toast.success(options.successMessage || 'Successfully updated');
      }
      
      return responseData as T;
    } catch (err) {
      console.error(`API PUT error for ${path}:`, err);
      setError(err as Error);
      
      if (options?.showErrorToast) {
        toast.error(options.errorMessage || 'Failed to update. Please try again.');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const apiDelete = useCallback(async <T>(path: string, options?: ApiOptions): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await del({
        apiName: 'TaskBuddyAPI',
        path
      }).response;
      
      const responseData = await response.body.json();
      
      if (options?.showSuccessToast) {
        toast.success(options.successMessage || 'Successfully deleted');
      }
      
      return responseData as T;
    } catch (err) {
      console.error(`API DELETE error for ${path}:`, err);
      setError(err as Error);
      
      if (options?.showErrorToast) {
        toast.error(options.errorMessage || 'Failed to delete. Please try again.');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    apiGet,
    apiPost,
    apiPut,
    apiDelete
  };
}
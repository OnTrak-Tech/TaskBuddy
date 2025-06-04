import { useState } from 'react';
import { get, post, put, del } from 'aws-amplify/api';
import { toast } from 'react-toastify';

interface ApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const defaultOptions: ApiOptions = {
    showSuccessToast: false,
    showErrorToast: true,
    successMessage: 'Operation completed successfully',
    errorMessage: 'An error occurred',
  };

  const apiRequest = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: any,
    options: ApiOptions = {}
  ): Promise<T | null> => {
    const mergedOptions = { ...defaultOptions, ...options };
    setLoading(true);
    setError(null);

    try {
      let response;

      switch (method) {
        case 'GET':
          response = await get({
            apiName: 'TaskBuddyAPI',
            path,
          });
          break;
        case 'POST':
          response = await post({
            apiName: 'TaskBuddyAPI',
            path,
            options: {
              body,
            },
          });
          break;
        case 'PUT':
          response = await put({
            apiName: 'TaskBuddyAPI',
            path,
            options: {
              body,
            },
          });
          break;
        case 'DELETE':
          await del({
            apiName: 'TaskBuddyAPI',
            path,
          });
          // For DELETE, we don't expect a response body
          response = { body: null };
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      if (mergedOptions.showSuccessToast) {
        toast.success(mergedOptions.successMessage);
      }

      let data: T | null = null;
      if (response && 'body' in response) {
        data = response.body as T;
      }

      setLoading(false);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      if (mergedOptions.showErrorToast) {
        toast.error(mergedOptions.errorMessage || error.message);
      }
      
      setLoading(false);
      return null;
    }
  };

  const getRequest = <T>(path: string, options?: ApiOptions) => {
    return apiRequest<T>('GET', path, undefined, options);
  };

  const postRequest = <T>(path: string, body: any, options?: ApiOptions) => {
    return apiRequest<T>('POST', path, body, options);
  };

  const putRequest = <T>(path: string, body: any, options?: ApiOptions) => {
    return apiRequest<T>('PUT', path, body, options);
  };

  const deleteRequest = <T>(path: string, options?: ApiOptions) => {
    return apiRequest<T>('DELETE', path, undefined, options);
  };

  return {
    loading,
    error,
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
  };
};
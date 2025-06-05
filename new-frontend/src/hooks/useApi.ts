import { API } from 'aws-amplify'
import { useState } from 'react'

interface ApiOptions {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const apiName = 'taskbuddyApi'

  async function callApi<T>({ path, method = 'GET', body, headers = {} }: ApiOptions): Promise<T> {
    setLoading(true)
    setError(null)
    
    try {
      // Get JWT token for authorization
      const session = await API.Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      
      // Use Amplify's API directly for better integration with AWS services
      const options: any = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...headers,
        },
      }
      
      if (body) {
        options.body = JSON.stringify(body)
      }
      
      console.log('API Request:', { path, method, options });
      
      let response;
      switch (method) {
        case 'POST':
          response = await API.post(apiName, path, options);
          break;
        case 'PUT':
          response = await API.put(apiName, path, options);
          break;
        case 'DELETE':
          response = await API.del(apiName, path, options);
          break;
        default:
          response = await API.get(apiName, path, options);
      }
      console.log('API Response:', response);
      return response as T;
    } catch (err) {
      console.error('API Error:', err)
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    callApi,
    loading,
    error,
  }
}
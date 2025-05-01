interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export const sendSuccess = <T>(data: T, message?: string): ApiResponse<T> => ({
  status: 'success',
  message,
  data
});

export const sendError = (message: string, code = 'INTERNAL_SERVER_ERROR'): ApiResponse<null> => ({
  status: 'error',
  error: {
    code,
    message
  }
});

export const sendFail = (message: string): ApiResponse<null> => ({
  status: 'fail',
  message
});
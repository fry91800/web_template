type JSendResponse<T = any> = 
  | { status: 'success'; data: T }
  | { status: 'fail'; data: T }
  | { status: 'error'; message: string; code: number };
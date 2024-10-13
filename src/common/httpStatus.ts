type StatusData = {
  code: number;
  message: string;
};

type HttpStatus = {
  Ok: StatusData;
  Created: StatusData;
  NoContent: StatusData;
  PartialContent: StatusData;
  BadRequest: StatusData;
  Unauthorized: StatusData;
  Forbidden: StatusData;
  NotFound: StatusData;
  MethodNotAllowed: StatusData;
  RequestTimeout: StatusData;
  PayloadTooLarge: StatusData;
  UnsupportedMediaType: StatusData;
  Unprocessable: StatusData;
  TooManyRequests: StatusData;
  InternalServerError: StatusData;
  NotImplemented: StatusData;
  BadGateway: StatusData;
  ServiceUnavailable: StatusData;
};

const HttpStatus: HttpStatus = {
  Ok: { code: 200, message: 'OK' },
  Created: { code: 201, message: 'Created' },
  NoContent: { code: 204, message: 'No Content' },
  PartialContent: { code: 206, message: 'Partial Content' },
  BadRequest: { code: 400, message: 'Bad Request' },
  Unauthorized: { code: 401, message: 'Unauthorized' },
  Forbidden: { code: 403, message: 'Forbidden' },
  NotFound: { code: 404, message: 'Not Found' },
  MethodNotAllowed: { code: 405, message: 'Method Not Allowed' },
  RequestTimeout: { code: 408, message: 'Request Timeout' },
  PayloadTooLarge: { code: 413, message: 'Payload Too Large' },
  UnsupportedMediaType: { code: 415, message: 'Unsupported Media Type' },
  Unprocessable: { code: 422, message: 'Unprocessable Entity' },
  TooManyRequests: { code: 429, message: 'Too Many Requests' },
  InternalServerError: { code: 500, message: 'Internal Server Error' },
  NotImplemented: { code: 501, message: 'Not Implemented' },
  BadGateway: { code: 502, message: 'Bad Gateway' },
  ServiceUnavailable: { code: 503, message: 'Service Unavailable' } as const,
} as const;

export default HttpStatus;

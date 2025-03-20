import React, { useState } from 'react';
import './HttpPlayground.css';
import '../../styles/App.css';

interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export const HttpPlayground: React.FC = () => {
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [headers, setHeaders] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [response, setResponse] = useState<HttpResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const headersObj = headers
        .split('\n')
        .filter(line => line.trim())
        .reduce((acc, line) => {
          const [key, value] = line.split(':').map(str => str.trim());
          if (key && value) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, string>);

      const response = await fetch(url, {
        method,
        headers: headersObj,
        body: method !== 'GET' ? body : undefined,
      });

      const responseHeaders = {} as Record<string, string>;
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: response.status,
        headers: responseHeaders,
        body: await response.text(),
      });
    } catch (error) {
      console.error('Error:', error);
      setResponse({
        status: 0,
        headers: {},
        body: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  return (
    <div className="http-playground">
      <h2>HTTP Playground</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Method:
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Headers (one per line, format: "Key: Value"):
            <textarea
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              placeholder="Content-Type: application/json"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Body:
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Request body (for POST/PUT)"
              disabled={method === 'GET'}
            />
          </label>
        </div>
        <button type="submit">Send Request</button>
      </form>

      {response && (
        <div className="response">
          <h3>Response</h3>
          <div className="status">Status: {response.status}</div>
          <div className="headers">
            <h4>Headers:</h4>
            <pre>{JSON.stringify(response.headers, null, 2)}</pre>
          </div>
          <div className="body">
            <h4>Body:</h4>
            <pre>{response.body}</pre>
          </div>
        </div>
      )}
    </div>
  );
}; 
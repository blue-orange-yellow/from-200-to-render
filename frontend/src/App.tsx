import React, { useState } from 'react';
import './App.css';

interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

function App() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<HttpResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      // Parse headers
      const headerLines = headers.split('\n').filter(line => line.trim());
      const headerObj: Record<string, string> = {};
      headerLines.forEach(line => {
        const [key, value] = line.split(':').map(part => part.trim());
        if (key && value) {
          headerObj[key] = value;
        }
      });

      const response = await fetch(url, {
        method,
        headers: headerObj,
        body: method !== 'GET' && method !== 'HEAD' ? body : undefined
      });

      const responseText = await response.text();
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseText
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="container">
      <h1>HTTP Playground</h1>
      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label htmlFor="method">Method:</label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            {['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="headers">Headers:</label>
          <textarea
            id="headers"
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            placeholder="Enter headers (one per line)&#10;Example:&#10;Content-Type: application/json&#10;Authorization: Bearer token"
          />
        </div>

        <div className="form-group">
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter request body"
          />
        </div>

        <button type="submit">Send Request</button>
      </form>

      {error && (
        <div className="response-section error">
          <h2>Error</h2>
          <pre>{error}</pre>
        </div>
      )}

      {response && (
        <div className="response-section">
          <h2>Response</h2>
          <div className="response-status">
            Status: {response.status} {response.statusText}
          </div>
          <div className="response-headers">
            <h3>Headers:</h3>
            <pre>
              {Object.entries(response.headers)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')}
            </pre>
          </div>
          <div className="response-body">
            <h3>Body:</h3>
            <pre>{response.body}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 
import React, { useState } from 'react';
import { RequestDetails, TimingInfo } from './RequestDetails';
import { measureRequestTiming } from '../../utils/timing';
import './HttpPlayground.css';
import '../../styles/App.css';

interface HttpResponse {
  method: string;
  path: string;
  headers: Record<string, string>;
  query_string?: string;
  body?: string;
}

export const HttpPlayground = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('http://localhost:8080/echo');
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<HttpResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timing, setTiming] = useState<TimingInfo | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResponse(null);
    setTiming(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (['POST', 'PUT'].includes(method) && body) {
        options.body = JSON.stringify({ message: body });
      }

      const timingInfo = await measureRequestTiming(url);
      const response = await fetch(url, options);
      const data = await response.json();

      setResponse(data);
      setTiming(timingInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const addHeader = () => {
    setHeaders(prev => ({
      ...prev,
      '': '',
    }));
  };

  const updateHeader = (oldKey: string, newKey: string, value: string) => {
    setHeaders(prev => {
      const newHeaders = { ...prev };
      if (oldKey !== newKey) {
        delete newHeaders[oldKey];
      }
      newHeaders[newKey] = value;
      return newHeaders;
    });
  };

  const removeHeader = (key: string) => {
    setHeaders(prev => {
      const newHeaders = { ...prev };
      delete newHeaders[key];
      return newHeaders;
    });
  };

  return (
    <div className="http-playground">
      <h2>HTTP Playground</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Method:</label>
          <select value={method} onChange={e => setMethod(e.target.value)}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div className="form-group">
          <label>URL:</label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="http://localhost:8080/echo"
          />
        </div>

        <div className="form-group">
          <label>Headers:</label>
          <div className="headers-list">
            {Object.entries(headers).map(([key, value]) => (
              <div key={key} className="header-item">
                <input
                  type="text"
                  value={key}
                  onChange={e => updateHeader(key, e.target.value, value)}
                  placeholder="Header name"
                />
                <input
                  type="text"
                  value={value}
                  onChange={e => updateHeader(key, key, e.target.value)}
                  placeholder="Header value"
                />
                <button
                  type="button"
                  onClick={() => removeHeader(key)}
                  className="remove-header"
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" onClick={addHeader} className="add-header">
              + Add Header
            </button>
          </div>
        </div>

        {['POST', 'PUT'].includes(method) && (
          <div className="form-group">
            <label>Request Body:</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Enter request body"
            />
          </div>
        )}

        <button type="submit" className="send-request">
          Send Request
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {response && timing && (
        <RequestDetails
          url={url}
          method={method}
          headers={headers}
          requestBody={body}
          responseStatus={200}
          responseHeaders={response.headers}
          responseBody={JSON.stringify(response, null, 2)}
          timing={timing}
        />
      )}
    </div>
  );
}; 
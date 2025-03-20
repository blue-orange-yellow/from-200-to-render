import React, { useState } from 'react';
import { DnsLookup } from './components/dns/DnsLookup';
import { HttpPlayground } from './components/http/HttpPlayground';
import './styles/App.css';

interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

type Tab = 'http-playground' | 'dns-lookup';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('http-playground');
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
    <div className="app">
      <div className="tabs">
        <button
          className={activeTab === 'http-playground' ? 'active' : ''}
          onClick={() => setActiveTab('http-playground')}
        >
          HTTP Playground
        </button>
        <button
          className={activeTab === 'dns-lookup' ? 'active' : ''}
          onClick={() => setActiveTab('dns-lookup')}
        >
          DNS Lookup
        </button>
      </div>

      <div className="content">
        {activeTab === 'http-playground' && <HttpPlayground />}
        {activeTab === 'dns-lookup' && <DnsLookup />}
      </div>
    </div>
  );
}

export default App; 
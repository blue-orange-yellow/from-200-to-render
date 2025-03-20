import React, { useState } from 'react';
import { lookupDomain } from '../../api/dns';
import { DnsLookupResponse } from '../../types/http';
import './DnsLookup.css';

export const DnsLookup = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<DnsLookupResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await lookupDomain(domain);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="dns-lookup">
      <h2>DNS Lookup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Domain Name:
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              required
            />
          </label>
        </div>
        <button type="submit">Lookup</button>
      </form>

      {error && (
        <div className="dns-error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="dns-result">
          <h3>Results</h3>
          <ul>
            {result.ips.map((ip, index) => (
              <li key={index}>{ip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 
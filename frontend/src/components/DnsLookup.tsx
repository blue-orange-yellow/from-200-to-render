import React, { useState } from 'react';
import './DnsLookup.css';

interface DnsResult {
  addresses: string[];
  error?: string;
}

export function DnsLookup() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<DnsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/dns-lookup?domain=${encodeURIComponent(domain)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ addresses: [], error: 'Failed to lookup DNS' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dns-lookup">
      <h2>DNS Lookup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter domain name"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Looking up...' : 'Lookup'}
        </button>
      </form>
      {result && (
        <div className="dns-result">
          {result.error ? (
            <div className="error">{result.error}</div>
          ) : (
            <>
              <h3>Results for {domain}:</h3>
              <ul>
                {result.addresses.map((address, index) => (
                  <li key={index}>{address}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
} 
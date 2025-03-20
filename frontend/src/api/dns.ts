import { DnsLookupResponse } from '../types/http';

export const lookupDomain = async (domain: string): Promise<DnsLookupResponse> => {
  const response = await fetch('/api/dns-lookup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ domain }),
  });

  if (!response.ok) {
    throw new Error(`DNS lookup failed: ${response.statusText}`);
  }

  return response.json();
}; 
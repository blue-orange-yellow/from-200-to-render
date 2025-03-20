export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface DnsLookupResponse {
  ips: string[];
} 
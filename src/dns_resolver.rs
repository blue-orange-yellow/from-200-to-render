use serde::Serialize;
use std::net::IpAddr;
use trust_dns_resolver::Resolver;
use trust_dns_resolver::config::*;

#[derive(Serialize)]
pub struct DnsLookupResult {
    domain: String,
    ip_addresses: Vec<IpAddr>,
    lookup_time_ms: u128,
}

pub async fn lookup_domain(domain: &str) -> Result<DnsLookupResult, Box<dyn std::error::Error>> {
    let start = std::time::Instant::now();

    // システムのDNS設定を使用
    let resolver = Resolver::from_system_conf()?;

    // Aレコード（IPv4）とAAAAレコード（IPv6）を取得
    let response = resolver.lookup_ip(domain).await?;
    let ip_addresses: Vec<IpAddr> = response.iter().collect();

    let elapsed = start.elapsed().as_millis();

    Ok(DnsLookupResult {
        domain: domain.to_string(),
        ip_addresses,
        lookup_time_ms: elapsed,
    })
}

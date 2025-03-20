use serde::Serialize;
use std::net::IpAddr;
use tokio::task;
use trust_dns_resolver::Resolver;

#[derive(Serialize)]
pub struct DnsLookupResult {
    domain: String,
    ip_addresses: Vec<IpAddr>,
    lookup_time_ms: u128,
}

pub async fn lookup_domain(domain: &str) -> Result<DnsLookupResult, String> {
    // DNSルックアップを別スレッドで実行
    let domain_clone = domain.to_string();
    task::spawn_blocking(move || -> Result<DnsLookupResult, String> {
        let start = std::time::Instant::now();

        // システムのDNS設定を使用
        let resolver = Resolver::from_system_conf().map_err(|e| e.to_string())?;

        // Aレコード（IPv4）とAAAAレコード（IPv6）を取得
        let response = resolver
            .lookup_ip(&domain_clone)
            .map_err(|e| e.to_string())?;
        let ip_addresses: Vec<IpAddr> = response.iter().collect();

        let elapsed = start.elapsed().as_millis();

        Ok(DnsLookupResult {
            domain: domain_clone,
            ip_addresses,
            lookup_time_ms: elapsed,
        })
    })
    .await
    .map_err(|e| e.to_string())?
}

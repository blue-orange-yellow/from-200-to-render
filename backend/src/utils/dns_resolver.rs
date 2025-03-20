use std::net::ToSocketAddrs;
use crate::models::dns::DnsResult;

pub async fn lookup_domain(domain: &str) -> Result<DnsResult, Box<dyn std::error::Error>> {
    let socket_addr = format!("{}:80", domain);
    let addrs = socket_addr.to_socket_addrs()?;
    let ips: Vec<String> = addrs.map(|addr| addr.ip().to_string()).collect();
    
    Ok(DnsResult { ips })
} 
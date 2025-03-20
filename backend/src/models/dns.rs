use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct DnsQuery {
    pub domain: String,
}

#[derive(Serialize)]
pub struct DnsResult {
    pub ips: Vec<String>,
}

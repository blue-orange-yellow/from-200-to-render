use actix_web::{post, web, HttpResponse, Responder};
use crate::models::dns::DnsQuery;
use crate::utils::dns_resolver;

#[post("/dns-lookup")]
pub async fn dns_lookup(query: web::Json<DnsQuery>) -> impl Responder {
    match dns_resolver::lookup_domain(&query.domain).await {
        Ok(result) => HttpResponse::Ok().json(result),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
} 
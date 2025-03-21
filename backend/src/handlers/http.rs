use crate::models::http::{PostData, RequestDetails};
use actix_web::{HttpRequest, HttpResponse, Responder, delete, get, post, put, web};
use std::time::Duration;
use tokio::time::sleep;

#[get("/echo")]
pub async fn echo_get(req: HttpRequest) -> impl Responder {
    sleep(Duration::from_millis(500)).await;
    let details = create_request_details(&req, None);
    HttpResponse::Ok().json(details)
}

#[post("/echo")]
pub async fn echo_post(req: HttpRequest, body: web::Json<PostData>) -> impl Responder {
    let details = create_request_details(&req, Some(body.message.clone()));
    HttpResponse::Ok().json(details)
}

#[put("/echo")]
pub async fn echo_put(req: HttpRequest, body: web::Json<PostData>) -> impl Responder {
    let details = create_request_details(&req, Some(body.message.clone()));
    HttpResponse::Ok().json(details)
}

#[delete("/echo")]
pub async fn echo_delete(req: HttpRequest) -> impl Responder {
    let details = create_request_details(&req, None);
    HttpResponse::Ok().json(details)
}

#[get("/status/{code}")]
pub async fn status_code(path: web::Path<u16>) -> impl Responder {
    let status_code = path.into_inner();
    match status_code {
        200 => HttpResponse::Ok(),
        201 => HttpResponse::Created(),
        204 => HttpResponse::NoContent(),
        400 => HttpResponse::BadRequest(),
        401 => HttpResponse::Unauthorized(),
        403 => HttpResponse::Forbidden(),
        404 => HttpResponse::NotFound(),
        500 => HttpResponse::InternalServerError(),
        502 => HttpResponse::BadGateway(),
        503 => HttpResponse::ServiceUnavailable(),
        _ => HttpResponse::Ok(),
    }
    .body(format!("Returned status code: {}", status_code))
}

fn create_request_details(req: &HttpRequest, body: Option<String>) -> RequestDetails {
    RequestDetails {
        method: req.method().to_string(),
        path: req.path().to_string(),
        headers: req
            .headers()
            .iter()
            .map(|(name, value)| {
                (
                    name.to_string(),
                    value.to_str().unwrap_or("invalid").to_string(),
                )
            })
            .collect(),
        query_string: Some(req.query_string().to_string()),
        body,
    }
}

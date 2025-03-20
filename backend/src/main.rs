mod handlers;
mod models;
mod utils;

use actix_web::{App, HttpServer};
use handlers::{dns, http};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server starting at http://127.0.0.1:8080");

    HttpServer::new(move || {
        App::new()
            .service(http::echo_post)
            .service(http::echo_put)
            .service(http::echo_delete)
            .service(http::status_code)
            .service(dns::dns_lookup)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

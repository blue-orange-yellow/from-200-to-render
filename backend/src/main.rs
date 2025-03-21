mod handlers;
mod models;
mod utils;

use actix_cors::Cors;
use actix_web::{App, HttpServer};
use handlers::{dns, http};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server starting at http://127.0.0.1:8080");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec!["Content-Type"])
            .max_age(3600);

        App::new()
            .wrap(cors)
            .service(http::echo_get)
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

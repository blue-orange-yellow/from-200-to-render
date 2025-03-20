use actix_files as fs;
use actix_web::{App, HttpRequest, HttpResponse, HttpServer, Responder, get};

#[get("/")]
async fn hello(req: HttpRequest) -> impl Responder {
    let connection_info = req.connection_info();
    let scheme = connection_info.scheme();
    let host = connection_info.host();
    let path = req.path();
    let method = req.method();
    let headers = req.headers();
    let user_agent = headers
        .get("User-Agent")
        .map_or("Unknown", |h| h.to_str().unwrap_or("Unknown"));

    HttpResponse::Ok().body(format!(
        r#"
        <!DOCTYPE html>
        <html>
        <head>
            <title>From 200 to Render</title>
            <link rel="stylesheet" href="/static/style.css">
            <style>
                .request-details {{
                    background-color: #e8f5e9;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }}
                .request-details h2 {{
                    color: #2e7d32;
                    margin-top: 0;
                }}
                .detail-item {{
                    margin: 10px 0;
                }}
                .detail-label {{
                    font-weight: bold;
                    color: #1b5e20;
                }}
            </style>
        </head>
        <body>
            <h1>Welcome to our HTTP Learning Journey!</h1>
            
            <div class="request-details">
                <h2>Your Request Details:</h2>
                <div class="detail-item">
                    <span class="detail-label">Protocol:</span> {scheme}
                </div>
                <div class="detail-item">
                    <span class="detail-label">Host:</span> {host}
                </div>
                <div class="detail-item">
                    <span class="detail-label">Path:</span> {path}
                </div>
                <div class="detail-item">
                    <span class="detail-label">Method:</span> {method}
                </div>
                <div class="detail-item">
                    <span class="detail-label">User Agent:</span> {user_agent}
                </div>
            </div>

            <p>This page will help us understand:</p>
            <ul>
                <li>HTTP Request/Response cycle</li>
                <li>Status codes (like 200 OK)</li>
                <li>Browser rendering process</li>
            </ul>
        </body>
        </html>
    "#,
        scheme = scheme,
        host = host,
        path = path,
        method = method,
        user_agent = user_agent
    ))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    println!("Server starting at http://127.0.0.1:8080");

    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(fs::Files::new("/static", "static").show_files_listing())
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

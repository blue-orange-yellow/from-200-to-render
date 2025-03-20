use actix_files as fs;
use actix_web::{
    App, HttpRequest, HttpResponse, HttpServer, Responder, delete, get, post, put, web,
};
use serde::{Deserialize, Serialize};

mod dns_resolver;

#[derive(Deserialize)]
struct DnsQuery {
    domain: String,
}

// HTTPリクエストの詳細を表すモデル
#[derive(Serialize)]
struct RequestDetails {
    method: String,
    path: String,
    headers: Vec<(String, String)>,
    query_string: Option<String>,
    body: Option<String>,
}

// POSTリクエストのボディ
#[derive(Deserialize)]
struct PostData {
    message: String,
}

// 様々なHTTPメソッドを試すためのエンドポイント
#[post("/echo")]
async fn echo_post(req: HttpRequest, body: web::Json<PostData>) -> impl Responder {
    let details = RequestDetails {
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
        body: Some(body.message.clone()),
    };

    HttpResponse::Ok().json(details)
}

#[put("/echo")]
async fn echo_put(req: HttpRequest, body: web::Json<PostData>) -> impl Responder {
    let details = RequestDetails {
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
        body: Some(body.message.clone()),
    };

    HttpResponse::Ok().json(details)
}

#[delete("/echo")]
async fn echo_delete(req: HttpRequest) -> impl Responder {
    let details = RequestDetails {
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
        body: None,
    };

    HttpResponse::Ok().json(details)
}

#[get("/status/{code}")]
async fn status_code(path: web::Path<u16>) -> impl Responder {
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

#[get("/dns-lookup")]
async fn dns_lookup(query: web::Query<DnsQuery>) -> impl Responder {
    match dns_resolver::lookup_domain(&query.domain).await {
        Ok(result) => HttpResponse::Ok().json(result),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

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

    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(format!(
        r#"
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
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
                .dns-lookup {{
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #f5f5f5;
                    border-radius: 5px;
                }}
                .dns-lookup input {{
                    padding: 8px;
                    margin-right: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }}
                .dns-lookup button {{
                    padding: 8px 16px;
                    background-color: #2196f3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }}
                .dns-lookup button:hover {{
                    background-color: #1976d2;
                }}
                #dns-result {{
                    margin-top: 15px;
                    white-space: pre-wrap;
                }}
                .http-playground {{
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #fff3e0;
                    border-radius: 5px;
                }}
                .http-playground h2 {{
                    color: #e65100;
                    margin-top: 0;
                }}
                .http-playground select, .http-playground input {{
                    padding: 8px;
                    margin-right: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }}
                .http-playground button {{
                    padding: 8px 16px;
                    background-color: #ff9800;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }}
                .http-playground button:hover {{
                    background-color: #f57c00;
                }}
                #http-result {{
                    margin-top: 15px;
                    white-space: pre-wrap;
                    font-family: monospace;
                }}
            </style>
            <script>
                async function lookupDomain() {{
                    const domain = document.getElementById('domain-input').value;
                    const resultDiv = document.getElementById('dns-result');
                    
                    try {{
                        const response = await fetch(`/dns-lookup?domain=${{encodeURIComponent(domain)}}`);
                        const data = await response.json();
                        resultDiv.textContent = JSON.stringify(data, null, 2);
                    }} catch (error) {{
                        resultDiv.textContent = `エラー: ${{error.message}}`;
                    }}
                }}

                async function sendRequest() {{
                    const method = document.getElementById('http-method').value;
                    const statusCode = document.getElementById('status-code').value;
                    const message = document.getElementById('message-input').value;
                    const resultDiv = document.getElementById('http-result');
                    
                    try {{
                        let url = method === 'STATUS' ? `/status/${{statusCode}}` : '/echo';
                        let options = {{
                            method: method === 'STATUS' ? 'GET' : method,
                            headers: {{
                                'Content-Type': 'application/json'
                            }}
                        }};
                        
                        if (['POST', 'PUT'].includes(method)) {{
                            options.body = JSON.stringify({{ message }});
                        }}
                        
                        const response = await fetch(url, options);
                        const data = await response.text();
                        
                        resultDiv.textContent = `Status: ${{response.status}} ${{response.statusText}}\n\nResponse:\n${{data}}`;
                    }} catch (error) {{
                        resultDiv.textContent = `エラー: ${{error.message}}`;
                    }}
                }}
            </script>
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

            <div class="dns-lookup">
                <h2>DNS Lookup Tool</h2>
                <p>ドメイン名からIPアドレスを解決してみよう：</p>
                <div>
                    <input type="text" id="domain-input" placeholder="example.com">
                    <button onclick="lookupDomain()">DNS Lookup</button>
                </div>
                <pre id="dns-result"></pre>
            </div>

            <div class="http-playground">
                <h2>HTTP Playground</h2>
                <p>HTTPメソッドとステータスコードを試してみよう：</p>
                <div>
                    <select id="http-method">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="STATUS">Status Code</option>
                    </select>
                    <input type="number" id="status-code" placeholder="Status Code (200, 404, etc.)" value="200">
                    <input type="text" id="message-input" placeholder="Message for POST/PUT">
                    <button onclick="sendRequest()">Send Request</button>
                </div>
                <pre id="http-result"></pre>
            </div>

            <p>This page will help us understand:</p>
            <ul>
                <li>HTTP Request/Response cycle</li>
                <li>Status codes (like 200 OK)</li>
                <li>Browser rendering process</li>
                <li>DNS resolution process</li>
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
            .service(dns_lookup)
            .service(echo_post)
            .service(echo_put)
            .service(echo_delete)
            .service(status_code)
            .service(fs::Files::new("/static", "static").show_files_listing())
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

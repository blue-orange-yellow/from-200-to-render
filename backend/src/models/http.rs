use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct RequestDetails {
    pub method: String,
    pub path: String,
    pub headers: Vec<(String, String)>,
    pub query_string: Option<String>,
    pub body: Option<String>,
}

#[derive(Deserialize)]
pub struct PostData {
    pub message: String,
}

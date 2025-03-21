import React, { useState } from 'react';
import './RequestDetails.css';

export interface TimingInfo {
  startTime: number;
  dnsLookupTime?: number;
  tcpConnectionTime?: number;
  tlsHandshakeTime?: number;
  timeToFirstByte?: number;
  totalTime: number;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && <div className="tooltip">{content}</div>}
    </div>
  );
};

const timingExplanations = {
  dns: `DNSルックアップ: ドメイン名（例：example.com）をIPアドレスに変換する処理時間。
• ローカルキャッシュの確認
• DNSサーバーへの問い合わせ
• 結果の取得と保存`,
  
  tcp: `TCP接続: クライアントとサーバー間で信頼性のある接続を確立する時間。
• 3ウェイハンドシェイク（SYN, SYN-ACK, ACK）
• 接続パラメータのネゴシエーション
• エラー制御と順序保証の設定`,
  
  tls: `TLSハンドシェイク: HTTPS通信のための暗号化接続を確立する時間。
• 証明書の検証
• 暗号化方式の決定
• セッションキーの生成と交換`,
  
  ttfb: `Time to First Byte: サーバーからの最初のレスポンスを受け取るまでの時間。
• リクエストの処理時間
• サーバーの応答時間
• ネットワークの往復時間`
};

export interface RequestDetailsProps {
  url: string;
  method: string;
  headers: Record<string, string>;
  requestBody?: string;
  responseStatus?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: string;
  timing?: TimingInfo;
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({
  url,
  method,
  headers,
  requestBody,
  responseStatus,
  responseHeaders,
  responseBody,
  timing,
}) => {
    console.log(timing);
  return (
    <div className="request-details">
      <section className="request-section">
        <h3>Request Information</h3>
        <div className="info-group">
          <div className="info-item">
            <span className="label">URL:</span>
            <span className="value">{url}</span>
          </div>
          <div className="info-item">
            <span className="label">Method:</span>
            <span className="value">{method}</span>
          </div>
        </div>

        <div className="info-group">
          <h4>Request Headers</h4>
          {Object.entries(headers).map(([key, value]) => (
            <div key={key} className="info-item">
              <span className="label">{key}:</span>
              <span className="value">{value}</span>
            </div>
          ))}
        </div>

        {requestBody && (
          <div className="info-group">
            <h4>Request Body</h4>
            <pre className="body-content">{requestBody}</pre>
          </div>
        )}
      </section>

      {responseStatus && (
        <section className="response-section">
          <h3>Response Information</h3>
          <div className="info-group">
            <div className="info-item">
              <span className="label">Status:</span>
              <span className="value">{responseStatus}</span>
            </div>
          </div>

          {responseHeaders && (
            <div className="info-group">
              <h4>Response Headers</h4>
              {Object.entries(responseHeaders).map(([key, value]) => (
                <div key={key} className="info-item">
                  <span className="label">{key}:</span>
                  <span className="value">{value}</span>
                </div>
              ))}
            </div>
          )}

          {responseBody && (
            <div className="info-group">
              <h4>Response Body</h4>
              <pre className="body-content">{responseBody}</pre>
            </div>
          )}
        </section>
      )}

      {timing && (
        <section className="timing-section">
          <h3>Timing Information</h3>
          <div className="timing-bar">
            {timing.dnsLookupTime && (
              <div
                className="timing-segment dns"
                style={{
                  width: `${(timing.dnsLookupTime / timing.totalTime) * 100}%`,
                }}
                title={`DNS Lookup: ${timing.dnsLookupTime.toFixed(2)}ms`}
              />
            )}
            {timing.tcpConnectionTime && (
              <div
                className="timing-segment tcp"
                style={{
                  width: `${(timing.tcpConnectionTime / timing.totalTime) * 100}%`,
                }}
                title={`TCP Connection: ${timing.tcpConnectionTime.toFixed(2)}ms`}
              />
            )}
            {timing.tlsHandshakeTime && (
              <div
                className="timing-segment tls"
                style={{
                  width: `${(timing.tlsHandshakeTime / timing.totalTime) * 100}%`,
                }}
                title={`TLS Handshake: ${timing.tlsHandshakeTime.toFixed(2)}ms`}
              />
            )}
            {timing.timeToFirstByte && (
              <div
                className="timing-segment ttfb"
                style={{
                  width: `${(timing.timeToFirstByte / timing.totalTime) * 100}%`,
                }}
                title={`Time to First Byte: ${timing.timeToFirstByte.toFixed(2)}ms`}
              />
            )}
          </div>
          <div className="timing-legend">
            {timing.dnsLookupTime && (
              <Tooltip content={timingExplanations.dns}>
                <div className="legend-item">
                  <div className="color-box dns" />
                  <span>DNS Lookup ({timing.dnsLookupTime.toFixed(2)}ms)</span>
                </div>
              </Tooltip>
            )}
            {timing.tcpConnectionTime && (
              <Tooltip content={timingExplanations.tcp}>
                <div className="legend-item">
                  <div className="color-box tcp" />
                  <span>TCP Connection ({timing.tcpConnectionTime.toFixed(2)}ms)</span>
                </div>
              </Tooltip>
            )}
            {timing.tlsHandshakeTime && (
              <Tooltip content={timingExplanations.tls}>
                <div className="legend-item">
                  <div className="color-box tls" />
                  <span>TLS Handshake ({timing.tlsHandshakeTime.toFixed(2)}ms)</span>
                </div>
              </Tooltip>
            )}
            {timing.timeToFirstByte && (
              <Tooltip content={timingExplanations.ttfb}>
                <div className="legend-item">
                  <div className="color-box ttfb" />
                  <span>Time to First Byte ({timing.timeToFirstByte.toFixed(2)}ms)</span>
                </div>
              </Tooltip>
            )}
          </div>
          <div className="timing-details">
            <div className="info-item">
              <span className="label">Total Time:</span>
              <span className="value">{timing.totalTime.toFixed(2)}ms</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}; 
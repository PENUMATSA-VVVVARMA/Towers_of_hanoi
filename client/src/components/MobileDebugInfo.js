import React, { useState, useEffect } from 'react';

const MobileDebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isOnline: navigator.onLine,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: window.location.port,
      pathname: window.location.pathname,
      apiUrl: process.env.REACT_APP_API_URL,
      nodeEnv: process.env.NODE_ENV,
      connectionType: navigator.connection?.effectiveType || 'unknown',
      networkState: navigator.connection?.downlink || 'unknown'
    };
    setDebugInfo(info);
  }, []);

  // Only show in development or when URL has debug=true
  const shouldShow = process.env.NODE_ENV === 'development' || 
    new URLSearchParams(window.location.search).get('debug') === 'true';

  if (!shouldShow) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>🔍 Debug Info</h4>
      <div><strong>Mobile:</strong> {debugInfo.isMobile ? 'Yes' : 'No'}</div>
      <div><strong>Online:</strong> {debugInfo.isOnline ? 'Yes' : 'No'}</div>
      <div><strong>Protocol:</strong> {debugInfo.protocol}</div>
      <div><strong>Host:</strong> {debugInfo.hostname}</div>
      <div><strong>API URL:</strong> {debugInfo.apiUrl}</div>
      <div><strong>Env:</strong> {debugInfo.nodeEnv}</div>
      <div><strong>Connection:</strong> {debugInfo.connectionType}</div>
      <div><strong>Speed:</strong> {debugInfo.networkState} Mbps</div>
      <small>Add ?debug=true to URL to see this in production</small>
    </div>
  );
};

export default MobileDebugInfo;
import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url = 'ws://localhost:8000/ws/cases', onMessage) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    let isComponentMounted = true;

    function connect() {
      try {
        const ws = new WebSocket(url);
        socketRef.current = ws;

        ws.onopen = () => {
          if (isComponentMounted) setIsConnected(true);
          console.log("WebSocket connected to Sarthi Live Feed Stream.");
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (onMessage) onMessage(data);
          } catch (e) {
            console.log("WebSocket raw payload:", event.data);
          }
        };

        ws.onclose = () => {
          if (isComponentMounted) setIsConnected(false);
          // Try reconnecting after 3 seconds
          setTimeout(() => {
            if (isComponentMounted) connect();
          }, 3000);
        };

        ws.onerror = (err) => {
          console.log("WebSocket connection error:", err);
          ws.close();
        };
      } catch (err) {
        console.log("WebSocket setup failed:", err);
      }
    }

    connect();

    return () => {
      isComponentMounted = false;
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]);

  return { isConnected };
}

import { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

const API_BASE_URL = 'http://localhost:5193';

export interface ProgressUpdate {
  message: string;
  percentage: number;
}

export const useSignalR = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState<ProgressUpdate>({ message: '', percentage: 0 });
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/progressHub`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = newConnection;
    setConnection(newConnection);

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, []);

  const startConnection = async () => {
    if (connection && connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await connection.start();
        setIsConnected(true);
        console.log('SignalR Connected');

        connection.on('ReceiveProgress', (message: string, percentage: number) => {
          setProgress({ message, percentage });
          console.log(`Progress: ${percentage}% - ${message}`);
        });
      } catch (err) {
        console.error('SignalR Connection Error:', err);
        setIsConnected(false);
      }
    }
  };

  const stopConnection = async () => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      try {
        connection.off('ReceiveProgress');
        await connection.stop();
        setIsConnected(false);
        console.log('SignalR Disconnected');
      } catch (err) {
        console.error('SignalR Disconnection Error:', err);
      }
    }
  };

  const resetProgress = () => {
    setProgress({ message: '', percentage: 0 });
  };

  return {
    connection,
    isConnected,
    progress,
    startConnection,
    stopConnection,
    resetProgress,
    connectionId: connection?.connectionId
  };
};


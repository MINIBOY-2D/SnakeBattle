import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { useFirebaseLeaderboard } from "../../lib/stores/useFirebaseLeaderboard";

export function FirebaseStatus() {
  const { loading, error } = useFirebaseLeaderboard();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');

  useEffect(() => {
    if (loading) {
      setConnectionStatus('connecting');
    } else if (error) {
      setConnectionStatus('error');
    } else {
      setConnectionStatus('connected');
    }
  }, [loading, error]);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-3 h-3" />;
      case 'connecting':
        return <div className="w-3 h-3 animate-spin border border-gray-400 border-t-transparent rounded-full" />;
      case 'error':
        return <WifiOff className="w-3 h-3" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connecté';
      case 'connecting':
        return 'Connexion...';
      case 'error':
        return 'Hors ligne';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-800 text-green-200 border-green-600';
      case 'connecting':
        return 'bg-yellow-800 text-yellow-200 border-yellow-600';
      case 'error':
        return 'bg-red-800 text-red-200 border-red-600';
    }
  };

  return (
    <div className="flex justify-center mb-4">
      <Badge variant="outline" className={`${getStatusColor()} flex items-center gap-1`}>
        {getStatusIcon()}
        {getStatusText()}
      </Badge>
    </div>
  );
}
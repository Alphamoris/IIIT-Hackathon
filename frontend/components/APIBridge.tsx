'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  Activity, 
  Database, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface APIBridgeProps {
  onStatusChange?: (connected: boolean) => void;
  onLog?: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

interface ServerMetrics {
  uptime: number;
  requests: number;
  errors: number;
  latency: number;
  chainsActive: number;
}

export default function APIBridge({ onStatusChange, onLog }: APIBridgeProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [metrics, setMetrics] = useState<ServerMetrics>({
    uptime: 0,
    requests: 0,
    errors: 0,
    latency: 0,
    chainsActive: 1
  });
  const [lastPing, setLastPing] = useState<Date | null>(null);

  // Simulate connection to MCP server
  const connectToServer = async () => {
    setIsConnecting(true);
    onLog?.('Attempting connection to MCP Server...', 'info');
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful connection
      setIsConnected(true);
      setLastPing(new Date());
      onStatusChange?.(true);
      onLog?.('Connected to MCP Server successfully', 'success');
      
      // Start metrics simulation
      startMetricsSimulation();
    } catch (error) {
      onLog?.('Failed to connect to MCP Server', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromServer = () => {
    setIsConnected(false);
    setLastPing(null);
    onStatusChange?.(false);
    onLog?.('Disconnected from MCP Server', 'warning');
  };

  const startMetricsSimulation = () => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      if (!isConnected) {
        clearInterval(interval);
        return;
      }
      
      setMetrics(prev => ({
        uptime: Math.floor((Date.now() - startTime) / 1000),
        requests: prev.requests + Math.floor(Math.random() * 3),
        errors: prev.errors + (Math.random() < 0.05 ? 1 : 0),
        latency: 50 + Math.floor(Math.random() * 100),
        chainsActive: 1
      }));
      
      setLastPing(new Date());
    }, 2000);

    return interval;
  };

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-400" />
            MCP Server Bridge
          </h3>
          
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
            <span className={`font-medium ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-black/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Status</span>
            </div>
            <div className={`text-lg font-semibold ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}>
              {isConnecting ? 'Connecting...' : isConnected ? 'Online' : 'Offline'}
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Last Ping</span>
            </div>
            <div className="text-lg font-semibold text-white">
              {lastPing ? lastPing.toLocaleTimeString() : 'Never'}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={isConnected ? disconnectFromServer : connectToServer}
            disabled={isConnecting}
            className={`cyber-button flex items-center gap-2 ${
              isConnecting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            whileHover={{ scale: isConnecting ? 1 : 1.05 }}
            whileTap={{ scale: isConnecting ? 1 : 0.95 }}
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isConnected ? (
              <WifiOff className="w-4 h-4" />
            ) : (
              <Wifi className="w-4 h-4" />
            )}
            {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
          </motion.button>

          {isConnected && (
            <motion.button
              onClick={() => {
                setLastPing(new Date());
                onLog?.('Ping sent to MCP Server', 'info');
              }}
              className="glass-card px-4 py-2 border border-gray-600 hover:border-blue-400/50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Ping Server
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Server Metrics */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Server Metrics
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Uptime</div>
              <div className="text-lg font-semibold text-white">
                {formatUptime(metrics.uptime)}
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Requests</div>
              <div className="text-lg font-semibold text-blue-400">
                {metrics.requests.toLocaleString()}
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Latency</div>
              <div className="text-lg font-semibold text-green-400">
                {metrics.latency}ms
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Active Chains</div>
              <div className="text-lg font-semibold text-purple-400">
                {metrics.chainsActive}
              </div>
            </div>
          </div>

          {/* Health Indicators */}
          <div className="mt-6 space-y-3">
            <h5 className="text-sm font-semibold text-white">Health Indicators</h5>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Connection Stability</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Excellent</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Response Time</span>
                <div className="flex items-center gap-2">
                  {metrics.latency < 100 ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Good</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">Fair</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Error Rate</span>
                <div className="flex items-center gap-2">
                  {metrics.errors < 5 ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Low</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">Moderate</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* API Endpoints Status */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Available Endpoints
          </h4>

          <div className="space-y-3">
            {[
              { name: 'getMyAddress', status: 'active', description: 'Get wallet address' },
              { name: 'getSolBalance', status: 'active', description: 'Check SOL balance' },
              { name: 'getTokenBalances', status: 'active', description: 'Get token balances' },
              { name: 'transferSol', status: 'active', description: 'Transfer SOL tokens' },
              { name: 'swapTokens', status: 'active', description: 'Swap via Jupiter DEX' },
              { name: 'getTokenPrice', status: 'active', description: 'Get token prices' },
            ].map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-black/20 rounded-lg">
                <div>
                  <div className="font-mono text-sm text-white">{endpoint.name}</div>
                  <div className="text-xs text-gray-400">{endpoint.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">Ready</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

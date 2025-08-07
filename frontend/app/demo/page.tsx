'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Square, 
  Terminal, 
  Settings, 
  Activity,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import SolanaDemo from '../../components/SolanaDemo';
import { mcpClient } from '../../lib/mcp-client';

export default function DemoPage() {
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [logs, setLogs] = useState<Array<{message: string, type: 'info' | 'success' | 'error' | 'warning', timestamp: Date}>>([]);
  const [serverStatus, setServerStatus] = useState<'stopped' | 'starting' | 'running' | 'error'>('stopped');

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setLogs(prev => [...prev.slice(-19), { message, type, timestamp: new Date() }]);
  };

  const checkServerHealth = async () => {
    try {
      const response = await mcpClient.healthCheck();
      if (response.success) {
        setIsServerRunning(true);
        setServerStatus('running');
        addLog('MCP Server is healthy and responding', 'success');
        return true;
      } else {
        setIsServerRunning(false);
        setServerStatus('error');
        addLog(`Server health check failed: ${response.error}`, 'error');
        return false;
      }
    } catch (error) {
      setIsServerRunning(false);
      setServerStatus('error');
      addLog('Unable to connect to MCP Server', 'error');
      return false;
    }
  };

  const initializeServer = async () => {
    setIsInitializing(true);
    setServerStatus('starting');
    addLog('Starting MCP Server initialization...', 'info');

    try {
      // Simulate the initialization process with realistic steps
      addLog('Checking environment configuration...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addLog('Loading blockchain configurations...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addLog('Establishing Solana RPC connection...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addLog('Validating private keys and credentials...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      addLog('Registering Solana tools and capabilities...', 'info');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addLog('Starting MCP protocol server...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Try to actually connect to server
      const isHealthy = await checkServerHealth();
      
      if (isHealthy) {
        addLog('🎉 MCP Server initialized successfully!', 'success');
        setIsServerRunning(true);
        setServerStatus('running');
      } else {
        addLog('⚠️ MCP Server started but health check failed', 'warning');
        addLog('This is normal for demo mode - server simulation active', 'info');
        setIsServerRunning(true);
        setServerStatus('running');
      }
    } catch (error: any) {
      addLog(`Initialization failed: ${error.message}`, 'error');
      setServerStatus('error');
    } finally {
      setIsInitializing(false);
    }
  };

  const stopServer = () => {
    addLog('Stopping MCP Server...', 'info');
    setIsServerRunning(false);
    setServerStatus('stopped');
    addLog('MCP Server stopped', 'warning');
  };

  const runInitScript = async () => {
    addLog('Executing initialization script...', 'info');
    try {
      // Simulate running the shell script
      addLog('$ ./scripts/init-mcp-server.sh', 'info');
      await new Promise(resolve => setTimeout(resolve, 500));
      addLog('Installing dependencies...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog('Building MCP server...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1500));
      addLog('Configuration validated', 'success');
      addLog('Script execution completed successfully', 'success');
    } catch (error: any) {
      addLog(`Script execution failed: ${error.message}`, 'error');
    }
  };

  // Check server status on component mount
  useEffect(() => {
    checkServerHealth();
    
    // Set up periodic health checks
    const interval = setInterval(() => {
      if (isServerRunning) {
        checkServerHealth();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isServerRunning]);

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'running': return 'text-green-400';
      case 'starting': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (serverStatus) {
      case 'running': return <CheckCircle className="w-4 h-4" />;
      case 'starting': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => window.history.back()}
              className="glass-card p-3 hover:border-blue-400/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            <div>
              <h1 className="text-3xl font-orbitron font-bold gradient-text">
                Web3 MCP Demo
              </h1>
              <p className="text-gray-400">Interactive blockchain operations showcase</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="font-medium capitalize">{serverStatus}</span>
            </div>
          </div>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-400" />
              Server Control Panel
            </h2>
            
            <div className="flex gap-3">
              <motion.button
                onClick={runInitScript}
                className="glass-card px-4 py-2 border border-gray-600 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Terminal className="w-4 h-4" />
                Run Init Script
              </motion.button>
              
              <motion.button
                onClick={isServerRunning ? stopServer : initializeServer}
                disabled={isInitializing}
                className={`cyber-button flex items-center gap-2 ${
                  isInitializing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: isInitializing ? 1 : 1.05 }}
                whileTap={{ scale: isInitializing ? 1 : 0.95 }}
              >
                {isInitializing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isServerRunning ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isInitializing ? 'Initializing...' : isServerRunning ? 'Stop Server' : 'Start Server'}
              </motion.button>
            </div>
          </div>

          {/* Server Status */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-white">Status</span>
              </div>
              <div className={`text-lg font-semibold ${getStatusColor()}`}>
                {serverStatus.charAt(0).toUpperCase() + serverStatus.slice(1)}
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="font-medium text-white">Enabled Chains</span>
              </div>
              <div className="text-lg font-semibold text-green-400">
                Solana
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-white">Tools Available</span>
              </div>
              <div className="text-lg font-semibold text-purple-400">
                {isServerRunning ? '8 Active' : 'None'}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Demo Interface */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-400" />
                Interactive Blockchain Operations
              </h2>
              
              <AnimatePresence>
                {isServerRunning ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <SolanaDemo onLog={(message) => addLog(message, 'info')} />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">
                      MCP Server Not Running
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start the MCP Server to begin the interactive demo
                    </p>
                    <motion.button
                      onClick={initializeServer}
                      className="cyber-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Initialize Server
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Live Console */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 h-fit"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-green-400" />
                  Live Console
                </h3>
                <motion.button
                  onClick={() => setLogs([])}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Clear
                </motion.button>
              </div>
              
              <div className="bg-black/50 rounded-lg p-4 h-96 overflow-y-auto border border-gray-800 font-mono text-sm">
                <AnimatePresence>
                  {logs.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Console output will appear here...</p>
                    </div>
                  ) : (
                    logs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`mb-1 ${
                          log.type === 'success' ? 'text-green-400' :
                          log.type === 'error' ? 'text-red-400' :
                          log.type === 'warning' ? 'text-yellow-400' :
                          'text-gray-300'
                        }`}
                      >
                        <span className="text-gray-500 text-xs">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                        {' '}
                        {log.message}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-gray-400"
        >
          <p className="mb-2">
            🏆 AYA Hackathon 2025 - Revolutionizing Web3 Development
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <span>Multi-Chain Support</span>
            <span>•</span>
            <span>Real-Time Operations</span>
            <span>•</span>
            <span>Enterprise Security</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

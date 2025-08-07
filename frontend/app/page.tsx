'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Coins, 
  ArrowRightLeft, 
  Wallet, 
  ChevronRight, 
  Play, 
  Settings, 
  Activity,
  Globe,
  Code,
  Shield,
  Rocket,
  Database,
  Network,
  TrendingUp,
  ChevronDown
} from 'lucide-react';

export default function Home() {
  const [selectedChain, setSelectedChain] = useState('solana');
  const [isInitialized, setIsInitialized] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const chains = [
    { id: 'solana', name: 'Solana', icon: '◎', color: 'from-purple-500 to-green-400', enabled: true },
    { id: 'ethereum', name: 'Ethereum', icon: 'Ξ', color: 'from-blue-500 to-purple-500', enabled: false },
    { id: 'bitcoin', name: 'Bitcoin', icon: '₿', color: 'from-orange-500 to-yellow-500', enabled: false },
    { id: 'cardano', name: 'Cardano', icon: '₳', color: 'from-blue-600 to-indigo-600', enabled: false },
    { id: 'xrp', name: 'XRP', icon: 'X', color: 'from-gray-500 to-blue-500', enabled: false },
  ];

  const features = [
    {
      title: 'Balance Checking',
      description: 'Real-time balance queries across multiple chains',
      icon: Wallet,
      demo: 'balance'
    },
    {
      title: 'Token Transfers',
      description: 'Secure token transfers with full transaction tracking',
      icon: ArrowRightLeft,
      demo: 'transfer'
    },
    {
      title: 'DEX Swaps',
      description: 'Best price routing via Jupiter and other DEXs',
      icon: TrendingUp,
      demo: 'swap'
    },
    {
      title: 'Account Info',
      description: 'Comprehensive wallet and account information',
      icon: Activity,
      demo: 'account'
    }
  ];

  const handleInitialize = async () => {
    setIsInitialized(false);
    addLog('Initializing MCP Server...');
    
    // Simulate initialization process
    setTimeout(() => addLog('Loading blockchain configurations...'), 500);
    setTimeout(() => addLog('Establishing RPC connections...'), 1000);
    setTimeout(() => addLog('Validating private keys...'), 1500);
    setTimeout(() => addLog('Registering Solana tools...'), 2000);
    setTimeout(() => addLog('MCP Server initialized successfully!'), 2500);
    setTimeout(() => setIsInitialized(true), 3000);
  };

  const runDemo = async (demo: string) => {
    setActiveDemo(demo);
    addLog(`Starting ${demo} demo...`);
    
    // Simulate demo execution
    setTimeout(() => {
      switch(demo) {
        case 'balance':
          addLog('Retrieved SOL balance: 1.234 SOL');
          addLog('Retrieved token balances: 3 SPL tokens found');
          break;
        case 'transfer':
          addLog('Transaction prepared: 0.1 SOL transfer');
          addLog('Transaction signed and submitted');
          addLog('Transaction confirmed: 4k2..abc');
          break;
        case 'swap':
          addLog('Jupiter quote: 0.1 SOL → 15.67 USDC');
          addLog('Swap transaction executed');
          addLog('Swap completed successfully');
          break;
        case 'account':
          addLog('Account info retrieved');
          addLog('Recent transactions: 12 found');
          break;
      }
      setTimeout(() => setActiveDemo(null), 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <Rocket className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">AYA Hackathon 2025</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-orbitron font-bold mb-6">
            <span className="gradient-text">Web3 MCP</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Revolutionary <span className="text-blue-400 font-semibold">Model Context Protocol</span> server for seamless blockchain interactions
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Unified interface for Solana, Ethereum, Bitcoin, Cardano, XRP and more. 
            Experience the future of multi-chain Web3 development.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <motion.button
              onClick={handleInitialize}
              disabled={isInitialized}
              className={`cyber-button flex items-center gap-2 ${isInitialized ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={{ scale: isInitialized ? 1 : 1.05 }}
              whileTap={{ scale: isInitialized ? 1 : 0.95 }}
            >
              <Play className="w-5 h-5" />
              {isInitialized ? 'MCP Server Running' : 'Initialize MCP Server'}
            </motion.button>
            
            <motion.a
              href="/demo"
              className="glass-card px-6 py-3 rounded-lg border border-white/20 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Code className="w-5 h-5" />
              Launch Demo
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Chain Selector */}
      <section className="px-4 py-16 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-orbitron font-bold mb-4 gradient-text">
              Multi-Chain Support
            </h2>
            <p className="text-gray-400 text-lg">
              Currently optimized for Solana with cross-chain capabilities
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
            {chains.map((chain, index) => (
              <motion.button
                key={chain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => chain.enabled && setSelectedChain(chain.id)}
                className={`glass-card p-6 text-center transition-all duration-300 ${
                  selectedChain === chain.id 
                    ? 'neon-border scale-105' 
                    : chain.enabled 
                      ? 'hover:border-white/30 hover:scale-105' 
                      : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!chain.enabled}
              >
                <div className={`text-4xl mb-3 bg-gradient-to-r ${chain.color} bg-clip-text text-transparent`}>
                  {chain.icon}
                </div>
                <h3 className="font-semibold text-white mb-1">{chain.name}</h3>
                <div className="flex items-center justify-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${chain.enabled ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                  <span className="text-xs text-gray-400">
                    {chain.enabled ? 'Active' : 'Coming Soon'}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Demo */}
      <section className="px-4 py-16 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-orbitron font-bold mb-4 gradient-text">
              Interactive Demo
            </h2>
            <p className="text-gray-400 text-lg">
              Experience the power of MCP Server with live blockchain operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.demo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 hover:border-blue-400/50 transition-all duration-300 group cursor-pointer"
                onClick={() => isInitialized && runDemo(feature.demo)}
              >
                <div className="flex items-center justify-between mb-4">
                  <feature.icon className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  {activeDemo === feature.demo && (
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                <div className="flex items-center text-blue-400 text-sm group-hover:text-blue-300 transition-colors">
                  <span className={isInitialized ? '' : 'opacity-50'}>
                    {isInitialized ? 'Run Demo' : 'Initialize First'}
                  </span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Console */}
      <section className="px-4 py-16 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-orbitron font-semibold text-white">Live Console</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Real-time logs</span>
              </div>
            </div>
            
            <div className="bg-black/50 rounded-lg p-4 h-64 overflow-y-auto border border-gray-800">
              <div className="font-mono text-sm space-y-1">
                {logs.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Initialize MCP Server to see live logs...</p>
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-green-400"
                    >
                      {log}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="px-4 py-16 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-orbitron font-bold mb-4 gradient-text">
              Technical Excellence
            </h2>
            <p className="text-gray-400 text-lg">
              Built with cutting-edge technology for maximum performance and security
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="glass-card p-8 text-center"
            >
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Enterprise Security</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li>• Environment-based key management</li>
                <li>• Secure transaction signing</li>
                <li>• Rate limiting & error handling</li>
                <li>• Audit-ready logging</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="glass-card p-8 text-center"
            >
              <Network className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Multi-Chain Architecture</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li>• Unified API across chains</li>
                <li>• Modular chain registration</li>
                <li>• Custom RPC endpoints</li>
                <li>• Cross-chain operations</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="glass-card p-8 text-center"
            >
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">High Performance</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li>• Optimized RPC connections</li>
                <li>• Intelligent caching layer</li>
                <li>• Parallel processing</li>
                <li>• Real-time updates</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 border-t border-white/10 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            Built for AYA Hackathon 2025 • Showcasing the future of Web3 development
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Documentation</a>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">GitHub</a>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">API Reference</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Terminal icon component
function Terminal({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  );
}
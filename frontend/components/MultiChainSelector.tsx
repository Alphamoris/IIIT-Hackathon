'use client';

import { motion } from 'framer-motion';
import { ChevronDown, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface Chain {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: 'active' | 'coming-soon' | 'maintenance';
  description: string;
  features: string[];
}

const chains: Chain[] = [
  {
    id: 'solana',
    name: 'Solana',
    icon: '◎',
    color: 'from-purple-500 to-green-400',
    status: 'active',
    description: 'High-performance blockchain with low fees',
    features: ['Balance checking', 'Token transfers', 'DEX swaps', 'Jupiter integration']
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: 'Ξ',
    color: 'from-blue-500 to-purple-500',
    status: 'coming-soon',
    description: 'Leading smart contract platform',
    features: ['ERC-20 tokens', 'DeFi protocols', 'NFT support', 'Layer 2 scaling']
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    icon: '₿',
    color: 'from-orange-500 to-yellow-500',
    status: 'coming-soon',
    description: 'Original cryptocurrency and store of value',
    features: ['UTXO tracking', 'Transaction history', 'Address validation', 'Fee estimation']
  },
  {
    id: 'cardano',
    name: 'Cardano',
    icon: '₳',
    color: 'from-blue-600 to-indigo-600',
    status: 'coming-soon',
    description: 'Research-driven blockchain platform',
    features: ['Native tokens', 'Stake pools', 'UTxO model', 'Formal verification']
  },
  {
    id: 'xrp',
    name: 'XRP Ledger',
    icon: 'X',
    color: 'from-gray-500 to-blue-500',
    status: 'coming-soon',
    description: 'Fast and efficient payment network',
    features: ['Cross-border payments', 'Trustlines', 'DEX trading', 'Low energy']
  },
  {
    id: 'ton',
    name: 'TON',
    icon: '💎',
    color: 'from-blue-400 to-cyan-400',
    status: 'coming-soon',
    description: 'The Open Network for mass adoption',
    features: ['Telegram integration', 'Sharding', 'Fast finality', 'DeFi ecosystem']
  }
];

interface MultiChainSelectorProps {
  selectedChain: string;
  onChainSelect: (chainId: string) => void;
  onLog?: (message: string) => void;
}

export default function MultiChainSelector({ selectedChain, onChainSelect, onLog }: MultiChainSelectorProps) {
  const [expandedChain, setExpandedChain] = useState<string | null>(null);

  const getStatusIcon = (status: Chain['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'coming-soon':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'maintenance':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusText = (status: Chain['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'coming-soon':
        return 'Coming Soon';
      case 'maintenance':
        return 'Maintenance';
    }
  };

  const handleChainClick = (chain: Chain) => {
    if (chain.status === 'active') {
      onChainSelect(chain.id);
      onLog?.(`Selected ${chain.name} blockchain`);
    } else {
      onLog?.(`${chain.name} is ${getStatusText(chain.status).toLowerCase()}`);
    }
  };

  const toggleExpanded = (chainId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedChain(expandedChain === chainId ? null : chainId);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-orbitron font-bold gradient-text mb-2">
          Multi-Chain Support
        </h3>
        <p className="text-gray-400">
          Choose your blockchain to explore Web3 capabilities
        </p>
      </div>

      <div className="grid gap-4">
        {chains.map((chain, index) => (
          <motion.div
            key={chain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`glass-card p-4 transition-all duration-300 cursor-pointer ${
              selectedChain === chain.id 
                ? 'neon-border scale-[1.02]' 
                : chain.status === 'active'
                  ? 'hover:border-white/30 hover:scale-[1.01]' 
                  : 'opacity-75'
            }`}
            onClick={() => handleChainClick(chain)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Chain Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${chain.color} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                  {chain.icon}
                </div>

                {/* Chain Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-semibold text-white">{chain.name}</h4>
                    {getStatusIcon(chain.status)}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      chain.status === 'active' 
                        ? 'bg-green-400/20 text-green-400' 
                        : chain.status === 'coming-soon'
                          ? 'bg-yellow-400/20 text-yellow-400'
                          : 'bg-red-400/20 text-red-400'
                    }`}>
                      {getStatusText(chain.status)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{chain.description}</p>
                </div>

                {/* Expand Button */}
                <motion.button
                  onClick={(e) => toggleExpanded(chain.id, e)}
                  className="p-2 rounded-lg glass-card hover:border-blue-400/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: expandedChain === chain.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            {/* Expanded Content */}
            <motion.div
              initial={false}
              animate={{ 
                height: expandedChain === chain.id ? 'auto' : 0,
                opacity: expandedChain === chain.id ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/10">
                <h5 className="text-sm font-semibold text-white mb-2">Available Features:</h5>
                <div className="grid grid-cols-2 gap-2">
                  {chain.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-400"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                {chain.status === 'active' && (
                  <motion.button
                    onClick={() => onLog?.(`Exploring ${chain.name} capabilities...`)}
                    className="mt-3 cyber-button text-sm px-4 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Now
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Roadmap Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-4 mt-6"
      >
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Development Roadmap
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Phase 1: Solana Integration</span>
            <span className="text-green-400 font-semibold">✓ Complete</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Phase 2: Ethereum & EVM Chains</span>
            <span className="text-yellow-400 font-semibold">Q2 2025</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Phase 3: Bitcoin & UTXO Chains</span>
            <span className="text-blue-400 font-semibold">Q3 2025</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Phase 4: Cardano, XRP, TON</span>
            <span className="text-purple-400 font-semibold">Q4 2025</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

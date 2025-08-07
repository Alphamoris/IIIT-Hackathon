'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ArrowRightLeft, 
  TrendingUp, 
  Copy, 
  ExternalLink, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { mcpClient, formatBalance, formatAddress, formatTokenAmount, COMMON_TOKENS } from '../lib/mcp-client';

interface SolanaDemoProps {
  onLog: (message: string) => void;
}

export default function SolanaDemo({ onLog }: SolanaDemoProps) {
  const [activeTab, setActiveTab] = useState<'balance' | 'transfer' | 'swap'>('balance');
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);
  const [transferData, setTransferData] = useState({
    amount: '',
    recipient: '',
  });
  const [swapData, setSwapData] = useState({
    inputMint: COMMON_TOKENS.SOL,
    outputMint: COMMON_TOKENS.USDC,
    amount: '',
    slippage: '3',
  });
  const [results, setResults] = useState<any>(null);

  const handleGetBalance = async () => {
    setLoading(true);
    onLog('Fetching wallet address and balance...');
    
    try {
      const addressResponse = await mcpClient.getMyAddress();
      if (!addressResponse.success) {
        throw new Error(addressResponse.error);
      }

      const address = addressResponse.data.address;
      onLog(`Wallet address: ${formatAddress(address)}`);

      const balanceResponse = await mcpClient.getSolBalance(address);
      const tokenResponse = await mcpClient.getTokenBalances(address);

      setWalletData({
        address,
        solBalance: balanceResponse.data?.balance || 0,
        tokens: tokenResponse.data?.tokens || [],
      });

      onLog(`SOL Balance: ${formatBalance(balanceResponse.data?.balance || 0)} SOL`);
      onLog(`Found ${tokenResponse.data?.tokens?.length || 0} token accounts`);
      
      setResults({
        type: 'balance',
        data: {
          address,
          solBalance: balanceResponse.data?.balance || 0,
          tokens: tokenResponse.data?.tokens || [],
        }
      });
    } catch (error: any) {
      onLog(`Error: ${error.message}`);
      setResults({
        type: 'error',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferData.amount || !transferData.recipient) {
      onLog('Error: Please fill in all transfer fields');
      return;
    }

    setLoading(true);
    onLog(`Initiating transfer of ${transferData.amount} SOL to ${formatAddress(transferData.recipient)}`);

    try {
      const response = await mcpClient.transferSol(
        parseFloat(transferData.amount),
        transferData.recipient
      );

      if (response.success) {
        onLog(`Transfer successful! Signature: ${formatAddress(response.data.signature)}`);
        setResults({
          type: 'transfer',
          data: response.data,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      onLog(`Transfer failed: ${error.message}`);
      setResults({
        type: 'error',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!swapData.amount) {
      onLog('Error: Please enter swap amount');
      return;
    }

    setLoading(true);
    onLog(`Fetching swap quote for ${swapData.amount} tokens...`);

    try {
      const response = await mcpClient.swapTokens(
        swapData.inputMint,
        swapData.outputMint,
        swapData.amount,
        parseInt(swapData.slippage) * 100 // Convert to basis points
      );

      if (response.success) {
        onLog(`Swap executed successfully! Signature: ${formatAddress(response.data.signature)}`);
        setResults({
          type: 'swap',
          data: response.data,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      onLog(`Swap failed: ${error.message}`);
      setResults({
        type: 'error',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onLog(`Copied to clipboard: ${formatAddress(text)}`);
  };

  const tabs = [
    { id: 'balance', label: 'Balance Check', icon: Wallet },
    { id: 'transfer', label: 'Transfer SOL', icon: ArrowRightLeft },
    { id: 'swap', label: 'Token Swap', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'glass-card text-gray-300 hover:text-white hover:border-blue-400/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6"
        >
          {activeTab === 'balance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Wallet Balance</h3>
                <motion.button
                  onClick={handleGetBalance}
                  disabled={loading}
                  className="cyber-button flex items-center gap-2"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {loading ? 'Fetching...' : 'Get Balance'}
                </motion.button>
              </div>

              {walletData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Wallet Address:</span>
                      <button
                        onClick={() => copyToClipboard(walletData.address)}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <span className="font-mono">{formatAddress(walletData.address)}</span>
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">SOL Balance:</span>
                      <span className="text-2xl font-bold text-white">
                        {formatTokenAmount(walletData.solBalance / 1e9, 'SOL')}
                      </span>
                    </div>
                  </div>

                  {walletData.tokens.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-white">Token Balances:</h4>
                      <div className="grid gap-2 max-h-48 overflow-y-auto">
                        {walletData.tokens.map((token: any, index: number) => (
                          <div key={index} className="bg-black/20 rounded p-3 flex justify-between items-center">
                            <div>
                              <div className="font-mono text-sm text-gray-400">
                                {formatAddress(token.mint)}
                              </div>
                              <div className="text-white font-semibold">
                                {formatTokenAmount(token.amount)}
                              </div>
                            </div>
                            <button
                              onClick={() => copyToClipboard(token.mint)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'transfer' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Transfer SOL</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (SOL)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={transferData.amount}
                    onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="0.001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={transferData.recipient}
                    onChange={(e) => setTransferData(prev => ({ ...prev, recipient: e.target.value }))}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none transition-colors font-mono text-sm"
                    placeholder="Enter Solana address..."
                  />
                </div>

                <motion.button
                  onClick={handleTransfer}
                  disabled={loading || !transferData.amount || !transferData.recipient}
                  className="w-full cyber-button flex items-center justify-center gap-2"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRightLeft className="w-4 h-4" />
                  )}
                  {loading ? 'Processing...' : 'Send Transfer'}
                </motion.button>
              </div>
            </div>
          )}

          {activeTab === 'swap' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Token Swap via Jupiter</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      From Token
                    </label>
                    <select
                      value={swapData.inputMint}
                      onChange={(e) => setSwapData(prev => ({ ...prev, inputMint: e.target.value }))}
                      className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none transition-colors"
                    >
                      <option value={COMMON_TOKENS.SOL}>SOL</option>
                      <option value={COMMON_TOKENS.USDC}>USDC</option>
                      <option value={COMMON_TOKENS.USDT}>USDT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      To Token
                    </label>
                    <select
                      value={swapData.outputMint}
                      onChange={(e) => setSwapData(prev => ({ ...prev, outputMint: e.target.value }))}
                      className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none transition-colors"
                    >
                      <option value={COMMON_TOKENS.USDC}>USDC</option>
                      <option value={COMMON_TOKENS.SOL}>SOL</option>
                      <option value={COMMON_TOKENS.USDT}>USDT</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={swapData.amount}
                      onChange={(e) => setSwapData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Slippage (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={swapData.slippage}
                      onChange={(e) => setSwapData(prev => ({ ...prev, slippage: e.target.value }))}
                      className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="3"
                    />
                  </div>
                </div>

                <motion.button
                  onClick={handleSwap}
                  disabled={loading || !swapData.amount}
                  className="w-full cyber-button flex items-center justify-center gap-2"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  {loading ? 'Swapping...' : 'Execute Swap'}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Results Display */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`glass-card p-4 border-l-4 ${
              results.type === 'error' ? 'border-red-500' : 'border-green-500'
            }`}
          >
            <div className="flex items-start gap-3">
              {results.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              )}
              
              <div className="flex-1">
                {results.type === 'error' ? (
                  <div>
                    <h4 className="text-red-400 font-semibold mb-1">Error</h4>
                    <p className="text-gray-300">{results.message}</p>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-green-400 font-semibold mb-2">Success</h4>
                    {results.type === 'transfer' && (
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300">
                          Transfer completed: {results.data.amount} SOL
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Signature:</span>
                          <button
                            onClick={() => copyToClipboard(results.data.signature)}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-mono"
                          >
                            {formatAddress(results.data.signature)}
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                    {results.type === 'swap' && (
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300">
                          Swapped {results.data.inputAmount} → {results.data.outputAmount}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Signature:</span>
                          <button
                            onClick={() => copyToClipboard(results.data.signature)}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-mono"
                          >
                            {formatAddress(results.data.signature)}
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

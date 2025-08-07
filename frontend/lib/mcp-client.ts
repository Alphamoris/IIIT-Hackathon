import axios from 'axios';

export interface MCPRequest {
  method: string;
  params?: any;
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export interface BalanceResult {
  address: string;
  balance: number;
  tokens?: Array<{
    mint: string;
    amount: number;
    decimals: number;
  }>;
}

export interface TransferResult {
  signature: string;
  status: 'success' | 'pending' | 'failed';
  amount: number;
  recipient: string;
}

export interface SwapResult {
  inputMint: string;
  outputMint: string;
  inputAmount: number;
  outputAmount: number;
  signature: string;
  status: 'success' | 'pending' | 'failed';
}

export class MCPClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = 'http://localhost:3001', timeout: number = 30000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async makeRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/mcp`, request, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('MCP Request failed:', error);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Solana Methods
  async getMyAddress(): Promise<MCPResponse> {
    return this.makeRequest({
      method: 'getMyAddress',
    });
  }

  async getSolBalance(address: string): Promise<MCPResponse> {
    return this.makeRequest({
      method: 'getSolBalance',
      params: { address },
    });
  }

  async getTokenBalances(address: string): Promise<MCPResponse> {
    return this.makeRequest({
      method: 'getTokenBalances',
      params: { address },
    });
  }

  async transferSol(amount: number, recipient: string): Promise<MCPResponse> {
    return this.makeRequest({
      method: 'transferSol',
      params: { amount, recipient },
    });
  }

  async swapTokens(
    inputMint: string,
    outputMint: string,
    amount: string,
    slippageBps?: number
  ): Promise<MCPResponse> {
    return this.makeRequest({
      method: 'swapTokens',
      params: {
        inputMint,
        outputMint,
        amount,
        slippageBps: slippageBps || 300, // 3% default slippage
      },
    });
  }

  // General Methods
  async getTokenPrice(tokenId: string): Promise<MCPResponse> {
    return this.makeRequest({
      method: 'getTokenPrice',
      params: { tokenId },
    });
  }

  async getMultipleTokenPrices(tokenIds: string[]): Promise<MCPResponse> {
    return this.makeRequest({
      method: 'getMultipleTokenPrices',
      params: { tokenIds },
    });
  }

  // Server Health Check
  async healthCheck(): Promise<MCPResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, {
        timeout: 5000,
      });

      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Health check failed',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Initialize MCP Server
  async initializeServer(): Promise<MCPResponse> {
    return this.makeRequest({
      method: 'initialize',
    });
  }

  // Get Server Status
  async getServerStatus(): Promise<MCPResponse> {
    return this.makeRequest({
      method: 'getStatus',
    });
  }

  // Get Available Tools
  async getAvailableTools(): Promise<MCPResponse> {
    return this.makeRequest({
      method: 'listTools',
    });
  }
}

// Default instance
export const mcpClient = new MCPClient();

// Utility functions for formatting responses
export const formatBalance = (balance: number, decimals: number = 9): string => {
  return (balance / Math.pow(10, decimals)).toFixed(4);
};

export const formatAddress = (address: string): string => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const formatTokenAmount = (amount: number, symbol: string = ''): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M ${symbol}`.trim();
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K ${symbol}`.trim();
  } else {
    return `${amount.toFixed(4)} ${symbol}`.trim();
  }
};

export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Constants for common token mints
export const COMMON_TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
  SRM: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
};

// Error handling utilities
export const handleMCPError = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

export const isValidSolanaAddress = (address: string): boolean => {
  try {
    // Basic validation: Solana addresses are base58 and typically 32-44 characters
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  } catch {
    return false;
  }
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

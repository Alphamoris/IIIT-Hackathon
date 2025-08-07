import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import fetch from 'cross-fetch';
const JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';
// Common token addresses
const COMMON_TOKENS = {
    SOL: 'So11111111111111111111111111111111111111112',
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    ORCA: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
};
// Cache for token metadata
const tokenMetadataCache = new Map();
// Initialize token list
async function initializeTokenList() {
    if (tokenMetadataCache.size > 0)
        return;
    try {
        const response = await fetch('https://token.jup.ag/strict');
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        for (const token of data) {
            tokenMetadataCache.set(token.address, {
                symbol: token.symbol,
                decimals: token.decimals,
                address: token.address,
                name: token.name,
                logoURI: token.logoURI
            });
        }
        // Ensure we have the common tokens
        ensureCommonTokens();
    }
    catch (error) {
        console.error('Failed to fetch token list:', error);
        // Fallback to common tokens
        ensureCommonTokens();
    }
}
// Ensure we have common tokens in cache
function ensureCommonTokens() {
    // SOL
    if (!tokenMetadataCache.has(COMMON_TOKENS.SOL)) {
        tokenMetadataCache.set(COMMON_TOKENS.SOL, {
            symbol: 'SOL',
            decimals: 9,
            address: COMMON_TOKENS.SOL,
            name: 'Solana'
        });
    }
    // USDC
    if (!tokenMetadataCache.has(COMMON_TOKENS.USDC)) {
        tokenMetadataCache.set(COMMON_TOKENS.USDC, {
            symbol: 'USDC',
            decimals: 6,
            address: COMMON_TOKENS.USDC,
            name: 'USD Coin'
        });
    }
    // Add other common tokens as needed
}
// Get token metadata
async function getTokenMetadata(mint) {
    await initializeTokenList();
    const tokenInfo = tokenMetadataCache.get(mint);
    if (!tokenInfo) {
        throw new Error(`Token metadata not found for ${mint}`);
    }
    return tokenInfo;
}
// Format amount based on decimals
function formatTokenAmount(amount, decimals) {
    const value = parseInt(amount) / Math.pow(10, decimals);
    return value.toFixed(decimals).replace(/\.?0+$/, '');
}
// Get quote from Jupiter
export async function getJupiterQuote(inputMint, outputMint, amount, slippageBps = 50) {
    // Initialize token list before getting quote
    await initializeTokenList();
    // Clean input parameters
    inputMint = inputMint.toString().trim();
    outputMint = outputMint.toString().trim();
    amount = amount.toString().trim();
    // Validate addresses
    try {
        new PublicKey(inputMint);
        new PublicKey(outputMint);
    }
    catch (error) {
        throw new Error(`Invalid token address: ${error?.message || 'Invalid format'}`);
    }
    const url = new URL('/quote', JUPITER_API_BASE);
    url.searchParams.set('inputMint', inputMint);
    url.searchParams.set('outputMint', outputMint);
    url.searchParams.set('amount', amount);
    url.searchParams.set('slippageBps', slippageBps.toString());
    url.searchParams.set('onlyDirectRoutes', 'false');
    url.searchParams.set('restrictIntermediateTokens', 'true');
    console.log('Fetching quote from:', url.toString());
    const response = await fetch(url.toString());
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get Jupiter quote: ${error}`);
    }
    return response.json();
}
// Build swap transaction
export async function buildJupiterSwapTransaction(quoteResponse, userPublicKey) {
    const url = new URL('/swap', JUPITER_API_BASE);
    const body = {
        quoteResponse,
        userPublicKey,
        dynamicComputeUnitLimit: true,
        dynamicSlippage: true,
        prioritizationFeeLamports: {
            priorityLevelWithMaxLamports: {
                maxLamports: 1000000,
                priorityLevel: "veryHigh"
            }
        }
    };
    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to build swap transaction: ${error}`);
    }
    const { swapTransaction } = await response.json();
    return swapTransaction;
}
// Execute swap transaction
export async function executeJupiterSwap(connection, swapTransaction, privateKey) {
    try {
        const keypair = Keypair.fromSecretKey(privateKey);
        // Convert base64 transaction to Uint8Array
        const transactionBinary = Buffer.from(swapTransaction, 'base64');
        // Deserialize and sign the transaction
        const transaction = VersionedTransaction.deserialize(transactionBinary);
        transaction.sign([keypair]);
        // Send the transaction with optimized parameters
        const signature = await connection.sendRawTransaction(transaction.serialize(), {
            skipPreflight: true,
            maxRetries: 2,
            preflightCommitment: 'confirmed'
        });
        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');
        return signature;
    }
    catch (error) {
        console.error('Error executing swap:', error);
        throw error;
    }
}
// Format quote details for display
export async function formatQuoteDetails(quote) {
    const [inputToken, outputToken] = await Promise.all([
        getTokenMetadata(quote.inputMint),
        getTokenMetadata(quote.outputMint)
    ]);
    const inputAmount = formatTokenAmount(quote.inAmount, inputToken.decimals);
    const outputAmount = formatTokenAmount(quote.outAmount, outputToken.decimals);
    const routeSteps = quote.routePlan
        .map(r => r.swapInfo.label || 'Unknown AMM')
        .join(' → ');
    // Calculate rate
    const inAmountNum = parseFloat(quote.inAmount) / Math.pow(10, inputToken.decimals);
    const outAmountNum = parseFloat(quote.outAmount) / Math.pow(10, outputToken.decimals);
    const rate = outAmountNum / inAmountNum;
    return `Swap Quote Details:
Input: ${inputAmount} ${inputToken.symbol}
Output: ${outputAmount} ${outputToken.symbol}
Rate: 1 ${inputToken.symbol} = ${rate.toFixed(6)} ${outputToken.symbol}
Price Impact: ${quote.priceImpactPct}%
Slippage Tolerance: ${quote.slippageBps / 100}%
Route: ${routeSteps}`;
}

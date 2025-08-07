"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJupiterQuote = getJupiterQuote;
exports.buildJupiterSwapTransaction = buildJupiterSwapTransaction;
exports.executeJupiterSwap = executeJupiterSwap;
exports.formatQuoteDetails = formatQuoteDetails;
var web3_js_1 = require("@solana/web3.js");
var web3_js_2 = require("@solana/web3.js");
var cross_fetch_1 = require("cross-fetch");
var JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';
// Common token addresses
var COMMON_TOKENS = {
    SOL: 'So11111111111111111111111111111111111111112',
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    ORCA: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
};
// Cache for token metadata
var tokenMetadataCache = new Map();
// Initialize token list
function initializeTokenList() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, _i, data_1, token, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (tokenMetadataCache.size > 0)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, cross_fetch_1.default)('https://token.jup.ag/strict')];
                case 2:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("HTTP error! status: ".concat(response.status));
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        token = data_1[_i];
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
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Failed to fetch token list:', error_1);
                    // Fallback to common tokens
                    ensureCommonTokens();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
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
function getTokenMetadata(mint) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initializeTokenList()];
                case 1:
                    _a.sent();
                    tokenInfo = tokenMetadataCache.get(mint);
                    if (!tokenInfo) {
                        throw new Error("Token metadata not found for ".concat(mint));
                    }
                    return [2 /*return*/, tokenInfo];
            }
        });
    });
}
// Format amount based on decimals
function formatTokenAmount(amount, decimals) {
    var value = parseInt(amount) / Math.pow(10, decimals);
    return value.toFixed(decimals).replace(/\.?0+$/, '');
}
// Get quote from Jupiter
function getJupiterQuote(inputMint_1, outputMint_1, amount_1) {
    return __awaiter(this, arguments, void 0, function (inputMint, outputMint, amount, slippageBps) {
        var url, response, error;
        if (slippageBps === void 0) { slippageBps = 50; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Initialize token list before getting quote
                return [4 /*yield*/, initializeTokenList()];
                case 1:
                    // Initialize token list before getting quote
                    _a.sent();
                    // Clean input parameters
                    inputMint = inputMint.toString().trim();
                    outputMint = outputMint.toString().trim();
                    amount = amount.toString().trim();
                    // Validate addresses
                    try {
                        new web3_js_1.PublicKey(inputMint);
                        new web3_js_1.PublicKey(outputMint);
                    }
                    catch (error) {
                        throw new Error("Invalid token address: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'Invalid format'));
                    }
                    url = new URL('/quote', JUPITER_API_BASE);
                    url.searchParams.set('inputMint', inputMint);
                    url.searchParams.set('outputMint', outputMint);
                    url.searchParams.set('amount', amount);
                    url.searchParams.set('slippageBps', slippageBps.toString());
                    url.searchParams.set('onlyDirectRoutes', 'false');
                    url.searchParams.set('restrictIntermediateTokens', 'true');
                    console.log('Fetching quote from:', url.toString());
                    return [4 /*yield*/, (0, cross_fetch_1.default)(url.toString())];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    error = _a.sent();
                    throw new Error("Failed to get Jupiter quote: ".concat(error));
                case 4: return [2 /*return*/, response.json()];
            }
        });
    });
}
// Build swap transaction
function buildJupiterSwapTransaction(quoteResponse, userPublicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var url, body, response, error, swapTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = new URL('/swap', JUPITER_API_BASE);
                    body = {
                        quoteResponse: quoteResponse,
                        userPublicKey: userPublicKey,
                        dynamicComputeUnitLimit: true,
                        dynamicSlippage: true,
                        prioritizationFeeLamports: {
                            priorityLevelWithMaxLamports: {
                                maxLamports: 1000000,
                                priorityLevel: "veryHigh"
                            }
                        }
                    };
                    return [4 /*yield*/, (0, cross_fetch_1.default)(url.toString(), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(body)
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    error = _a.sent();
                    throw new Error("Failed to build swap transaction: ".concat(error));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    swapTransaction = (_a.sent()).swapTransaction;
                    return [2 /*return*/, swapTransaction];
            }
        });
    });
}
// Execute swap transaction
function executeJupiterSwap(connection, swapTransaction, privateKey) {
    return __awaiter(this, void 0, void 0, function () {
        var keypair, transactionBinary, transaction, signature, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    keypair = web3_js_2.Keypair.fromSecretKey(privateKey);
                    transactionBinary = Buffer.from(swapTransaction, 'base64');
                    transaction = web3_js_1.VersionedTransaction.deserialize(transactionBinary);
                    transaction.sign([keypair]);
                    return [4 /*yield*/, connection.sendRawTransaction(transaction.serialize(), {
                            skipPreflight: true,
                            maxRetries: 2,
                            preflightCommitment: 'confirmed'
                        })];
                case 1:
                    signature = _a.sent();
                    // Wait for confirmation
                    return [4 /*yield*/, connection.confirmTransaction(signature, 'confirmed')];
                case 2:
                    // Wait for confirmation
                    _a.sent();
                    return [2 /*return*/, signature];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error executing swap:', error_2);
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Format quote details for display
function formatQuoteDetails(quote) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, inputToken, outputToken, inputAmount, outputAmount, routeSteps, inAmountNum, outAmountNum, rate;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        getTokenMetadata(quote.inputMint),
                        getTokenMetadata(quote.outputMint)
                    ])];
                case 1:
                    _a = _b.sent(), inputToken = _a[0], outputToken = _a[1];
                    inputAmount = formatTokenAmount(quote.inAmount, inputToken.decimals);
                    outputAmount = formatTokenAmount(quote.outAmount, outputToken.decimals);
                    routeSteps = quote.routePlan
                        .map(function (r) { return r.swapInfo.label || 'Unknown AMM'; })
                        .join(' → ');
                    inAmountNum = parseFloat(quote.inAmount) / Math.pow(10, inputToken.decimals);
                    outAmountNum = parseFloat(quote.outAmount) / Math.pow(10, outputToken.decimals);
                    rate = outAmountNum / inAmountNum;
                    return [2 /*return*/, "Swap Quote Details:\nInput: ".concat(inputAmount, " ").concat(inputToken.symbol, "\nOutput: ").concat(outputAmount, " ").concat(outputToken.symbol, "\nRate: 1 ").concat(inputToken.symbol, " = ").concat(rate.toFixed(6), " ").concat(outputToken.symbol, "\nPrice Impact: ").concat(quote.priceImpactPct, "%\nSlippage Tolerance: ").concat(quote.slippageBps / 100, "%\nRoute: ").concat(routeSteps)];
            }
        });
    });
}

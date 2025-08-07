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
exports.registerSolanaTools = registerSolanaTools;
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var zod_1 = require("zod");
var bs58_1 = require("bs58");
var jupiter_js_1 = require("./jupiter.js");
var SOLANA_RPC = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
// Initialize Solana connection
var solanaConnection = new web3_js_1.Connection(SOLANA_RPC, 'confirmed');
// Helper function to get token accounts for a wallet
function getTokenAccounts(walletAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var owner, tokenAccounts, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    owner = new web3_js_1.PublicKey(walletAddress);
                    return [4 /*yield*/, solanaConnection.getParsedTokenAccountsByOwner(owner, {
                            programId: spl_token_1.TOKEN_PROGRAM_ID
                        })];
                case 1:
                    tokenAccounts = _a.sent();
                    return [2 /*return*/, tokenAccounts.value.map(function (account) {
                            var parsedAccountInfo = account.account.data.parsed.info;
                            return {
                                mint: new web3_js_1.PublicKey(parsedAccountInfo.mint),
                                amount: parsedAccountInfo.tokenAmount.uiAmount,
                                decimals: parsedAccountInfo.tokenAmount.decimals,
                                tokenAccount: account.pubkey.toString()
                            };
                        })];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching token accounts:', error_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function registerSolanaTools(server) {
    var _this = this;
    // Debug: Check environment variables
    console.error('Debug - ENV vars available:', Object.keys(process.env));
    console.error('Debug - SOLANA_PRIVATE_KEY exists:', !!process.env.SOLANA_PRIVATE_KEY);
    if (!process.env.SOLANA_PRIVATE_KEY) {
        console.error('Warning: SOLANA_PRIVATE_KEY not found in environment');
    }
    server.tool("getMyAddress", "Get your Solana public address from private key in .env", {}, function () { return __awaiter(_this, void 0, void 0, function () {
        var privateKeyBytes, keypair, publicKey, balance, solBalance, tokenAccounts, tokenBalances, err_1, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!process.env.SOLANA_PRIVATE_KEY) {
                        throw new Error('SOLANA_PRIVATE_KEY not found in environment variables');
                    }
                    privateKeyBytes = bs58_1.default.decode(process.env.SOLANA_PRIVATE_KEY);
                    keypair = web3_js_1.Keypair.fromSecretKey(privateKeyBytes);
                    publicKey = keypair.publicKey.toString();
                    return [4 /*yield*/, solanaConnection.getBalance(keypair.publicKey)];
                case 1:
                    balance = _a.sent();
                    solBalance = balance / web3_js_1.LAMPORTS_PER_SOL;
                    return [4 /*yield*/, getTokenAccounts(publicKey)];
                case 2:
                    tokenAccounts = _a.sent();
                    tokenBalances = tokenAccounts
                        .filter(function (account) { return account.amount > 0; })
                        .map(function (account) { return "".concat(account.amount, " (Mint: ").concat(account.mint.toString(), ")"); })
                        .join('\n');
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Your Solana Address: ".concat(publicKey, "\nSOL Balance: ").concat(solBalance, " SOL\n\nToken Balances:\n").concat(tokenBalances),
                                },
                            ],
                        }];
                case 3:
                    err_1 = _a.sent();
                    error = err_1;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to get address: ".concat(error.message),
                                },
                            ],
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    server.tool("getBalance", "Get balance for a Solana address", {
        address: zod_1.z.string().describe("Solana account address"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var publicKey, balance, solBalance, err_2, error;
        var address = _b.address;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    publicKey = new web3_js_1.PublicKey(address);
                    return [4 /*yield*/, solanaConnection.getBalance(publicKey)];
                case 1:
                    balance = _c.sent();
                    solBalance = balance / web3_js_1.LAMPORTS_PER_SOL;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Balance for ".concat(address, ":\n").concat(solBalance, " SOL"),
                                },
                            ],
                        }];
                case 2:
                    err_2 = _c.sent();
                    error = err_2;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to retrieve balance for address: ".concat(error.message),
                                },
                            ],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    server.tool("getAccountInfo", "Get detailed account information for a Solana address", {
        address: zod_1.z.string().describe("Solana account address"),
        encoding: zod_1.z.enum(['base58', 'base64', 'jsonParsed']).optional().describe("Data encoding format"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var publicKey, accountInfo, formattedData, err_3, error;
        var address = _b.address, _c = _b.encoding, encoding = _c === void 0 ? 'base64' : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    publicKey = new web3_js_1.PublicKey(address);
                    return [4 /*yield*/, solanaConnection.getAccountInfo(publicKey, 'confirmed')];
                case 1:
                    accountInfo = _d.sent();
                    if (!accountInfo) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "No account found for address: ".concat(address),
                                    },
                                ],
                            }];
                    }
                    formattedData = void 0;
                    if (encoding === 'base58') {
                        formattedData = bs58_1.default.encode(accountInfo.data);
                    }
                    else if (encoding === 'base64') {
                        formattedData = Buffer.from(accountInfo.data).toString('base64');
                    }
                    else {
                        formattedData = Buffer.from(accountInfo.data).toString('base64');
                    }
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Account Information for ".concat(address, ":\nLamports: ").concat(accountInfo.lamports, " (").concat(accountInfo.lamports / web3_js_1.LAMPORTS_PER_SOL, " SOL)\nOwner: ").concat(accountInfo.owner.toBase58(), "\nExecutable: ").concat(accountInfo.executable, "\nRent Epoch: ").concat(accountInfo.rentEpoch, "\nData Length: ").concat(accountInfo.data.length, " bytes\nData (").concat(encoding, "): ").concat(formattedData),
                                },
                            ],
                        }];
                case 2:
                    err_3 = _d.sent();
                    error = err_3;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to retrieve account information: ".concat(error.message),
                                },
                            ],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    server.tool("getSplTokenBalances", "Get SPL token balances for a Solana address", {
        address: zod_1.z.string().describe("Solana account address"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var tokenAccounts, balancesList, err_4, error;
        var address = _b.address;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getTokenAccounts(address)];
                case 1:
                    tokenAccounts = _c.sent();
                    if (tokenAccounts.length === 0) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "No token accounts found for address: ".concat(address),
                                    },
                                ],
                            }];
                    }
                    balancesList = tokenAccounts
                        .filter(function (account) { return account.amount > 0; })
                        .map(function (account) { return "Mint: ".concat(account.mint.toString(), "\nBalance: ").concat(account.amount, "\nDecimals: ").concat(account.decimals, "\nToken Account: ").concat(account.tokenAccount); })
                        .join('\n\n');
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Token Balances for ".concat(address, ":\n\n").concat(balancesList),
                                },
                            ],
                        }];
                case 2:
                    err_4 = _c.sent();
                    error = err_4;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to retrieve token balances: ".concat(error.message),
                                },
                            ],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    server.tool("getSwapQuote", "Get best swap quote from Jupiter DEX aggregator", {
        inputMint: zod_1.z.string().describe("Input token mint address"),
        outputMint: zod_1.z.string().describe("Output token mint address"),
        amount: zod_1.z.string().describe("Amount of input tokens (in smallest denomination)"),
        slippageBps: zod_1.z.number().optional().describe("Slippage tolerance in basis points (optional, default 50 = 0.5%)"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var quote, formattedDetails, err_5;
        var inputMint = _b.inputMint, outputMint = _b.outputMint, amount = _b.amount, slippageBps = _b.slippageBps;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    // Validate input parameters
                    inputMint = inputMint.trim();
                    outputMint = outputMint.trim();
                    amount = amount.toString().trim();
                    return [4 /*yield*/, (0, jupiter_js_1.getJupiterQuote)(inputMint, outputMint, amount, slippageBps)];
                case 1:
                    quote = _c.sent();
                    return [4 /*yield*/, (0, jupiter_js_1.formatQuoteDetails)(quote)];
                case 2:
                    formattedDetails = _c.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: formattedDetails,
                                },
                            ],
                            quote: quote,
                        }];
                case 3:
                    err_5 = _c.sent();
                    console.error('Error getting swap quote:', err_5);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to get swap quote: ".concat(err_5 instanceof Error ? err_5.message : 'Unknown error'),
                                },
                            ],
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    server.tool("executeSwap", "Execute a token swap using Jupiter DEX aggregator (using private key from .env)", {
        inputMint: zod_1.z.string().describe("Input token mint address"),
        outputMint: zod_1.z.string().describe("Output token mint address"),
        amount: zod_1.z.string().describe("Amount of input tokens (in smallest denomination)"),
        slippageBps: zod_1.z.number().optional().describe("Slippage tolerance in basis points (optional, default 50 = 0.5%)"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var privateKeyBytes, keypair, quote, formattedQuote, swapTransaction, signature, err_6;
        var inputMint = _b.inputMint, outputMint = _b.outputMint, amount = _b.amount, slippageBps = _b.slippageBps;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    // Validate input parameters
                    inputMint = inputMint.trim();
                    outputMint = outputMint.trim();
                    amount = amount.toString().trim();
                    // Check for private key
                    if (!process.env.SOLANA_PRIVATE_KEY) {
                        throw new Error('SOLANA_PRIVATE_KEY not found in environment variables');
                    }
                    privateKeyBytes = bs58_1.default.decode(process.env.SOLANA_PRIVATE_KEY);
                    keypair = web3_js_1.Keypair.fromSecretKey(privateKeyBytes);
                    return [4 /*yield*/, (0, jupiter_js_1.getJupiterQuote)(inputMint, outputMint, amount, slippageBps)];
                case 1:
                    quote = _c.sent();
                    return [4 /*yield*/, (0, jupiter_js_1.formatQuoteDetails)(quote)];
                case 2:
                    formattedQuote = _c.sent();
                    return [4 /*yield*/, (0, jupiter_js_1.buildJupiterSwapTransaction)(quote, keypair.publicKey.toString())];
                case 3:
                    swapTransaction = _c.sent();
                    return [4 /*yield*/, (0, jupiter_js_1.executeJupiterSwap)(solanaConnection, swapTransaction, privateKeyBytes)];
                case 4:
                    signature = _c.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "".concat(formattedQuote, "\n\nSwap executed successfully!\nTransaction signature: ").concat(signature, "\nExplorer URL: https://explorer.solana.com/tx/").concat(signature),
                                },
                            ],
                        }];
                case 5:
                    err_6 = _c.sent();
                    console.error('Error executing swap:', err_6);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to execute swap: ".concat(err_6 instanceof Error ? err_6.message : 'Unknown error'),
                                },
                            ],
                        }];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    server.tool("transfer", "Transfer SOL from your keypair (using private key from .env) to another address", {
        toAddress: zod_1.z.string().describe("Destination wallet address"),
        amount: zod_1.z.number().positive().describe("Amount of SOL to send"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var privateKeyBytes, fromKeypair, lamports, transaction, signature, err_7, error;
        var toAddress = _b.toAddress, amount = _b.amount;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    if (!process.env.SOLANA_PRIVATE_KEY) {
                        throw new Error('SOLANA_PRIVATE_KEY not found in environment variables');
                    }
                    privateKeyBytes = bs58_1.default.decode(process.env.SOLANA_PRIVATE_KEY);
                    fromKeypair = web3_js_1.Keypair.fromSecretKey(privateKeyBytes);
                    lamports = amount * web3_js_1.LAMPORTS_PER_SOL;
                    transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
                        fromPubkey: fromKeypair.publicKey,
                        toPubkey: new web3_js_1.PublicKey(toAddress),
                        lamports: lamports,
                    }));
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(solanaConnection, transaction, [fromKeypair])];
                case 1:
                    signature = _c.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Transfer successful!\nFrom: ".concat(fromKeypair.publicKey.toBase58(), "\nTo: ").concat(toAddress, "\nAmount: ").concat(amount, " SOL\nTransaction signature: ").concat(signature, "\nExplorer URL: https://explorer.solana.com/tx/").concat(signature),
                                },
                            ],
                        }];
                case 2:
                    err_7 = _c.sent();
                    error = err_7;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to transfer SOL: ".concat(error.message),
                                },
                            ],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}

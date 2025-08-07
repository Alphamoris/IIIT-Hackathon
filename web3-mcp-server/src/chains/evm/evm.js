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
exports.registerEvmTools = registerEvmTools;
var ethers_1 = require("ethers");
var zod_1 = require("zod");
var NETWORKS = {
    ethereum: {
        name: "Ethereum",
        rpc: process.env.ETH_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/demo",
        chainId: 1,
        currencySymbol: "ETH",
        explorer: "https://etherscan.io"
    },
    base: {
        name: "Base",
        rpc: process.env.BASE_RPC_URL || "https://mainnet.base.org",
        chainId: 8453,
        currencySymbol: "ETH",
        explorer: "https://basescan.org"
    },
    arbitrum: {
        name: "Arbitrum",
        rpc: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
        chainId: 42161,
        currencySymbol: "ETH",
        explorer: "https://arbiscan.io"
    },
    optimism: {
        name: "Optimism",
        rpc: process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io",
        chainId: 10,
        currencySymbol: "ETH",
        explorer: "https://optimistic.etherscan.io"
    },
    bsc: {
        name: "BNB Smart Chain",
        rpc: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org",
        chainId: 56,
        currencySymbol: "BNB",
        explorer: "https://bscscan.com"
    },
    polygon: {
        name: "Polygon",
        rpc: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
        chainId: 137,
        currencySymbol: "MATIC",
        explorer: "https://polygonscan.com"
    },
    avalanche: {
        name: "Avalanche",
        rpc: process.env.AVALANCHE_RPC_URL || "https://api.avax.network/ext/bc/C/rpc",
        chainId: 43114,
        currencySymbol: "AVAX",
        explorer: "https://snowtrace.io"
    },
    berachain: {
        name: "Berachain",
        rpc: process.env.BERACHAIN_RPC_URL || "https://rpc.berachain.com",
        chainId: 80094,
        currencySymbol: "BERA",
        explorer: "https://berascan.com"
    },
    sonic: {
        name: "Sonic",
        rpc: process.env.SONIC_RPC_URL || "https://rpc.soniclabs.com/",
        chainId: 2024,
        currencySymbol: "SONIC",
        explorer: "https://explorer.sonic.ooo"
    }
};
// Initialize providers for each network
var providers = {};
for (var _i = 0, _a = Object.entries(NETWORKS); _i < _a.length; _i++) {
    var _b = _a[_i], network = _b[0], config = _b[1];
    providers[network] = new ethers_1.JsonRpcProvider(config.rpc);
}
// ERC-20 minimal ABI
var ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)"
];
function registerEvmTools(server) {
    var _this = this;
    // Get native token balance for any EVM network
    server.tool("getEvmBalance", "Get native token balance for an EVM address on any supported network", {
        address: zod_1.z.string().describe("EVM account address"),
        network: zod_1.z.string().describe("Network name (ethereum, base, arbitrum, optimism, bsc, polygon, avalanche, berachain, sonic)"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var provider, balance, formattedBalance, networkConfig, err_1, error;
        var address = _b.address, network = _b.network;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    if (!NETWORKS[network]) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "Unsupported network: ".concat(network, ". Supported networks are: ").concat(Object.keys(NETWORKS).join(", ")),
                                    },
                                ],
                            }];
                    }
                    provider = providers[network];
                    return [4 /*yield*/, provider.getBalance(address)];
                case 1:
                    balance = _c.sent();
                    formattedBalance = (0, ethers_1.formatEther)(balance);
                    networkConfig = NETWORKS[network];
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Balance on ".concat(networkConfig.name, ":\n").concat(formattedBalance, " ").concat(networkConfig.currencySymbol),
                                },
                            ],
                        }];
                case 2:
                    err_1 = _c.sent();
                    error = err_1;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to retrieve balance: ".concat(error.message),
                                },
                            ],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Get ERC-20 token balance for any EVM network
    server.tool("getEvmTokenBalance", "Get ERC-20 token balance for an address on any supported EVM network", {
        address: zod_1.z.string().describe("EVM account address"),
        tokenAddress: zod_1.z.string().describe("ERC-20 token contract address"),
        network: zod_1.z.string().describe("Network name (ethereum, base, arbitrum, optimism, bsc, polygon, avalanche, berachain, sonic)"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var provider, contract, _c, balance, decimals, symbol, formattedBalance, networkConfig, err_2, error;
        var address = _b.address, tokenAddress = _b.tokenAddress, network = _b.network;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    if (!NETWORKS[network]) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "Unsupported network: ".concat(network, ". Supported networks are: ").concat(Object.keys(NETWORKS).join(", ")),
                                    },
                                ],
                            }];
                    }
                    provider = providers[network];
                    contract = new ethers_1.Contract(tokenAddress, ERC20_ABI, provider);
                    return [4 /*yield*/, Promise.all([
                            contract.balanceOf(address),
                            contract.decimals(),
                            contract.symbol()
                        ])];
                case 1:
                    _c = _d.sent(), balance = _c[0], decimals = _c[1], symbol = _c[2];
                    formattedBalance = (0, ethers_1.formatUnits)(balance, decimals);
                    networkConfig = NETWORKS[network];
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Token Balance on ".concat(networkConfig.name, ":\n").concat(formattedBalance, " ").concat(symbol, " (").concat(tokenAddress, ")\nExplorer: ").concat(networkConfig.explorer, "/token/").concat(tokenAddress)
                                },
                            ],
                        }];
                case 2:
                    err_2 = _d.sent();
                    error = err_2;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to retrieve token balance: ".concat(error.message),
                                },
                            ],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Get gas price for any EVM network
    server.tool("getGasPrice", "Get current gas price for any supported EVM network", {
        network: zod_1.z.string().describe("Network name (ethereum, base, arbitrum, optimism, bsc, polygon, avalanche, berachain, sonic)"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var provider, feeData, gasPrice, maxFeePerGas, maxPriorityFeePerGas, networkConfig, response, err_3, error;
        var network = _b.network;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    if (!NETWORKS[network]) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "Unsupported network: ".concat(network, ". Supported networks are: ").concat(Object.keys(NETWORKS).join(", ")),
                                    },
                                ],
                            }];
                    }
                    provider = providers[network];
                    return [4 /*yield*/, provider.getFeeData()];
                case 1:
                    feeData = _c.sent();
                    gasPrice = (0, ethers_1.formatUnits)(feeData.gasPrice || 0, 'gwei');
                    maxFeePerGas = feeData.maxFeePerGas ? (0, ethers_1.formatUnits)(feeData.maxFeePerGas, 'gwei') : null;
                    maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ? (0, ethers_1.formatUnits)(feeData.maxPriorityFeePerGas, 'gwei') : null;
                    networkConfig = NETWORKS[network];
                    response = "Gas Prices on ".concat(networkConfig.name, ":\nGas Price: ").concat(gasPrice, " Gwei");
                    if (maxFeePerGas) {
                        response += "\nMax Fee: ".concat(maxFeePerGas, " Gwei");
                    }
                    if (maxPriorityFeePerGas) {
                        response += "\nMax Priority Fee: ".concat(maxPriorityFeePerGas, " Gwei");
                    }
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: response,
                                },
                            ],
                        }];
                case 2:
                    err_3 = _c.sent();
                    error = err_3;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to retrieve gas price: ".concat(error.message),
                                },
                            ],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Send native tokens on any EVM network
    server.tool("sendEvmTransaction", "Send native tokens on any supported EVM network (using private key from .env)", {
        toAddress: zod_1.z.string().describe("Recipient's address"),
        amount: zod_1.z.string().describe("Amount to send (in native tokens)"),
        network: zod_1.z.string().describe("Network name (ethereum, base, arbitrum, optimism, bsc, polygon, avalanche, berachain, sonic)"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var provider, networkConfig, wallet, fromAddress, _c, gasPrice, nonce, tx, txResponse, err_4, error;
        var toAddress = _b.toAddress, amount = _b.amount, network = _b.network;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    if (!NETWORKS[network]) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "Unsupported network: ".concat(network, ". Supported networks are: ").concat(Object.keys(NETWORKS).join(", "))
                                    }
                                ]
                            }];
                    }
                    provider = providers[network];
                    networkConfig = NETWORKS[network];
                    // Get private key from environment variables
                    if (!process.env.ETH_PRIVATE_KEY) {
                        throw new Error('ETH_PRIVATE_KEY not found in environment variables');
                    }
                    wallet = new ethers_1.Wallet(process.env.ETH_PRIVATE_KEY, provider);
                    fromAddress = wallet.address;
                    return [4 /*yield*/, Promise.all([
                            provider.getFeeData(),
                            provider.getTransactionCount(fromAddress)
                        ])];
                case 1:
                    _c = _d.sent(), gasPrice = _c[0], nonce = _c[1];
                    tx = {
                        to: toAddress,
                        value: (0, ethers_1.parseUnits)(amount),
                        nonce: nonce,
                        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,
                        maxFeePerGas: gasPrice.maxFeePerGas,
                        gasLimit: 21000, // Standard ETH transfer
                        chainId: networkConfig.chainId
                    };
                    return [4 /*yield*/, wallet.sendTransaction(tx)];
                case 2:
                    txResponse = _d.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Transaction sent on ".concat(networkConfig.name, "!\nFrom: ").concat(fromAddress, "\nTo: ").concat(toAddress, "\nAmount: ").concat(amount, " ").concat(networkConfig.currencySymbol, "\nTransaction Hash: ").concat(txResponse.hash, "\nExplorer Link: ").concat(networkConfig.explorer, "/tx/").concat(txResponse.hash)
                                }
                            ]
                        }];
                case 3:
                    err_4 = _d.sent();
                    error = err_4;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to send transaction: ".concat(error.message)
                                }
                            ]
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Send ERC-20 tokens on any EVM network
    server.tool("sendEvmToken", "Send ERC-20 tokens on any supported EVM network (using private key from .env)", {
        toAddress: zod_1.z.string().describe("Recipient's address"),
        tokenAddress: zod_1.z.string().describe("Token contract address"),
        amount: zod_1.z.string().describe("Amount to send (in token units)"),
        network: zod_1.z.string().describe("Network name (ethereum, base, arbitrum, optimism, bsc, polygon, avalanche, berachain)"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var provider, networkConfig, wallet, fromAddress, contract, _c, decimals, symbol, amountInTokenUnits, txResponse, err_5, error;
        var toAddress = _b.toAddress, tokenAddress = _b.tokenAddress, amount = _b.amount, network = _b.network;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    if (!NETWORKS[network]) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "Unsupported network: ".concat(network, ". Supported networks are: ").concat(Object.keys(NETWORKS).join(", "))
                                    }
                                ]
                            }];
                    }
                    provider = providers[network];
                    networkConfig = NETWORKS[network];
                    // Get private key from environment variables
                    if (!process.env.ETH_PRIVATE_KEY) {
                        throw new Error('ETH_PRIVATE_KEY not found in environment variables');
                    }
                    wallet = new ethers_1.Wallet(process.env.ETH_PRIVATE_KEY, provider);
                    fromAddress = wallet.address;
                    contract = new ethers_1.Contract(tokenAddress, ERC20_ABI, wallet);
                    return [4 /*yield*/, Promise.all([
                            contract.decimals(),
                            contract.symbol()
                        ])];
                case 1:
                    _c = _d.sent(), decimals = _c[0], symbol = _c[1];
                    amountInTokenUnits = (0, ethers_1.parseUnits)(amount, decimals);
                    return [4 /*yield*/, contract.transfer(toAddress, amountInTokenUnits, {
                            gasLimit: 100000 // Estimated gas limit for token transfers
                        })];
                case 2:
                    txResponse = _d.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Token transfer sent on ".concat(networkConfig.name, "!\nFrom: ").concat(fromAddress, "\nTo: ").concat(toAddress, "\nAmount: ").concat(amount, " ").concat(symbol, "\nToken Address: ").concat(tokenAddress, "\nTransaction Hash: ").concat(txResponse.hash, "\nExplorer Link: ").concat(networkConfig.explorer, "/tx/").concat(txResponse.hash)
                                }
                            ]
                        }];
                case 3:
                    err_5 = _d.sent();
                    error = err_5;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to send token transfer: ".concat(error.message)
                                }
                            ]
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Approve ERC-20 token spending
    server.tool("approveEvmToken", "Approve ERC-20 token spending on any supported EVM network (using private key from .env)", {
        spenderAddress: zod_1.z.string().describe("Address to approve for spending"),
        tokenAddress: zod_1.z.string().describe("Token contract address"),
        amount: zod_1.z.string().optional().describe("Amount to approve (in token units, defaults to unlimited)"),
        network: zod_1.z.string().describe("Network name (ethereum, base, arbitrum, optimism, bsc, polygon, avalanche, berachain)"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var provider, networkConfig, wallet, contract, _c, decimals, symbol, approvalAmount, txResponse, formattedAmount, err_6, error;
        var spenderAddress = _b.spenderAddress, tokenAddress = _b.tokenAddress, amount = _b.amount, network = _b.network;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    if (!NETWORKS[network]) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "Unsupported network: ".concat(network, ". Supported networks are: ").concat(Object.keys(NETWORKS).join(", "))
                                    }
                                ]
                            }];
                    }
                    provider = providers[network];
                    networkConfig = NETWORKS[network];
                    // Get private key from environment variables
                    if (!process.env.ETH_PRIVATE_KEY) {
                        throw new Error('ETH_PRIVATE_KEY not found in environment variables');
                    }
                    wallet = new ethers_1.Wallet(process.env.ETH_PRIVATE_KEY, provider);
                    contract = new ethers_1.Contract(tokenAddress, ERC20_ABI, wallet);
                    return [4 /*yield*/, Promise.all([
                            contract.decimals(),
                            contract.symbol()
                        ])];
                case 1:
                    _c = _d.sent(), decimals = _c[0], symbol = _c[1];
                    approvalAmount = amount ? (0, ethers_1.parseUnits)(amount, decimals) : ethers_1.MaxUint256;
                    return [4 /*yield*/, contract.approve(spenderAddress, approvalAmount, {
                            gasLimit: 60000 // Estimated gas limit for approvals
                        })];
                case 2:
                    txResponse = _d.sent();
                    formattedAmount = amount || "unlimited";
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Token approval sent on ".concat(networkConfig.name, "!\nToken: ").concat(symbol, " (").concat(tokenAddress, ")\nSpender: ").concat(spenderAddress, "\nAmount: ").concat(formattedAmount, "\nTransaction Hash: ").concat(txResponse.hash, "\nExplorer Link: ").concat(networkConfig.explorer, "/tx/").concat(txResponse.hash)
                                }
                            ]
                        }];
                case 3:
                    err_6 = _d.sent();
                    error = err_6;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to approve token spending: ".concat(error.message)
                                }
                            ]
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}

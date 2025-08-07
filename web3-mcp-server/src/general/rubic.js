"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.registerRubicTools = registerRubicTools;
var zod_1 = require("zod");
var RUBIC_API_BASE = 'https://api-v2.rubic.exchange/api';
function registerRubicTools(server) {
    var _this = this;
    // Get available blockchains
    server.tool("getRubicSupportedChains", "Get a list of all blockchains supported by Rubic for cross-chain bridging.", {
        includeTestnets: zod_1.z.boolean().optional().describe("Include testnet blockchains in the results."),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var url, response, errorText, data, formattedChains, textResponse, err_1, error;
        var _c = _b.includeTestnets, includeTestnets = _c === void 0 ? false : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    url = new URL("".concat(RUBIC_API_BASE, "/info/chains"));
                    url.searchParams.append('includeTestnets', includeTestnets.toString());
                    return [4 /*yield*/, fetch(url.toString(), {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                            },
                        })];
                case 1:
                    response = _d.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _d.sent();
                    throw new Error("Rubic API error (".concat(response.status, "): ").concat(errorText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _d.sent();
                    formattedChains = data.map(function (chain) { return ({
                        name: chain.name,
                        id: chain.id,
                        testnet: chain.testnet,
                        type: chain.type,
                        crossChainProviders: chain.providers.crossChain,
                        onChainProviders: chain.providers.onChain,
                        proxyAvailable: chain.proxyAvailable
                    }); });
                    textResponse = "Available blockchains for cross-chain bridging:\n\n".concat(formattedChains.map(function (chain) {
                        return "".concat(chain.name, " (ID: ").concat(chain.id, ")").concat(chain.testnet ? ' [TESTNET]' : '', "\n") +
                            "Type: ".concat(chain.type, "\n") +
                            "Cross-Chain Providers: ".concat(chain.crossChainProviders.join(', '), "\n") +
                            "On-Chain Providers: ".concat(chain.onChainProviders.join(', '), "\n") +
                            "Fee Collection Available: ".concat(chain.proxyAvailable ? 'Yes' : 'No', "\n");
                    }).join('\n'));
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: textResponse
                                }
                            ],
                            data: formattedChains
                        }];
                case 5:
                    err_1 = _d.sent();
                    error = err_1;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to get supported blockchains: ".concat(error.message)
                                }
                            ]
                        }];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    // Get bridge quote
    server.tool("getRubicBridgeQuote", "Get the best cross-chain bridge route for swapping tokens between different blockchains.", {
        srcTokenAddress: zod_1.z.string().describe("Source token address. Use 0x0000000000000000000000000000000000000000 for native tokens like ETH, BNB, etc."),
        srcTokenBlockchain: zod_1.z.string().describe("Source blockchain name (e.g., ETH, BSC, POLYGON, etc.)"),
        srcTokenAmount: zod_1.z.string().describe("Amount of source token to bridge (as a string with decimals)"),
        dstTokenAddress: zod_1.z.string().describe("Destination token address. Use 0x0000000000000000000000000000000000000000 for native tokens."),
        dstTokenBlockchain: zod_1.z.string().describe("Destination blockchain name (e.g., ETH, BSC, POLYGON, etc.)"),
        walletAddress: zod_1.z.string().optional().describe("Wallet address to send tokens to on the destination blockchain"),
        slippageTolerance: zod_1.z.number().min(0.01).max(50).optional().describe("Slippage tolerance in percentage (min: 0.01, max: 50)"),
        showFailedRoutes: zod_1.z.boolean().optional().describe("Show failed routes in the response"),
        includeTestnets: zod_1.z.boolean().optional().describe("Include testnets in calculations"),
        timeout: zod_1.z.number().min(5).max(60).optional().describe("Calculation timeout in seconds (min: 5, max: 60)"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var url, requestBody, response, errorText, data, textResponse_1, err_2, error;
        var srcTokenAddress = _b.srcTokenAddress, srcTokenBlockchain = _b.srcTokenBlockchain, srcTokenAmount = _b.srcTokenAmount, dstTokenAddress = _b.dstTokenAddress, dstTokenBlockchain = _b.dstTokenBlockchain, walletAddress = _b.walletAddress, _c = _b.slippageTolerance, slippageTolerance = _c === void 0 ? 1 : _c, _d = _b.showFailedRoutes, showFailedRoutes = _d === void 0 ? false : _d, _e = _b.includeTestnets, includeTestnets = _e === void 0 ? false : _e, _f = _b.timeout, timeout = _f === void 0 ? 30 : _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 5, , 6]);
                    url = new URL("".concat(RUBIC_API_BASE, "/routes/quoteBest"));
                    requestBody = __assign({ srcTokenBlockchain: String(srcTokenBlockchain), srcTokenAddress: String(srcTokenAddress), srcTokenAmount: String(srcTokenAmount), dstTokenBlockchain: String(dstTokenBlockchain), dstTokenAddress: String(dstTokenAddress), referrer: "web3-mcp", timeout: Number(timeout), includeTestnets: Boolean(includeTestnets), showFailedRoutes: Boolean(showFailedRoutes), slippageTolerance: Number(slippageTolerance) / 100 }, (walletAddress ? { walletAddress: String(walletAddress) } : {}));
                    return [4 /*yield*/, fetch(url.toString(), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify(requestBody),
                        })];
                case 1:
                    response = _g.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _g.sent();
                    throw new Error("Rubic API error (".concat(response.status, "): ").concat(errorText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _g.sent();
                    textResponse_1 = "Bridge Quote Results:\n\n";
                    textResponse_1 += "From: ".concat(data.tokens.from.amount, " ").concat(data.tokens.from.symbol, " (").concat(data.tokens.from.blockchain, ")\n");
                    textResponse_1 += "To: ".concat(data.estimate.destinationTokenAmount, " ").concat(data.tokens.to.symbol, " (").concat(data.tokens.to.blockchain, ")\n\n");
                    if (data.tokens.from.price && data.tokens.to.price) {
                        textResponse_1 += "USD Value: $".concat((parseFloat(data.tokens.from.amount) * data.tokens.from.price).toFixed(2), " \u2192 $").concat(data.estimate.destinationUsdAmount.toFixed(2), "\n\n");
                    }
                    textResponse_1 += "Provider: ".concat(data.providerType.toUpperCase(), "\n");
                    textResponse_1 += "Type: ".concat(data.swapType, "\n");
                    textResponse_1 += "Estimated Duration: ".concat(data.estimate.durationInMinutes, " minutes\n");
                    if (data.fees.gasTokenFees) {
                        textResponse_1 += "Gas Fee: ".concat(data.fees.gasTokenFees.provider.fixedAmount, " ").concat(data.fees.gasTokenFees.nativeToken.symbol, " (\u2248$").concat(data.fees.gasTokenFees.provider.fixedUsdAmount.toFixed(2), ")\n");
                    }
                    textResponse_1 += "\nFees:\n";
                    if (data.fees.percentFees) {
                        textResponse_1 += "Percent Fee: ".concat(data.fees.percentFees.percent, "%\n");
                    }
                    if (data.estimate.priceImpact) {
                        textResponse_1 += "\nPrice Impact: ".concat((data.estimate.priceImpact * 100).toFixed(2), "%\n");
                    }
                    if (data.warnings && data.warnings.length > 0) {
                        textResponse_1 += "\nWarnings: ".concat(data.warnings.length, "\n");
                    }
                    // Add routing path details
                    if (data.routing && data.routing.length > 0) {
                        textResponse_1 += "\nRouting Path:\n";
                        data.routing.forEach(function (route, i) {
                            textResponse_1 += "Step ".concat(i + 1, ": ").concat(route.provider, " (").concat(route.type, ")\n");
                            if (route.path.length > 0) {
                                var fromToken = route.path[0];
                                var toToken = route.path[route.path.length - 1];
                                textResponse_1 += "  ".concat(fromToken.amount, " ").concat(fromToken.symbol, " \u2192 ").concat(toToken.amount, " ").concat(toToken.symbol, "\n");
                            }
                        });
                    }
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: textResponse_1
                                }
                            ],
                            data: data
                        }];
                case 5:
                    err_2 = _g.sent();
                    error = err_2;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to get bridge quote: ".concat(error.message)
                                }
                            ]
                        }];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    // Get multiple bridge quotes
    server.tool("getRubicBridgeQuotes", "Get all available cross-chain bridge routes for swapping tokens between different blockchains.", {
        srcTokenAddress: zod_1.z.string().describe("Source token address. Use 0x0000000000000000000000000000000000000000 for native tokens like ETH, BNB, etc."),
        srcTokenBlockchain: zod_1.z.string().describe("Source blockchain name (e.g., ETH, BSC, POLYGON, etc.)"),
        srcTokenAmount: zod_1.z.string().describe("Amount of source token to bridge (as a string with decimals)"),
        dstTokenAddress: zod_1.z.string().describe("Destination token address. Use 0x0000000000000000000000000000000000000000 for native tokens."),
        dstTokenBlockchain: zod_1.z.string().describe("Destination blockchain name (e.g., ETH, BSC, POLYGON, etc.)"),
        walletAddress: zod_1.z.string().optional().describe("Wallet address to send tokens to on the destination blockchain"),
        slippageTolerance: zod_1.z.number().min(0.01).max(50).optional().describe("Slippage tolerance in percentage (min: 0.01, max: 50)"),
        showFailedRoutes: zod_1.z.boolean().optional().describe("Show failed routes in the response"),
        includeTestnets: zod_1.z.boolean().optional().describe("Include testnets in calculations"),
        timeout: zod_1.z.number().min(5).max(60).optional().describe("Calculation timeout in seconds (min: 5, max: 60)"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var url, requestBody, response, errorText, data, textResponse_2, err_3, error;
        var srcTokenAddress = _b.srcTokenAddress, srcTokenBlockchain = _b.srcTokenBlockchain, srcTokenAmount = _b.srcTokenAmount, dstTokenAddress = _b.dstTokenAddress, dstTokenBlockchain = _b.dstTokenBlockchain, walletAddress = _b.walletAddress, _c = _b.slippageTolerance, slippageTolerance = _c === void 0 ? 1 : _c, _d = _b.showFailedRoutes, showFailedRoutes = _d === void 0 ? false : _d, _e = _b.includeTestnets, includeTestnets = _e === void 0 ? false : _e, _f = _b.timeout, timeout = _f === void 0 ? 30 : _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 5, , 6]);
                    url = new URL("".concat(RUBIC_API_BASE, "/routes/quoteAll"));
                    requestBody = __assign({ srcTokenBlockchain: String(srcTokenBlockchain), srcTokenAddress: String(srcTokenAddress), srcTokenAmount: String(srcTokenAmount), dstTokenBlockchain: String(dstTokenBlockchain), dstTokenAddress: String(dstTokenAddress), referrer: "web3-mcp", timeout: Number(timeout), includeTestnets: Boolean(includeTestnets), showFailedRoutes: Boolean(showFailedRoutes), slippageTolerance: Number(slippageTolerance) / 100 }, (walletAddress ? { walletAddress: String(walletAddress) } : {}));
                    return [4 /*yield*/, fetch(url.toString(), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify(requestBody),
                        })];
                case 1:
                    response = _g.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _g.sent();
                    throw new Error("Rubic API error (".concat(response.status, "): ").concat(errorText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _g.sent();
                    textResponse_2 = "Available Bridge Routes:\n\n";
                    if (data.length === 0) {
                        textResponse_2 += "No available routes found.";
                    }
                    else {
                        data.forEach(function (route, index) {
                            textResponse_2 += "Route ".concat(index + 1, ": ").concat(route.providerType.toUpperCase(), "\n");
                            textResponse_2 += "From: ".concat(route.tokens.from.amount, " ").concat(route.tokens.from.symbol, " (").concat(route.tokens.from.blockchain, ")\n");
                            textResponse_2 += "To: ".concat(route.estimate.destinationTokenAmount, " ").concat(route.tokens.to.symbol, " (").concat(route.tokens.to.blockchain, ")\n");
                            if (route.tokens.from.price && route.tokens.to.price) {
                                textResponse_2 += "USD Value: $".concat((parseFloat(route.tokens.from.amount) * route.tokens.from.price).toFixed(2), " \u2192 $").concat(route.estimate.destinationUsdAmount.toFixed(2), "\n");
                            }
                            textResponse_2 += "Estimated Time: ".concat(route.estimate.durationInMinutes, " minutes\n");
                            if (route.fees.gasTokenFees) {
                                textResponse_2 += "Gas Fee: ".concat(route.fees.gasTokenFees.provider.fixedAmount, " ").concat(route.fees.gasTokenFees.nativeToken.symbol, " (\u2248$").concat(route.fees.gasTokenFees.provider.fixedUsdAmount.toFixed(2), ")\n");
                            }
                            if (route.estimate.priceImpact) {
                                textResponse_2 += "Price Impact: ".concat((route.estimate.priceImpact * 100).toFixed(2), "%\n");
                            }
                            textResponse_2 += "\n";
                        });
                    }
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: textResponse_2
                                }
                            ],
                            data: data
                        }];
                case 5:
                    err_3 = _g.sent();
                    error = err_3;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to get bridge quotes: ".concat(error.message)
                                }
                            ]
                        }];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    // Check cross-chain transaction status
    server.tool("getRubicBridgeStatus", "Check the status of a cross-chain bridge transaction.", {
        srcTxHash: zod_1.z.string().describe("Source transaction hash to check status"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var url, response, errorText, data, textResponse, err_4, error;
        var srcTxHash = _b.srcTxHash;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    url = new URL("".concat(RUBIC_API_BASE, "/info/status"));
                    url.searchParams.append('srcTxHash', String(srcTxHash));
                    return [4 /*yield*/, fetch(url.toString(), {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                            },
                        })];
                case 1:
                    response = _c.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _c.sent();
                    throw new Error("Rubic API error (".concat(response.status, "): ").concat(errorText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _c.sent();
                    textResponse = "Cross-Chain Transaction Status:\n\n";
                    textResponse += "Source Transaction: ".concat(data.srcTxHash, "\n");
                    if (data.dstTxHash) {
                        textResponse += "Destination Transaction: ".concat(data.dstTxHash, "\n");
                    }
                    textResponse += "Status: ".concat(data.status.toUpperCase(), "\n");
                    if (data.message) {
                        textResponse += "Message: ".concat(data.message, "\n");
                    }
                    if (data.error) {
                        textResponse += "Error: ".concat(data.error, "\n");
                    }
                    if (data.bridgeName) {
                        textResponse += "Bridge Provider: ".concat(data.bridgeName, "\n");
                    }
                    // Provide a human-readable explanation of the status
                    textResponse += "\nStatus Explanation:\n";
                    switch (data.status) {
                        case 'pending':
                            textResponse += "Your transaction is still in progress. This could take a few minutes to complete.";
                            break;
                        case 'indexing':
                            textResponse += "The transaction has been detected but is still being indexed. Please check back soon.";
                            break;
                        case 'revert':
                            textResponse += "The transaction on the destination chain failed and needs to be reverted. You should collect your funds.";
                            break;
                        case 'failed':
                            textResponse += "The transaction has failed. Your funds may be reverted automatically.";
                            break;
                        case 'claim':
                            textResponse += "The transaction was successful! You can now claim your tokens on the destination chain.";
                            break;
                        case 'success':
                            textResponse += "The transaction was completed successfully! Your tokens have been sent to the destination address.";
                            break;
                        case 'error':
                            textResponse += "An error occurred during the transaction. Please check the error message for details.";
                            break;
                        default:
                            textResponse += "Unknown status. Please check the Rubic interface for more information.";
                    }
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: textResponse
                                }
                            ],
                            data: data
                        }];
                case 5:
                    err_4 = _c.sent();
                    error = err_4;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to get bridge transaction status: ".concat(error.message)
                                }
                            ]
                        }];
                case 6: return [2 /*return*/];
            }
        });
    }); });
}

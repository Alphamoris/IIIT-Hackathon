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
exports.registerThorchainTools = registerThorchainTools;
var xchain_thorchain_1 = require("@xchainjs/xchain-thorchain");
var xchain_thorchain_amm_1 = require("@xchainjs/xchain-thorchain-amm");
var xchain_thorchain_query_1 = require("@xchainjs/xchain-thorchain-query");
var xchain_thorchain_query_2 = require("@xchainjs/xchain-thorchain-query");
var xchain_client_1 = require("@xchainjs/xchain-client");
var xchain_util_1 = require("@xchainjs/xchain-util");
var bignumber_js_1 = require("bignumber.js");
var zod_1 = require("zod");
var dotenv_1 = require("dotenv");
var axios_1 = require("axios");
var xchain_util_2 = require("@xchainjs/xchain-util");
var cross_fetch_1 = require("cross-fetch");
(0, dotenv_1.config)();
// Initialize Nine Realms headers
(0, xchain_util_2.register9Rheader)(axios_1.default);
// Initialize Thorchain clients
var thorchainClient = new xchain_thorchain_1.Client({
    network: xchain_client_1.Network.Mainnet,
    phrase: process.env.THORCHAIN_MNEMONIC || ''
});
var thornode = new xchain_thorchain_query_2.Thornode(xchain_client_1.Network.Mainnet);
var thorchainQuery = new xchain_thorchain_query_1.ThorchainQuery();
var thorchainAmm = new xchain_thorchain_amm_1.ThorchainAMM(thorchainQuery);
// Helper function to format base amounts
function formatBaseAmount(baseAmount) {
    return baseAmount.amount().toString();
}
function registerThorchainTools(server) {
    var _this = this;
    // Get THORChain balance
    server.tool("getThorchainBalance", "Get RUNE balance for an address", {
        address: zod_1.z.string().describe("THORChain address to check"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var balances, err_1, error;
        var address = _b.address;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, thorchainClient.getBalance(address)];
                case 1:
                    balances = _c.sent();
                    return [2 /*return*/, {
                            content: [{
                                    type: "text",
                                    text: "THORChain Balance for ".concat(address, ":\n").concat(formatBaseAmount(balances[0].amount), " RUNE"),
                                }],
                        }];
                case 2:
                    err_1 = _c.sent();
                    error = err_1;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to retrieve RUNE balance: ".concat(error.message) }],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Get pool info
    server.tool("getThorchainPoolInfo", "Get information about a THORChain liquidity pool", {
        asset: zod_1.z.string().describe("Asset symbol (e.g., 'BTC.BTC', 'ETH.ETH')"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var pool, err_2, error;
        var asset = _b.asset;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, thornode.getPool(asset)];
                case 1:
                    pool = _c.sent();
                    return [2 /*return*/, {
                            content: [{
                                    type: "text",
                                    text: "Pool Information for ".concat(asset, ":\n") +
                                        "Status: ".concat(pool.status, "\n") +
                                        "Asset Depth: ".concat(pool.balance_asset, "\n") +
                                        "RUNE Depth: ".concat(pool.balance_rune, "\n") +
                                        "LP Units: ".concat(pool.LP_units, "\n") +
                                        "Synth Units: ".concat(pool.synth_units),
                                }],
                        }];
                case 2:
                    err_2 = _c.sent();
                    error = err_2;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to retrieve pool information: ".concat(error.message) }],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Get swap quote
    server.tool("getThorchainSwapQuote", "Get a quote for swapping assets on THORChain", {
        fromAsset: zod_1.z.string().describe("Source asset (e.g., 'BTC.BTC')"),
        toAsset: zod_1.z.string().describe("Destination asset (e.g., 'ETH.ETH')"),
        amount: zod_1.z.string().describe("Amount to swap"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var fromAsset, toAsset, numAmount, amountInBaseUnits, quoteParams, response, quote, formatAssetAmount, err_3, error;
        var fromAssetString = _b.fromAsset, toAssetString = _b.toAsset, amountString = _b.amount;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    fromAsset = (0, xchain_util_1.assetFromString)(fromAssetString);
                    toAsset = (0, xchain_util_1.assetFromString)(toAssetString);
                    if (!fromAsset || !toAsset) {
                        return [2 /*return*/, {
                                content: [{ type: "text", text: "Invalid asset format. Expected format: 'CHAIN.SYMBOL' (e.g., 'BTC.BTC', 'ETH.ETH')" }],
                            }];
                    }
                    numAmount = void 0;
                    try {
                        numAmount = new bignumber_js_1.BigNumber(amountString);
                        if (numAmount.isNaN() || numAmount.isLessThanOrEqualTo(0)) {
                            throw new Error('Invalid amount');
                        }
                    }
                    catch (error) {
                        return [2 /*return*/, {
                                content: [{ type: "text", text: "Invalid amount format. Please provide a valid positive number." }],
                            }];
                    }
                    amountInBaseUnits = numAmount.multipliedBy(Math.pow(10, 8)).toFixed(0);
                    quoteParams = {
                        amount: amountInBaseUnits,
                        from_asset: (0, xchain_util_1.assetToString)(fromAsset),
                        to_asset: (0, xchain_util_1.assetToString)(toAsset).replace('-B1A', ''), // Remove B1A suffix
                        destination: '', // Optional destination address
                        streaming_interval: '1',
                        streaming_quantity: '0'
                    };
                    return [4 /*yield*/, (0, cross_fetch_1.default)("https://thornode.ninerealms.com/thorchain/quote/swap?".concat(new URLSearchParams(quoteParams)))];
                case 1:
                    response = _c.sent();
                    if (!response.ok) {
                        throw new Error("THORNode API error: ".concat(response.status, " ").concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    quote = _c.sent();
                    formatAssetAmount = function (amount, decimals) {
                        if (decimals === void 0) { decimals = 8; }
                        var num = Number(amount) / Math.pow(10, decimals);
                        return num.toLocaleString('en-US', { maximumFractionDigits: decimals });
                    };
                    return [2 /*return*/, {
                            content: [{
                                    type: "text",
                                    text: "Swap Quote:\n" +
                                        "Expected Output: ".concat(formatAssetAmount(quote.expected_amount_out), " ").concat(quoteParams.to_asset, "\n") +
                                        "Fees:\n" +
                                        "- Affiliate Fee: ".concat(formatAssetAmount(quote.fees.affiliate), " ").concat(quote.fees.asset, "\n") +
                                        "- Outbound Fee: ".concat(formatAssetAmount(quote.fees.outbound), " ").concat(quote.fees.asset, "\n") +
                                        "- Liquidity Fee: ".concat(formatAssetAmount(quote.fees.liquidity), " ").concat(quote.fees.asset, "\n") +
                                        "- Total Fee: ".concat(formatAssetAmount(quote.fees.total), " ").concat(quote.fees.asset, "\n") +
                                        "Slippage: ".concat(quote.fees.slippage_bps / 100, "%\n") +
                                        "Expires: ".concat(new Date(quote.expiry * 1000).toLocaleString(), "\n") +
                                        "Total Swap Time: ~".concat(quote.total_swap_seconds, " seconds"),
                                }],
                        }];
                case 3:
                    err_3 = _c.sent();
                    error = err_3;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to get swap quote: ".concat(error.message) }],
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}

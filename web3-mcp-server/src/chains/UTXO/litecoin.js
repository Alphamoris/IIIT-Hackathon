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
exports.registerLitecoinTools = registerLitecoinTools;
var xchain_litecoin_1 = require("@xchainjs/xchain-litecoin");
var xchain_client_1 = require("@xchainjs/xchain-client");
var zod_1 = require("zod");
// Initialize client with mainnet by default
var litecoinClient = new xchain_litecoin_1.Client(__assign(__assign({}, xchain_litecoin_1.defaultLtcParams), { network: xchain_client_1.Network.Mainnet }));
// Helper function to format base amounts
function formatBaseAmount(baseAmount) {
    return baseAmount.amount().toString();
}
function registerLitecoinTools(server) {
    var _this = this;
    // Litecoin Balance
    server.tool("getLitecoinBalance", "Get balance for a Litecoin address", {
        address: zod_1.z.string().describe("Litecoin address to check"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var balances, err_1, error;
        var address = _b.address;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, litecoinClient.getBalance(address)];
                case 1:
                    balances = _c.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Litecoin Balance for ".concat(address, ":\n").concat(formatBaseAmount(balances[0].amount), " LTC"),
                                },
                            ],
                        }];
                case 2:
                    err_1 = _c.sent();
                    error = err_1;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to retrieve LTC balance: ".concat(error.message) }],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Transaction History
    server.tool("getLTCTransactionHistory", "Get transaction history for a Litecoin address", {
        address: zod_1.z.string().describe("Litecoin address to check"),
        limit: zod_1.z.number().optional().describe("Maximum number of transactions to return"),
        offset: zod_1.z.number().optional().describe("Number of transactions to skip"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var txs, txList, err_2, error;
        var address = _b.address, _c = _b.limit, limit = _c === void 0 ? 10 : _c, _d = _b.offset, offset = _d === void 0 ? 0 : _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, litecoinClient.getTransactions({ address: address, limit: limit, offset: offset })];
                case 1:
                    txs = _e.sent();
                    txList = txs.txs.map(function (tx) {
                        var _a, _b, _c, _d;
                        var fromAmount = ((_a = tx.from[0]) === null || _a === void 0 ? void 0 : _a.amount) ? "".concat(formatBaseAmount(tx.from[0].amount), " LTC") : 'Unknown';
                        var toAmount = ((_b = tx.to[0]) === null || _b === void 0 ? void 0 : _b.amount) ? "".concat(formatBaseAmount(tx.to[0].amount), " LTC") : 'Unknown';
                        return "\nTransaction: ".concat(tx.hash, "\nType: ").concat(tx.type, "\nFrom: ").concat(((_c = tx.from[0]) === null || _c === void 0 ? void 0 : _c.from) || 'Unknown', " (").concat(fromAmount, ")\nTo: ").concat(((_d = tx.to[0]) === null || _d === void 0 ? void 0 : _d.to) || 'Unknown', " (").concat(toAmount, ")\nAsset: ").concat(tx.asset.ticker, "\nDate: ").concat(new Date(tx.date).toLocaleString());
                    }).join('\n---\n');
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Litecoin Transaction History for ".concat(address, ":\n").concat(txList),
                                },
                            ],
                        }];
                case 2:
                    err_2 = _e.sent();
                    error = err_2;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to retrieve LTC transaction history: ".concat(error.message) }],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Address Validation
    server.tool("validateLTCAddress", "Validate a Litecoin address format", {
        address: zod_1.z.string().describe("Litecoin address to validate"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var isValid, error;
        var address = _b.address;
        return __generator(this, function (_c) {
            try {
                isValid = litecoinClient.validateAddress(address);
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: isValid
                                    ? "The address ".concat(address, " is a valid Litecoin address")
                                    : "The address ".concat(address, " is NOT a valid Litecoin address"),
                            },
                        ],
                    }];
            }
            catch (err) {
                error = err;
                return [2 /*return*/, {
                        content: [{ type: "text", text: "Error validating Litecoin address: ".concat(error.message) }],
                    }];
            }
            return [2 /*return*/];
        });
    }); });
    // Network Info
    server.tool("getLTCNetworkInfo", "Get current Litecoin network information", {}, function () { return __awaiter(_this, void 0, void 0, function () {
        var fees, err_3, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, litecoinClient.getFeeRates()];
                case 1:
                    fees = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Litecoin Network Information:\nCurrent Network: ".concat(litecoinClient.getNetwork(), "\nFee Rates (sats/byte):\n  Fast: ").concat(fees.fast, "\n  Average: ").concat(fees.average),
                                },
                            ],
                        }];
                case 2:
                    err_3 = _a.sent();
                    error = err_3;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to retrieve Litecoin network information: ".concat(error.message) }],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}

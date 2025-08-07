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
exports.getWalletInfo = getWalletInfo;
exports.sendAda = sendAda;
exports.sendTokens = sendTokens;
exports.registerCardanoTools = registerCardanoTools;
var zod_1 = require("zod");
var cross_fetch_1 = require("cross-fetch");
var lucid_cardano_1 = require("lucid-cardano");
var dotenv = require("dotenv");
var path_1 = require("path");
var url_1 = require("url");
var fs_1 = require("fs");
// Direct .env loading for debugging
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var projectRoot = (0, path_1.resolve)(__filename, '../../../..');
var envPath = (0, path_1.resolve)(projectRoot, '.env');
// Load env file directly
if ((0, fs_1.existsSync)(envPath)) {
    var result = dotenv.config({ path: envPath });
    if (result.error) {
        console.error('Error loading .env file:', result.error);
    }
}
// Configuration from environment variables
var BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || '';
var CARDANO_NETWORK = process.env.CARDANO_NETWORK || 'mainnet';
var BLOCKFROST_BASE_URL = "https://cardano-".concat(CARDANO_NETWORK, ".blockfrost.io/api/v0");
var CARDANO_MNEMONIC = process.env.CARDANO_MNEMONIC || '';
var CARDANO_ACCOUNT_INDEX = parseInt(process.env.CARDANO_ACCOUNT_INDEX || '0');
// Helper function to make Blockfrost API requests
function blockfrostRequest(endpoint) {
    return __awaiter(this, void 0, void 0, function () {
        var url, headers, response, errorText, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(BLOCKFROST_BASE_URL).concat(endpoint);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    headers = {
                        'project_id': BLOCKFROST_API_KEY
                    };
                    return [4 /*yield*/, (0, cross_fetch_1.default)(url, {
                            method: 'GET',
                            headers: headers
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorText = _a.sent();
                    throw new Error("API error ".concat(response.status, ": ").concat(errorText));
                case 4: return [4 /*yield*/, response.json()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    error_1 = _a.sent();
                    throw error_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Helper function to format ADA amounts
function lovelaceToAda(lovelace) {
    return (parseInt(String(lovelace)) / 1000000).toFixed(6);
}
// Helper function to format asset name
function formatAssetName(name) {
    try {
        // If the name is in hex, try to convert it to ASCII
        if (/^[0-9a-fA-F]+$/.test(name)) {
            return Buffer.from(name, 'hex').toString('utf8');
        }
        return name;
    }
    catch (e) {
        return name; // Return original if conversion fails
    }
}
// Initialize Lucid instance
function initLucid() {
    return __awaiter(this, void 0, void 0, function () {
        var network, provider, lucid, trimmedMnemonic, words, address, error_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (CARDANO_NETWORK === 'mainnet') {
                        network = 'Mainnet';
                    }
                    else if (['testnet', 'preprod'].includes(CARDANO_NETWORK)) {
                        network = 'Preprod';
                    }
                    else if (CARDANO_NETWORK === 'preview') {
                        network = 'Preview';
                    }
                    else {
                        network = 'Mainnet';
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    // Check for required configurations
                    if (!BLOCKFROST_API_KEY) {
                        throw new Error('BLOCKFROST_API_KEY is required in .env file');
                    }
                    if (!CARDANO_MNEMONIC) {
                        throw new Error('CARDANO_MNEMONIC is required in .env file');
                    }
                    provider = new lucid_cardano_1.Blockfrost("https://cardano-".concat(CARDANO_NETWORK, ".blockfrost.io/api/v0"), BLOCKFROST_API_KEY);
                    return [4 /*yield*/, lucid_cardano_1.Lucid.new(provider, network)];
                case 2:
                    lucid = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    trimmedMnemonic = CARDANO_MNEMONIC.trim();
                    words = trimmedMnemonic.split(/\s+/);
                    // Check if word count is valid (should be 15 or 24 for Cardano)
                    if (words.length !== 15 && words.length !== 24) {
                        throw new Error("Invalid mnemonic: Expected 15 or 24 words, got ".concat(words.length));
                    }
                    // Select wallet from seed
                    lucid.selectWalletFromSeed(trimmedMnemonic, { accountIndex: CARDANO_ACCOUNT_INDEX });
                    return [4 /*yield*/, lucid.wallet.address()];
                case 4:
                    address = _a.sent();
                    if (!address) {
                        throw new Error('Failed to derive address from mnemonic');
                    }
                    return [2 /*return*/, lucid];
                case 5:
                    error_2 = _a.sent();
                    throw new Error("Failed to load wallet: ".concat(error_2 instanceof Error ? error_2.message : String(error_2)));
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_3 = _a.sent();
                    throw new Error("Failed to initialize Lucid: ".concat(error_3 instanceof Error ? error_3.message : String(error_3)));
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Get wallet info
function getWalletInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var lucid, address, utxos, adaBalance, tokenBalances, value, _i, _a, _b, unit, quantity, _c, policyId, assetName, displayName, error_4;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, initLucid()];
                case 1:
                    lucid = _d.sent();
                    return [4 /*yield*/, lucid.wallet.address()];
                case 2:
                    address = _d.sent();
                    return [4 /*yield*/, lucid.wallet.getUtxos()];
                case 3:
                    utxos = _d.sent();
                    adaBalance = '0';
                    tokenBalances = [];
                    if (utxos.length > 0) {
                        value = utxos.reduce(function (acc, utxo) { return acc.add(utxo.assets); }, 
                        // @ts-ignore: Lucid types are not fully compatible
                        lucid.newValue()).assets;
                        // Extract ADA balance
                        adaBalance = value.lovelace ? lovelaceToAda(value.lovelace) : '0';
                        // Extract token balances
                        for (_i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
                            _b = _a[_i], unit = _b[0], quantity = _b[1];
                            if (unit === 'lovelace')
                                continue;
                            try {
                                _c = lucid.utils.fromUnit(unit), policyId = _c.policyId, assetName = _c.assetName;
                                displayName = assetName ?
                                    // @ts-ignore: Lucid types are not fully compatible
                                    (lucid.utils.toText(assetName) || formatAssetName(assetName)) :
                                    "".concat(policyId.substring(0, 8), "...");
                                tokenBalances.push({
                                    unit: unit,
                                    name: displayName,
                                    quantity: quantity.toString()
                                });
                            }
                            catch (e) {
                                tokenBalances.push({
                                    unit: unit,
                                    name: unit,
                                    quantity: quantity.toString()
                                });
                            }
                        }
                    }
                    return [2 /*return*/, {
                            address: address,
                            utxoCount: utxos.length,
                            ada: adaBalance,
                            tokens: tokenBalances
                        }];
                case 4:
                    error_4 = _d.sent();
                    throw error_4;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Send ADA transaction
function sendAda(recipientAddress_1, amountAda_1) {
    return __awaiter(this, arguments, void 0, function (recipientAddress, amountAda, metadata) {
        var lucid, senderAddress, lovelaceAmount, tx, parsedMetadata, signedTx, txHash, error_5;
        if (metadata === void 0) { metadata = null; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    // Validate input
                    if (!recipientAddress) {
                        throw new Error('Recipient address is required');
                    }
                    if (typeof amountAda !== 'number' || amountAda <= 0) {
                        throw new Error('Amount must be a positive number');
                    }
                    return [4 /*yield*/, initLucid()];
                case 1:
                    lucid = _a.sent();
                    return [4 /*yield*/, lucid.wallet.address()];
                case 2:
                    senderAddress = _a.sent();
                    // Validate recipient address
                    try {
                        // @ts-ignore: Lucid types are not fully compatible
                        lucid.utils.getAddressDetails(recipientAddress);
                    }
                    catch (error) {
                        throw new Error("Invalid recipient address: ".concat(error instanceof Error ? error.message : String(error)));
                    }
                    lovelaceAmount = BigInt(Math.floor(amountAda * 1000000));
                    tx = lucid.newTx()
                        .payToAddress(recipientAddress, { lovelace: lovelaceAmount });
                    // Add metadata if provided
                    if (metadata) {
                        parsedMetadata = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
                        // @ts-ignore: Lucid types are not fully compatible
                        tx = tx.attachMetadata(674, parsedMetadata);
                    }
                    return [4 /*yield*/, tx.complete()];
                case 3:
                    // Complete the transaction (adds inputs and change output)
                    // @ts-ignore: Lucid types are not fully compatible
                    tx = _a.sent();
                    return [4 /*yield*/, tx.sign().complete()];
                case 4:
                    signedTx = _a.sent();
                    return [4 /*yield*/, signedTx.submit()];
                case 5:
                    txHash = _a.sent();
                    return [2 /*return*/, {
                            txHash: txHash,
                            senderAddress: senderAddress,
                            recipientAddress: recipientAddress,
                            amount: amountAda,
                            links: {
                                explorer: "https://cardanoscan.io/transaction/".concat(txHash)
                            }
                        }];
                case 6:
                    error_5 = _a.sent();
                    throw error_5;
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Send tokens transaction
function sendTokens(recipientAddress_1, policyId_1, assetName_1, amount_1) {
    return __awaiter(this, arguments, void 0, function (recipientAddress, policyId, assetName, amount, adaAmount) {
        var lucid, senderAddress, assetNameHex, unit, assets, minLovelace, outputLovelace, tx, signedTx, txHash, displayAssetName, error_6;
        var _a;
        if (adaAmount === void 0) { adaAmount = null; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    // Validate input
                    if (!recipientAddress) {
                        throw new Error('Recipient address is required');
                    }
                    if (!policyId) {
                        throw new Error('Policy ID is required');
                    }
                    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
                        throw new Error('Amount must be a positive number');
                    }
                    return [4 /*yield*/, initLucid()];
                case 1:
                    lucid = _b.sent();
                    return [4 /*yield*/, lucid.wallet.address()];
                case 2:
                    senderAddress = _b.sent();
                    // Validate recipient address
                    try {
                        // @ts-ignore: Lucid types are not fully compatible
                        lucid.utils.getAddressDetails(recipientAddress);
                    }
                    catch (error) {
                        throw new Error("Invalid recipient address: ".concat(error instanceof Error ? error.message : String(error)));
                    }
                    assetNameHex = assetName;
                    if (assetName && !/^[0-9a-fA-F]+$/.test(assetName)) {
                        assetNameHex = (0, lucid_cardano_1.fromText)(assetName);
                    }
                    unit = "".concat(policyId).concat(assetNameHex);
                    assets = (_a = {}, _a[unit] = BigInt(amount), _a);
                    return [4 /*yield*/, lucid.utils.minAdaRequired({
                            outputs: [{ address: recipientAddress, assets: assets }]
                        })];
                case 3:
                    minLovelace = _b.sent();
                    outputLovelace = adaAmount
                        ? BigInt(Math.floor(adaAmount * 1000000))
                        : minLovelace;
                    // Check if we're sending at least the minimum required
                    if (outputLovelace < minLovelace) {
                        throw new Error("Minimum ".concat(lovelaceToAda(minLovelace), " ADA required to send these tokens"));
                    }
                    tx = lucid.newTx()
                        .payToAddress(recipientAddress, __assign({ lovelace: outputLovelace }, assets));
                    return [4 /*yield*/, tx.complete()];
                case 4:
                    // Complete the transaction (adds inputs and change output)
                    // @ts-ignore: Lucid types are not fully compatible
                    tx = _b.sent();
                    return [4 /*yield*/, tx.sign().complete()];
                case 5:
                    signedTx = _b.sent();
                    return [4 /*yield*/, signedTx.submit()];
                case 6:
                    txHash = _b.sent();
                    displayAssetName = assetName ? formatAssetName(assetNameHex) : '';
                    return [2 /*return*/, {
                            txHash: txHash,
                            senderAddress: senderAddress,
                            recipientAddress: recipientAddress,
                            token: {
                                policyId: policyId,
                                name: displayAssetName,
                                amount: amount
                            },
                            ada: lovelaceToAda(outputLovelace),
                            links: {
                                explorer: "https://cardanoscan.io/transaction/".concat(txHash)
                            }
                        }];
                case 7:
                    error_6 = _b.sent();
                    throw error_6;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function registerCardanoTools(server) {
    var _this = this;
    // Get Address Balance
    server.tool("getCardanoAddressBalance", "Get balance and token holdings for a Cardano address", {
        address: zod_1.z.string().describe("Cardano address to check"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var addressInfo, utxos, tokenMap_1, adaBalance, tokens, tokenList, err_1, error;
        var address = _b.address;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, blockfrostRequest("/addresses/".concat(address))];
                case 1:
                    addressInfo = _c.sent();
                    return [4 /*yield*/, blockfrostRequest("/addresses/".concat(address, "/utxos"))];
                case 2:
                    utxos = _c.sent();
                    tokenMap_1 = new Map();
                    utxos.forEach(function (utxo) {
                        utxo.amount.forEach(function (asset) {
                            var currentAmount = tokenMap_1.get(asset.unit) || BigInt(0);
                            tokenMap_1.set(asset.unit, currentAmount + BigInt(asset.quantity));
                        });
                    });
                    adaBalance = tokenMap_1.get('lovelace') || BigInt(addressInfo.amount);
                    // Remove lovelace from token map for separate display
                    tokenMap_1.delete('lovelace');
                    tokens = Array.from(tokenMap_1.entries()).map(function (_a) {
                        var unit = _a[0], quantity = _a[1];
                        // Split into policy ID and asset name
                        var policyId = unit.slice(0, 56);
                        var assetName = unit.slice(56);
                        var formattedName = formatAssetName(assetName);
                        return {
                            unit: unit,
                            policyId: policyId,
                            assetName: formattedName,
                            quantity: quantity.toString()
                        };
                    });
                    // Sort tokens by quantity (descending)
                    tokens.sort(function (a, b) { return (BigInt(b.quantity) - BigInt(a.quantity)) > 0n ? 1 : -1; });
                    tokenList = tokens.length > 0
                        ? tokens.map(function (token) {
                            return "".concat(token.quantity, " ").concat(token.assetName || token.unit, " (Policy: ").concat(token.policyId.substring(0, 8), "...)");
                        }).join('\n')
                        : 'No tokens found';
                    // Build response
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Cardano Address Balance for ".concat(address, ":\n\nADA Balance: ").concat(lovelaceToAda(adaBalance.toString()), " ADA\nStake Address: ").concat(addressInfo.stake_address || 'Not staked', "\nAddress Type: ").concat(addressInfo.script ? 'Script' : 'Key-based', "\n\n").concat(tokens.length > 0 ? "Token Holdings (".concat(tokens.length, "):\n").concat(tokenList) : 'No token holdings found'),
                                },
                            ],
                        }];
                case 3:
                    err_1 = _c.sent();
                    error = err_1;
                    return [2 /*return*/, {
                            content: [{
                                    type: "text",
                                    text: "Failed to retrieve Cardano address balance: ".concat(error.message)
                                }],
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Get Cardano Wallet Info
    server.tool("getCardanoWalletInfo", "Get the current wallet information, including balance and tokens", {}, function () { return __awaiter(_this, void 0, void 0, function () {
        var walletInfo, tokenList, err_2, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getWalletInfo()];
                case 1:
                    walletInfo = _a.sent();
                    tokenList = walletInfo.tokens.length > 0
                        ? walletInfo.tokens.map(function (token) { return "".concat(token.quantity, " ").concat(token.name); }).join('\n')
                        : 'No tokens found';
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "# Cardano Wallet Information\n\nAddress: ".concat(walletInfo.address, "\nADA Balance: ").concat(walletInfo.ada, " ADA\nUTXO Count: ").concat(walletInfo.utxoCount, "\n\n").concat(walletInfo.tokens.length > 0 ? "## Token Holdings (".concat(walletInfo.tokens.length, "):\n").concat(tokenList) : 'No token holdings found')
                                },
                            ],
                        }];
                case 2:
                    err_2 = _a.sent();
                    error = err_2;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to get wallet information: ".concat(error.message, "\n\n**Troubleshooting Tips:**\n1. Make sure you have a valid 15 or 24-word Cardano mnemonic in your .env file\n2. Verify your Blockfrost API key is correct and has sufficient access rights\n3. Check the console logs for detailed error information")
                                },
                            ],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Send ADA Transaction
    server.tool("sendCardanoAda", "Send ADA from your wallet to a recipient address", {
        recipientAddress: zod_1.z.string().describe("Recipient Cardano address"),
        amount: zod_1.z.number().min(1).describe("Amount of ADA to send"),
        metadata: zod_1.z.optional(zod_1.z.string()).describe("Optional transaction metadata in JSON format")
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var result, err_3, error;
        var recipientAddress = _b.recipientAddress, amount = _b.amount, metadata = _b.metadata;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, sendAda(recipientAddress, amount, metadata)];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "# ADA Transaction Successful\n\nTransaction Hash: ".concat(result.txHash, "\nFrom: ").concat(result.senderAddress, "\nTo: ").concat(result.recipientAddress, "\nAmount: ").concat(result.amount, " ADA\n\n[View on Explorer](").concat(result.links.explorer, ")")
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
                                    text: "Failed to send ADA: ".concat(error.message, "\n\n**Troubleshooting Tips:**\n1. Make sure you have a valid 15 or 24-word Cardano mnemonic in your .env file\n2. Verify your Blockfrost API key is correct and has sufficient access rights\n3. Check that your wallet has sufficient balance\n4. Verify the recipient address is correct\n5. Check the console logs for detailed error information")
                                },
                            ],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Send Tokens Transaction
    server.tool("sendCardanoTokens", "Send Cardano native tokens from your wallet to a recipient address", {
        recipientAddress: zod_1.z.string().describe("Recipient Cardano address"),
        policyId: zod_1.z.string().describe("Token policy ID"),
        assetName: zod_1.z.string().describe("Asset name (can be empty for policy-only tokens)"),
        amount: zod_1.z.string().describe("Amount of tokens to send"),
        adaAmount: zod_1.z.optional(zod_1.z.number()).describe("Optional amount of ADA to send with tokens (will use minimum required if not specified)")
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var result, err_4, error;
        var recipientAddress = _b.recipientAddress, policyId = _b.policyId, assetName = _b.assetName, amount = _b.amount, adaAmount = _b.adaAmount;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, sendTokens(recipientAddress, policyId, assetName, amount, adaAmount)];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "# Token Transaction Successful\n\nTransaction Hash: ".concat(result.txHash, "\nFrom: ").concat(result.senderAddress, "\nTo: ").concat(result.recipientAddress, "\n\nToken Details:\n- Policy ID: ").concat(result.token.policyId, "\n- Asset Name: ").concat(result.token.name || '(none)', "\n- Amount: ").concat(result.token.amount, "\n\nIncluded ADA: ").concat(result.ada, " ADA\n\n[View on Explorer](").concat(result.links.explorer, ")")
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
                                    text: "Failed to send tokens: ".concat(error.message, "\n\n**Troubleshooting Tips:**\n1. Make sure you have a valid 15 or 24-word Cardano mnemonic in your .env file\n2. Verify your Blockfrost API key is correct and has sufficient access rights\n3. Check that your wallet has sufficient ADA balance for the transaction\n4. Verify the policy ID and asset name are correct\n5. Verify the recipient address is correct\n6. Check the console logs for detailed error information")
                                },
                            ],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}

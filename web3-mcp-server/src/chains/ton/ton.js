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
exports.registerTonTools = registerTonTools;
var zod_1 = require("zod");
var ton_1 = require("@ton/ton");
var crypto_1 = require("@ton/crypto");
// Initialize TON client
var tonClient = null;
// TON Network URL - Default to mainnet
var TON_MAINNET_ENDPOINT = process.env.TON_RPC_URL || 'https://toncenter.com/api/v2/jsonRPC';
var TON_TESTNET_ENDPOINT = 'https://testnet.toncenter.com/api/v2/jsonRPC';
var TON_API_KEY = process.env.TON_API_KEY || '';
var TON_EXPLORER = 'https://tonscan.org';
// Helper function to get or initialize the client
function getClient(testnet) {
    if (testnet === void 0) { testnet = false; }
    var endpoint = testnet ? TON_TESTNET_ENDPOINT : TON_MAINNET_ENDPOINT;
    if (!tonClient) {
        tonClient = new ton_1.TonClient({
            endpoint: endpoint,
            apiKey: TON_API_KEY
        });
    }
    return tonClient;
}
// Helper function to create a wallet from mnemonic
function createWalletFromMnemonic(mnemonic) {
    return __awaiter(this, void 0, void 0, function () {
        var mnemonicArray, keyPair;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mnemonicArray = mnemonic.split(' ');
                    return [4 /*yield*/, (0, crypto_1.mnemonicToWalletKey)(mnemonicArray)];
                case 1:
                    keyPair = _a.sent();
                    return [2 /*return*/, keyPair];
            }
        });
    });
}
// Helper function to determine wallet version and create appropriate contract
function createWalletContract(client, address, keyPair) {
    return __awaiter(this, void 0, void 0, function () {
        var walletContract, derivedAddress;
        return __generator(this, function (_a) {
            walletContract = ton_1.WalletContractV4.create({
                publicKey: keyPair.publicKey,
                workchain: 0
            });
            derivedAddress = walletContract.address;
            if (!derivedAddress.equals(address)) {
                console.warn('Warning: Derived wallet address does not match provided address.');
                console.warn("Derived: ".concat(derivedAddress.toString()));
                console.warn("Provided: ".concat(address.toString()));
                // We'll use the provided address anyway, but this is a warning sign
            }
            return [2 /*return*/, {
                    contract: walletContract,
                    walletVersion: 'v4r2'
                }];
        });
    });
}
// Helper function to implement exponential backoff for API rate limits
function withRetry(fn_1) {
    return __awaiter(this, arguments, void 0, function (fn, maxRetries) {
        var retries, _loop_1, state_1;
        if (maxRetries === void 0) { maxRetries = 5; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    retries = 0;
                    _loop_1 = function () {
                        var _b, error_1, delay_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 2, , 4]);
                                    _b = {};
                                    return [4 /*yield*/, fn()];
                                case 1: return [2 /*return*/, (_b.value = _c.sent(), _b)];
                                case 2:
                                    error_1 = _c.sent();
                                    retries++;
                                    // If we've exceeded our max retries or it's not a rate limit error, rethrow
                                    if (retries > maxRetries || !error_1.message.includes('429')) {
                                        throw error_1;
                                    }
                                    delay_1 = Math.pow(2, retries - 1) * 1000;
                                    console.log("Rate limit hit, retrying in ".concat(delay_1, "ms (attempt ").concat(retries, " of ").concat(maxRetries, ")..."));
                                    // Wait for the calculated time before retrying
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                                case 3:
                                    // Wait for the calculated time before retrying
                                    _c.sent();
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Register all TON tools
function registerTonTools(server) {
    var _this = this;
    // Get TON Balance
    server.tool("getTonBalance", "Get balance for a TON address", {
        address: zod_1.z.string().describe("TON address to check"),
        testnet: zod_1.z.boolean().optional().describe("Use testnet instead of mainnet"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var client_1, validAddress_1, accountInfo, balance, err_1, error;
        var address = _b.address, _c = _b.testnet, testnet = _c === void 0 ? false : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    client_1 = getClient(testnet);
                    try {
                        validAddress_1 = ton_1.Address.parse(address);
                    }
                    catch (error) {
                        return [2 /*return*/, {
                                content: [{ type: "text", text: "Invalid TON address format: ".concat(address) }],
                            }];
                    }
                    return [4 /*yield*/, withRetry(function () { return client_1.getBalance(validAddress_1); })];
                case 1:
                    accountInfo = _d.sent();
                    balance = (0, ton_1.fromNano)(accountInfo);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "TON Balance for ".concat(validAddress_1.toString(), ":\n").concat(balance, " TON"),
                                },
                            ],
                        }];
                case 2:
                    err_1 = _d.sent();
                    error = err_1;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to retrieve TON balance: ".concat(error.message) }],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Get TON transaction history
    server.tool("getTonTransactionHistory", "Get transaction history for a TON address", {
        address: zod_1.z.string().describe("TON address to check"),
        limit: zod_1.z.number().optional().describe("Maximum number of transactions to return (default: 10)"),
        testnet: zod_1.z.boolean().optional().describe("Use testnet instead of mainnet"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var client_2, validAddress_2, transactions, txList, err_2, error;
        var address = _b.address, _c = _b.limit, limit = _c === void 0 ? 10 : _c, _d = _b.testnet, testnet = _d === void 0 ? false : _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    client_2 = getClient(testnet);
                    try {
                        validAddress_2 = ton_1.Address.parse(address);
                    }
                    catch (error) {
                        return [2 /*return*/, {
                                content: [{ type: "text", text: "Invalid TON address format: ".concat(address) }],
                            }];
                    }
                    return [4 /*yield*/, withRetry(function () {
                            return client_2.getTransactions(validAddress_2, { limit: limit });
                        })];
                case 1:
                    transactions = _e.sent();
                    if (transactions.length === 0) {
                        return [2 /*return*/, {
                                content: [{ type: "text", text: "No transactions found for ".concat(validAddress_2.toString()) }],
                            }];
                    }
                    txList = transactions.map(function (tx) {
                        var timestamp = new Date(tx.time * 1000).toLocaleString();
                        var inMsg = tx.inMessage;
                        var outMsgs = tx.outMessages;
                        var txType = "Unknown";
                        var fromAddress = "N/A";
                        var toAddress = "N/A";
                        var amount = "0";
                        var comment = "";
                        // Determine if it's incoming or outgoing
                        if (inMsg && inMsg.source) {
                            txType = "Incoming";
                            fromAddress = inMsg.source.toString();
                            toAddress = validAddress_2.toString();
                            amount = inMsg.value ? (0, ton_1.fromNano)(inMsg.value) : "0";
                            // Try to extract comment if present
                            if (inMsg.body) {
                                try {
                                    var msgBody = inMsg.body;
                                    // Attempt to decode comment if it's an op=0 message
                                    if (msgBody && msgBody.beginParse) {
                                        var slice = msgBody.beginParse();
                                        if (slice.loadUint(32) === 0) { // op=0 indicates text comment
                                            comment = slice.loadStringTail();
                                        }
                                    }
                                }
                                catch (e) {
                                    // Silent fail if we can't parse the comment
                                }
                            }
                        }
                        else if (outMsgs && outMsgs.length > 0) {
                            txType = "Outgoing";
                            fromAddress = validAddress_2.toString();
                            // Sum total sent amount across all outgoing messages
                            var totalAmount_1 = 0n;
                            outMsgs.forEach(function (msg) {
                                if (msg.destination) {
                                    toAddress = msg.destination.toString();
                                }
                                if (msg.value) {
                                    totalAmount_1 += msg.value;
                                }
                                // Try to extract comment from the first message if present
                                if (!comment && msg.body) {
                                    try {
                                        var msgBody = msg.body;
                                        // Attempt to decode comment if it's an op=0 message
                                        if (msgBody && msgBody.beginParse) {
                                            var slice = msgBody.beginParse();
                                            if (slice.loadUint(32) === 0) { // op=0 indicates text comment
                                                comment = slice.loadStringTail();
                                            }
                                        }
                                    }
                                    catch (e) {
                                        // Silent fail if we can't parse the comment
                                    }
                                }
                            });
                            amount = (0, ton_1.fromNano)(totalAmount_1);
                        }
                        return "\nTransaction: ".concat(tx.hash, "\nType: ").concat(txType, "\nDate: ").concat(timestamp, "\nFrom: ").concat(fromAddress, "\nTo: ").concat(toAddress, "\nAmount: ").concat(amount, " TON").concat(comment ? "\nComment: ".concat(comment) : "");
                    }).join('\n---\n');
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "TON Transaction History for ".concat(validAddress_2.toString(), ":\n").concat(txList),
                                },
                            ],
                        }];
                case 2:
                    err_2 = _e.sent();
                    error = err_2;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to retrieve TON transaction history: ".concat(error.message) }],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Validate TON address
    server.tool("validateTonAddress", "Validate a TON address format", {
        address: zod_1.z.string().describe("TON address to validate"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var isValid, normalized, parsedAddress, error;
        var address = _b.address;
        return __generator(this, function (_c) {
            try {
                isValid = false;
                normalized = "";
                try {
                    parsedAddress = ton_1.Address.parse(address);
                    isValid = true;
                    normalized = parsedAddress.toString();
                }
                catch (e) {
                    isValid = false;
                }
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: isValid
                                    ? "The address ".concat(address, " has a valid TON address format.\nNormalized format: ").concat(normalized)
                                    : "The address ".concat(address, " does NOT have a valid TON address format."),
                            },
                        ],
                    }];
            }
            catch (err) {
                error = err;
                return [2 /*return*/, {
                        content: [{ type: "text", text: "Error validating TON address: ".concat(error.message) }],
                    }];
            }
            return [2 /*return*/];
        });
    }); });
    // Get TON Network Info
    server.tool("getTonNetworkInfo", "Get current TON network information", {
        testnet: zod_1.z.boolean().optional().describe("Use testnet instead of mainnet"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var client_3, masterchainInfo, err_3, error;
        var _c = _b.testnet, testnet = _c === void 0 ? false : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    client_3 = getClient(testnet);
                    return [4 /*yield*/, withRetry(function () { return client_3.getMasterchainInfo(); })];
                case 1:
                    masterchainInfo = _d.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "TON Network Information (".concat(testnet ? 'Testnet' : 'Mainnet', "):\nCurrent Workchain: ").concat(masterchainInfo.workchain, "\nCurrent Shard: ").concat(masterchainInfo.shard, "\nInitial Seqno: ").concat(masterchainInfo.initSeqno, "\nLatest Seqno: ").concat(masterchainInfo.latestSeqno),
                                },
                            ],
                        }];
                case 2:
                    err_3 = _d.sent();
                    error = err_3;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to retrieve TON Network information: ".concat(error.message) }],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Send TON transaction using mnemonic
    server.tool("sendTonTransaction", "Send TON from your wallet to another address using mnemonic from .env", {
        toAddress: zod_1.z.string().describe("TON address to send to"),
        amount: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).describe("Amount of TON to send"),
        comment: zod_1.z.string().optional().describe("Optional comment to include with the transaction"),
        testnet: zod_1.z.boolean().optional().describe("Use testnet instead of mainnet"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var client, walletAddress, destinationAddress, keyPair_1, amountInNano, _c, walletContract, walletVersion, wallet_1, balance, balanceInTon, sendAmount, gasFee, body, message_1, seqno_1, timestamp, txId, explorerLink, err_4, error;
        var toAddress = _b.toAddress, amount = _b.amount, comment = _b.comment, _d = _b.testnet, testnet = _d === void 0 ? false : _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 6, , 7]);
                    // Check if mnemonic is available
                    if (!process.env.TON_MNEMONIC) {
                        throw new Error("TON_MNEMONIC is required in the .env file");
                    }
                    // Check if address is available
                    if (!process.env.TON_ADDRESS) {
                        throw new Error("TON_ADDRESS is required in the .env file");
                    }
                    client = getClient(testnet);
                    walletAddress = ton_1.Address.parse(process.env.TON_ADDRESS);
                    destinationAddress = void 0;
                    try {
                        destinationAddress = ton_1.Address.parse(toAddress);
                    }
                    catch (error) {
                        throw new Error("Invalid destination address: ".concat(toAddress));
                    }
                    return [4 /*yield*/, createWalletFromMnemonic(process.env.TON_MNEMONIC)];
                case 1:
                    keyPair_1 = _e.sent();
                    amountInNano = (0, ton_1.toNano)(typeof amount === 'number' ? amount.toString() : amount);
                    return [4 /*yield*/, createWalletContract(client, walletAddress, keyPair_1)];
                case 2:
                    _c = _e.sent(), walletContract = _c.contract, walletVersion = _c.walletVersion;
                    wallet_1 = client.open(walletContract);
                    return [4 /*yield*/, withRetry(function () { return wallet_1.getBalance(); })];
                case 3:
                    balance = _e.sent();
                    balanceInTon = (0, ton_1.fromNano)(balance);
                    console.log("Wallet balance: ".concat(balanceInTon, " TON"));
                    sendAmount = BigInt(amountInNano);
                    gasFee = (0, ton_1.toNano)('0.05');
                    if (balance < sendAmount + gasFee) {
                        throw new Error("Insufficient funds: ".concat(balanceInTon, " TON available, need at least ").concat((0, ton_1.fromNano)(sendAmount + gasFee), " TON (including fees)"));
                    }
                    body = comment
                        ? (0, ton_1.beginCell)().storeUint(0, 32).storeStringTail(comment).endCell()
                        : undefined;
                    message_1 = (0, ton_1.internal)({
                        to: destinationAddress,
                        value: amountInNano,
                        body: body,
                    });
                    // Send the transaction with retry logic for rate limits
                    console.log("Sending ".concat((0, ton_1.fromNano)(amountInNano), " TON to ").concat(destinationAddress.toString()));
                    return [4 /*yield*/, withRetry(function () { return wallet_1.getSeqno(); })];
                case 4:
                    seqno_1 = _e.sent();
                    timestamp = Math.floor(Date.now() / 1000);
                    txId = "".concat(timestamp, "-").concat(walletAddress.toString().slice(0, 8), "-").concat(destinationAddress.toString().slice(0, 8));
                    // Send transfer with retry
                    return [4 /*yield*/, withRetry(function () {
                            return wallet_1.sendTransfer({
                                seqno: seqno_1,
                                secretKey: keyPair_1.secretKey,
                                messages: [message_1],
                                sendMode: ton_1.SendMode.PAY_GAS_SEPARATELY | ton_1.SendMode.IGNORE_ERRORS,
                            });
                        })];
                case 5:
                    // Send transfer with retry
                    _e.sent();
                    explorerLink = testnet
                        ? "https://testnet.tonscan.org/address/".concat(destinationAddress.toString())
                        : "".concat(TON_EXPLORER, "/address/").concat(destinationAddress.toString());
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "TON Transaction Sent Successfully!\nFrom: ".concat(walletAddress.toString(), "\nTo: ").concat(destinationAddress.toString(), "\nAmount: ").concat(typeof amount === 'number' ? amount.toString() : amount, " TON\n").concat(comment ? "Comment: ".concat(comment, "\n") : '', "\nWallet Version: ").concat(walletVersion, "\nTransaction ID: ").concat(txId, "\nExplorer Link: ").concat(explorerLink, "\n\nNote: The transaction has been sent to the network. Check the explorer link to see when it appears (usually within seconds)."),
                                },
                            ],
                        }];
                case 6:
                    err_4 = _e.sent();
                    error = err_4;
                    console.error('Error in sendTonTransaction:', error);
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to send TON transaction: ".concat(error.message) }],
                        }];
                case 7: return [2 /*return*/];
            }
        });
    }); });
}

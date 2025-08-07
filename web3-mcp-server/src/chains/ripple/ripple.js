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
exports.registerRippleTools = registerRippleTools;
var zod_1 = require("zod");
var xrpl_1 = require("xrpl");
// Initialize XRP Ledger client
var xrpClient = null;
// XRP Network URL
var XRP_NETWORK_URL = process.env.XRP_RPC_URL || 'wss://s1.ripple.com';
var XRP_EXPLORER = 'https://livenet.xrpl.org';
// Helper function to get or initialize the client
function getClient() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!xrpClient || !xrpClient.isConnected())) return [3 /*break*/, 2];
                    xrpClient = new xrpl_1.Client(XRP_NETWORK_URL);
                    return [4 /*yield*/, xrpClient.connect()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, xrpClient];
            }
        });
    });
}
// Helper function to format drops to XRP
function dropsToXrp(drops) {
    return (parseInt(drops) / 1000000).toFixed(6);
}
// Helper function to format XRP to drops
function xrpToDrops(xrp) {
    // Ensure xrp is a string
    var xrpStr = typeof xrp === 'number' ? xrp.toString() : xrp;
    // Use a string to preserve precision and avoid floating point issues
    var drops = Math.floor(parseFloat(xrpStr) * 1000000).toString();
    return drops;
}
// Helper function to clean up resources
function cleanUp() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(xrpClient && xrpClient.isConnected())) return [3 /*break*/, 2];
                    return [4 /*yield*/, xrpClient.disconnect()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// Helper function to create a wallet from available credentials
function createWallet() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Try with private key first if available
            if (process.env.XRP_PRIVATE_KEY) {
                try {
                    console.log("Creating wallet from private key...");
                    return [2 /*return*/, xrpl_1.Wallet.fromSeed(process.env.XRP_PRIVATE_KEY)];
                }
                catch (err) {
                    console.log("Failed to create wallet from private key:", err);
                }
            }
            // Try with mnemonic if private key failed or isn't available
            if (process.env.XRP_MNEMONIC) {
                try {
                    console.log("Creating wallet from mnemonic...");
                    return [2 /*return*/, xrpl_1.Wallet.fromMnemonic(process.env.XRP_MNEMONIC)];
                }
                catch (err) {
                    console.log("Failed to create wallet from mnemonic:", err);
                }
            }
            // If we have the address and we get here, throw an error
            if (process.env.XRP_ADDRESS) {
                throw new Error('Could not create wallet from available credentials');
            }
            throw new Error('No wallet credentials provided. Please add XRP_PRIVATE_KEY or XRP_MNEMONIC to your .env file');
        });
    });
}
// Register all XRP tools
function registerRippleTools(server) {
    var _this = this;
    // Get XRP Balance
    server.tool("getXrpBalance", "Get balance for an XRP address", {
        address: zod_1.z.string().describe("XRP address to check"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var client, response, balance, err_1, error;
        var address = _b.address;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getClient()];
                case 1:
                    client = _c.sent();
                    return [4 /*yield*/, client.request({
                            command: 'account_info',
                            account: address,
                            ledger_index: 'validated'
                        })];
                case 2:
                    response = _c.sent();
                    balance = dropsToXrp(response.result.account_data.Balance);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "XRP Balance for ".concat(address, ":\n").concat(balance, " XRP"),
                                },
                            ],
                        }];
                case 3:
                    err_1 = _c.sent();
                    error = err_1;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to retrieve XRP balance: ".concat(error.message) }],
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Get account transactions
    server.tool("getXrpTransactionHistory", "Get transaction history for an XRP address", {
        address: zod_1.z.string().describe("XRP address to check"),
        limit: zod_1.z.number().optional().describe("Maximum number of transactions to return (default: 10)"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var client, response, txList, err_2, error;
        var address = _b.address, _c = _b.limit, limit = _c === void 0 ? 10 : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getClient()];
                case 1:
                    client = _d.sent();
                    return [4 /*yield*/, client.request({
                            command: 'account_tx',
                            account: address,
                            limit: limit
                        })];
                case 2:
                    response = _d.sent();
                    if (!response.result.transactions || response.result.transactions.length === 0) {
                        return [2 /*return*/, {
                                content: [{ type: "text", text: "No transactions found for ".concat(address) }],
                            }];
                    }
                    txList = response.result.transactions.map(function (tx) {
                        var transaction = tx.tx;
                        var txInfo = "\nTransaction: ".concat(transaction.hash, "\nType: ").concat(transaction.TransactionType, "\nDate: ").concat(new Date(transaction.date ? (transaction.date + 946684800) * 1000 : 0).toLocaleString());
                        if (transaction.TransactionType === 'Payment') {
                            txInfo += "\nFrom: ".concat(transaction.Account, "\nTo: ").concat(transaction.Destination, "\nAmount: ").concat(transaction.Amount.currency ?
                                "".concat(transaction.Amount.value, " ").concat(transaction.Amount.currency) :
                                "".concat(dropsToXrp(transaction.Amount), " XRP"));
                        }
                        return txInfo;
                    }).join('\n---\n');
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "XRP Transaction History for ".concat(address, ":\n").concat(txList),
                                },
                            ],
                        }];
                case 3:
                    err_2 = _d.sent();
                    error = err_2;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to retrieve XRP transaction history: ".concat(error.message) }],
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Validate XRP address
    server.tool("validateXrpAddress", "Validate an XRP address format", {
        address: zod_1.z.string().describe("XRP address to validate"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var isValid, error;
        var address = _b.address;
        return __generator(this, function (_c) {
            try {
                isValid = /^r[a-zA-Z0-9]{24,34}$/.test(address);
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: isValid
                                    ? "The address ".concat(address, " has a valid XRP address format")
                                    : "The address ".concat(address, " does NOT have a valid XRP address format"),
                            },
                        ],
                    }];
            }
            catch (err) {
                error = err;
                return [2 /*return*/, {
                        content: [{ type: "text", text: "Error validating XRP address: ".concat(error.message) }],
                    }];
            }
            return [2 /*return*/];
        });
    }); });
    // Get XRP Ledger Info
    server.tool("getXrpLedgerInfo", "Get current XRP Ledger information", {}, function () { return __awaiter(_this, void 0, void 0, function () {
        var client, serverInfo, ledgerInfo, serverState, ledgerIndex, ledgerHash, closeTime, baseFee, reserveBase, reserveInc, err_3, error;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 4, 5, 6]);
                    return [4 /*yield*/, getClient()];
                case 1:
                    client = _d.sent();
                    return [4 /*yield*/, client.request({
                            command: 'server_info'
                        })];
                case 2:
                    serverInfo = _d.sent();
                    return [4 /*yield*/, client.request({
                            command: 'ledger',
                            ledger_index: 'validated'
                        })];
                case 3:
                    ledgerInfo = _d.sent();
                    serverState = serverInfo.result.info.server_state || 'Unknown';
                    ledgerIndex = ledgerInfo.result.ledger.ledger_index || 'Unknown';
                    ledgerHash = ledgerInfo.result.ledger.ledger_hash || 'Unknown';
                    closeTime = ledgerInfo.result.ledger.close_time
                        ? new Date((ledgerInfo.result.ledger.close_time + 946684800) * 1000).toLocaleString()
                        : 'Unknown';
                    baseFee = ((_a = serverInfo.result.info.validated_ledger) === null || _a === void 0 ? void 0 : _a.base_fee_xrp) || 'Unknown';
                    reserveBase = ((_b = serverInfo.result.info.validated_ledger) === null || _b === void 0 ? void 0 : _b.reserve_base_xrp) || 'Unknown';
                    reserveInc = ((_c = serverInfo.result.info.validated_ledger) === null || _c === void 0 ? void 0 : _c.reserve_inc_xrp) || 'Unknown';
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "XRP Ledger Information:\nServer Status: ".concat(serverState, "\nCurrent Ledger: ").concat(ledgerIndex, "\nLedger Hash: ").concat(ledgerHash, "\nClose Time: ").concat(closeTime, "\nBase Fee: ").concat(baseFee, " XRP\nReserve Base: ").concat(reserveBase, " XRP\nReserve Inc: ").concat(reserveInc, " XRP"),
                                },
                            ],
                        }];
                case 4:
                    err_3 = _d.sent();
                    error = err_3;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to retrieve XRP Ledger information: ".concat(error.message) }],
                        }];
                case 5: return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    // Send XRP transaction using private key or mnemonic
    server.tool("sendXrpTransaction", "Send XRP from your wallet to another address using private key from .env", {
        toAddress: zod_1.z.string().describe("XRP address to send to"),
        amount: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).describe("Amount of XRP to send (string or number)"),
        memo: zod_1.z.string().optional().describe("Optional memo to include with the transaction"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var amountStr, client, wallet, walletError_1, accountInfo, payment, prepared, signed, submitResult, finalResult, waitError_1, txError_1, err_4, error;
        var toAddress = _b.toAddress, amount = _b.amount, memo = _b.memo;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 18, , 19]);
                    amountStr = typeof amount === 'number' ? amount.toString() : amount;
                    return [4 /*yield*/, getClient()];
                case 1:
                    client = _c.sent();
                    wallet = void 0;
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, createWallet()];
                case 3:
                    wallet = _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    walletError_1 = _c.sent();
                    console.error('Wallet creation error:', walletError_1);
                    throw new Error("Failed to create wallet: ".concat(walletError_1.message));
                case 5:
                    // Log debug info
                    console.log("Wallet created. Address: ".concat(wallet.address, ", Public Key: ").concat(wallet.publicKey));
                    // Verify wallet address matches expected address if provided
                    if (process.env.XRP_ADDRESS && wallet.address !== process.env.XRP_ADDRESS) {
                        console.log("Warning: Derived wallet address ".concat(wallet.address, " does not match provided XRP_ADDRESS ").concat(process.env.XRP_ADDRESS));
                    }
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 16, , 17]);
                    // Get account info first to confirm the account exists
                    console.log("Getting account info for ".concat(wallet.address, "..."));
                    return [4 /*yield*/, client.request({
                            command: 'account_info',
                            account: wallet.address,
                            ledger_index: 'validated'
                        })];
                case 7:
                    accountInfo = _c.sent();
                    console.log("Account exists with sequence: ".concat(accountInfo.result.account_data.Sequence));
                    payment = {
                        TransactionType: 'Payment',
                        Account: wallet.address,
                        Destination: toAddress,
                        // Convert amount to drops and ensure it's a string
                        Amount: xrpToDrops(amount)
                    };
                    // Add memo if provided
                    if (memo) {
                        payment.Memos = [{
                                Memo: {
                                    MemoData: Buffer.from(memo, 'utf8').toString('hex').toUpperCase()
                                }
                            }];
                    }
                    // Prepare transaction with autofill to get all needed fields
                    console.log('Preparing transaction...');
                    return [4 /*yield*/, client.autofill(payment)];
                case 8:
                    prepared = _c.sent();
                    console.log('Prepared transaction:', JSON.stringify(prepared));
                    // Use the wallet's sign method to create the signed tx_blob
                    console.log('Signing transaction...');
                    signed = wallet.sign(prepared);
                    console.log('Signed transaction. tx_blob length:', signed.tx_blob.length);
                    console.log('Signed transaction hash:', signed.hash);
                    // First submit the transaction to get immediate feedback
                    console.log('Submitting transaction...');
                    return [4 /*yield*/, client.submit(signed.tx_blob)];
                case 9:
                    submitResult = _c.sent();
                    console.log('Submit response:', JSON.stringify(submitResult));
                    if (!(submitResult.result.engine_result === 'tesSUCCESS' || submitResult.result.engine_result.startsWith('tes'))) return [3 /*break*/, 14];
                    // Wait for transaction to be validated
                    console.log("Transaction submitted successfully with hash: ".concat(signed.hash, ". Waiting for validation..."));
                    _c.label = 10;
                case 10:
                    _c.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, client.submitAndWait(signed.tx_blob)];
                case 11:
                    finalResult = _c.sent();
                    console.log('Final transaction result:', JSON.stringify(finalResult));
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "XRP Transaction Sent!\nFrom: ".concat(wallet.address, "\nTo: ").concat(toAddress, "\nAmount: ").concat(amountStr, " XRP\nTransaction Hash: ").concat(signed.hash, "\nExplorer Link: ").concat(XRP_EXPLORER, "/transactions/").concat(signed.hash),
                                },
                            ],
                        }];
                case 12:
                    waitError_1 = _c.sent();
                    // Even if we can't check the result, if submission was successful we return success
                    console.log('Could not verify transaction, but submission was successful:', waitError_1);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "XRP Transaction Submitted!\nFrom: ".concat(wallet.address, "\nTo: ").concat(toAddress, "\nAmount: ").concat(amountStr, " XRP\nTransaction Hash: ").concat(signed.hash, "\nExplorer Link: ").concat(XRP_EXPLORER, "/transactions/").concat(signed.hash, "\n\nNote: Transaction was submitted successfully but validation status is pending."),
                                },
                            ],
                        }];
                case 13: return [3 /*break*/, 15];
                case 14: 
                // If submission wasn't successful, throw an error with the engine result
                throw new Error("Transaction submission failed: ".concat(submitResult.result.engine_result, " - ").concat(submitResult.result.engine_result_message));
                case 15: return [3 /*break*/, 17];
                case 16:
                    txError_1 = _c.sent();
                    console.error('Transaction error details:', txError_1);
                    throw new Error("Transaction error: ".concat(txError_1.message));
                case 17: return [3 /*break*/, 19];
                case 18:
                    err_4 = _c.sent();
                    error = err_4;
                    console.error('Error in sendXrpTransaction:', error);
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to send XRP transaction: ".concat(error.message) }],
                        }];
                case 19: return [2 /*return*/];
            }
        });
    }); });
    // Check token balances on XRP Ledger
    server.tool("getXrpTokenBalances", "Get token balances for an XRP address", {
        address: zod_1.z.string().describe("XRP address to check"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var client, response, tokenBalances, err_5, error;
        var address = _b.address;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getClient()];
                case 1:
                    client = _c.sent();
                    return [4 /*yield*/, client.request({
                            command: 'account_lines',
                            account: address
                        })];
                case 2:
                    response = _c.sent();
                    if (!response.result.lines || response.result.lines.length === 0) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: "No token balances found for ".concat(address),
                                    },
                                ],
                            }];
                    }
                    tokenBalances = response.result.lines.map(function (line) {
                        return "".concat(line.balance, " ").concat(line.currency, " (Issuer: ").concat(line.account, ")");
                    }).join('\n');
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Token Balances for ".concat(address, ":\n").concat(tokenBalances),
                                },
                            ],
                        }];
                case 3:
                    err_5 = _c.sent();
                    error = err_5;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to retrieve XRP token balances: ".concat(error.message) }],
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Create trustline for a token on XRP Ledger
    server.tool("createXrpTrustline", "Create a trustline for a token on the XRP Ledger using private key from .env", {
        currency: zod_1.z.string().describe("Currency code (3-letter ISO code or hex string)"),
        issuer: zod_1.z.string().describe("Issuer's XRP address"),
        limit: zod_1.z.string().describe("Maximum amount of the token to trust"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var client, wallet, trustSetTx, prepared, signed, result, signError_1, err_6, error;
        var currency = _b.currency, issuer = _b.issuer, limit = _b.limit;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, getClient()];
                case 1:
                    client = _c.sent();
                    return [4 /*yield*/, createWallet()];
                case 2:
                    wallet = _c.sent();
                    trustSetTx = {
                        TransactionType: 'TrustSet',
                        Account: wallet.address,
                        LimitAmount: {
                            currency: currency,
                            issuer: issuer,
                            value: limit
                        }
                    };
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, client.autofill(trustSetTx)];
                case 4:
                    prepared = _c.sent();
                    signed = wallet.sign(prepared);
                    return [4 /*yield*/, client.submitAndWait(signed.tx_blob)];
                case 5:
                    result = _c.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "XRP Trustline Created!\nAccount: ".concat(wallet.address, "\nCurrency: ").concat(currency, "\nIssuer: ").concat(issuer, "\nLimit: ").concat(limit, "\nTransaction Hash: ").concat(result.result.hash, "\nExplorer Link: ").concat(XRP_EXPLORER, "/transactions/").concat(result.result.hash),
                                },
                            ],
                        }];
                case 6:
                    signError_1 = _c.sent();
                    throw new Error("Failed to sign/submit transaction: ".concat(signError_1.message));
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_6 = _c.sent();
                    error = err_6;
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Failed to create XRP trustline: ".concat(error.message) }],
                        }];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    process.on('beforeExit', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cleanUp()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}

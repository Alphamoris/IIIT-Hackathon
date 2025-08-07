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
exports.registerCoinGeckoTools = registerCoinGeckoTools;
var zod_1 = require("zod");
var COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
function registerCoinGeckoTools(server) {
    var _this = this;
    // Search tokens
    server.tool("searchCoinGecko", "Search for coins by ticker symbol OR name to get their CoinGecko ID. IMPORTANT: Only search with one term - either ticker (e.g., 'BTC', 'BERA') or name (e.g., 'Bitcoin', 'Berachain'), but not both. $ symbol will be automatically removed from tickers. Use this first to find the coin's CoinGecko ID before querying detailed information.", {
        query: zod_1.z.string().describe("Search query (e.g., 'BTC' or 'Bitcoin', but not 'BTC Bitcoin')"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var apiKey, cleanQuery, url, headers, response, errorText, data, coins, formattedCoins, textResponse, err_1, error;
        var query = _b.query;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    apiKey = process.env.COINGECKO_API_KEY;
                    if (!apiKey) {
                        throw new Error('COINGECKO_API_KEY not found in environment variables');
                    }
                    cleanQuery = query.replace('$', '').trim();
                    url = new URL("".concat(COINGECKO_API_BASE, "/search"));
                    url.searchParams.append('query', cleanQuery);
                    headers = {
                        'accept': 'application/json',
                        'x-cg-demo-api-key': apiKey
                    };
                    return [4 /*yield*/, fetch(url.toString(), {
                            headers: headers,
                            method: 'GET'
                        })];
                case 1:
                    response = _c.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _c.sent();
                    throw new Error("CoinGecko API error (".concat(response.status, "): ").concat(errorText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _c.sent();
                    coins = (data.coins || []);
                    formattedCoins = coins.map(function (coin) { return ({
                        id: coin.id,
                        symbol: coin.symbol.toUpperCase(),
                        name: coin.name,
                        marketCapRank: coin.market_cap_rank || 'N/A'
                    }); });
                    textResponse = void 0;
                    if (formattedCoins.length === 0) {
                        textResponse = "No coins found matching '".concat(cleanQuery, "'.\n\nTips:\n1. Search with just the ticker (e.g., 'BERA') or just the name (e.g., 'Berachain'), but not both\n2. Try searching with the ticker first, then try the name if no results\n3. Make sure the ticker or name is spelled correctly");
                    }
                    else {
                        textResponse = "Found ".concat(formattedCoins.length, " coins matching '").concat(cleanQuery, "':\n\n").concat(formattedCoins.map(function (coin) {
                            return "".concat(coin.name, " (").concat(coin.symbol, ")\n") +
                                "CoinGecko ID: ".concat(coin.id, "\n") +
                                "Market Cap Rank: ".concat(coin.marketCapRank, "\n");
                        }).join('\n'));
                    }
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: textResponse
                                }
                            ],
                            data: formattedCoins
                        }];
                case 5:
                    err_1 = _c.sent();
                    error = err_1;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to search CoinGecko: ".concat(error.message)
                                }
                            ]
                        }];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    // Get token prices
    server.tool("getCoinGeckoPrices", "Get current prices of tokens using their CoinGecko IDs. Must provide valid CoinGecko IDs (use searchCoinGecko to find IDs first).", {
        ids: zod_1.z.array(zod_1.z.string()).describe("Array of CoinGecko token IDs"),
        vsCurrencies: zod_1.z.array(zod_1.z.string()).describe("Array of currencies to get prices in (e.g., ['usd', 'eur'])"),
        includeMarketCap: zod_1.z.boolean().optional().describe("Include market cap data"),
        include24hrVol: zod_1.z.boolean().optional().describe("Include 24h volume data"),
        include24hrChange: zod_1.z.boolean().optional().describe("Include 24h price change data"),
        includeLastUpdatedAt: zod_1.z.boolean().optional().describe("Include last updated timestamp"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var apiKey, url_1, params, headers, response, errorText, data, textResponse, _i, _c, _d, coinId, prices, _e, _f, _g, currency, value, formattedValue, label, err_2, error;
        var _h, _j, _k, _l;
        var ids = _b.ids, vsCurrencies = _b.vsCurrencies, includeMarketCap = _b.includeMarketCap, include24hrVol = _b.include24hrVol, include24hrChange = _b.include24hrChange, includeLastUpdatedAt = _b.includeLastUpdatedAt;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _m.trys.push([0, 5, , 6]);
                    apiKey = process.env.COINGECKO_API_KEY;
                    if (!apiKey) {
                        throw new Error('COINGECKO_API_KEY not found in environment variables');
                    }
                    url_1 = new URL("".concat(COINGECKO_API_BASE, "/simple/price"));
                    params = {
                        ids: ids.join(','),
                        vs_currencies: vsCurrencies.join(','),
                        include_market_cap: (_h = includeMarketCap === null || includeMarketCap === void 0 ? void 0 : includeMarketCap.toString()) !== null && _h !== void 0 ? _h : 'false',
                        include_24hr_vol: (_j = include24hrVol === null || include24hrVol === void 0 ? void 0 : include24hrVol.toString()) !== null && _j !== void 0 ? _j : 'false',
                        include_24hr_change: (_k = include24hrChange === null || include24hrChange === void 0 ? void 0 : include24hrChange.toString()) !== null && _k !== void 0 ? _k : 'false',
                        include_last_updated_at: (_l = includeLastUpdatedAt === null || includeLastUpdatedAt === void 0 ? void 0 : includeLastUpdatedAt.toString()) !== null && _l !== void 0 ? _l : 'false',
                    };
                    Object.entries(params).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        url_1.searchParams.append(key, value);
                    });
                    headers = {
                        'accept': 'application/json',
                        'x-cg-demo-api-key': apiKey
                    };
                    return [4 /*yield*/, fetch(url_1.toString(), {
                            headers: headers,
                            method: 'GET'
                        })];
                case 1:
                    response = _m.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _m.sent();
                    throw new Error("CoinGecko API error (".concat(response.status, "): ").concat(errorText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _m.sent();
                    textResponse = '';
                    for (_i = 0, _c = Object.entries(data); _i < _c.length; _i++) {
                        _d = _c[_i], coinId = _d[0], prices = _d[1];
                        textResponse += "".concat(coinId, ":\n");
                        for (_e = 0, _f = Object.entries(prices); _e < _f.length; _e++) {
                            _g = _f[_e], currency = _g[0], value = _g[1];
                            formattedValue = currency.includes('last_updated') ? new Date(value * 1000).toISOString()
                                : currency.includes('market_cap') ? "$".concat(value.toLocaleString())
                                    : currency.includes('24h_vol') ? "$".concat(value.toLocaleString())
                                        : currency.includes('24h_change') ? "".concat(value.toFixed(2), "%")
                                            : "".concat(value, " ").concat(currency.toUpperCase());
                            label = currency.includes('market_cap') ? 'Market Cap'
                                : currency.includes('24h_vol') ? '24h Volume'
                                    : currency.includes('24h_change') ? '24h Change'
                                        : currency.includes('last_updated') ? 'Last Updated'
                                            : "Price (".concat(currency.toUpperCase(), ")");
                            textResponse += "  ".concat(label, ": ").concat(formattedValue, "\n");
                        }
                        textResponse += '\n';
                    }
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: textResponse || 'No price data found.'
                                }
                            ],
                            data: data
                        }];
                case 5:
                    err_2 = _m.sent();
                    error = err_2;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to get CoinGecko prices: ".concat(error.message)
                                }
                            ]
                        }];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    // Get detailed coin information including contract addresses
    server.tool("getCoinInfoByCoingeckoId", "Look up contract addresses and chain information for a token using its CoinGecko ID. Use searchCoinGecko first to find the correct CoinGecko ID before using this tool.", {
        id: zod_1.z.string().describe("CoinGecko coin ID (get this from searchCoinGecko)"),
        marketData: zod_1.z.boolean().optional().describe("Include market data"),
        localization: zod_1.z.boolean().optional().describe("Include localized data"),
        tickers: zod_1.z.boolean().optional().describe("Include ticker data"),
        communityData: zod_1.z.boolean().optional().describe("Include community data"),
        developerData: zod_1.z.boolean().optional().describe("Include developer data"),
        sparkline: zod_1.z.boolean().optional().describe("Include sparkline data"),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var apiKey, url, headers, response, errorText, data, contractInfo, _i, _c, _d, platform, address, generalInfo, marketInfo, md, textResponse, err_3, error;
        var _e, _f, _g;
        var id = _b.id, _h = _b.localization, localization = _h === void 0 ? false : _h, _j = _b.tickers, tickers = _j === void 0 ? false : _j, _k = _b.marketData, marketData = _k === void 0 ? true : _k, _l = _b.communityData, communityData = _l === void 0 ? false : _l, _m = _b.developerData, developerData = _m === void 0 ? false : _m, _o = _b.sparkline, sparkline = _o === void 0 ? false : _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    _p.trys.push([0, 5, , 6]);
                    apiKey = process.env.COINGECKO_API_KEY;
                    if (!apiKey) {
                        throw new Error('COINGECKO_API_KEY not found in environment variables');
                    }
                    url = new URL("".concat(COINGECKO_API_BASE, "/coins/").concat(encodeURIComponent(id)));
                    url.searchParams.append('localization', localization.toString());
                    url.searchParams.append('tickers', tickers.toString());
                    url.searchParams.append('market_data', marketData.toString());
                    url.searchParams.append('community_data', communityData.toString());
                    url.searchParams.append('developer_data', developerData.toString());
                    url.searchParams.append('sparkline', sparkline.toString());
                    headers = {
                        'accept': 'application/json',
                        'x-cg-demo-api-key': apiKey
                    };
                    return [4 /*yield*/, fetch(url.toString(), {
                            headers: headers,
                            method: 'GET'
                        })];
                case 1:
                    response = _p.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _p.sent();
                    throw new Error("CoinGecko API error (".concat(response.status, "): ").concat(errorText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _p.sent();
                    contractInfo = '';
                    if (data.platforms && Object.keys(data.platforms).length > 0) {
                        contractInfo = '\nContract Addresses:\n';
                        for (_i = 0, _c = Object.entries(data.platforms); _i < _c.length; _i++) {
                            _d = _c[_i], platform = _d[0], address = _d[1];
                            if (address && address !== '') {
                                contractInfo += "  ".concat(platform, ": ").concat(address, "\n");
                            }
                        }
                    }
                    generalInfo = "".concat(data.name, " (").concat(data.symbol.toUpperCase(), ")");
                    if (data.market_cap_rank) {
                        generalInfo += "\nMarket Cap Rank: #".concat(data.market_cap_rank);
                    }
                    marketInfo = '';
                    if (marketData && data.market_data) {
                        md = data.market_data;
                        marketInfo = '\nMarket Data:\n';
                        if ((_e = md.current_price) === null || _e === void 0 ? void 0 : _e.usd) {
                            marketInfo += "  Current Price: $".concat(md.current_price.usd.toLocaleString(), "\n");
                        }
                        if ((_f = md.market_cap) === null || _f === void 0 ? void 0 : _f.usd) {
                            marketInfo += "  Market Cap: $".concat(md.market_cap.usd.toLocaleString(), "\n");
                        }
                        if ((_g = md.total_volume) === null || _g === void 0 ? void 0 : _g.usd) {
                            marketInfo += "  24h Volume: $".concat(md.total_volume.usd.toLocaleString(), "\n");
                        }
                        if (md.price_change_percentage_24h) {
                            marketInfo += "  24h Change: ".concat(md.price_change_percentage_24h.toFixed(2), "%\n");
                        }
                    }
                    textResponse = "".concat(generalInfo).concat(contractInfo).concat(marketInfo, "\n\nLast Updated: ").concat(data.last_updated);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: textResponse
                                }
                            ],
                            data: data // Include raw data for potential future use
                        }];
                case 5:
                    err_3 = _p.sent();
                    error = err_3;
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: "Failed to get coin info: ".concat(error.message)
                                }
                            ]
                        }];
                case 6: return [2 /*return*/];
            }
        });
    }); });
}

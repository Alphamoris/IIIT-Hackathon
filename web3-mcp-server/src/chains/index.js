"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUtxoTools = registerUtxoTools;
exports.registerAllTools = registerAllTools;
var bitcoin_1 = require("./UTXO/bitcoin");
var litecoin_1 = require("./UTXO/litecoin");
var dogecoin_1 = require("./UTXO/dogecoin");
var bitcoincash_1 = require("./UTXO/bitcoincash");
var cardano_1 = require("./UTXO/cardano");
var thorchain_1 = require("./thorchain/thorchain");
var ripple_1 = require("./ripple/ripple");
var ton_1 = require("./ton/ton");
// Export all UTXO tools registration function
function registerUtxoTools(server) {
    (0, bitcoin_1.registerBitcoinTools)(server);
    (0, litecoin_1.registerLitecoinTools)(server);
    (0, dogecoin_1.registerDogecoinTools)(server);
    (0, bitcoincash_1.registerBitcoinCashTools)(server);
    (0, cardano_1.registerCardanoTools)(server);
}
// Export all tools registration function
function registerAllTools(server) {
    registerUtxoTools(server);
    (0, thorchain_1.registerThorchainTools)(server);
    (0, ripple_1.registerRippleTools)(server);
    (0, ton_1.registerTonTools)(server);
}

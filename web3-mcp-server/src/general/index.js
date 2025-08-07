"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGeneralTools = registerGeneralTools;
var coingecko_js_1 = require("./coingecko.js");
var rubic_js_1 = require("./rubic.js");
function registerGeneralTools(server) {
    (0, coingecko_js_1.registerCoinGeckoTools)(server);
    (0, rubic_js_1.registerRubicTools)(server);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "extends": "./tsconfig.json",
    "exclude": [
        "node_modules/**/*",
        "**/*.test.ts",
        "**/*.spec.ts"
    ],
    "compilerOptions": {
        "skipLibCheck": false,
        "noEmit": false
    }
};

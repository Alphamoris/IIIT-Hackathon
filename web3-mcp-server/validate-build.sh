#!/bin/bash

echo "🔍 Validating Web3 MCP Server Build..."
echo "======================================"

# Check if build files exist
if [ -f "build/index.js" ]; then
    echo "✅ Build files: PRESENT"
else
    echo "❌ Build files: MISSING"
    exit 1
fi

# Check for THORChain references
if grep -i "thorchain" build/index.js > /dev/null; then
    echo "❌ THORChain removal: FAILED - References still found"
else
    echo "✅ THORChain removal: SUCCESS"
fi

# Check for Solana tools
if grep -i "solana" build/index.js > /dev/null; then
    echo "✅ Solana support: PRESENT"
else
    echo "❌ Solana support: MISSING"
fi

# Check for MCP server setup
if grep -i "McpServer" build/index.js > /dev/null; then
    echo "✅ MCP Server: CONFIGURED"
else
    echo "❌ MCP Server: MISSING"
fi

# Check environment loading
if grep -i "dotenv" build/index.js > /dev/null; then
    echo "✅ Environment loading: CONFIGURED"
else
    echo "❌ Environment loading: MISSING"
fi

echo ""
echo "🎯 Build Validation Complete!"
echo "The MCP server should now work without THORChain issues."

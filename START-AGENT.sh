#!/bin/bash

# 🚀 Aya AI Hackathon - Start SolanaGenie Agent
echo "🎯 Starting SolanaGenie for Aya AI Hackathon..."
echo "📁 Project: /home/alpha-45/aya-hackathon-project/"
echo ""

# Ensure we're in the right directory
cd /home/alpha-45/aya-hackathon-project/elizaos-agent

# Check if character file exists
if [ ! -f "characters/genie.character.json" ]; then
    echo "❌ Character file not found!"
    exit 1
fi

# Check if Web3 MCP server is built
if [ ! -f "../web3-mcp-server/build/index.js" ]; then
    echo "❌ Web3 MCP server not built! Run: cd ../web3-mcp-server && npm run build"
    exit 1
fi

echo "✅ All files ready!"
echo "🔧 Starting elizaOS with Web3 MCP integration..."
echo ""

# Start the agent
npx elizaos start --character characters/genie.character.json

echo ""
echo "🎉 SolanaGenie agent started successfully!"
echo "💡 Try these commands:"
echo "  - 'What can you help me with?'"
echo "  - 'What's my Solana address?'"  
echo "  - 'Help me swap SOL to USDC'"
echo "  - 'Set up crypto payments on my website'"


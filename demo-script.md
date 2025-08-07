# 🎯 Aya AI Hackathon Demo Script - SolanaGenie

## 🚀 Project Overview
**SolanaGenie** - An AI-powered multi-chain DeFi assistant that enables natural language cryptocurrency operations through elizaOS + Web3 MCP integration.

## 🎥 Demo Flow (5-minute presentation)

### 1. Introduction (30 seconds)
```
"Hi! I'm presenting SolanaGenie - an AI agent that democratizes DeFi by enabling 
anyone to perform complex blockchain operations through simple conversations.

Built with elizaOS framework and integrates the Strangelove Web3 MCP server 
for multi-chain blockchain interactions."
```

### 2. Architecture Overview (60 seconds)
```
"Our architecture combines:
• elizaOS - AI agent framework with Comput3 Llama 3 70B models
• Web3 MCP Server - Multi-blockchain RPC interface
• Focus on Solana ecosystem with cross-chain capabilities
• Universal crypto payment hooks for Web2/Web3 bridging"
```

### 3. Live Demo Commands (3 minutes)

#### Command 1: Check Balance
```
User: "What's my Solana wallet balance?"
Expected: Agent shows SOL balance + SPL token breakdown
```

#### Command 2: Token Swap
```
User: "Swap 0.1 SOL to USDC"
Expected: Agent uses Jupiter aggregator for optimal routing
```

#### Command 3: Payment Hook Creation
```
User: "Help me set up crypto payments on my website"
Expected: Agent provides integration code and webhook setup
```

#### Command 4: Cross-chain Operation
```
User: "Send 10 USDC from Ethereum to Solana"
Expected: Agent demonstrates cross-chain transfer capability
```

### 4. Technical Highlights (30 seconds)
```
"Key innovations:
• Natural language to blockchain operations
• Multi-chain support (Solana, Ethereum, Base, Arbitrum)
• Real-time price optimization via Jupiter
• Universal payment hooks for any website
• Enterprise-ready with proper security practices"
```

### 5. Hackathon Requirements Met (30 seconds)
```
"✅ Built on elizaOS framework
✅ Uses Comput3 AI infrastructure  
✅ Focuses on Solana ecosystem
✅ Implements crypto payment hooks (mandatory feature)
✅ Integrates all required platforms
✅ Production-ready architecture"
```

## 🔧 Pre-Demo Setup Checklist

### Before Demo Day:
- [ ] elizaOS built and tested
- [ ] Web3-MCP server configured and running
- [ ] Test wallets funded with small amounts
- [ ] Character configuration verified
- [ ] Demo commands practiced and working
- [ ] Backup responses prepared for any failures
- [ ] Video recording of working demo (backup)

### Environment Variables Required:
```bash
# In web3-mcp-server/.env
ENABLE_SOLANA_TOOLS=true
ENABLE_ETHEREUM_TOOLS=true
SOLANA_PRIVATE_KEY=your_test_key_here
ETH_PRIVATE_KEY=your_test_key_here

# In elizaos-agent/.env  
OPENAI_API_KEY=c3_api_Mn0tzOhZSQtu1egGZmlozkDv
OPENAI_API_URL=https://api.comput3.ai/v1
```

## 🎬 Demo Commands Script

### Start Command:
```bash
cd /home/alpha-45/aya-hackathon-project/elizaos-agent
bun run start --characters=characters/genie.character.json
```

### Test Commands (in order):
1. "Hello! What can you help me with?"
2. "What's my Solana address?"
3. "Check my wallet balance"
4. "What's the current price of SOL?"
5. "Help me swap 0.01 SOL to USDC"
6. "I want to accept crypto payments on my website"
7. "Show me how to send USDC from Ethereum to Solana"

### Expected Responses:
- Professional, informative responses about DeFi operations
- Clear step-by-step instructions for complex operations
- Risk warnings and security best practices
- Actual blockchain data when available

## 🚨 Troubleshooting

### If MCP connection fails:
```bash
cd /home/alpha-45/aya-hackathon-project/web3-mcp-server
node build/index.js --help
```

### If elizaOS won't start:
```bash
cd /home/alpha-45/aya-hackathon-project/elizaos-agent
bun install
bun run build
```

### If character doesn't load:
- Check JSON syntax in genie.character.json
- Verify absolute paths are correct
- Check .env file exists and has correct variables

## 🏆 Winning Strategy

### Judge Appeal Points:
1. **Innovation**: Natural language DeFi operations
2. **Technical Excellence**: Proper elizaOS + MCP integration  
3. **Real-world Utility**: Solves actual DeFi accessibility problems
4. **Cross-chain Support**: Works across multiple blockchains
5. **Production Ready**: Follows security best practices

### Prize Categories to Target:
- **Main Aya Prize**: Complete elizaOS integration
- **Solana Track**: Primary focus on Solana ecosystem
- **Innovation Prize**: Novel approach to DeFi accessibility

## 📱 Backup Demo

If live demo fails, have ready:
1. Pre-recorded video of working system
2. Screenshots of successful transactions
3. Code walkthrough of key integrations
4. Architecture diagrams

## 🎉 Closing

"SolanaGenie represents the future of DeFi - where anyone can perform 
complex blockchain operations through simple conversations. 

By combining elizaOS's powerful AI framework with comprehensive 
blockchain integration, we're making DeFi accessible to everyone.

Thank you for your time, and we're excited to bring this to production!"


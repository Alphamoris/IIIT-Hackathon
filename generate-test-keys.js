#!/usr/bin/env node

// Generate test keys for hackathon demo
const { Keypair } = require('@solana/web3.js');
const { ethers } = require('ethers');
const bs58 = require('bs58');

console.log('🔑 Generating Test Wallet Keys for Hackathon Demo\n');
console.log('⚠️  IMPORTANT: Use only for testing with small amounts!\n');

// Generate Solana test wallet
console.log('=== SOLANA WALLET ===');
const solanaKeypair = Keypair.generate();
const solanaPrivateKeyBase58 = bs58.encode(solanaKeypair.secretKey);

console.log('Solana Public Key:', solanaKeypair.publicKey.toString());
console.log('Solana Private Key (base58):', solanaPrivateKeyBase58);
console.log('Add to web3-mcp-server/.env: SOLANA_PRIVATE_KEY=' + solanaPrivateKeyBase58);
console.log();

// Generate Ethereum test wallet  
console.log('=== ETHEREUM WALLET ===');
const ethWallet = ethers.Wallet.createRandom();

console.log('Ethereum Address:', ethWallet.address);
console.log('Ethereum Private Key:', ethWallet.privateKey);
console.log('Add to web3-mcp-server/.env: ETH_PRIVATE_KEY=' + ethWallet.privateKey);
console.log();

console.log('🎯 Quick Setup Commands:');
console.log(`echo 'SOLANA_PRIVATE_KEY=${solanaPrivateKeyBase58}' >> /home/alpha-45/aya-hackathon-project/web3-mcp-server/.env`);
console.log(`echo 'ETH_PRIVATE_KEY=${ethWallet.privateKey}' >> /home/alpha-45/aya-hackathon-project/web3-mcp-server/.env`);
console.log();
console.log('💰 Fund these addresses with small test amounts from faucets:');
console.log('- Solana Devnet: https://faucet.solana.com/');
console.log('- Ethereum Sepolia: https://sepoliafaucet.com/');


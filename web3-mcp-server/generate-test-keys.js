#!/usr/bin/env node
// Enhanced test key generator for hackathon demo with auto-funding
import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

console.log('🔑 Generating Test Wallet Keys for Hackathon Demo\n');
console.log('⚠️  IMPORTANT: Use only for testing with small amounts!\n');

// Solana connection for devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Function to request Solana devnet airdrop
async function requestSolanaAirdrop(publicKey) {
    try {
        console.log('💰 Requesting Solana devnet airdrop...');
        
        // Request 2 SOL from devnet faucet
        const airdropSignature = await connection.requestAirdrop(
            publicKey, 
            2 * LAMPORTS_PER_SOL
        );
        
        // Wait for confirmation
        await connection.confirmTransaction(airdropSignature);
        
        // Check balance
        const balance = await connection.getBalance(publicKey);
        console.log(`✅ Airdrop successful! Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
        
        return true;
    } catch (error) {
        console.log(`❌ Airdrop failed: ${error.message}`);
        console.log('💡 You can manually fund at: https://faucet.solana.com/');
        return false;
    }
}

async function main() {
    try {
        // Generate Solana test wallet
        console.log('=== SOLANA WALLET ===');
        const solanaKeypair = Keypair.generate();
        const solanaPrivateKeyBase58 = bs58.encode(solanaKeypair.secretKey);
        
        console.log('Solana Public Key:', solanaKeypair.publicKey.toString());
        console.log('Solana Private Key (base58):', solanaPrivateKeyBase58);
        console.log('Add to web3-mcp-server/.env: SOLANA_PRIVATE_KEY=' + solanaPrivateKeyBase58);
        console.log();
        
        // Auto-fund Solana wallet
        await requestSolanaAirdrop(solanaKeypair.publicKey);
        console.log();
        
        // Enhanced setup commands
        console.log('🎯 Quick Setup Commands:');
        console.log('# Add to .env file:');
        console.log(`echo 'SOLANA_PRIVATE_KEY=${solanaPrivateKeyBase58}' >> /home/alpha-45/aya-hackathon-project/web3-mcp-server/.env`);
        console.log();
        
        // Network configurations
        console.log('🌐 Network Configurations:');
        console.log('# Add these to your .env as well:');
        console.log('echo "SOLANA_RPC_URL=https://api.devnet.solana.com" >> /home/alpha-45/aya-hackathon-project/web3-mcp-server/.env');
        console.log();
        
        // Funding information
        console.log('💰 Funding Information:');
        console.log('✅ Solana: Auto-funded with 2 SOL (devnet)');
        console.log();
        
        // Security reminders
        console.log('🔒 Security Reminders:');
        console.log('- These are TEST networks only');
        console.log('- Never use these keys on mainnet');
        console.log('- Store private keys securely');
        console.log('- Add .env to .gitignore');
        console.log();
        
        // Quick verification commands
        console.log('🔍 Quick Verification Commands:');
        console.log('# Check Solana balance:');
        console.log(`solana balance ${solanaKeypair.publicKey.toString()} --url devnet`);
        
    } catch (error) {
        console.error('❌ Error during wallet generation:', error);
        process.exit(1);
    }
}

// Run the main function
main().then(() => {
    console.log('\n🎉 Wallet generation complete!');
}).catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
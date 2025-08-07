#!/bin/bash

# Test elizaOS model connection
echo "🧠 Testing elizaOS Model Connection..."
echo "📁 Project: /home/alpha-45/aya-hackathon-project/"
echo ""

cd /home/alpha-45/aya-hackathon-project/elizaos-agent

# Check if environment variables are set
echo "🔍 Checking environment configuration..."
if grep -q "OPENAI_API_KEY" .env; then
    echo "✅ OPENAI_API_KEY found in .env"
else
    echo "❌ OPENAI_API_KEY missing - adding now..."
    echo "OPENAI_API_KEY=c3_api_Mn0tzOhZSQtu1egGZmlozkDv" >> .env
fi

if grep -q "OPENAI_API_URL" .env; then
    echo "✅ OPENAI_API_URL found in .env"
else
    echo "❌ OPENAI_API_URL missing - adding now..."
    echo "OPENAI_API_URL=https://api.comput3.ai/v1" >> .env
fi

echo ""
echo "🚀 Starting elizaOS with model connection..."
echo "💡 If this works, you should see model initialization messages"
echo ""

# Test the connection with a 30-second timeout
timeout 30s npx elizaos start --character characters/genie.character.json

echo ""
echo "🎯 If elizaOS started without errors, your model connection is working!"
echo "🎪 Ready for hackathon demo!"


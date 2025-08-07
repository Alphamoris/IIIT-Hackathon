import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCoinGeckoTools } from "./coingecko.js";
import { registerRubicTools } from "./rubic.js";

export function registerGeneralTools(server: McpServer) {
  console.error('Starting to register CoinGecko tools...');
  try {
    registerCoinGeckoTools(server);
    console.error('Successfully registered CoinGecko tools!');
  } catch (error) {
    console.error('Error registering CoinGecko tools:', error);
    throw error;
  }

  console.error('Starting to register Rubic tools...');
  try {
    registerRubicTools(server);
    console.error('Successfully registered Rubic tools!');
  } catch (error) {
    console.error('Error registering Rubic tools:', error);
    throw error;
  }
  
  console.error('All general tools registered successfully!');
}
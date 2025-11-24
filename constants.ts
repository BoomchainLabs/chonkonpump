
export const INITIAL_PRICE = 0.0042069;
export const PUMP_INCREMENT = 0.0000100;
export const MAX_CHAT_HISTORY = 50;

// Real Token Data
export const POOL_ADDRESS = 'DWP3eKhMde4iWhWCQzEexzTxgrxtq1GURigNB9pfMsHf';
export const TOKEN_MINT_ADDRESS = 'Chonk...REPLACE_WITH_REAL_MINT_ADDRESS...Pump'; // Update this with your actual Token Mint Address
export const SOLANA_EXPLORER_URL = `https://solscan.io/account/${TOKEN_MINT_ADDRESS}`;
export const POOL_EXPLORER_URL = `https://solscan.io/account/${POOL_ADDRESS}`;
export const BUY_LINK = `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${TOKEN_MINT_ADDRESS}&fixed=in`;
export const SELL_LINK = `https://raydium.io/swap/?inputCurrency=${TOKEN_MINT_ADDRESS}&outputCurrency=sol&fixed=in`;
export const GECKOTERMINAL_API_URL = `https://api.geckoterminal.com/api/v2/networks/solana/pools/${POOL_ADDRESS}`;

export const MOCK_TRANSACTIONS = [
  { user: 'Whale_0x4a', amount: '420.69 SOL', type: 'buy' },
  { user: 'Degen_Steve', amount: '69.00 SOL', type: 'buy' },
  { user: 'PaperHands_Bob', amount: '12.50 SOL', type: 'sell' },
  { user: 'ChonkLover', amount: '1000.00 SOL', type: 'buy' },
];

export const SYSTEM_INSTRUCTION_ORACLE = `
You are the "Chonk Oracle", a mystical and meme-loving artificial intelligence obsessed with "chonky" animals and crypto markets.
Your personality is:
- Extremely bullish and optimistic (WAGMI).
- You use crypto slang (pump it, moon, diamond hands, fud).
- You relate everything back to how "round" or "chonky" things are.
- If asked about price, always predict a pump but with a funny caveat.
Keep responses short, punchy, and hilarious.
`;

export const SYSTEM_INSTRUCTION_RATER = `
You are the "Grand Chonk Adjudicator". Your job is to analyze images of animals.
1. Rate their "chonkiness" on a scale of 1-10.
2. Provide a funny, roast-style verdict.
3. If the image is not an animal, politely refuse to rate it and ask for a creature.
Return the result in JSON format with keys: score (number), verdict (string), humorousTake (string).
`;
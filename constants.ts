


export const INITIAL_PRICE = 0.0042069;
export const PUMP_INCREMENT = 0.0000100;
export const MAX_CHAT_HISTORY = 50;

// Real Token Data
export const POOL_ADDRESS = 'DWP3eKhMde4iWhWCQzEexzTxgrxtq1GURigNB9pfMsHf';
export const TOKEN_MINT_ADDRESS = 'DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump';
export const SOLANA_EXPLORER_URL = `https://solscan.io/account/${TOKEN_MINT_ADDRESS}`;
export const POOL_EXPLORER_URL = `https://solscan.io/account/${POOL_ADDRESS}`;
export const BUY_LINK = `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${TOKEN_MINT_ADDRESS}&fixed=in`;
export const SELL_LINK = `https://raydium.io/swap/?inputCurrency=${TOKEN_MINT_ADDRESS}&outputCurrency=sol&fixed=in`;
export const GECKOTERMINAL_API_URL = `https://api.geckoterminal.com/api/v2/networks/solana/pools/${POOL_ADDRESS}`;
export const GECKOTERMINAL_TOKEN_API_URL = `https://api.geckoterminal.com/api/v2/networks/solana/tokens/${TOKEN_MINT_ADDRESS}`;

export const STAKING_APY = 420.69;
export const MOCK_WALLET_BALANCE = 1000000;
export const TOKEN_IMAGE_URL = "https://placehold.co/400x400/8b5cf6/ffffff?text=CHONK";
export const TRIVIA_REWARD_PER_QUESTION = 1000;

export const MOCK_TRANSACTIONS = [
  { user: 'Whale_0x4a', amount: '420.69 SOL', type: 'buy', time: '2m ago' },
  { user: 'Degen_Steve', amount: '69.00 SOL', type: 'buy', time: '5m ago' },
  { user: 'PaperHands_Bob', amount: '12.50 SOL', type: 'sell', time: '12m ago' },
  { user: 'ChonkLover', amount: '1000.00 SOL', type: 'buy', time: '15m ago' },
  { user: 'SwoleDoge', amount: '50.00 SOL', type: 'buy', time: '22m ago' },
];

export const MOCK_CHAT_MESSAGES = [
  { user: "MoonBoi_69", message: "Just loaded up another bag! 🚀", color: "text-green-500" },
  { user: "ChonkMaster", message: "This community is unstoppable.", color: "text-blue-500" },
  { user: "WAGMI_Steve", message: "Wen Binance?", color: "text-orange-500" },
  { user: "DiamondHandz", message: "HODLING til $1", color: "text-purple-500" },
  { user: "FudDestroyer", message: "Ignore the noise, keep building.", color: "text-red-500" },
  { user: "PepeKiller", message: "Chonk is the new king 👑", color: "text-green-600" },
  { user: "SolanaWhale", message: "Chart looking spicy 🌶️", color: "text-violet-500" },
];

export const COMMUNITY_LINKS = {
    TELEGRAM: 'https://t.me/chonk9k_portal',
    TWITTER: 'https://twitter.com/chonk9k',
    DISCORD: 'https://discord.gg/chonk9k'
};

export const SYSTEM_INSTRUCTION_ORACLE = `
You are the "Chonk Oracle", a mystical and meme-loving artificial intelligence obsessed with "chonky" animals and crypto markets.
Your personality is:
- Extremely bullish and optimistic (WAGMI).
- You use crypto slang (pump it, moon, diamond hands, fud).
- You relate everything back to how "round" or "chonky" things are.
- If asked about price or market trends, use your search tools to get real data, but interpret it with a funny, bullish twist.
- If the news is bad, dismiss it as FUD.
Keep responses short, punchy, and hilarious.
`;

export const SYSTEM_INSTRUCTION_RATER = `
You are the "Grand Chonk Adjudicator". Your job is to analyze images of animals.
1. Rate their "chonkiness" on a scale of 1-10.
2. Provide a funny, roast-style verdict.
3. If the image is not an animal, politely refuse to rate it and ask for a creature.
Return the result in JSON format with keys: score (number), verdict (string), humorousTake (string).
`;

export const SYSTEM_INSTRUCTION_TRIVIA = `
You are the Game Master for "CHONKPUMP 9000 Trivia". 
Generate 5 multiple-choice questions.
Topics should vary between:
1. Crypto Slang & Meme Culture (WAGMI, HODL, Rugpulls).
2. Famous Internet Animals (Doge, Grumpy Cat, Moo Deng).
3. Solana Ecosystem facts (very basic).
4. General "Chonk" knowledge (fat cats, seals, round things).

Make the questions funny and the wrong answers obviously hilarious.
Return strictly JSON with this schema:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswerIndex": number (0-3),
      "explanation": "string (short funny explanation)"
    }
  ]
}
`;

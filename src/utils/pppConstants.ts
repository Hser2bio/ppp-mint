const debug = process.env.NEXT_PUBLIC_DEBUG?.toString() === 'true';
export const DEBUG = debug;
const network = process.env.NEXT_PUBLIC_NETWORK ? process.env.NEXT_PUBLIC_NETWORK : 'devnet';
export const NETWORK = network;
const url = process.env.NEXT_PUBLIC_URL ? process.env.NEXT_PUBLIC_URL : 'metaplex.devnet.rpcpool.com';
export const RPCPOOL_URL = url

const devFake = process.env.NEXT_PUBLIC_DEV_USE_FAKE_LOCAL_ENDPOINT?.toString() === 'true';
export const DEV_USE_FAKE_LOCAL_ENDPOINT = devFake;
const fakeTotal = parseInt(process.env.NEXT_PUBLIC_DEV_PAL_FAKE_TOTAL ? process.env.NEXT_PUBLIC_DEV_PAL_FAKE_TOTAL : '0');
export const DEV_PAL_FAKE_TOTAL = fakeTotal;

const candyMachine = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID ? process.env.NEXT_PUBLIC_CANDY_MACHINE_ID : '';
export const NEXT_PUBLIC_CANDY_MACHINE_ID = candyMachine;

const creator = process.env.NEXT_PUBLIC_CREATOR ? process.env.NEXT_PUBLIC_CREATOR : '';
export const CREATOR = creator;

const treasury = process.env.NEXT_PUBLIC_TREASURY ? process.env.NEXT_PUBLIC_TREASURY : '';
export const TREASURY = treasury;

const countsHdr = process.env.NEXT_PUBLIC_CANDY_MACHINE_COUNTS_HEADER ? process.env.NEXT_PUBLIC_CANDY_MACHINE_COUNTS_HEADER : 'Counts';
export const CANDY_MACHINE_COUNTS_HDR = countsHdr;

const showCounts = process.env.NEXT_PUBLIC_SHOW_CANDY_MACHINE_COUNTS_THRESHOLD ? parseInt(process.env.NEXT_PUBLIC_SHOW_CANDY_MACHINE_COUNTS_THRESHOLD, 10) : -1;
export const SHOW_CANDY_MACHINE_COUNTS_THRESHOLD = showCounts;

export const MSG_MINT_ALL_ITEMS = 'All Pals have been minted! There are no more available to mint but you can try to purchase one on the secondary market.';
export const MSG_MINT_BEFORE_START = 'Minting is not yet live.';
export const MSG_MINT_AFTER_END = 'The minting period is over.';
export const MSG_MINT_ADDRESS_GATE_NO_CROSSMINT = 'We have temporarily disabled minting by credit card. Contact us or check back soon when minting by credit card is reopened.'
export const MSG_MINT_ADDRESS_GATE = 'You are not allowed to mint because an "address gate" restriction was placed on the candy machine. Contact us or check back soon when minting is reopened.';
export const MSG_MINT_MINT_LIMIT = 'You have reached the mint limit.';
export const MSG_MINT_SOL_MIN = 'You need more SOL in your wallet.';
export const MSG_MINT_FREEZE_SOL_MIN = 'You need more freeze SOL.';
export const MSG_MINT_SUCCESS = 'Mint was successful!';

export const COST_IN_SOL = process.env.NEXT_PUBLIC_COST_IN_SOL ? process.env.NEXT_PUBLIC_COST_IN_SOL : "2.36";
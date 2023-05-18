This is the minting page for Porcupine Playground Pals NFT Collection on Solana using 
the Metaplex Candy Machine v3 - Account v2, which allows pNFTs to protect royalties to creators on secondary sales.

A lot of the code came from https://github.com/MarkSackerberg/mpl-candy-machine/tree/example-CM-mint/examples/js/ui-create-nft

This includes the solPayment guard and showing the number of items minted and remaining.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
# This UI works with a collection deployed using sugar 2.1.1
Reference https://docs.metaplex.com/programs/candy-machine/how-to-guides/my-first-candy-machine-part1
sugar config create
sugar validate
sugar upload
sugar deploy
sugar verify
sugar mint (to test)
sugar guard add (after setting solPayment and botTax guards to config)
sugar config set -t pnft (i wish i had done this before minting; Ones minted after this change will show tokenStandard: 4 (which is pnft))

# Install dependencies.
```bash
yarn add @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/umi-signer-wallet-adapters \
  @metaplex-foundation/mpl-candy-machine@alpha \
  @metaplex-foundation/mpl-token-metadata@alpha \
  @solana/web3.js \
  @solana/wallet-adapter-base \
  @solana/wallet-adapter-react \
  @solana/wallet-adapter-react-ui \
  @solana/wallet-adapter-wallets
```

# Create .env file
Copy sample.env as .env

# Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Dosis, a custom Google Font.

## The production mainnet-beta version is deployed on Vercel
[https://mint.porcupineplaygroundpals.com/](https://mint.porcupineplaygroundpals.com/)

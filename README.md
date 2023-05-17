This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

# Install dependencies.
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

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This is the minting page for Porcupine Playground Pals NFT Collection on Solana using 
the Metaplex Candy Machine v3 - Account v2, which allows pNFTs to protect royalties to creators on secondary sales.

It was originally cloned from https://github.com/MarkSackerberg/mpl-candy-machine/tree/example-CM-mint/examples/js/ui-create-nft

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Dosis, a custom Google Font.

## The production mainnet-beta version is deployed on Vercel
[https://mint.porcupineplaygroundpals.com/](https://mint.porcupineplaygroundpals.com/)

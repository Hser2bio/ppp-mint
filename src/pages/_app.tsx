import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import type { AppProps } from "next/app";
import { useMemo } from "react";
import { UmiProvider } from "../context/UmiProvider";

import "@/styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  //TODO: Use network and endpoint from .env
  const network = WalletAdapterNetwork.Devnet;
  // const endpoint = "https://api.devnet.solana.com";
  // const endpoint = "https://rpc.ankr.com/solana_devnet";
  const endpoint = "https://metaplex.devnet.rpcpool.com";
  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <UmiProvider endpoint={endpoint}>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </UmiProvider>
    </WalletProvider>
  );
}

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
import * as PPPConstants from "../utils/pppConstants";
import { debug } from "@/utils/pppUtils";

export default function App({ Component, pageProps }: AppProps) {
  
  const network = PPPConstants.NETWORK === 'devnet' ? WalletAdapterNetwork.Devnet :
    PPPConstants.NETWORK === 'testnet' ? WalletAdapterNetwork.Testnet :
    WalletAdapterNetwork.Mainnet;

  const endpoint = `https://${PPPConstants.RPCPOOL_URL}`;

  debug(`${network} - ${endpoint}`);
  
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

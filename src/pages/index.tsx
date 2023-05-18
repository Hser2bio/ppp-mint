import {
  base58PublicKey,
  generateSigner,
  Option,
  PublicKey,
  publicKey,
  SolAmount,
  some,
  transactionBuilder,
  unwrapSome
} from "@metaplex-foundation/umi";
import { fetchDigitalAsset, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { Dosis } from "next/font/google";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";
import { useUmi } from "../context/useUmi";
import { fetchCandyMachine, mintV2, safeFetchCandyGuard, DefaultGuardSetMintArgs, DefaultGuardSet, SolPayment, CandyMachine, CandyGuard } from "@metaplex-foundation/mpl-candy-machine"
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials';
import * as PPPConstants from "@/utils/pppConstants";

import styles from "@/styles/Home.module.css";
import { debug, lamportsToSol } from "@/utils/pppUtils";
import Layout from "@/components/layout";
import PPPNavbar from "@/components/PPPNavbar";
import PPPPageTitle from "@/components/PPPPageTitle";
import Image from 'next/image';

// import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";

const dosis = Dosis({ 
  weight: '400',
  subsets: ['latin'] 
});


const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);


export default function Home() {
  const wallet = useWallet();
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const [mintCreated, setMintCreated] = useState<PublicKey | null>(null);
  const [mintMsg, setMintMsg] = useState<string>();
  const [costInSol, setCostInSol] = useState<string>(PPPConstants.COST_IN_SOL);
  const [cmv3v2, setCandyMachine] = useState<CandyMachine>();
  const [defaultCandyGuardSet, setDefaultCandyGuardSet] = useState<CandyGuard<DefaultGuardSet>>();
  const [countTotal, setCountTotal] = useState<number>();
  const [countRemaining, setCountRemaining] = useState<number>();
  const [countMinted, setCountMinted] = useState<number>();
  const [mintDisabled, setMintDisabled] = useState<boolean>(true);

  const postToMintLog = (mintAddress: string) => {
    debug('postToMintLong: mint success! mintAddress: ' + mintAddress);
    // setMintedPal(nft);

    const payload = {
      mintAddress: mintAddress,
      pppName: `TBA${PPPConstants.NETWORK === 'devnet' ? ' (devnet)' : ''}`
    };
    // write to log
    fetch('https://porcupineplaygroundpals.com/mintlog/minted.php', {
      method: 'POST',
      body: JSON.stringify(payload)
    }).then((response: Response) => {
      // don't need to do anything with response but we will debug log it for sanity check
      debug('postToMintLog fetched');
      debug(response);
    }).catch(err => {
      // may as well log
      debug('postToMintLog did not fetch');
      debug(err.message);
    }); 

    // reset counts retrieveAvailability() should be called because dependency is on mintedPal
    // but if it couldn't be retrieved or something, then just call it outright
    retrieveAvailability();
  };

  const retrieveAvailability = async () => {
    const candyMachine: CandyMachine = await fetchCandyMachine(umi, publicKey(PPPConstants.NEXT_PUBLIC_CANDY_MACHINE_ID))
    setCandyMachine(candyMachine);

    // Get counts
    setCountTotal(candyMachine.itemsLoaded);
    setCountMinted(Number(candyMachine.itemsRedeemed));
    const remaining = candyMachine.itemsLoaded - Number(candyMachine.itemsRedeemed)
    setCountRemaining(remaining);
    
    // Get cost
    const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
    if (candyGuard) {
      setDefaultCandyGuardSet(candyGuard);
    }
    const defaultGuards: DefaultGuardSet | undefined = candyGuard?.guards;
    const solPaymentGuard: Option<SolPayment> | undefined = defaultGuards?.solPayment;

    if (solPaymentGuard) {
      const solPayment: SolPayment | null  = unwrapSome(solPaymentGuard);
      if (solPayment) {
        const lamports: SolAmount = solPayment.lamports;
        debug("lamports.basisPoints = " + lamports.basisPoints);
        const solCost = lamportsToSol(Number(lamports.basisPoints));
        setCostInSol('' + solCost);
      }
    }

    //TODO check wallet balance

    if (remaining > 0) {
      setMintDisabled(false);
    }
  };

  useEffect(() => {
    retrieveAvailability();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!cmv3v2 || !defaultCandyGuardSet) {
      setMintMsg("There was an error fetching the candy machine. Try refreshing your browser window.");
      return;
    }
    setLoading(true);
    setMintMsg(undefined);

    try {
      const candyMachine = cmv3v2;
      const candyGuard = defaultCandyGuardSet;

      const nftSigner = generateSigner(umi);
      
      const mintArgs: Partial<DefaultGuardSetMintArgs> = {};

      // solPayment has mintArgs
      const defaultGuards: DefaultGuardSet | undefined = candyGuard?.guards;
      const solPaymentGuard: Option<SolPayment> | undefined = defaultGuards?.solPayment;
      if (solPaymentGuard) {
        const solPayment: SolPayment | null  = unwrapSome(solPaymentGuard);
        if (solPayment) {
          const treasury = solPayment.destination;

          mintArgs.solPayment = some({
            destination: treasury
          });
        }
      }
      
      const tx = transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 600_000 }))
        .add(mintV2(umi, {
          candyMachine: candyMachine.publicKey,
          collectionMint: candyMachine.collectionMint, 
          collectionUpdateAuthority: candyMachine.authority, 
          nftMint: nftSigner,
          candyGuard: candyGuard?.publicKey,
          mintArgs: mintArgs,
          tokenStandard: TokenStandard.ProgrammableNonFungible
        }))


      const { signature } = await tx.sendAndConfirm(umi, {
        confirm: { commitment: "finalized" }, send: {
          skipPreflight: true,
        },
      });

      const nft = await fetchDigitalAsset(umi, nftSigner.publicKey)
      setMintCreated(nftSigner.publicKey);
      debug("Mint Successful");
      

    } catch (err: any) {
      console.error(err);
      setMintMsg(err.message);
    } finally {
      setLoading(false);

      // does not seem to exist here, so useEffect should get it
      if (mintCreated) {
        postToMintLog(base58PublicKey(mintCreated));
      }
    }
  };

  useEffect(() => {
    if (mintCreated) {
      postToMintLog(base58PublicKey(mintCreated));
    }
  }, [mintCreated])
  
  const MintWithWalletContent = () => {
    const closeMsg = () => {
      setMintMsg(undefined);
    };
  
  
    if (!wallet.connected) {
      return <p>Please connect your wallet to get started.</p>;
    }

    if (loading) {
      return (
        <div className={styles.loading}>
           <img className={styles.loadingIcon} src="/loading.svg" alt="Loading indicator"/>
          <p>Get ready to meet your new Pal<span className="loadingDots">...</span></p>
        </div>
      );
    }

    if (mintCreated) {
      return (
        <>
          <a
            className={styles.success}
            target="_blank"
            href={
              `https://my.porcupineplaygroundpals.com/connect?p=${base58PublicKey(mintCreated)}${PPPConstants.NETWORK === 'devnet' ? '&cluster=devnet' : ''}` 
            }
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="192"
              height="192"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <rect width="256" height="256" fill="none"></rect>
              <polyline
                points="172 104 113.3 160 84 132"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="24"
              ></polyline>
              <circle
                cx="128"
                cy="128"
                r="96"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="24"
              ></circle>
            </svg>
            <div>
              <p>
                <strong>Meet your new Pal</strong> at the following address
              </p>
              <p className="mintAddress">
                <code>{base58PublicKey(mintCreated)}</code>
              </p>
            </div>
          </a>
          <button onClick={() => {window.open('.','_blank');}}>Mint another Pal</button>
      </>
      );
    }
    return (
      <>          
        <form method="post" onSubmit={onSubmit} className={styles.form}>
          <button type="submit" className={styles.mintBtn} disabled={mintDisabled || loading}>
            Buy with wallet ({costInSol} SOL)
          </button>
        </form>
        <div>
          {mintMsg && (
            <div className={styles.msg}>
              <span>{mintMsg}</span>
              <button className={styles.closeBtn} onClick={closeMsg}>&times;</button>
            </div>)} 
        </div>
      </> 
    );
  };

  return (
    <Layout>
      <Head>
        <title>Mint Porcupine Playground Pals</title>
      </Head>
      <PPPNavbar selectedMenu="mint"/>
      
      <PPPPageTitle title="Mint Porcupine Playground Pals" />

      <main className={dosis.className}>
        <div className={styles.container}>
          <div className={styles.instruct}>Approximately $50</div>
          {(PPPConstants.SHOW_CANDY_MACHINE_COUNTS_THRESHOLD < 0 || (countRemaining && countRemaining <= PPPConstants.SHOW_CANDY_MACHINE_COUNTS_THRESHOLD)) && (
            <div className={styles.countsContainer}>
              <h3>{countRemaining && countRemaining >= 1 ? PPPConstants.CANDY_MACHINE_COUNTS_HDR : 'Sold Out!'}</h3>
              <div className={styles.counts}>
              <div><h4>Minted:</h4><h5>{countMinted} / {countTotal}</h5></div>
              <div><h4>Remaining:</h4><h5>{countRemaining}</h5></div>
              </div>
            </div>
          )}

          <Image priority className="preview" src="/preview.gif" width={350} height={350} alt="Porcupine Playground Pals Candy Machine Preview" />
          <div className={styles.container}>
            <div className={styles.wallet}>
              <WalletMultiButtonDynamic />
            </div>

            <div className={styles.container}>
              <MintWithWalletContent />
            </div>
            <div className={styles.container}>
              {/* <CrossmintPayButton
              className="xmintBtn"
              clientId={crossmintClientId}
              environment={crossmintEnv}
              mintConfig={{
                  type: "candy-machine",
                  quantity: 1,
                  mintingGroup: "default"                  
              }}
            /> */}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

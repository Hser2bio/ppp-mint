import {
  base58PublicKey,
  createGenericFileFromBrowserFile,
  generateSigner,
  Umi,
  percentAmount,
  PublicKey,
  publicKey,
  some,
  transactionBuilder
} from "@metaplex-foundation/umi";
import { createNft, fetchDigitalAsset, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { Dosis } from "@next/font/google";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { useUmi } from "../context/useUmi";
import { fetchCandyMachine, mintV2, safeFetchCandyGuard, DefaultGuardSetMintArgs } from "@metaplex-foundation/mpl-candy-machine"
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials';
import * as PPPConstants from "@/utils/pppConstants";

import styles from "@/styles/Home.module.css";
import { debug } from "@/utils/pppUtils";
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

// async function uploadAndCreateNft(umi: Umi, name: string, file: File) {
//   // Ensure input is valid.
//   if (!name) {
//     throw new Error("Please enter a name for your NFT.");
//   }
//   if (!file || file.size === 0) {
//     throw new Error("Please select an image for your NFT.");
//   }

//   // Upload image and JSON data.
//   const imageFile = await createGenericFileFromBrowserFile(file);
//   const [imageUri] = await umi.uploader.upload([imageFile]);
//   const uri = await umi.uploader.uploadJson({
//     name,
//     description: "A test NFT created via Umi.",
//     image: imageUri,
//   });

//   // Create and mint NFT.
//   const mint = generateSigner(umi);
//   const sellerFeeBasisPoints = percentAmount(5.5, 2);
//   await createNft(umi, {
//     mint,
//     name,
//     uri,
//     sellerFeeBasisPoints,
//   }).sendAndConfirm(umi);

//   // Return the mint address.
//   return mint.publicKey;
// }

export default function Home() {
  const wallet = useWallet();
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const [mintCreated, setMintCreated] = useState<PublicKey | null>(null);
  const [mintMsg, setMintMsg] = useState<string>();

  const postToMintLog = (mintAddress: string) => {
    debug('mint success! mintAddress: ' + mintAddress);
    // setMintedPal(nft);

    const payload = {
      mintAddress: mintAddress,
      pppName: 'TBA'
    };
    // write to log
    fetch('https://porcupineplaygroundpals.com/mintlog/minted.php', {
      method: 'POST',
      body: JSON.stringify(payload)
    }).then((response: Response) => {
      // don't need to do anything with response but we will debug log it for sanity check
      debug('post minted success:');
      debug(response);
    }).catch(err => {
      // may as well log
      debug('post minted error:');
      debug(err);
    }); 

    // reset counts retrieveAvailability() should be called because dependency is on mintedPal
    // but if it couldn't be retrieved or something, then just call it outright
    // retrieveAvailability();
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMintMsg(undefined);

    // const formData = new FormData(event.target as HTMLFormElement);
    // const data = Object.fromEntries(formData) as { name: string; image: File };

    try {
      const candyMachine = await fetchCandyMachine(umi, publicKey(PPPConstants.NEXT_PUBLIC_CANDY_MACHINE_ID))

      const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);

      const nftSigner = generateSigner(umi);
      // console.log(nftSigner);
      const mintArgs: Partial<DefaultGuardSetMintArgs> = {
        solPayment: some({
          destination: publicKey(PPPConstants.TREASURY)
        })
      };
      // console.log(mintArgs);
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
      setMintMsg("Mint Successful");
      
      if (mintCreated) {
        postToMintLog(base58PublicKey(mintCreated));
      }

    } catch (err: any) {
      debug(err.message);
      setMintMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const PageContent = () => {
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
          <a
            className={styles.success}
            target="_blank"
            href={
              "https://my.porcupineplaygroundpals.com/connect?p=" +
              base58PublicKey(mintCreated)
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
      );
    }
    return (
      <>          
          <form method="post" onSubmit={onSubmit} className={styles.form}>
        {/* <label className={styles.field}>
          <span>Name</span>
          <input name="name" defaultValue="My NFT" />
        </label>
        <label className={styles.field}>
          <span>Image</span>
          <input name="image" type="file" />
        </label> */}
        <button type="submit" className={styles.mintBtn}>
          Buy with wallet
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
      <title>My Porcupine Playground Pals</title>
    </Head>
    <PPPNavbar selectedMenu="mint"/>
      
      <PPPPageTitle title="Mint Porcupine Playground Pals" />

      <main className={dosis.className}>
        <div className={styles.container}>
          <Image priority className="preview" src="/preview.gif" width={350} height={350} alt="Porcupine Playground Pals Candy Machine Preview" />

          <div className={styles.container}>
            <div className={styles.wallet}>
              <WalletMultiButtonDynamic />
            </div>

            <div className={styles.container}>
              <PageContent />
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

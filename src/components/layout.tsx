import styles from '@/styles/layout.module.css';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import PPPHeader from './PPPHeader';
import PPPNavbar from './PPPNavbar';

export const siteTitle = 'Porcupine Playground Pals Mint';

//@ts-ignore
export default function Layout({ children }) {
    return (<>
    <Head>
        <link rel="icon" href="/logo512.png" />
        <meta
          name="description"
          content="Mint Porcupine Playground Pals"
        />
        
        <meta name="og:title" content={siteTitle} />
    
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    
    </Head>
    
    <PPPHeader/>
    <main>{children}</main>

      
    </>);
}
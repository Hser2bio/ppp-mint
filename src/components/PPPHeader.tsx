import React from 'react';
import Image from 'next/image';
import { Dosis } from '@next/font/google';

const dosis = Dosis({ 
  weight: '800',
  subsets: ['latin'] 
});

const twitter = process.env.NEXT_PUBLIC_SOCIAL_TWITTER;
const discord = process.env.NEXT_PUBLIC_SOCIAL_DISCORD;
const instagram = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM;
const magiceden = process.env.NEXT_PUBLIC_SOCIAL_MAGIC_EDEN;
const opensea = process.env.NEXT_PUBLIC_SOCIAL_OPENSEA;

const PPPHeader = () => {
  return (
    <main className={dosis.className}>
    <div className="headerContainer">
    <a
      className="logoContainer"
      href="https://porcupineplaygroundpals.com/"
      rel="home"
    >
      <Image
        className="logo"
        src="/logo192.png"
        alt="logo"
        width="150"
        height="150"
      />
    </a>
    <h1 className="site-title">
      <a className={dosis.className} href="https://porcupineplaygroundpals.com/" rel="home">
        Porcupine Playground Pals
      </a>
    </h1>
    <div className="socialsContainer">
      <ul>
        {twitter && <li className="social">
          <a
            className="social-link"
            href={twitter}
            target="_blank"
            rel="noopener noreferrer"
            title="Twitter"
          >
            <i className="twitter-logo"></i>
            <span className="screen-reader-text">Twitter</span>
          </a>
        </li>}

        {discord && <li className="social">
          <a
            className="social-link"
            href={discord}
            target="_blank"
            rel="noopener noreferrer"
            title="Discord"
          >
            <i className="discord-logo"></i>
            <span className="screen-reader-text">Discord</span>
          </a>
        </li>}

        {instagram && <li className="social">
          <a
            className="social-link"
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
          >
            <i className="instagram-logo"></i>
            <span className="screen-reader-text">Instagram</span>
          </a>
        </li>}

        {magiceden && <li className="social">
          <a
            className="social-link"
            href={magiceden}
            target="_blank"
            rel="noopener noreferrer"
            title="Magic Eden"
          >
            <i className="magiceden-logo"></i>
            <span className="screen-reader-text">Magic Eden</span>
          </a>
        </li>}

        {opensea && <li className="social">
          <a
            className="social-link"
            href={opensea}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Sea"
          >
            <i className="opensea-logo"></i>
            <span className="screen-reader-text">Open Sea</span>
          </a>
        </li>}
        
        <li className="social">
          <a
            className="social-link last"
            href="https://porcupineplaygroundpals.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            title="Contact Us"
          >
            <i className="contact-us"></i>
            <span className="screen-reader-text">Contact Us</span>
          </a>
        </li>
      </ul>
    </div>
  </div></main>
);
};

export default PPPHeader;

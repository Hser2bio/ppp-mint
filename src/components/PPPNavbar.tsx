import Link from 'next/link';
import React from 'react';
import TypeChecker from 'prop-types';

//@ts-ignore
const PPPNavbar = ({selectedMenu}) => {
  return (
    <div>
      <ul className="menu"> 
        <li>
          <Link className={selectedMenu == "my" ? "selected" : ""} href="https://my.porcupineplaygroundpals.com/"  target="_blank">
            My Pals
          </Link>
        </li>
        <li>
          <Link className={selectedMenu == "connect" ? "selected" : ""}  target="_blank"
            href="https://my.porcupineplaygroundpals.com/connect"
          >
            Connect
          </Link>
        </li>
        <li>
          <Link className={selectedMenu == "mint" ? "selected" : ""} 
            href="/"
          >
            Mint
          </Link>
        </li>
      </ul>
    </div>
  );
};

PPPNavbar.propTypes = {
  selectedMenu: TypeChecker.string.isRequired,
};
export default PPPNavbar;

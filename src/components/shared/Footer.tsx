import Image from 'next/image';
import React from 'react';

const Footer = () => {
  return (
    <div>
      <Image src='/booklogo.png' alt='logo' width={50} height={50} ></Image>
    </div>
  );
};

export default Footer;
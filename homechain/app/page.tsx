"use client";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import {  Client,  Wallet, Request, convertHexToString }  from "xrpl";
import { ethers } from "ethers";
import NFTCard from './components/NFTCard';
import CollectionSearch from './components/CollectionSearch';

const client = new Client("wss://s.altnet.rippletest.net:51233")
const issuerSeed = 'sEdTLkGGQLbow2ydptZRjYvqS3c5Pxe'

const getNFT = async () => {
  let results = '';
  const standby_wallet = Wallet.fromSeed(issuerSeed);

  await client.connect();

  results += '\nConnected. Getting NFTs...';
  const request: Request = {
    command: 'account_nfts',
    account: standby_wallet.classicAddress,
  };

  try {
    const nfts = await client.request(request);
    results += '\nNFTs:\n ' + JSON.stringify(nfts, null, 2);
    console.log(results);

    type NFTData = { name: string; url: string };
    for (const nft of nfts.result.account_nfts) {
      const data: NFTData = JSON.parse(convertHexToString(nft.URI!));
      console.log('data : ', data);
      console.log('url : ', data.url);
      console.log('name : ', data.name);
    }
    // const data: NFTData = JSON.parse(convertHexToString(nfts.result.account_nfts[0].URI!));
    // console.log('data : ', data);
    // console.log('url : ', data.url);
    // console.log('name : ', data.name);
  } catch (err) {
    console.error('Error fetching NFTs:', err);
  } finally {
    client.disconnect();
  }
};


// output:
// Connected. Getting NFTs...
// NFTs:
//  {
//   "id": 2,
//   "result": {
//     "account": "rLeYKKxAcYrvBPvw69AMdHyGEAiZrCGrZu",
//     "account_nfts": [
//       {
//         "Flags": 8,
//         "Issuer": "rLeYKKxAcYrvBPvw69AMdHyGEAiZrCGrZu",
//         "NFTokenID": "000861A8D783EBF762A2BC5020388F906975809BCFBCFB4014018E040003CB69",
//         "NFTokenTaxon": 0,
//         "TransferFee": 25000,
//         "URI": "7B2275726C223A2268747470733A2F2F64726976652E676F6F676C652E636F6D2F66696C652F642F31645469624A6155695761354969617446446830595F75376A4A4C63334E3065482F766965773F7573703D64726976655F6C696E6B222C226E616D65223A226174746573746174696F6E2D64652D70726F70726965CC817465CC812D44323039382E706E67227D",
//         "nft_serial": 248681
//       },
//       {
//         "Flags": 8,
//         "Issuer": "rLeYKKxAcYrvBPvw69AMdHyGEAiZrCGrZu",
//         "NFTokenID": "000861A8D783EBF762A2BC5020388F906975809BCFBCFB40B86A4A000003CB65",
//         "NFTokenTaxon": 0,
//         "TransferFee": 25000,
//         "URI": "68747470733A2F2F64726976652E676F6F676C652E636F6D2F66696C652F642F31645469624A6155695761354969617446446830595F75376A4A4C63334E3065482F766965773F7573703D64726976655F6C696E6B",
//         "nft_serial": 248677
//       },
//       {
//         "Flags": 8,
//         "Issuer": "rLeYKKxAcYrvBPvw69AMdHyGEAiZrCGrZu",
//         "NFTokenID": "000861A8D783EBF762A2BC5020388F906975809BCFBCFB40CF501B010003CB66",
//         "NFTokenTaxon": 0,
//         "TransferFee": 25000,
//         "URI": "68747470733A2F2F64726976652E676F6F676C652E636F6D2F66696C652F642F31645469624A6155695761354969617446446830595F75376A4A4C63334E3065482F766965773F7573703D64726976655F6C696E6B",
//         "nft_serial": 248678
//       },
//       {
//         "Flags": 8,
//         "Issuer": "rLeYKKxAcYrvBPvw69AMdHyGEAiZrCGrZu",
//         "NFTokenID": "000861A8D783EBF762A2BC5020388F906975809BCFBCFB40E635EC020003CB67",
//         "NFTokenTaxon": 0,
//         "TransferFee": 25000,
//         "URI": "68747470733A2F2F64726976652E676F6F676C652E636F6D2F66696C652F642F31645469624A6155695761354969617446446830595F75376A4A4C63334E3065482F766965773F7573703D64726976655F6C696E6B",
//         "nft_serial": 248679
//       },
//       {
//         "Flags": 8,
//         "Issuer": "rLeYKKxAcYrvBPvw69AMdHyGEAiZrCGrZu",
//         "NFTokenID": "000861A8D783EBF762A2BC5020388F906975809BCFBCFB40FD1BBD030003CB68",
//         "NFTokenTaxon": 0,
//         "TransferFee": 25000,
//         "URI": "68747470733A2F2F64726976652E676F6F676C652E636F6D2F66696C652F642F31645469624A6155695761354969617446446830595F75376A4A4C63334E3065482F766965773F7573703D64726976655F6C696E6B",
//         "nft_serial": 248680
//       }
//     ],
//     "ledger_current_index": 390935,
//     "validated": false
//   },
//   "type": "response"
// }
// url :  https://drive.google.com/file/d/1dTibJaUiWa5IiatFDh0Y_u7jJLc3N0eH/view?usp=drive_link
// name :  attestation-de-propriété-D2098.png

export default function Home() {
  React.useEffect(() => {
    getNFT()
  }, [])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}

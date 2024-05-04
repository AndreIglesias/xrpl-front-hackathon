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
  let results = "";
  const standby_wallet = Wallet.fromSeed(issuerSeed);
  await client.connect()
  results += '\nConnected. Getting NFTs...'
  const request: Request = {
      command: "account_nfts",
      account: standby_wallet.classicAddress
    };
  const nfts = await client.request(request)
  results += '\nNFTs:\n ' + JSON.stringify(nfts,null,2)
  console.log(results);
  type NFTData = {name: string, url: string};
  const data: NFTData = JSON.parse(convertHexToString(nfts.result.account_nfts[0].URI!))
  console.log("url : ", data.url);
  console.log("name : ", data.name);
  client.disconnect()
}

export default function Home() {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNFTs = async () => {
    const client = new Client('wss://s.altnet.rippletest.net:51233');
    const standby_wallet = Wallet.fromSeed(issuerSeed);

    try {
      await client.connect();
      const request = {
        command: 'account_nfts',
        account: standby_wallet.classicAddress,
      };

      const response = await client.request(request);
      client.disconnect();

      const nftData = response.result.account_nfts.map((nft) => {
        const uriData = JSON.parse(convertHexToString(nft.URI));
        return {
          id: nft.NFTokenID,
          name: uriData.name,
          imageUrl: uriData.url,
        };
      });

      setNFTs(nftData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setNFTs([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div className="container mx-auto">
      <CollectionSearch searchText={fetchNFTs} />
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
}

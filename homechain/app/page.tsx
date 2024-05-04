"use client";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import {  Client,  Wallet, Request, convertHexToString, TxRequest }  from "xrpl";
import { ethers } from "ethers";
import NFTCard from './components/NFTCard';
import CollectionSearch from './components/CollectionSearch';
//UI
import { styled } from '@mui/material/styles';
import { Button, Box, CircularProgress, Paper, Grid } from '@mui/material';
import NFTIcon from '../public/icons/rent.png';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
//end UI

const client = new Client("wss://s.altnet.rippletest.net:51233")
const clio_client = new Client("wss://clio.altnet.rippletest.net:51233")
const issuerSeed = 'sEd7bBA8ZV6kwTFy4qvuqgRYrTqFdM9'

const getNFTMemo = async (nftTokenId: string, client) => {
  try {
    await client.connect();
    console.log('Fetching memo data for NFT:', nftTokenId)
    const request: Request = {
      command: 'nft_history',
      nft_id: nftTokenId,
    };
    console.log('Request:', request);
    const response = await client.request(request);
    console.log('Response:', response);
    let memo = response.result.transactions[0].tx.Memos[0].Memo.MemoData;
    memo = convertHexToString(memo);
    console.log('Memo:', memo)
    // convert memo to JSON
    memo = JSON.parse(memo);
    return memo;
  } catch (err) {
    return null;
  }
};

const getNFT = async () => {
  let results = '';
  const standby_wallet = Wallet.fromSeed(issuerSeed);

  await client.connect();
  await clio_client.connect();

  results += '\nConnected. Getting NFTs...';
  const request: Request = {
    command: 'account_nfts',
    account: standby_wallet.classicAddress,
  };

  try {
    const nfts = await client.request(request);
    results += '\nNFTs:\n ' + JSON.stringify(nfts, null, 2);
    console.log(results);

    type NFTData = {id: number; ID: string; url: string; floor: number; appartmentId: number; txIds: string[]};
	  let x = 0;
    let NFTs = []

    for (const nft of nfts.result.account_nfts) {
      // create dictionary for each NFT
      let nftData: NFTData = { id: x, ID: '', url: '', floor: 0, appartmentId: 0, txIds: []};
	  x++;
      // get ID
      nftData.ID = nft.NFTokenID;
      console.log('data : ', nft);
      if (nft.URI !== undefined) {
        try {
          // console.log('before url :', convertHexToString(nft.URI!));
          // console.log('url :', JSON.parse(convertHexToString(nft.URI!)).url);
          nftData.url = convertHexToString(nft.URI!);
        } catch (err) {}
      }
      if (nft.NFTokenID !== undefined) {
        let memo = await getNFTMemo(nft.NFTokenID, clio_client);
        console.log(memo);
        // memo is "{"floor":2,"appartmentId":3,"txIds":["1F7FFC85C39390B0B4A71D03B53DFA7D90E5B8902106C09E0D6BA85AF852EFE1","4E7BFC6CBD824DCFCE7D51C643F9E51CC0898309387286631D89B1F3C616F3E8","655294C0191028D6F6F149FE5B0E73FE277481CC38EC107B4266028F9D79F27C"]}"
        if (memo !== null) {
          nftData.floor = memo.floor;
          nftData.appartmentId = memo.appartmentId;
          nftData.txIds = memo.txIds;
        }
      }
      NFTs.push(nftData);
    }
    console.log('NFTs : ', NFTs);
    return NFTs;
  } catch (err) {
    console.error('Error fetching NFTs:', err);
    return null;
  } finally {
    client.disconnect();
  }
};

export default function Home() {
  const [NFTs, setNFTs] = useState([]);
  const [loading, setLoading] = useState(true); // To handle the loading state
  const [selectedNFT, setSelectedNFT] = useState(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      const fetchedNFTs = await getNFT();
      setNFTs(fetchedNFTs);
      setLoading(false); // Set loading to false when data is loaded
    };

    fetchNFTs();
  }, []);


	// Inline styles for the grid
	const styles = {
		gridContainer: {
		  color: '#333',
		  padding: '30px', // Increased padding
		  backgroundColor: '#f8f8f8', // Light gray background color
      height: '100vh',
		},
		grid: {
		  display: 'grid', // Set to grid layout
		  gap: '25px', // Space between grid items
		  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', // Defines columns
		},
		gridItem: {
		  border: '1px solid #ddd', // Light border
		  padding: '15px', // Increased padding
		  backgroundColor: '#ffffff', // White background
		  borderRadius: '10px', // Rounded corners
		  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
		  cursor: 'pointer', // Indicates it's clickable
		  transition: 'transform 0.2s, boxShadow 0.2s', // Smooth transitions
		},
		gridItemHover: {
		  transform: 'translateY(-5px)', // Lift on hover
		  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Increased shadow on hover
		},
		fontBlack: {
		  color: '#333', // Dark gray font color (close to black)
		},
		modal: {
		  position: 'fixed',
		  top: '50%',
		  left: '50%',
		  transform: 'translate(-50%, -50%)', // Centered on screen
		  backgroundColor: 'white',
		  border: '1px solid #ccc',
		  padding: '20px',
		  borderRadius: '10px',
		  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Shadow for depth
		  zIndex: 1000, // Ensures modal stays on top
		},
		overlay: {
		  position: 'fixed',
		  top: 0,
		  left: 0,
		  width: '100%',
		  height: '100%',
		  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
		  zIndex: 999, // Places overlay beneath modal
		},
		header: {
			fontSize: '35px',
			marginBottom: '20px',
		},
		gridItemImage: {
			width: '50px',
			height: '50px',
			marginRight: '15px',
		},
		gridList: {
			alignItems: 'center',
		},
    textEllipsis: {
      whiteSpace: 'nowrap', // Ensures the text stays on one line
      overflow: 'hidden', // Hides text that overflows the container
      textOverflow: 'ellipsis', // Replaces hidden text with '...'
    },
    gridItemContent: {
      padding: '5px', // Adds some padding around the text
    },
  
	  };
	  

	// Modal component that shows the pop-up in the center of the screen
	const Modal = ({ NFT, onClose }) => (
		<>
		  <div
			style={styles.overlay}
			onClick={onClose} // Close modal when overlay is clicked
		  ></div>
		  <div style={styles.modal}>
      <h2><strong>NFTokenID:</strong> {NFT.ID}</h2>
			<p><strong>id:</strong> {NFT.id}</p>
      <p><strong>url:</strong> <a href={NFT.url} style={{color: "blue"}}>{NFT.url}</a></p>
			<p><strong>floor:</strong> {NFT.floor}</p>
			<p><strong>appartmentId:</strong> {NFT.appartmentId}</p>
      <p><strong>txIds:</strong></p>
        {NFT.txIds.join(", ")}
      <br />
      <br />
      <Box sx={{ display: 'flex', width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant="contained" onClick={onClose}>Close</Button>
      </Box>
		  </div>
		</>
	  );

	const handleGridItemClick = (NFT) => {
	  setSelectedNFT(NFT);
	};
  
	const handleCloseModal = () => {
	  setSelectedNFT(null); // Close the modal by setting selectedNFT to null
	};

	return (
		<div style={styles.gridContainer}>
      {/* when loading show Loading else the rest */}
      {loading ? ( 
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
        ) : (
        <>
        <h1 style={styles.header}>Apartment Listing</h1>
        <div style={styles.grid}>
          {NFTs.map((NFT) => (
            <div
              key={NFT.id}
              style={{
                ...styles.gridItem,
                ...(selectedNFT === NFT ? styles.gridItemHover : {}),
              }}
              onClick={() => handleGridItemClick(NFT)}
            >
              <div style={styles.gridList}>
                <Image src={NFTIcon} alt="NFT" style={styles.gridItemImage} />
                <div style={styles.gridItemContent}>
                <div style={styles.textEllipsis}>
                  <strong>ID:</strong> {NFT.ID}
                </div>
                <div style={styles.textEllipsis}>
                  <strong>URL:</strong> {NFT.url}
                </div>
                <div style={styles.textEllipsis}>
                  <strong>Floor:</strong> {NFT.floor}
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
        {selectedNFT && (
          <Modal
            NFT={selectedNFT}
            onClose={handleCloseModal} // Modal with close function
          />
        )}
        </>
      )}
    </div>
	);
}

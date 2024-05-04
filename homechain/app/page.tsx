"use client";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import {  Client,  Wallet, Request, convertHexToString }  from "xrpl";
import { ethers } from "ethers";
import NFTCard from './components/NFTCard';
import CollectionSearch from './components/CollectionSearch';
//UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import apartmentIcon from '../public/icons/rent.png';
//import styles from 'apartment_grid.css';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
//end UI

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
	// Array of apartment objects with country, price, and type
	const apartments = [
		{
		  id: 1,
		  country: 'USA',
		  price: '$1,200',
		  type: 'Studio',
		  description: 'Cozy studio apartment in downtown.',
		  address: '123 Main St, Anytown, USA',
		  features: ['Wi-Fi', 'Air Conditioning', 'Washer/Dryer'],
		},
		{
		  id: 2,
		  country: 'UK',
		  price: '£850',
		  type: 'One-Bedroom',
		  description: 'Modern one-bedroom apartment near the river.',
		  address: '456 Thames Rd, London, UK',
		  features: ['Wi-Fi', 'Heating', 'Balcony'],
		},
		{
		  id: 3,
		  country: 'Canada',
		  price: 'CAD 1,000',
		  type: 'Two-Bedroom',
		  description: 'Spacious two-bedroom apartment in the city center.',
		  address: '789 Queen St, Toronto, Canada',
		  features: ['Parking', 'Elevator', 'Gym'],
		},
		{
		  id: 4,
		  country: 'Australia',
		  price: 'AUD 1,500',
		  type: 'Penthouse',
		  description: 'Luxury penthouse with ocean views.',
		  address: '123 Ocean Ave, Sydney, Australia',
		  features: ['Swimming Pool', 'Balcony', 'Security'],
		},
		{
			id: 4,
			country: 'Thailand',
			price: 'D 1,500',
			type: 'Penthouse',
			description: 'Luxury penthouse with ocean views.',
			address: '123 Ocean Ave, Sydney, Australia',
			features: ['Swimming Pool', 'Balcony', 'Security'],
		},
		{
			id: 5,
			country: 'El Salvador',
			price: 'USD 1,500',
			type: 'Penthouse',
			description: 'Luxury penthouse with ocean views.',
			address: '123 Ocean Ave, Sydney, Australia',
			features: ['Swimming Pool', 'Balcony', 'Security'],
		},
		{
			id: 6,
			country: 'Japan',
			price: 'YEN 1,500',
			type: 'Penthouse',
			description: 'Luxury penthouse with ocean views.',
			address: '123 Ocean Ave, Sydney, Australia',
			features: ['Swimming Pool', 'Balcony', 'Security'],
		},
		{
			id: 7,
			country: 'France',
			price: 'EUR 1,500',
			type: 'Penthouse',
			description: 'Luxury penthouse with ocean views.',
			address: '123 Ocean Ave, Sydney, Australia',
			features: ['Swimming Pool', 'Balcony', 'Security'],
		},
		{
			id: 8,
			country: 'Thailand',
			price: 'AUD 1,500',
			type: 'Penthouse',
			description: 'Luxury penthouse with ocean views.',
			address: '123 Ocean Ave, Sydney, Australia',
			features: ['Swimming Pool', 'Balcony', 'Security'],
		},
	  ];

	// Inline styles for the grid
	const styles = {
		gridContainer: {
		  color: '#333',
		  padding: '30px', // Increased padding
		  backgroundColor: '#f8f8f8', // Light gray background color
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
			display: 'flex', // Flex layout
			alignItems: 'center',
		}
	  };
	  

	// Modal component that shows the pop-up in the center of the screen
	const Modal = ({ apartment, onClose }) => (
		<>
		  <div
			style={styles.overlay}
			onClick={onClose} // Close modal when overlay is clicked
		  ></div>
		  <div style={styles.modal}>
			<h2>{apartment.type} in {apartment.country}</h2>
			<p><strong>Price:</strong> {apartment.price}</p>
			<p><strong>Description:</strong> {apartment.description}</p>
			<p><strong>Address:</strong> {apartment.address}</p>
			<p><strong>Features:</strong> {apartment.features.join(', ')}</p>
			<button onClick={onClose}>Close</button> {/* Close button */}
		  </div>
		</>
	  );

	const [selectedApartment, setSelectedApartment] = useState(null);

	const handleGridItemClick = (apartment) => {
	  setSelectedApartment(apartment);
	};
  
	const handleCloseModal = () => {
	  setSelectedApartment(null); // Close the modal by setting selectedApartment to null
	};

	return (
		<div style={styles.gridContainer}>
		<h1 style={styles.header}>Apartments listing</h1>
		<div style={styles.grid}>
		  {apartments.map((apartment) => (
			<div
			  key={apartment.id}
			  style={{
				...styles.gridItem,
				...(selectedApartment === apartment ? styles.gridItemHover : {}), // Hover effect
			  }}
			  onClick={() => handleGridItemClick(apartment)} // Click to open modal
			>
			  <div style = {styles.gridList}>
				<Image
				src={apartmentIcon} // Use the imported PNG
				alt="Apartment"
				style={styles.gridItemImage} // Apply styling for the image
				/>
				<div>
					<strong>Country:</strong> {apartment.country} <br />
					<strong>Price:</strong> {apartment.price} <br />
					<strong>Type:</strong> {apartment.type}
				</div>
				</div>
			</div>
		  ))}
		</div>
		{selectedApartment && (
		  <Modal
			apartment={selectedApartment}
			onClose={handleCloseModal} // Modal with close function
		  />
		)}
	  </div>
	);
}

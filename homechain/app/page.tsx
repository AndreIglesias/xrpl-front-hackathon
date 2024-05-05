"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Client, Wallet, Request, convertHexToString, TxRequest } from "xrpl";
import { ethers } from "ethers";
import NFTCard from "./components/NFTCard";
import CollectionSearch from "./components/CollectionSearch";
//UI
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import {
  Button,
  Box,
  CircularProgress,
  Paper,
  Grid,
  ButtonGroup,
} from "@mui/material";
import NFTIcon from "../public/icons/placeholder.png";
import L from "leaflet"; // Importing Leaflet
import "leaflet/dist/leaflet.css"; // Leaflet CSS

import i1 from "../public/01.png";
import i2 from "../public/02.png";
import i3 from "../public/03.png";
import axios from "axios";

const ADDOK_URL = "http://api-adresse.data.gouv.fr/search/";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
//end UI

const client = new Client("wss://s.altnet.rippletest.net:51233");
const clio_client = new Client("wss://clio.altnet.rippletest.net:51233");
const issuerSeed = "sEd78jwso8dMzEwHjzfyfhtr8CFY4V8";

const getNFTMemo = async (nftTokenId: string, client) => {
  try {
    await client.connect();
    console.log("Fetching memo data for NFT:", nftTokenId);
    const request: Request = {
      command: "nft_history",
      nft_id: nftTokenId,
    };
    console.log("Request:", request);
    const response = await client.request(request);
    console.log("Response:", response);
    let memo = response.result.transactions[0].tx.Memos[0].Memo.MemoData;
    memo = convertHexToString(memo);
    console.log("Memo:", memo);
    // convert memo to JSON
    memo = JSON.parse(memo);
    return memo;
  } catch (err) {
    return null;
  }
};

const getNFT = async () => {
  let results = "";
  const standby_wallet = Wallet.fromSeed(issuerSeed);

  await client.connect();
  await clio_client.connect();

  results += "\nConnected. Getting NFTs...";
  const request: Request = {
    command: "account_nfts",
    account: standby_wallet.classicAddress,
  };

  try {
    const nfts = await client.request(request);
    results += "\nNFTs:\n " + JSON.stringify(nfts, null, 2);
    console.log(results);

    type NFTData = {
      name: string;
      collectionName: string;
      id: number;
      ID: string;
      url: string;
      floor: number;
      appartmentId: number;
      txIds: string[];
      nftUrl: string;
      image: string;
    };
    let x = 0;
    let NFTs = [];

    for (const nft of nfts.result.account_nfts) {
      // create dictionary for each NFT
      let nftData: NFTData = {
        id: x,
        ID: "",
        url: "",
        floor: 0,
        appartmentId: 0,
        txIds: [],
      };
      x++;
      // get ID
      nftData.ID = nft.NFTokenID;
      console.log("data : ", nft);
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
          nftData.collectionName = memo.collectionName;
          nftData.name = memo.name;
          nftData.nftUrl = `https://testnet.xrpl.org/nft/${nftData.ID}`;
          nftData.image = i3;
          if (nftData.collectionName === "75006") {
            nftData.image = i1;
          } else if (nftData.collectionName === "75007") {
            nftData.image = i2;
          }
        }
      }
      NFTs.push(nftData);
    }
    console.log("NFTs : ", NFTs);
    return NFTs;
  } catch (err) {
    console.error("Error fetching NFTs:", err);
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

  const TransactionLinks = ({ NFT }) => {
    if (!NFT || !NFT.txIds || NFT.txIds.length === 0) {
      return <p>No transaction IDs available.</p>;
    }
  };

  // Inline styles for the grid
  const styles = {
    gridContainer: {
      color: "#333",
      padding: "30px", // Increased padding
      backgroundColor: "#f8f8f8", // Light gray background color
      height: "100vh",
    },
    grid: {
      display: "grid", // Set to grid layout
      gap: "25px", // Space between grid items
      gridTemplateColumns: "repeat(auto-fill, minmax(370px, 1fr))",
    },
    gridItem: {
      border: "1px solid #ddd", // Light border
      padding: "15px", // Increased padding
      backgroundColor: "#ffffff", // White background
      borderRadius: "10px", // Rounded corners
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
      cursor: "pointer", // Indicates it's clickable
      transition: "transform 0.2s, boxShadow 0.2s", // Smooth transitions
    },
    gridItemHover: {
      transform: "translateY(-5px)", // Lift on hover
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Increased shadow on hover
    },
    fontBlack: {
      color: "#333", // Dark gray font color (close to black)
    },
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // Centered on screen
      backgroundColor: "white",
      border: "1px solid #ccc",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Shadow for depth
      zIndex: 1000, // Ensures modal stays on top
    },
    mapContainer: {
      height: "200px", // Map height
      width: "100%", // Full width
	  marginBottom: "20px", // Adds some space below the map
	  marginTop: "20px", // Adds some space above the map
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay
      zIndex: 999, // Places overlay beneath modal
    },
    header: {
      fontSize: "35px",
      marginBottom: "20px",
    },
    gridItemImage: {
      width: "100%",
      marginTop: "10px",
      marginBottom: "10px",
      marginRight: "15px",
    },
    gridList: {
      alignItems: "center",
    },
    textEllipsis: {
      whiteSpace: "nowrap", // Ensures the text stays on one line
      overflow: "hidden", // Hides text that overflows the container
      textOverflow: "ellipsis", // Replaces hidden text with '...'
    },
    gridItemContent: {
      padding: "5px", // Adds some padding around the text
    },
  };

  const [location, setLocation] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState(''); // Input for address

  const fetchGeolocation = async (address: string) => {
    try {
		console.log('Fetching geolocation with address:', address); // Debug line
      const ADDOK_URL = 'http://api-adresse.data.gouv.fr/search/';
      const params = new URLSearchParams({ q: address, limit: '5' });
      const response = await fetch(`${ADDOK_URL}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const firstResult = data.features[0];
        const [lon, lat] = firstResult.geometry.coordinates;
        const postcode = firstResult.properties.postcode;

        const result = {
          ...firstResult.properties,
          lon,
          lat,
          postcode,
        };

        setLocation(result);
		console.log('Fetched geolocation:', result); // Debug line
        setError(null); // Reset error if successful
      } else {
        setError('No results found');
        setLocation(null); // Clear location if no results
      }
    } catch (err) {
		console.error('Error in fetchGeolocation:', err); // Debug line
      setError(err.message);
      setLocation(null); // Clear location on error
    }
  };

  const handleGridItemClick = (NFT) => {
    setSelectedNFT(NFT);
	console.log('Fetching geolocation for:', NFT.name); // Debug line
	fetchGeolocation(NFT.name);
  };

  const customIcon = L.icon({
	iconUrl: NFTIcon.src, // Path to your PNG
	iconSize: [30, 30], // Size of the icon in pixels (width, height)
	iconAnchor: [16, 32], // Anchor point (center-bottom)
  });

  // Leaflet map component with hardcoded coordinates
  const LeafletMap = ({ center, zoom }) => {
    useEffect(() => {
      const map = L.map("leaflet-map").setView(center, zoom); // Initialize map with center

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      //L.marker(center).addTo(map); // Add marker at the center
	  L.marker(center, { icon: customIcon }).addTo(map); // Add custom icon marker

      return () => {
        map.remove(); // Cleanup when component unmounts
      };
    }, [center, zoom]);

    return <div id="leaflet-map" style={styles.mapContainer}></div>;
  };

  // Modal component that shows the pop-up in the center of the screen
  const Modal = ({ NFT, onClose }) => (
    <>
      <div
        style={styles.overlay}
        onClick={onClose} // Close modal when overlay is clicked
      ></div>
      <div style={styles.modal}>
        <a href={NFT.nftUrl}>
          <h1>
            <strong>{NFT.name}</strong>
          </h1>
        </a>

        <h1>
          <strong>Collection:</strong> {NFT.collectionName}
        </h1>
        <h2>
          <strong>NFTokenID:</strong> {NFT.ID}
        </h2>
        <p>
          <strong>url:</strong>{" "}
          <a href={NFT.url} style={{ color: "blue" }}>
            {NFT.url}
          </a>
        </p>
        <p>
          <strong>floor:</strong> {NFT.floor}
        </p>
        <p>
          <strong>appartmentId:</strong> {NFT.appartmentId}
        </p>
        <div>
          <p>
            <strong>Transaction Links:</strong>
          </p>
          <ul>
            <ButtonGroup
              orientation="vertical"
              aria-label="Vertical button group"
            >
              {NFT.txIds.map((txId, index) => (
                <li key={index}>
                  <Button variant="outlined" style={{ width: "100%" }}>
                    <a
                      href={`https://testnet.xrpl.org/transactions/${txId}`}
                      target="_blank" // Open in a new tab
                      rel="noopener noreferrer" // Security measure for new tab
                    >
                      {txId}
                    </a>
                  </Button>
                </li>
              ))}
            </ButtonGroup>
          </ul>
        </div>
		{location ? (
        <LeafletMap
          center={{ lat: location.lat, lng: location.lon }} // Default coordinates (San Francisco)
          zoom={15} // Map zoom level
        />
		) : (
		<p>{error || "Loading location..."}</p>
		)}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </div>
    </>
  );


  const handleCloseModal = () => {
    setSelectedNFT(null); // Close the modal by setting selectedNFT to null
  };

  return (
    <div style={styles.gridContainer}>
      {/* when loading show Loading else the rest */}
      {loading ? (
        <Box sx={{ display: "flex" }}>
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
                  <div style={styles.textEllipsis}>
                    <strong>{NFT.name}</strong>
                  </div>

                  <Image
                    src={NFT.image}
                    alt="NFT"
                    style={styles.gridItemImage}
                  />

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

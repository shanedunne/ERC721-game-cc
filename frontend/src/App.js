import React, { useState, useEffect } from "react";
import abi from "./assets/abi.json";
import "./App.css";
import NavBar from "./components/navbar";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { polygonMumbai } from "wagmi/chains";
import { ethers } from "ethers";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MintCard from "./components/Mint";
import Leaderboard from "./components/Leaderboard";
import Grid from "@mui/material/Grid";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const { chains, provider } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  // contract constants
  const contractAddress = "0x1Fcd3e4D2B20F791caf81000FB13AFF1d709eac1";
  const contractABI = abi;

  // current account state
  const [currentAccount, setCurrentAccount] = useState("");
  const [hasMinted, setHasMinted] = useState("");
  const [name, setName] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [level, setLevel] = useState("");

  // to be called when the page is loaded
  useEffect(() => {
    getAddress();
    checkIfHasMinted();
  });

  const getAddress = async () => {
    const { ethereum } = window;

    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log("accounts: ", accounts);

    if (accounts.length > 0) {
      const account = accounts[0];
      console.log("wallet is connected! " + account);
      setCurrentAccount(account);
    } else {
      console.log("make sure MetaMask is connected");
    }
  };

  const checkIfHasMinted = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log("address here: " + signer);
        const verifyMintStatus = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const balance = await verifyMintStatus.balanceOf(currentAccount);

        if (balance > 0) {
          setHasMinted(true);
          console.log("token ID" + balance);
          getCharacterInfo();
        } else {
          console.log("has not minted - display mint page");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCharacterInfo = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const getInfo = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const characterStructData = await getInfo.ownerAddressToCharacterInfo(
          currentAccount
        );
        let charName = characterStructData[0];
        let charTokenId = characterStructData[1];
        let characterLevel = characterStructData[3];

        setName(charName);
        setTokenId(charTokenId);
        setLevel(characterLevel);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} coolMode>
        <NavBar />

        <Grid
          container
          spacing={2}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Grid xs={6}>
            <MintCard />
          </Grid>
          <Grid xs={6}>
            <Leaderboard />
          </Grid>
        </Grid>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;

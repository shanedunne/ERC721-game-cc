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
import LevelUpCard from "./components/LevelUp";
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
  const contractAddress = "0x0fCB9993bccA1d159bAA6506340738F106417Aa4";
  const contractABI = abi;

  // current account state
  const [currentAccount, setCurrentAccount] = useState("");
  const [hasMinted, setHasMinted] = useState("");
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [level, setLevel] = useState("");

  // to be called when the page is loaded
  useEffect(() => {
    getAddress();
    getLeaderboard();
  }, []);
  const onNameChange = (event) => {
    setNewName(event.target.value);
    console.log(newName);
  };

  const getAddress = async () => {
    const { ethereum } = window;

    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log("accounts: ", accounts);

    if (accounts.length > 0) {
      const account = accounts[0];
      console.log("wallet is connected! " + account);
      setCurrentAccount(account);
      checkIfHasMinted();
    } else {
      console.log("make sure MetaMask is connected");
    }
  };

  const checkIfHasMinted = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // get provider
        const provider = new ethers.providers.Web3Provider(ethereum);

        // get signer
        const signer = provider.getSigner();
        console.log("address here: " + signer);

        // create address instance
        const verifyMintStatus = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // get accounts. This has been added again for now as useState does not seem to save quickly enough
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const account = accounts[0];
        console.log("account check" + account);
        const balance = await verifyMintStatus.balanceOf(account);

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
        // get accounts. This has been added again for now as useState does not seem to save quickly enough
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const account = accounts[0];
        const characterStructData = await getInfo.ownerAddressToCharacterInfo(
          account
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

  const mintCharacter = async (propsName) => {
    try {
      // general ethereum set up
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const minter = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        // get accounts. This has been added again for now as useState does not seem to save quickly enough
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const account = accounts[0];
        console.log("Mint process has begun");

        console.log("character name" + propsName);

        // call mint function

        const newCharacter = await minter.mint(propsName);
        // wait for the transaction to be minee
        await newCharacter.wait();
        console.log(newCharacter.hash);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const levelUp = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const leveler = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        // get accounts. This has been added again for now as useState does not seem to save quickly enough
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const account = accounts[0];

        // call for random words from Chainlink VRF
        const randomNumber = await leveler.requestRandomWords({
          gasLimit: 1000000,
          gasPrice: 30000000000,
        });
        console.log("Level up process has begun");
        console.log("Request sent to Chainlink VRF");

        // Wait for random words to be returned
        await randomNumber.wait();
        console.log(
          "Random number returned. Initiating level up functionality"
        );
        // send the ramdom number from Chainlink VRF through the modulos calculation and add to character
        const levelUpTx = await leveler.getRandomLevelUp({
          gasLimit: 1000000,
          gasPrice: 30000000000,
        });

        console.log("awaiting confirmation was a success");
        await levelUpTx.wait();

        console.log("Level up complete. Checking new level");

        // find out what the characters new level is
        const getLevel = await leveler.ownerAddressToCharacterInfo(account);
        let charName = getLevel[0];
        let newLevel = getLevel[3];
        console.log(`${charName}'s new level is ${newLevel}`);

        console.log("calling leaderboard event listener");
        getLeaderboard();
        console.log("event listener has been called");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLeaderboard = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.WebSocketProvider(
          "wss://polygon-mumbai.g.alchemy.com/v2/d-qKmYky4kiu0xT-UN3Xo3w6dq3Pd4vx"
        );
        const levelCheckInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );

        levelCheckInstance.on(
          "LevelUpEvent",
          (owner, characterName, currentLevel) => {
            let eventInfo = {
              owner: owner,
              characterName: characterName,
              currentLevel: currentLevel,
            };

            console.log("test emit" + JSON.stringify(eventInfo, null, 4));
          }
        );
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
          <Grid item xs={6}>
            {hasMinted ? (
              <LevelUpCard levelUp={levelUp} />
            ) : (
              <MintCard mintCharacter={mintCharacter} />
            )}
          </Grid>
          <Grid item xs={6}>
            <Leaderboard />
          </Grid>
        </Grid>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;

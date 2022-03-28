import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {ethers, Connection, utils, providers} from 'ethers';
import Web3modal from 'web3modal';
import Web3 from 'web3'; 
import {useRef, useEffect, useState} from 'react';
import { Web3Provider } from '@ethersproject/providers';


export default function Home() {
  //Set true if wallet is connecect
  const [walletConnected, setWalletIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');
  const web3modalRef = useRef();
  //Helper function get get Provider Or signer 
  const getProviderOrSigner = async(needSigner = false) => { 
  const provider = await web3modalRef.current.connect();
  const web3provider = new providers.Web3Provider(provider);
  const signer = web3provider.getSigner();
  const address = await signer.getAddress();
  setAccountAddress(address)
  //Make sure account is connected to ETH network
  const {chainId} = await web3provider.getNetwork();
  if(chainId !==1) { 
    window.alert("Please connect to Eth Network")
  };

  if(needSigner) { 
    const signer = web3provider.getSigner();
    return signer;
  }

  return web3provider;

      
  }


  //Helper function to prompt user to connect their wallet 
  const Connect = async() =>{ 
    try { 
      await getProviderOrSigner();
      setWalletIsConnected(true);
    }catch(err) { 
      console.error(err);
    }


  }

  //on load connect Wallet autonomous to eth network
  useEffect(() => { 
    if(!walletConnected) { 
      web3modalRef.current = new Web3modal({
        network: "ethereum ",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      Connect();
    }
  })

function connectWallet() { 
  if(!walletConnected) { 
    return ( 
      <button
        onClick={Connect}
      >
        Connect Wallet
      </button>
    )
  }else { 
    return(
      <>
      <h1>You are Connected!</h1>
      <h2>You wallet address is {accountAddress} </h2>
      </>
     
    )
   
  }
}

  return (
    <div className={styles.container}> 
      {connectWallet()}
    </div>
  )
}

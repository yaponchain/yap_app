import { ethers } from "ethers";
import { Session } from "meteor/session";

const monadTestnetConfig = {
  chainId: "0x279f",
  chainName: "Monad Testnet",
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  blockExplorerUrls: ["https://explorer.testnet.monad.xyz"],
};

const walletLogos = {
  MetaMask: "/images/wallets/metamask.png",
  Rabby: "/images/wallets/rabby.png",
  Backpack: "/images/wallets/backpack.png",
  Haha: "/images/wallets/haha.png",
};

export function detectWallets() {
  const wallets = [
    { name: "MetaMask", logo: walletLogos.MetaMask, available: !!window.ethereum?.isMetaMask },
    { name: "Rabby", logo: walletLogos.Rabby, available: !!window.ethereum?.isRabby },
    /* // @ts-ignore
    { name: "Backpack", logo: walletLogos.Backpack, available: !!window?.backpack || !!window.ethereum?.isBackpack  },
    // @ts-ignore
    { name: "Haha", logo: walletLogos.Haha, available: !!window?.haha || !!window.ethereum?.isHaha}, */
  ];
  return wallets.filter(wallet => wallet.available);
}

async function addMonadTestnetToWallet(provider) {
  try {
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [monadTestnetConfig],
    });
  } catch (error) {
    console.error("Erro ao adicionar Monad Testnet:", error);
  }
}

export async function connectWallet(walletName) {
  let provider;
  let ethProvider;
  try {
    if (walletName === "MetaMask" || walletName === "Rabby") {
      if (!window.ethereum) throw new Error(`${walletName} não detectado`);
      provider = new ethers.BrowserProvider(window.ethereum);
      ethProvider = window.ethereum;
    // @ts-ignore
    } else if (walletName === "Backpack" && window?.backpack) {
      // @ts-ignore
      provider = new ethers.BrowserProvider(window?.backpack)
      // @ts-ignore
      ethProvider = window.backpack;
    // @ts-ignore
    } else if (walletName === "Haha" && window?.haha) {
      // @ts-ignore
      provider = new ethers.BrowserProvider(window?.haha);
      // @ts-ignore
      ethProvider = window.haha;
    } else {
      throw new Error(`${walletName} não suportado ou não detectado`);
    }

    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = accounts[0];

    const network = await provider.getNetwork();
    if (Number(network.chainId) !== parseInt(monadTestnetConfig.chainId, 16)) {
      // @ts-ignore
      await addMonadTestnetToWallet(window.ethereum || window?.backpack || window?.haha);
    }

    sessionStorage.setItem("wallet", address);
    Session.set("wallet", address);
    Session.set("provider", provider);
    window.location.reload();
    return { provider, signer, address };
  } catch (error) {
    console.error("Erro ao conectar:", error);
  }
}

export function disconnectWallet() {
  // @ts-ignore
  const ethProvider = window.ethereum || window.backpack || window.haha;
  
  if (ethProvider) {
    ethProvider.removeAllListeners("accountsChanged");
    ethProvider.removeAllListeners("chainChanged");

    if (ethProvider.disconnect) {
      ethProvider.disconnect();
    } else if (ethProvider.close) {
      ethProvider.close();
    } 
  }

  sessionStorage.removeItem("wallet");
  Session.set("wallet", null);
  Session.set("provider", null);
  Session.set("ethProvider", null);
  Session.set("list", null);
  sessionStorage.removeItem("list");
  console.log("Carteira desconectada da plataforma.");
}
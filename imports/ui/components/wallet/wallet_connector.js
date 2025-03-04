import { ethers } from "ethers";
import { Session } from "meteor/session";

// Configuração da Monad Testnet
const monadTestnetConfig = {
  chainId: "0x279f", // Exemplo: 10143 em hex (ajuste conforme o Chain ID real)
  chainName: "Monad Testnet",
  rpcUrls: ["https://testnet-rpc.monad.xyz"], // Ajuste o RPC real
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  blockExplorerUrls: ["https://explorer.testnet.monad.xyz"],
};

// Logos das carteiras (substitua pelos URLs reais ou use assets locais)
const walletLogos = {
  MetaMask: "/images/wallets/metamask.png", // Substitua
  Rabby: "/images/wallets/rabby.png", // Substitua
  Backpack: "/images/wallets/backpack.png", // Substitua
  Haha: "/images/wallets/haha.png", // Substitua
};

// Função para detectar carteiras disponíveis
export function detectWallets() {
  const wallets = [
    { name: "MetaMask", logo: walletLogos.MetaMask, available: !!window.ethereum?.isMetaMask },
    { name: "Rabby", logo: walletLogos.Rabby, available: !!window.ethereum?.isRabby },
    { name: "Backpack", logo: walletLogos.Backpack, available: !!window?.backpack || !!window.ethereum?.isBackpack  },
    { name: "Haha", logo: walletLogos.Haha, available: !!window?.haha || !!window.ethereum?.isHaha},
  ];
  return wallets.filter(wallet => wallet.available);
}

// Função para adicionar a Monad Testnet
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

// Função para conectar a carteira selecionada
export async function connectWallet(walletName) {
  let provider;
  try {
    if (walletName === "MetaMask" || walletName === "Rabby") {
      if (!window.ethereum) throw new Error(`${walletName} não detectado`);
      provider = new ethers.BrowserProvider(window.ethereum);
    } else if (walletName === "Backpack" && window?.backpack) {
      provider = new ethers.BrowserProvider(window?.backpack);
    } else if (walletName === "Haha" && window?.haha) {
      provider = new ethers.BrowserProvider(window?.haha);
    } else {
      throw new Error(`${walletName} não suportado ou não detectado`);
    }

    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = accounts[0];

    const network = await provider.getNetwork();
    if (Number(network.chainId) !== parseInt(monadTestnetConfig.chainId, 16)) {
      await addMonadTestnetToWallet(window.ethereum || window?.backpack || window?.haha);
    }

    Session.set("wallet", address);
    Session.set("provider", provider);

    // Listeners para mudanças
    const ethProvider = window.ethereum || window.backpack || window.haha;
    ethProvider.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) Session.set("connectedAddress", accounts[0]);
      else {
        Session.set("wallet", null);
        Session.set("provider", null);
      }
    });
    ethProvider.on("chainChanged", () => window.location.reload());

    return { provider, signer, address };
  } catch (error) {
    console.error("Erro ao conectar:", error);
  }
}

// Função para desconectar
export function disconnectWallet() {
  Session.set("wallet", null);
  Session.set("provider", null);
}
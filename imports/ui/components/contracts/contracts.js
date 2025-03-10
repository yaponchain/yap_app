import { ethers } from "ethers";
import YapLendCoreABI from "./abis/YapLendCore.json";
import ProposalManagerABI from "./abis/ProposalManager.json";
import NFTVerifierABI from "./abis/NFTVerifier.json";
import IERC721ABI from "./abis/IERC721.json";

const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;

const yapLendCore = new ethers.Contract(
  YapLendCoreABI.address,
  YapLendCoreABI.abi,
  provider
);
const proposalManager = new ethers.Contract(
  ProposalManagerABI.address,
  ProposalManagerABI.abi,
  provider
);
const nftVerifier = new ethers.Contract(
  NFTVerifierABI.address,
  NFTVerifierABI.abi,
  provider
);

async function getSignedContracts() {
  const signer = await provider.getSigner();
  return {
    yapLendCore: yapLendCore.connect(signer),
    proposalManager: proposalManager.connect(signer),
    nftVerifier: nftVerifier.connect(signer),
  };
}

//Methods
export async function approveNFTForProtocol(nftAddress, tokenId) {
  try {
    const { nftVerifier } = await getSignedContracts();
    const signer = await provider.getSigner();

    const nftContract = new ethers.Contract(nftAddress, IERC721ABI, signer);

    const tx = await nftContract.approve(
      "0x8FA2C5Dfbd65811135F2ABd0EBaEAF4710ca1bC0",
      tokenId
    );

    const receipt = await tx.wait();
    console.log("NFT aprovado com sucesso:", receipt);
    return { success: true, receipt };
  } catch (error) {
    console.error("Erro ao aprovar NFT:", error);
    return { error: true, detail: error };
  }
}

export async function createLoanProposal(
  nftAddresses,
  tokenIds,
  requestedAmount,
  duration,
  interestRate
) {
  try {
    const { proposalManager } = await getSignedContracts();

    // @ts-ignore
    const tx = await proposalManager.createProposal(
      nftAddresses,
      tokenIds,
      ethers.parseEther(requestedAmount.toString()),
      duration * 86400,
      interestRate * 100
    );

    const receipt = await tx.wait();
    
    console.log("Receipt: ", receipt);
    const event = receipt.logs
      .filter(
        (log) =>
          log.topics[0] ===
          ethers.id(
            "ProposalCreated(uint256,address,address[],uint256[],uint256,uint256,uint256)"
          )
      )
      .map((log) => proposalManager.interface.parseLog(log));
    const proposalId = Number(event[0].args[0]);
    console.log("Proposta criada com sucesso, ID:", proposalId);
    return { success: true, proposalId };
  } catch (error) {
    console.error("Erro ao criar proposta de empréstimo:", error);
    return { error: true, detail: error };
  }
}

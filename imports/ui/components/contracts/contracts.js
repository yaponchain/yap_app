import { ethers } from "ethers";
import YapLendCoreABI from "./abis/YapLendCore.json";
import ProposalManagerABI from "./abis/ProposalManager.json";
import NFTVerifierABI from "./abis/NFTVerifier.json";
import IERC721ABI from "./abis/IERC721.json";

const provider = window.ethereum
  ? new ethers.BrowserProvider(window.ethereum)
  : null;

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
export async function verifyNFTOwnership(userAddress, nftAddress, tokenId) {
  try {
    // Verificar propriedade via NFTVerifier
    const signer = await provider.getSigner();

    const nftContract = new ethers.Contract(
      NFTVerifierABI.address,
      NFTVerifierABI.abi,
      signer
    );

    const tx = await nftContract.verifyOwnership(
      userAddress,
      nftAddress,
      tokenId
    );

    const isOwner = await tx.wait();
    console.log("NFT verificado com sucesso:", isOwner);
    return isOwner;
  } catch (error) {
    console.error("Erro ao verificar propriedade do NFT:", error);
    return false;
  }
}

export async function verifyNFTApproval(userAddress, nftAddress, tokenId) {
  try {
    const isApproved = await nftVerifier.checkApproval(
      userAddress,
      nftAddress,
      tokenId
    );
    console.log("Check Approval verificado com sucesso:", isApproved);
    return isApproved;
  } catch (error) {
    console.error("Erro ao verificar Check Approval:", error);
    return false;
  }
}

export async function approveNFTForProtocol(nftAddress, tokenId) {
  try {
    const { nftVerifier } = await getSignedContracts();
    const signer = await provider.getSigner();

    const nftContract = new ethers.Contract(nftAddress, IERC721ABI, signer);

    const tx = await nftContract.approve(
      "0x92e4bA72513C6e2a80235fF5cD8060f9d2F5C65e",
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

export async function createCounterOffer(
  proposalId,
  offerAmount,
  duration,
  interestRate,
  validityPeriod
) {
  try {
    const { proposalManager } = await getSignedContracts();
    // @ts-ignore
    const tx = await proposalManager.createCounterOffer(
      proposalId,
      ethers.parseEther(offerAmount.toString()),
      duration * 86400,
      interestRate * 100,
      validityPeriod * 86400,
      { value: ethers.parseEther(offerAmount.toString()) }
    );

    const receipt = await tx.wait();

    const event = receipt.logs
      .filter(
        (log) =>
          log.topics[0] ===
          ethers.id(
            "CounterOfferCreated(uint256,address,uint256,uint256,uint256,uint256)"
          )
      )
      .map((log) => proposalManager.interface.parseLog(log));
    const counterProposalId = Number(event[0].args[0]);
    console.log("Contra-oferta criada com sucesso, ID:", counterProposalId);
    return { success: true, counterProposalId };
  } catch (error) {
    console.error("Erro ao criar contra-oferta:", error);
    return { error: true, detail: error };
  }
}

export async function acceptOriginalProposal(proposalId, amount) {
  try {
    const { proposalManager } = await getSignedContracts();

    // @ts-ignore
    const tx = await proposalManager.acceptProposal(proposalId, {
      value: ethers.parseEther(amount.toString()),
    });
    const receipt = await tx.wait();

    const event = receipt.logs
      .filter(
        (log) =>
          log.topics[0] ===
          ethers.id("ProposalAccepted(uint256,address,address,uint256)")
      )
      .map((log) => proposalManager.interface.parseLog(log));
    const loanId = Number(event[0].args[3]);
    console.log("Proposta aceita com sucesso, Empréstimo ID:", loanId);
    return { success: true, loanId };
  } catch (error) {
    console.error("Erro ao aceitar proposta original:", error);
    return { error: true, detail: error };
  }
}

export async function rejectCounterOffer(counterOfferProposalId) {
  try {
    const { proposalManager } = await getSignedContracts();

    // @ts-ignore
    const tx = await proposalManager.rejectCounterOffer(counterOfferProposalId);
    await tx.wait();
    console.log("Contra-oferta rejeitada com sucesso");
    return { success: true };
  } catch (error) {
    console.error("Erro ao rejeitar contra-oferta:", error);
    return { error: true, detail: error };
  }
}

export async function acceptCounterOffer(counterOfferProposalId) {
  try {
    const { proposalManager } = await getSignedContracts();

    // @ts-ignore
    const tx = await proposalManager.acceptProposal(counterOfferProposalId);
    const receipt = await tx.wait();

    const event = receipt.logs
      .filter(
        (log) =>
          log.topics[0] ===
          ethers.id("ProposalAccepted(uint256,address,address,uint256)")
      )
      .map((log) => proposalManager.interface.parseLog(log));
    const loanId = Number(event[0].args[3]);
    console.log("Contra-oferta aceita com sucesso, Empréstimo ID:", loanId);
    return { success: true, loanId };
  } catch (error) {
    console.error("Erro ao aceitar contra-oferta:", error);
    return { error: true, detail: error };
  }
}

export async function repayLoan(loanId, totalAmount) {
  try {
      const { yapLendCore } = await getSignedContracts();
      
      // @ts-ignore
      const tx = await yapLendCore.repayLoan(loanId,
  { value: ethers.parseEther(totalAmount.toString()) } );
      await tx.wait();
      console.log('Empréstimo repago com sucesso');
      return { success: true };
    } catch (error) {
      console.error('Erro ao repagar empréstimo:', error);
      return { error: true, detail: error };
  } }

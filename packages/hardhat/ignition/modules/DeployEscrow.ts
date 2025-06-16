import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// This is an Ignition Module that defines the deployment of our EscrowFactory contract.
const EscrowFactoryModule = buildModule("EscrowFactoryModule", (m) => {
  // The 'm' object is the ModuleBuilder. It provides methods for deploying contracts.

  // Our EscrowFactory constructor takes no arguments, so the second parameter is an empty array.
  const escrowFactory = m.contract("EscrowFactory", []);

  // The module must return an object containing the deployed contracts.
  // The keys of this object will be the "deployment IDs" within this module.
  return { escrowFactory };
});

export default EscrowFactoryModule;
import { ethers } from "hardhat";

async function main() {
  // token first
  const CarToken = await ethers.getContractFactory("CarToken");
  const carToken = await CarToken.deploy();
  await carToken.deployed();
 console.log(`CarToken deployed to ${carToken.address}`);

  const BorrowYourCar = await ethers.getContractFactory("BorrowYourCar");
  const borrowYourCar = await BorrowYourCar.deploy(carToken.address);
  await borrowYourCar.deployed();

  console.log(`BorrowYourCar deployed to ${borrowYourCar.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import "../CarToken.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract BorrowYourCar is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    // use a event if you want
    // to represent time you can choose block.timestamp
    event CarMinted(uint256 indexed carId, address owner);
    event CarBorrowed(
        uint32 carTokenId,
        address borrower,
        uint256 startTime,
        uint256 duration
    );

    // maybe you need a struct to store car information
    struct Car {
        address owner;
        address borrower;
        uint256 borrowUntil;
    }

    mapping(uint256 => Car) public cars; // A map from car index to its information

    IERC20 public carToken;

    constructor(address _carToken) ERC721("Cars", "Car") {
        carToken = IERC20(_carToken);
    }

    // constructor() ERC721("Cars", "Car") {}

    function mint() public {
        _tokenIds.increment();
        uint256 newCarId = _tokenIds.current();
        _mint(msg.sender, newCarId);
        cars[newCarId].owner = msg.sender;

        emit CarMinted(newCarId, msg.sender);
    }

    function borrow(uint32 carTokenId, uint256 duration) public {
        require(carTokenId <= _tokenIds.current(), "Car does not exist");
        require(
            cars[carTokenId].owner != msg.sender,
            "You already own this car"
        );
        require(
            cars[carTokenId].borrower == address(0) ||
                cars[carTokenId].borrowUntil < block.timestamp,
            "This car is already borrowed"
        );
        carToken.transferFrom(msg.sender, cars[carTokenId].owner, duration);
        cars[carTokenId].borrower = msg.sender;
        cars[carTokenId].borrowUntil = block.timestamp + duration;

        emit CarBorrowed(carTokenId, msg.sender, block.timestamp, duration);
    }

    function getOwner(uint32 carTokenId) external view returns (address) {
        require(carTokenId <= _tokenIds.current(), "Car does not exist");
        return cars[carTokenId].owner;
    }

    function getBorrower(uint32 carTokenId) external view returns (address) {
        require(carTokenId <= _tokenIds.current(), "Car does not exist");
        require(
            cars[carTokenId].borrower != address(0) &&
                cars[carTokenId].borrowUntil > block.timestamp,
            "This car is not borrowed"
        );

        return cars[carTokenId].borrower;
    }

    function getOwnedCars(
        address owner
    ) external view returns (uint256[] memory) {
        require(owner != address(0), "Invalid address");
        uint256 ownerBalance = balanceOf(owner);
        uint256[] memory carIds = new uint256[](ownerBalance);
        uint256 index = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (cars[i].owner == owner) {
                carIds[index] = i;
                index++;
            }
        }
        return carIds;
    }

    function availableCars() external view returns (uint256[] memory) {
        uint256 totalCars = _tokenIds.current();
        uint256[] memory tempCarIds = new uint256[](totalCars);
        uint256 availableCount = 0;

        for (uint256 i = 1; i <= totalCars; i++) {
            if (
                cars[i].borrower == address(0) ||
                cars[i].borrowUntil < block.timestamp
            ) {
                tempCarIds[availableCount] = i;
                availableCount++;
            }
        }

        uint256[] memory carIds = new uint256[](availableCount);
        for (uint256 j = 0; j < availableCount; j++) {
            carIds[j] = tempCarIds[j];
        }

        return carIds;
    }

    function borrowedCars() external view returns (uint256[] memory) {
        uint256 totalCars = _tokenIds.current();
        uint256[] memory tempCarIds = new uint256[](totalCars);
        uint256 availableCount = 0;

        for (uint256 i = 1; i <= totalCars; i++) {
            if (
                cars[i].borrower != address(0) &&
                cars[i].borrowUntil > block.timestamp
            ) {
                tempCarIds[availableCount] = i;
                availableCount++;
            }
        }

        uint256[] memory carIds = new uint256[](availableCount);
        for (uint256 j = 0; j < availableCount; j++) {
            carIds[j] = tempCarIds[j];
        }

        return carIds;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/SpaceInvadersGame.sol";

contract DeploySpaceInvadersGame is Script {
    function run() external {
        string memory privateKeyStr = vm.envString("PRIVATE_KEY");
        // Add 0x prefix if not present
        bytes memory privateKeyBytes = bytes(privateKeyStr);
        if (privateKeyBytes.length >= 2 && !(privateKeyBytes[0] == '0' && privateKeyBytes[1] == 'x')) {
            privateKeyStr = string(abi.encodePacked("0x", privateKeyStr));
        }
        uint256 deployerPrivateKey = vm.parseUint(privateKeyStr);
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the SpaceInvadersGame contract
        SpaceInvadersGame game = new SpaceInvadersGame();
        
        // Fund the contract with initial rewards (e.g., 100 levels worth of rewards)
        // 100 levels * 0.0006667 ETH per level = 0.06667 ETH
        vm.deal(address(game), 0.06667 ether);
        
        vm.stopBroadcast();

        console.log("SpaceInvadersGame deployed at:", address(game));
        console.log("Contract balance:", game.getContractBalance());
    }
}
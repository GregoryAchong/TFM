// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "SoulContract.sol";

contract ReputationManager is ERC721URIStorage, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Reputation {
        int256 value;
        string comment;
        uint256 timestamp;
        address soul;
    }

    // Lista de valores permitidos para los tokens de reputación
    int256[] public allowedValues = [-5, 1];

    SoulContract public soulContract;
    
    // Almacena reputaciones emitidas
    mapping(uint256 => Reputation) public reputations; 
    // Contador para asignar IDs a los tokens
    uint256 public reputationCounter; 

    event ReputationTokenNotMinted(address indexed soul, uint indexed reputationCount);
    event ReputationTokenMinted(uint256 indexed tokenId, address indexed soul, int256 value, uint256 timestamp, string comment);

    constructor(address _soulContractAddress) ERC721("ReputationToken", "RPT") {
        soulContract = SoulContract(_soulContractAddress);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function addAllowedValue(int256 _value) external onlyRole(ADMIN_ROLE) {
        allowedValues.push(_value);
    }

    function isAllowedValue(int256 _value) public view returns (bool) {
        for (uint256 i = 0; i < allowedValues.length; i++) {
            if (allowedValues[i] == _value) {
                return true;
            }
        }
        return false;
    }

    // Función para emitir un token de reputación (Soulbound)
    function mintReputationToken(address _soul, int256 _value, string memory _comment) external onlyRole(ADMIN_ROLE) {
        require(isAllowedValue(_value), "Reputation value is not allowed");

        uint256 tokenId = reputationCounter++;
        reputations[tokenId] = Reputation({
            value: _value,
            comment: _comment,
            timestamp: block.timestamp,
            soul: _soul
        });

        _safeMint(_soul, tokenId);
        _setTokenURI(tokenId, _comment); 
        
        soulContract.addReputation(_soul, _value, _comment);
        emit ReputationTokenMinted(tokenId, _soul, _value, block.timestamp, _comment);
    }

    // Deshabilitar transferencia de tokens para hacerlos SoulBound
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal {
        require(from == address(0), "Soulbound Token: non-transferable");
    }

    // Sobrescribir supportsInterface para resolver el conflicto entre AccessControl y ERC721
    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Obtener los valores permitidos
    function getAllowedValues() external view returns (int256[] memory) {
        return allowedValues;
    }
}

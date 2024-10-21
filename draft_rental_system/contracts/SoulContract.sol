// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SoulContract is AccessControl {

    struct Reputation {
        int256 value;       // Valor del token de reputación
        string comment;     // Comentario relacionado al token
        uint256 timestamp;  // Fecha de emisión
    }

    struct Soul {
        string identity;        // Identidad única del usuario
        uint256 createdAt;      // Fecha de creación del Soul
    }

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    mapping(address => Soul) private souls;
    mapping(address => uint256[]) private soulToReputationTokenIds; // ID de tokens de reputación asociados a cada Soul
    mapping(uint256 => Reputation) public reputationTokens;         // Almacenar todos los tokens de reputación
    mapping(string => address) private identityToSoulAddress;       // Para buscar por identidad (identity)

    uint256 public reputationCounter = 0; // Contador para asignar IDs únicos a los tokens de reputación

    // Eventos para la trazabilidad
    event SoulCreated(address indexed soulAddress, string identity, uint256 createdAt);
    event ReputationAdded(uint256 indexed tokenId, address indexed soulAddress, int256 value, string comment, uint256 timestamp);

    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // Crear un nuevo Soul asegurando que la identidad (identity) sea única
    //function createSoul(address _soulAddress, string memory _identity) external onlyRole(ADMIN_ROLE) {
    function createSoul(address _soulAddress, string memory _identity) external {
    require(identityToSoulAddress[_identity] == address(0), "Identity already in use");
    if (bytes(souls[_soulAddress].identity).length != 0) {
        // Si ya existe un Soul, actualizar la identidad
        souls[_soulAddress].identity = string(abi.encodePacked(souls[_soulAddress].identity, " | ", _identity));
    } else {
        // Crear un nuevo Soul
        Soul storage newSoul = souls[_soulAddress];
        newSoul.identity = _identity;
        newSoul.createdAt = block.timestamp;

        // Asignar la identidad al address del Soul
        identityToSoulAddress[_identity] = _soulAddress;

        emit SoulCreated(_soulAddress, _identity, block.timestamp);
    }
}

    // Añadir reputación a un Soul basado en la dirección (soulAddress)
    function addReputation(address _soulAddress, int256 _value, string memory _comment) external onlyRole(ADMIN_ROLE) {
        require(bytes(souls[_soulAddress].identity).length != 0, "Soul does not exist");

        // Asignar un ID único al nuevo token de reputación
        uint256 tokenId = reputationCounter++;

        // Crear y almacenar el token de reputación
        reputationTokens[tokenId] = Reputation({
            value: _value,
            comment: _comment,
            timestamp: block.timestamp
        });

        // Asociar el token de reputación al Soul
        soulToReputationTokenIds[_soulAddress].push(tokenId);

        emit ReputationAdded(tokenId, _soulAddress, _value, _comment, block.timestamp);
    }

    // Obtener la información completa de un Soul por su dirección
    function getSoul(address _soulAddress) external view returns (Soul memory) {
        require(bytes(souls[_soulAddress].identity).length != 0, "Soul does not exist");
        return souls[_soulAddress];
    }

    // Obtener la dirección de un Soul utilizando la identidad (identity)
    function getSoulByIdentity(string memory _identity) external view returns (Soul memory) {
        address soulAddress = identityToSoulAddress[_identity];
        require(bytes(souls[soulAddress].identity).length != 0, "Soul does not exist");
        return souls[soulAddress];
    }

    // Obtener todos los tokens de reputación (con detalles) de un Soul
    function getReputationTokens(address _soulAddress) external view returns (Reputation[] memory) {
        require(bytes(souls[_soulAddress].identity).length != 0, "Soul does not exist");

        uint256[] memory tokenIds = soulToReputationTokenIds[_soulAddress];
        Reputation[] memory reputationDetails = new Reputation[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            reputationDetails[i] = reputationTokens[tokenIds[i]];
        }

        return reputationDetails;
    }

    // Obtener un token de reputación específico usando su tokenId
    function getReputationToken(uint256 tokenId) external view returns (Reputation memory) {
        require(tokenId < reputationCounter, "Reputation token does not exist");
        return reputationTokens[tokenId];
    }
}
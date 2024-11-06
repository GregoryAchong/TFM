// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract DigitalIdentity is OwnableUpgradeable {
    struct DIDDocument {
        address owner;
        string publicKey;
        string authenticationMethod;
        bool revoked;
        string identifier;
        // Other fields...
    }

    mapping(address => DIDDocument) public didDocuments;

    event DIDDocumentCreated(
        address indexed did,
        address indexed owner,
        string indexed identifier
    );
    event DIDDocumentUpdated(
        address indexed did,
        string indexed newPublicKey,
        string newAuthenticationMethod
    );

    function initialize() public initializer {
        // Initialize libs
        __Ownable_init();
    }

    function createDIDDocument(
        string memory publicKey,
        string memory authenticationMethod
    ) external {
        require(bytes(publicKey).length > 0, "Public key is required");
        require(
            bytes(authenticationMethod).length > 0,
            "Authentication method is required"
        );
        require(
            didDocuments[msg.sender].owner == address(0),
            "DID document already exists"
        );

        didDocuments[msg.sender] = DIDDocument({
            owner: msg.sender,
            identifier: string.concat("did:ethr:0x", publicKey),
            publicKey: publicKey,
            authenticationMethod: authenticationMethod,
            revoked: false
            // Populate other fields...
        });

        emit DIDDocumentCreated(
            msg.sender,
            msg.sender,
            didDocuments[msg.sender].identifier
        );
    }

    function updateDIDDocument(
        string memory newPublicKey,
        string memory newAuthenticationMethod
    ) external onlyOwner {
        require(bytes(newPublicKey).length > 0, "New public key is required");
        require(
            bytes(newAuthenticationMethod).length > 0,
            "New authentication method is required"
        );
        require(
            didDocuments[msg.sender].revoked == false,
            "DID document already revoked"
        );

        DIDDocument storage doc = didDocuments[msg.sender];
        doc.publicKey = newPublicKey;
        doc.authenticationMethod = newAuthenticationMethod;
        // Update other fields...

        // Emit an event or perform additional actions as needed
        emit DIDDocumentUpdated(
            msg.sender,
            newPublicKey,
            newAuthenticationMethod
        );
    }

    function revokeDIDDocument() external onlyOwner {
        require(
            didDocuments[msg.sender].revoked == false,
            "DID document already revoked"
        );

        DIDDocument storage doc = didDocuments[msg.sender];
        doc.revoked = true;
        doc.publicKey = "0x";
    }

    // Verificacion + ZKP
    function getDIDDocument()
        external
        view
        onlyOwner
        returns (DIDDocument memory)
    {
        require(
            didDocuments[msg.sender].revoked == false,
            "DID document already revoked"
        );
        return didDocuments[msg.sender];
    }

    function compareStrings(
        string memory _a,
        string memory _b
    ) public pure returns (bool) {
        return
            keccak256(abi.encodePacked(_a)) == keccak256(abi.encodePacked(_b));
    }

    function getDIDDocumentbyPK(
        string memory namePublicKey
    ) external view onlyOwner returns (DIDDocument memory did) {
        require(bytes(namePublicKey).length > 0, "public key name is required");
        require(
            didDocuments[msg.sender].revoked == false,
            "DID document already revoked"
        );

        DIDDocument storage doc = didDocuments[msg.sender];
        if (compareStrings(doc.publicKey, namePublicKey))
            did = didDocuments[msg.sender];

        return did;
    }

    function verifyDIDDocumentbyID(
        string memory identifier
    ) external view onlyOwner returns (DIDDocument memory did) {
        require(bytes(identifier).length > 0, "identifier key is required");
        require(
            didDocuments[msg.sender].revoked == false,
            "DID document already revoked"
        );

        DIDDocument storage doc = didDocuments[msg.sender];
        if (compareStrings(doc.identifier, identifier))
            did = didDocuments[msg.sender];

        return did;
    }
    // Other functions for resolving DIDs and additional features...
}

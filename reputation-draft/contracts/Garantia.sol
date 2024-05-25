
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import './Reputation.sol';
import './PagoAlquiler.sol';


contract Garantia {


address owner;
uint256 _LiberarGarantia = block.timestamp + 180 days;

 constructor() {
        // Set the transaction sender as the owner of the contract.
        owner = msg.sender;
    }


modifier onlyOwner {
require(msg.sender == owner );
_;
}

 function retenerGarantia  () public  onlyOwner {

 } 

 function liberarGarantia (uint256 _tiempoTranscurrido) public view onlyOwner  {
   
   if( _tiempoTranscurrido == _LiberarGarantia ){



   }
   

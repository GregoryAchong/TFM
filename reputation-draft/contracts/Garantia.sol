// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import './Reputation.sol';
import './PagoAlquiler.sol';

//esta es la garantia extra si no tiene reputacion. 
contract Garantia {

address owner;
address user;
int256 amount;
bool isBlocked;
uint256 _LiberarGarantia = block.timestamp + 180 days;

 constructor() {
        // Set the transaction sender as the owner of the contract.
        owner = msg.sender;
    }

modifier onlyOwner {
require(msg.sender == owner );
_;
}

 function retenerGarantia  ( address _user , int256 _amount) public  onlyOwner {
    
    amount = _amount;
    user=_user;
    isBlocked=true;
 } 
  

 function liberarGarantia (uint256 _tiempoTranscurrido , address payable  withdrawAddress, uint _amount) public  onlyOwner  {
   
   if( _tiempoTranscurrido == _LiberarGarantia && isBlocked == true  ){
       isBlocked=false;
       withdrawAddress.transfer(_amount);
  }

   

   }
   
 } 




// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import './Reputation.sol';
import './PagoAlquiler.sol';

contract Garantia {

address  owner;
address user;
int256 amount;
bool isBlocked;
uint256 LiberarGarantia;

 constructor() {
        // Set the transaction sender as the owner of the contract.
        owner = msg.sender;
    }

modifier onlyOwner {
require(msg.sender == owner );
_;
}

 function retenerGarantia  ( address _user , int256 _amount) public  onlyOwner {
    //se toma de pago alquiles el dia de inicio del pago 
    PagoAlquiler AlquilerPago;
    //se suman los 6 meses para saber la fecha de devolucion 
    LiberarGarantia = AlquilerPago.enviarInicioPago() +180 days;
    amount = _amount;
    user=_user;
    //se bloquea en este contrato el poder hacer
    isBlocked=true;
 } 

 function descontarGarantia(address  _owner , int256 _amount) public onlyOwner{
      

 }
  
 function garantiaLiberada (uint256 _tiempoTranscurrido , address payable  withdrawAddress, uint _amount) public  onlyOwner  {
   //se compara si el tiempo transcurrido es mayor o igual a 6meses y si la cuenta sigue bloqueada 
   if( _tiempoTranscurrido >= LiberarGarantia && isBlocked == true ){
      //se desbloquea la cuenta 
       isBlocked=false;
       // se envian los fondos bloqueado
       withdrawAddress.transfer(_amount);
  }

   }
   
 } 



 

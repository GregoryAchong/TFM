// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;
import './Reputation.sol';
import './Garantia.sol';

contract PagoAlquiler {

  uint256 public  inicioPago  = block.timestamp;
  uint256 finPago = block.timestamp + 5 days;

  function comprobarPagoMes( uint32 arrendatario, address user) public   returns (bool) {
    //declarar Variables
    Reputation  Reputacion ; 
    bool pago;
    arrendatario=0; // esto se modifica desde front 

    //comparar si el pago se hizo en los primeros 5 dias de ejecucion del contrato 
    if ( block.timestamp == inicioPago || block.timestamp <= finPago && arrendatario == 0  ){
        //Devuelve true si fue pago en los 5 dias de ejecucion del contrato
        //al ser true se dbe ejecutar contrato moonbean para que el arrendador confirme y pague fees
        pago = true ;
        return pago ;

    } else {
           if(block.timestamp <= finPago &&  arrendatario == 1){
            //Reputacion no suma no resta por excepción
            Reputacion.decreaseReputation(user, 0);
           //Devuelve false si fue pago en los 5 dias de ejecucion del contrato
           pago = false ;
           return pago ;
           
           }else{
           //resta la reputacion en 5
            Reputacion.decreaseReputation(user , -5);
           //quitar x% de garantia  donde garantia es una address 
           // garantia[user] = garantia * .95;
           //Devuelve false si fue pago en los 5 dias de ejecucion del contrato
           pago = false;
           return pago ;


           }
    }
  
  }
}

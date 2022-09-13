import axios from 'axios'
// const MoltinGateway = require('@moltin/sdk').gateway
import { gateway as MoltinGateway } from '@moltin/sdk';
import { MoltinClient } from '@moltin/request';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { CartItem } from '@components/cart';
import { useEffect, useMemo, useState } from 'react'
import { SWRHook } from '@commerce/utils/types'

const cartId = getCookie('cartId');
const customer_token = getCookie('user_token');
  console.log("cartId in show tax  " , cartId );
  console.log("customer token " ,customer_token )

 
 function getTax (cartId : any){
  console.log(cartId , "in tax calculation") 
 const tax =   axios({
    url: 'http://localhost:3000/events/store/showTax',
    method: 'POST',
    data: {
      payload: {
        data: {
          cartId: cartId
        }
      }
    }
  })
  .then((response) =>{
    let rates = 0;
  for (const item of response.data.TaxRates.taxdata) {
    rates += item.rate;
  }
  console.log(rates);
 return rates
  })
  return tax
}

  export default  function useShowTax(
    data?: {
      amount: number
      cartId: string 
    } | null
  ) {
    console.log(data , " before function ")
    const value =    useMemo( async () => {
     const res = await getTax(data?.cartId);
      return res;
       
    }, [data?.amount , data?.cartId])
  
    return  value
  }
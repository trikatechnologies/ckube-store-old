import axios from 'axios'
import getCustomerCookie from './get-customer-creds'

const adminRequest = async (
    endpoint: { 
      method: any; 
      url: string;
    }, 
    payload?: object | undefined
  ) => {
    
  const customer_token = getCustomerCookie();
  let base_url = process.env.NEXT_PUBLIC_CKUBE_BASE;
  let config = {
    url: base_url+endpoint.url,
    method: endpoint.method,
    data : payload
  };
  
  if(customer_token.token){
    try {
      let res = await axios(config)
      return {
        ...res, 
        success: true
      };
    } catch(err:any) {
      throw {...err.response, success: false};
    }
  }
}

export default adminRequest;
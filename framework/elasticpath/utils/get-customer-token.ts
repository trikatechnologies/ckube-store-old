
import Cookies from 'js-cookie'

const getCustomerToken = () => {
  const customerCookieObj = Cookies.get('customer_token');
  if(customerCookieObj) {
    try {
      return JSON.parse(Buffer.from(customerCookieObj, 'base64').toString());
    } catch(err) {
      return false;
    } 
  } else {
    return false;
  }
}
export default getCustomerToken;
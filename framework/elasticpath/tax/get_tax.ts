import adminRequest from '../utils/request'
import epClient from '../utils/ep-client'

async function getTax(input:any,cartData:any) {
  async function wait(s: number | undefined) {
    return new Promise(resolve => {
      setTimeout(resolve, s);
    });
  }
  const customerAddress = {
    first_name: input.firstName,
    last_name: input.lastName,
    phone_number: "",
    company_name: input.company,
    line_1: input.streetNumber,
    city: input.city,
    postcode:input.zipCode,
    county: "",
    country: input.country,
    instructions: ""
  }
  const endpoint = {
    url: '/store-events/6204e01520425c0020310413/get-tax',
    method: 'POST'
  }
  const payload = {
    payload:{
      data:{
        cart_id:cartData.id,
        shipping_address: customerAddress
      }
    }
  }
  const response = await adminRequest(endpoint, payload)
  if (response?.status == 200){
    await wait(3000);
    await epClient.Cart().Get();
  }
  
}

export default getTax;
import adminRequest from '../utils/request'

async function getShippingrates(input:any,cartData:any) {
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
    url: '/store-events/6204e01520425c0020310413/shipping-added',
    method: 'POST'
  }
  const payload = {
    payload:{
      data:{
        cartId:cartData.id,
        shipping_address: customerAddress
      }
    }
  }
  const response = await adminRequest(endpoint, payload)
  
  if (response?.status == 200){
    await wait(3000);
    const endpoint = {
      url: '/store-events/6204e01520425c0020310413/get-shipping-rates',
      method: 'POST'
    }
    const res = await adminRequest(endpoint, payload)
    return res?.data?.shippingRates[0]?.shipmentCost || 0
  }
  
}

export default getShippingrates;
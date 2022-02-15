import type { MutationHook } from '@commerce/utils/types'
import { useCallback } from 'react'
import useAddItem, { UseAddItem } from '@commerce/customer/address/use-add-item'
import useAddresses from './use-addresses'
import { useCheckoutContext } from '@components/checkout/context'
import epClient from '../../utils/ep-client'
import getCustomerCookie from '../../utils/get-customer-creds'
import adminRequest from '../../utils/request'
export default useAddItem as UseAddItem<typeof handler>

export const handler: MutationHook<any> = {
  fetchOptions: {
    url: '',
    method: '',
  },
  async fetcher ({input, options, fetch }){
    const customer_token = getCustomerCookie();
    input['name'] = "home";
    await epClient.Addresses.Create({
      customer: customer_token.customer_id,
      body: input,
      token:customer_token.token
    })
  },

  useHook: ({ fetch }) =>
    function useHook() {
      const { mutate } = useAddresses()
      const { setAddressFields } = useCheckoutContext()
      return useCallback(
        async function addItem(input) {
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
          
          await epClient.Cart().Get();
          const data = await fetch({ input:customerAddress })
          await mutate([data], false)
          setAddressFields(data)
          return data
        },
        [fetch, mutate, setAddressFields]
      )
    },
  }

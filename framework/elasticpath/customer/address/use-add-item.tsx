import type { AddItemHook } from '@commerce/types/customer/address'
import type { MutationHook } from '@commerce/utils/types'

import { useCallback } from 'react'
import useAddItem, { UseAddItem } from '@commerce/customer/address/use-add-item'
import useAddresses from './use-addresses'
import lookup from 'country-code-lookup'

import epClient from '../../utils/ep-client'

// import { gateway as MoltinGateway } from '@moltin/sdk';

// let Moltin:any = MoltinGateway({
//   client_id: process.env.NEXT_PUBLIC_ELASTICPATH_CLIENTID,
//   client_secret: process.env.NEXT_PUBLIC_ELASTICPATH_SECRET
// });

export default useAddItem as UseAddItem<typeof handler>

export const handler: MutationHook<AddItemHook> = {
  fetchOptions: {
    url: 'CustomerAddresses',
    method: 'Create'
  },
  async fetcher({ input, options, fetch }) {
    let data = {
      first_name: input.firstName,
      last_name: input.lastName,
      line_1: input.streetNumber,
      postcode: input.zipCode,
      type: input.type,
      country: lookup.byCountry(input.country)?.iso2,
      county: 'Sunnyville'
    } 

    const { params } = await fetch({
      ...options,
      variables: {
        params: [{
          customer: '1f72bb5c-233e-46fa-ac67-cc5871553399',
          data
        }]
      }
    });
    console.log("Add items item file", params);
    return params;
  },
  useHook: ({ fetch }) =>
    function useHook() {
      const { mutate } = useAddresses()

      return useCallback(
        async function addItem(input) {
          const data = await fetch({ input })

          await mutate([data], false)

          return data
        },
        [fetch, mutate]
      )
    },
}


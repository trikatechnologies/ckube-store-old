import type { AddItemHook } from '@commerce/types/customer/address'
import type { MutationHook } from '@commerce/utils/types'

import { useCallback } from 'react'
import useAddItem, { UseAddItem } from '@commerce/customer/address/use-add-item'
import useAddresses from './use-addresses'

import epClient from '../../utils/ep-client'

import { gateway as MoltinGateway } from '@moltin/sdk';

let Moltin:any = MoltinGateway({
  client_id: process.env.NEXT_PUBLIC_ELASTICPATH_CLIENTID,
  client_secret: process.env.NEXT_PUBLIC_ELASTICPATH_SECRET
});

export default useAddItem as UseAddItem<typeof handler>

export const handler: MutationHook<AddItemHook> = {
  fetchOptions: {
    query: ''
  },
  async fetcher({ input, options, fetch }) {
    // return epClient.Cart().AddProduct()
    // console.log("Moltin", Moltin);
    // console.log("CLient id", process.env.NEXT_PUBLIC_ELASTICPATH_CLIENTID);
    // console.log("Client secret", process.env.NEXT_PUBLIC_ELASTICPATH_SECRET);
    // return Moltin.CustomerAddresses.Create({
    //   customer: '1f72bb5c-233e-46fa-ac67-cc5871553399', 
    //   body: {data: {input}}
    // })

    // var raw = JSON.stringify({data: input});
    const {params} = await fetch({
      url: `https://api.moltin.com/v2/customers/1f72bb5c-233e-46fa-ac67-cc5871553399/addresses`,
      method: 'POST',
      variables: {
        params: {data: input}
      }
    });
    console.log(params);
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


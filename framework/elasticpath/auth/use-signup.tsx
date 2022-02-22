import { useCallback } from 'react'
import useCustomer from '../customer/use-customer'
import { MutationHook } from '@commerce/utils/types'
import { CommerceError } from '@commerce/utils/errors'
import useSignup, { UseSignup } from '@commerce/auth/use-signup'
import epClient from '../utils/ep-client'
import jwt_access from '@framework/api/token/jwt-token'
import Cookies from 'js-cookie'

export default useSignup as UseSignup<typeof handler>

export const handler: MutationHook<any> = {
  fetchOptions: {
    query: '',
  },
  async fetcher({ input: { firstName, lastName, email, password }, options, fetch }) {
    console.log("input", firstName)
    if (!(firstName && lastName && email && password)) {
      throw new CommerceError({
        message:
          'A first name, last name, email and password are required to login',
      })
    }

    const data = await epClient.Customers.Create({
      email, 
      type: "customer",
      name: `${firstName} ${lastName}`, 
      password });
      const cus_details = {
        email: email,
        customerId: data.customer_id
      }
      const customer_token = await jwt_access(cus_details);
      Cookies.set("jwt_token",JSON.stringify(customer_token));
    return data || null;
  },
  useHook: ({ fetch }) => () => {
    const { revalidate } = useCustomer()

    return useCallback(
      async function signup(input) {
        const data = await fetch({ input })
        await revalidate()
        return data
      },
      [fetch, revalidate]
    )
  },
}

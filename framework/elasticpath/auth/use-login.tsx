import { useCallback } from 'react'
import type { MutationHook } from '@commerce/utils/types'
import { CommerceError } from '@commerce/utils/errors'
import useLogin, { UseLogin } from '@commerce/auth/use-login'
import useCustomer from '../customer/use-customer'
import Cookies from 'js-cookie'
import jwt_access from '@framework/api/token/jwt-token'

export default useLogin as UseLogin<typeof handler>

export const handler: MutationHook<any> = {
  fetchOptions: {
    url: 'Customers',
    method: 'TokenViaPassword',
  },
  async fetcher({ input: { email, password }, options, fetch }) {
    if (!(email && password)) {
      throw new CommerceError({
        message:
          'A first name, last name, email and password are required to login',
      })
    }
    const {data:token} = await fetch({
      ...options,
      variables:{
        params: [email, password]
      }
    });
    const cus_details = {
      email: email,
      customerId: token.customer_id
    }
    const customer_token = await jwt_access(cus_details);
    let expireTime = Math.round(token.expires/(1000*24*60*60));
    Cookies.set("jwt_token",JSON.stringify(customer_token), { expires: expireTime });
    Cookies.set("user_token", 
                JSON.stringify(token), 
                { expires: expireTime });
    return token || null;
  },
  useHook: ({ fetch }) => () => {
    const { revalidate } = useCustomer()

    return useCallback(
      async function login(input) {
        const data = await fetch({ input })
        await revalidate()
        return data
      },
      [fetch, revalidate]
    )
  },
}

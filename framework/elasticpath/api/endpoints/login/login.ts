import { FetcherError } from '@commerce/utils/errors'
import type { LoginEndpoint } from '.'
import jwtToken from '../../token/jwt-token';

const MoltinGateway = require('@moltin/sdk').gateway
const Moltin = MoltinGateway({
  client_id: process.env.NEXT_PUBLIC_ELASTICPATH_CLIENTID,
  client_secret: process.env.ELASTICPATH_SECRET
})

const login: LoginEndpoint['handlers']['login'] = async ({
  res,
  body: { email, password },
  config,
  commerce,
}) => {
  // TODO: Add proper validations with something like Ajv
  if (!(email && password)) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }
  // TODO: validate the password and email
  // Passwords must be at least 7 characters and contain both alphabetic
  // and numeric characters.
  try {
    let tokens = await Moltin.Customers.Token(email, password);
    let customer_token = JSON.stringify({
      customer_id: tokens.data.customer_id,
      token: tokens.data.token,
      id: tokens.data.id
    });
    let expiry = new Date(Date.now() + tokens.data.expires);
    // generate jwt token based on customer data
    let tokenData = {
      customerId: tokens.data.customer_id,
      email:email,
      ecommerce: process.env.COMMERCE_PROVIDER
    };
    let token = await jwtToken.jwt_token(tokenData)
    
    // encodeing the tocken object with btoa
    // in clinet side, use atob to decode the token object
    let jwt_token = `jwt_token=${token};Expires=${expiry};Path=/`;
    let user_token = `user_token=${customer_token};Expires=${expiry};Path=/`
    res.setHeader("Set-Cookie", [user_token, jwt_token]);

    return res.status(200).json(tokens);
  } catch (error) {
    console.error(error);
    let errorData = error.errors[0];
    // Check if the email and password didn't match an existing account
    if (errorData.status == 404) {
      return res.status(401).json({
        data: null,
        errors: [
          {
            message:
              'Cannot find an account that matches the provided credentials',
            code: 'invalid_credentials',
          },
        ],
      })
    }

    throw error
  }

  res.status(200).json({ data: null })
}

export default login

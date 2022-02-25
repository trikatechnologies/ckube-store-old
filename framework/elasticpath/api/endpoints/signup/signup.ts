import type { SignupEndpoint } from '.'
import jwtToken from '../../token/jwt-token';

const MoltinGateway = require('@moltin/sdk').gateway
const Moltin = MoltinGateway({
  client_id: process.env.NEXT_PUBLIC_ELASTICPATH_CLIENTID,
  client_secret: process.env.ELASTICPATH_SECRET
})

const signup: SignupEndpoint['handlers']['signup'] = async ({
  res,
  body: { firstName, lastName, email, password },
  config,
  commerce,
}) => {
  // TODO: Add proper validations with something like Ajv
  if (!(firstName && lastName && email && password)) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }
  // TODO: validate the firstname, lastname, password and email
  // Passwords must be at least 7 characters and contain both alphabetic
  // and numeric characters.
  const customer = {
    type: 'customer',
    name: firstName + lastName,
    email: email,
    password: password
  }
  try {
    let customerData = await Moltin.Customers.Create(customer)
    if(customerData){
      
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
        
        // set the token to header
        let jwt_token = `jwt_token=${token};Expires=${expiry};Path=/`;
        let user_token = `user_token=${customer_token};Expires=${expiry};Path=/`
        res.setHeader("Set-Cookie", [user_token, jwt_token]);
        return res.status(200).json(tokens);
      }
      else {
        return res.status(401).json({
          data: null,
          errors: [{ 
            message: 'Account not created. Please try again',
            code: 'invalid_credentials',}],
          })
      }
  } catch (error) {
    let errorData = error.errors[0];
    // Check if the email and password didn't match an existing account
    if (errorData.status == 409) {
      return res.status(401).json({
        data: null,
        errors: [
          {
            message:
              'Account not created. Please try again',
            code: 'invalid_credentials',
          },
        ],
      })
    }

    throw error
  }
}

export default signup

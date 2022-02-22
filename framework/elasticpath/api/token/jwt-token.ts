import jwt from 'jsonwebtoken';

const jwt_access= async(payload:any) => {
    const secretKey:any = process.env.NEXT_PUBLIC_JWT_SECRET;
	let options = {
		issuer: "ecf",
		subject: 'Access Tokens',
		audience: payload.email
	};
	let tokenData = {
		"id": payload.customerId,
		"email":payload.email,
		"ecommerce": process.env.NEXT_PUBLIC_COMMERCE_PROVIDER
	};
	console.log(tokenData,"tokenData")
	let newToken;
	try {
	  newToken = jwt.sign(tokenData, secretKey, options);
	} catch(e){
       console.log("error",e)
	}
    return newToken

};

export default jwt_access



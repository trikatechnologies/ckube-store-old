const fs = require('fs');
const jwt = require('jsonwebtoken');

var jwt_token = async (payload) => {
	var privateKEY = fs.readFileSync('framework/elasticpath/api/token/keys/private.txt', 'utf8');
	// assign values to the signOpt object and token data object using the payload values
	var jwtOpt = {
		issuer: "ecf",
		subject: 'Access Tokens',
		audience: payload.email,
		expiresIn: '20m',
		algorithm: "RS256"
	},
		tokenData = {
			"id": payload.customerId,
			"email":payload.email,
			"ecommerce": process.env.COMMERCE_PROVIDER
		};
	// calling sign function with tokenData, signOPt and the RSA private key  which returns the new token required to access data. 
	let newToken = jwt.sign(tokenData, privateKEY, jwtOpt);
    return newToken
};


module.exports = {
	jwt_token: jwt_token
};
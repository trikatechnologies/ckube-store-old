const storeId = process.env.NEXT_PUBLIC_ELASTICPATH_STOREID;
const clientid = process.env.NEXT_PUBLIC_ELASTICPATH_CLIENTID;
const clientSecret = process.env.ELASTICPATH_SECRET;

let tokenExpires = false;
let tokenValid = null;

const getToken = async () => {
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("content-type", "application/x-www-form-urlencoded");
    myHeaders.append("x-moltin-auth-store", `${storeId}`);
    myHeaders.append("content-type", "text/plain");

    var urlencoded = new URLSearchParams();
    urlencoded.append("client_id", `${clientid}`);
    urlencoded.append("client_secret", `${clientSecret}`);
    urlencoded.append("grant_type", "client_credentials");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
    };

    tokenValid = await fetch("https://api.moltin.com/oauth/access_token", requestOptions)
    return tokenValid.json();
}
const getCustomerMoltinToken = async () => {
    if (!tokenExpires) {
        const token = await getToken();
        tokenExpires = true;
        return token;
    } else {
        return tokenValid.json();
    }
}
export default getCustomerMoltinToken;
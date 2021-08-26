const storeId = process.env.NEXT_PUBLIC_ELASTICPATH_STOREID;
const clientid = process.env.NEXT_PUBLIC_ELASTICPATH_CLIENTID;
const clientSecret = process.env.ELASTICPATH_SECRET;

const tokenExpires = false;

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

    const token = await fetch("https://api.moltin.com/oauth/access_token", requestOptions)
    return token.json();
}
const getCustomerMoltinToken = async () => {
    if (tokenExpires == false) {
      const token = await getToken();
      return token;
    } else {
        return '';
    }
}
export default getCustomerMoltinToken;
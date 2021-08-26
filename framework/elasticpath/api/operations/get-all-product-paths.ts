import data from '../../data.json'
import { gateway as MoltinGateway } from '@moltin/sdk'
import normalizeProduct from '../../utils/normalize'
import getCustomerMoltinToken from '../../utils/get-customer-moltin-token'

const Moltin = MoltinGateway({
  client_id: process.env.NEXT_PUBLIC_ELASTICPATH_CLIENTID
})
//Moltin.config.version="pcm";
export type GetAllProductPathsResult = {
  products: Array<{ path: string }>
}

export default function getAllProductPathsOperation() {
  async function getAllProductPaths(): Promise<GetAllProductPathsResult> {
    // let products = await Moltin.Products.Limit(200).All();
    // let normalizeProducts = await normalizeProduct(products.data)
    // let productPaths = normalizeProducts.map(({ path }) => ({ path }));
    const moltinToken = await getCustomerMoltinToken();
    const storeId = process.env.NEXT_PUBLIC_ELASTICPATH_STOREID;
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("x-moltin-auth-store", `${storeId}`);
    myHeaders.append("Authorization", `Bearer ${moltinToken.access_token}`);

    let allProducts = await fetch("https://api.moltin.com/pcm/catalog/products", {
      method: 'GET',
      headers: myHeaders
    })
    let normalizeProducts = await normalizeProduct(await allProducts.json())
    let productPaths = normalizeProducts.map(({ path }) => ({ path }));
    return await Promise.resolve({
      products: productPaths
      // products: data.products.map(({ path }) => ({ path })),
    })
  }

  return getAllProductPaths
}

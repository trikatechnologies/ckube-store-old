import { Product } from '@commerce/types/product'
import { GetAllProductsOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'
import type { ElasticpathConfig, Provider } from '../index'
import { gateway as MoltinGateway } from '@moltin/sdk'
import normalizeProduct from '../../utils/normalize'
import data from '../../data.json'
import getCustomerMoltinToken from '../../utils/get-customer-moltin-token'

const Moltin = MoltinGateway({
  client_id: process.env.NEXT_PUBLIC_ELASTICPATH_CLIENTID,
  // client_secret: process.env.ELASTICPATH_SECRET
})
// Moltin.config.version="pcm";
export default function getAllProductsOperation({
  commerce,
}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<ElasticpathConfig>
    preview?: boolean
  } = {}): Promise<{ products: Product[] | any[] }> {
    const moltinToken = await getCustomerMoltinToken();
    // console.log("moltinToken", moltinToken)
    const storeId = process.env.NEXT_PUBLIC_ELASTICPATH_STOREID;
    // elastic path get all products
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("x-moltin-auth-store", `${storeId}`);
    myHeaders.append("Authorization", `Bearer ${moltinToken.access_token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };

    let allProducts = await fetch("https://api.moltin.com/pcm/catalog/products", requestOptions)
    // console.log("allProducts", await allProducts.json())
    // let products = await Moltin.Products.Limit(200).All();
    let normalizeProducts = await normalizeProduct(await allProducts.json())
    // console.log("normalizeProducts", normalizeProducts)
    return {
      products: normalizeProducts,
      // products: data.products,
    }
  }
  return getAllProducts
}

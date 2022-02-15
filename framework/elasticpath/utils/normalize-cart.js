import shipping from '@framework/shipping/shipping-rates'

const normalizeLineItem = ({
  id, 
  name, 
  quantity, 
  product_id:productId,
  sku,
  image,
  value,
  unit_price
}) => {
  const item = {
    id,
    variantId: productId,
    productId,
    name,
    quantity,
    variant: {
      id: productId,
      sku,
      name,
      image: {
        url: image.href || '/',
      },
      requiresShipping: false,
      price: (unit_price.amount/100),
      listPrice: (unit_price.amount/100),
    },
    path: '',
    discounts: [],
    options: [],
  }
  return item
}

const normalizeCart = async (cart, lineItems) => {
  const {with_tax, without_tax} = cart.meta?.display_price;
  const {amount} = cart.meta?.display_price?.tax;
  const customer_address = JSON.parse(localStorage.getItem("customerAddress"))
  const shippingRate = 0;
  if(customer_address !== null){
    shippingRate = await shipping(customer_address, cart)
    console.log("with_tax + shippingRates", (with_tax.amount/100) + shippingRate)
  }
  return {
    id: cart.id,
    createdAt: cart.meta.timestamps.created_at,
    currency: { code: with_tax.currency },
    taxesIncluded: '',
    lineItems: lineItems?.map(normalizeLineItem) ?? [],
    lineItemsSubtotalPrice: cart.meta?.display_price.without_tax || 0,
    subtotalPrice: (without_tax.amount/100) || 0,
    totalPrice: (with_tax.amount/100)+ shippingRate,
    tax: (amount/100) || 0,
    shipping: shippingRate
  };
}

export default normalizeCart;
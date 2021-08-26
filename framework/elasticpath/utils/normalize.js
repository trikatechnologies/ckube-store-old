import {
	gateway as MoltinGateway
} from '@moltin/sdk'
const Moltin = MoltinGateway({
	client_id: process.env.NEXT_PUBLIC_ELASTICPATH_CLIENTID
})

const normalizeProduct = async(products) => {
	// console.log("products", products)
	let normalizeProducts = []

	const productImageGet = async(fileId) => {
		try {
			let apiImage = await Moltin.Files.Get(fileId);
			return apiImage;
		} catch (error) {

		}
	}

	const normalizeProductImages = async(productId) => {
		let fileId;
		// console.log("productId", productId.relationships)
		if (productId.relationships.files.data) {
			fileId = productId.relationships.files.data[0].id;
			let productImageObject = await productImageGet(fileId);
			// console.log("productImageObject", productImageObject.data.link.href)
			return productImageObject.data.link.href;
		}
		return '';
	}

	const normalizeProductVariants = (productVariants) => {
		return [
			{
			  "id": "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzU0NDczMjUwMjQ0MjAss=",
			  "options": [
				{
				  "__typename": "MultipleChoiceOption",
				  "id": "asd",
				  "displayName": "Size",
				  "values": [
					{
					  "label": "XL"
					}
				  ]
				}
			  ]
			}
		  ];
	}

	for (let index in products.data) {
		let product = products.data[index];
		// console.log("product-single", product)
		normalizeProducts.push({
			"id": product.hasOwnProperty("id") ? product.id : '',
			"name": product.attributes.hasOwnProperty("name") ? product.attributes.name : '',
			"vendor": "trika",
			"path": product.attributes.hasOwnProperty("slug") ? "/" + product.attributes.slug : '',
			"slug": `${product.attributes.hasOwnProperty("slug") ? product.attributes.slug:''}`,
			"price": {
				"value": product.meta.hasOwnProperty("display_price") ? product.meta.display_price.without_tax.hasOwnProperty("amount") ? product.meta.display_price.without_tax.amount : '' : '',
				"currencyCode": product.meta.hasOwnProperty("display_price") ? product.meta.display_price.without_tax.hasOwnProperty("currency") ? product.meta.display_price.without_tax.currency : '' : ''
			},
			"descriptionHtml": product.attributes.hasOwnProperty("description") ? product.attributes.description : null,
			"images": [{
				"url": await normalizeProductImages(product),
				"altText": "Shirt",
				"width": 1000,
				"height": 1000
			}],
			"variants": normalizeProductVariants(product),
			"options": [{
					"id": "option-color",
					"displayName": "Color",
					"values": [{
						"label": "color",
						"hexColors": [
							"#222"
						]
					}]
				},
				{
					"id": "option-size",
					"displayName": "Size",
					"values": [{
							"label": "S"
						},
						{
							"label": "M"
						},
						{
							"label": "L"
						}
					]
				}
			]
		})
	}
	return normalizeProducts;
}

export default normalizeProduct;
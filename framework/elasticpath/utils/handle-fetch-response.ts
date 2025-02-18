import { CommerceError } from '@commerce/utils/errors'

type ElasticpathFetchResponse = {
  error: {
    message: string
    code?: string
  }
}

const handleFetchResponse = async (res: ElasticpathFetchResponse) => {
  if (res) {
    if (res.error) {
      throw new CommerceError(res.error)
    }
    return res
  }
}

export default handleFetchResponse

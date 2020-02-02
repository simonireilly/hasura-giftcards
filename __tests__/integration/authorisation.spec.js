import clientConstructor from '../../support/client'
import {
  GET_ALL_GIFT_CARDS
} from '../../support/queries'

describe('authentication', () => {
  it('prevents any access to those without a valid authorization header', () => {
    const noAuthClient = clientConstructor({})
    expect.assertions(1)

    return expect(noAuthClient.request(GET_ALL_GIFT_CARDS, {}))
      .rejects.toThrowError('Missing Authorization header in JWT authentication mode')
  })

  it('prevents unknown roles accessing the scope', () => {
    const noRoleClient = clientConstructor({
      role: 'not role',
      subdomain: 'new guy'
    })
    expect.assertions(1)

    return expect(noRoleClient.request(GET_ALL_GIFT_CARDS, {}))
      .rejects.toThrowError('field \"gift_cards\" not found in type: \'query_root\':')
  })

  it('allows valid users to access the scope', async () => {
    const authClient = clientConstructor({
      role: 'organisation',
      subdomain: 'valid_tenant'
    })
    const response = await authClient.request(GET_ALL_GIFT_CARDS)
    expect(response).toEqual(
      expect.objectContaining({
        gift_cards: []
      })
    )
  })
})

import clientConstructor from '../../support/client'
import {
  GET_ALL_GIFT_CARDS
} from '../../support/queries'

describe('authentication', () => {
  it('prevents unknown roles accessing the scope', () => {
    const noAuthClient = clientConstructor({
      role: 'not role',
      subdomain: 'new guy'
    })
    expect.assertions(1)

    return expect(noAuthClient.request(GET_ALL_GIFT_CARDS)).rejects.toEqual(
      expect.objectContaining({
        Error: expect.any(Object)
      })
    )
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

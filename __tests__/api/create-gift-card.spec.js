import { CREATE_GIFT_CARD, GET_GIFT_CARD } from '../../utils/queries'
import { GraphQLClient } from 'graphql-request'

process.env.RECORD_LOCAL = true
const Replay = require('replay')
Replay.mode = 'record'

const client = new GraphQLClient('http://localhost:8080/v1alpha1/graphql', {
  headers: {
    'x-hasura-admin-secret': 'myadminsecretkey'
  }
})

const code = 'STORE-0001'
const initialBalance = 2000

const variables = {
  code,
  initialBalance
}

describe('integration tests', () => {
  it('creates a valid gift card', async () => {
    const response = await client.request(CREATE_GIFT_CARD, variables)

    expect(response).toEqual(
      expect.objectContaining({
        insert_gift_cards: expect.any(Object)
      })
    )
  })

  it('fetches gift cards by code', async () => {
    const response = await client.request(GET_GIFT_CARD, { code })

    expect(response).toEqual(
      expect.objectContaining({
        gift_cards: [
          {
            available_balance: initialBalance,
            claims: [],
            id: expect.any(Number),
            code,
            initial_balance: initialBalance,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            valid_from: expect.any(String),
            valid_to: expect.any(String)
          }]
      })
    )
  })
})

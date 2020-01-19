import { CREATE_GIFT_CARD, GET_GIFT_CARD } from '../../utils/queries'
import { GraphQLClient } from 'graphql-request'
import { truncate, migrate, close } from '../../data/support'

const client = new GraphQLClient('http://hasura:8080/v1alpha1/graphql', {
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
  beforeAll(async () => migrate())
  beforeEach(async () => truncate())
  afterAll(async () => close())

  describe('create', () => {
    it('requires unique gift card codes', async () => {
      await client.request(CREATE_GIFT_CARD, variables)
      let error
      try {
        await client.request(CREATE_GIFT_CARD, variables)
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toMatch(/Uniqueness violation./)
    })

    it('creates a valid gift card', async () => {
      const response = await client.request(CREATE_GIFT_CARD, variables)

      expect(response).toEqual(
        expect.objectContaining({
          insert_gift_cards: expect.any(Object)
        })
      )
    })
  })

  it('fetches gift cards by code', async () => {
    await client.request(CREATE_GIFT_CARD, variables)
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

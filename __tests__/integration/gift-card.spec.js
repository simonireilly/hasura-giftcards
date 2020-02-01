import {
  CREATE_GIFT_CARD,
  GET_GIFT_CARD
} from '../queries'
import {
  GraphQLClient
} from 'graphql-request'
import {
  truncate,
  migrate,
  close
} from '../../data/support'

const organisationClient = new GraphQLClient('http://hasura:8080/v1alpha1/graphql', {
  headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldmVsb3BtZW50IG9yZ2FuaXNhdGlvbiIsImFkbWluIjp0cnVlLCJpYXQiOjE1ODA1ODcwNDcsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJvcmdhbmlzYXRpb24iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoib3JnYW5pc2F0aW9uIiwieC1oYXN1cmEtYWNjb3VudC1yZWZlcmVuY2UiOiJzdWJkb21haW4ifX0.KH6-8gUwGI_F21DS025IsNK2C9SdbMoLnHjQv1WUljQ'
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
      await organisationClient.request(CREATE_GIFT_CARD, variables)
      let error
      try {
        await organisationClient.request(CREATE_GIFT_CARD, variables)
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toMatch(/Uniqueness violation./)
    })

    it('creates a valid gift card', async () => {
      const response = await organisationClient.request(CREATE_GIFT_CARD, variables)

      expect(response).toEqual(
        expect.objectContaining({
          insert_gift_cards: expect.any(Object)
        })
      )
    })
  })

  it('fetches gift cards by code', async () => {
    await organisationClient.request(CREATE_GIFT_CARD, variables)
    const response = await organisationClient.request(GET_GIFT_CARD, {
      code
    })

    expect(response).toEqual(
      expect.objectContaining({
        gift_cards: [{
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

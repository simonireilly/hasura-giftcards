import {
  CREATE_GIFT_CARD,
  GET_GIFT_CARD,
  CREATE_CLAIM
} from '../../support/queries'

import {
  truncate,
  migrate,
  close
} from '../../support/db'

import clientConstructor from '../../support/client'

const code = 'STORE-0001'
const initialBalance = 2000

const variables = {
  code,
  initialBalance
}

const organisationClient = clientConstructor({
  role: 'organisation',
  subdomain: 'tenant_a'
})

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
    await organisationClient.request(CREATE_CLAIM, {
      gift_card_code: variables.code,
      amount: 2000
    })
    const response = await organisationClient.request(GET_GIFT_CARD, {
      code
    })

    expect(response).toEqual(
      expect.objectContaining({
        gift_cards: [{
          account_reference: 'tenant_a',
          claims: [expect.objectContaining({
            amount: 2000,
            account_reference: 'tenant_a',
            state: 'allocated',
            id: expect.any(Number)
          })],
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

const GET_GIFT_CARD = `
query GetGiftCardByCode($code: String) {
  gift_cards(where: {code: {_eq: $code}}) {
    account_reference
    id
    code
    valid_from
    valid_to
    initial_balance
    created_at
    updated_at
    claims {
      account_reference
      state
      id
      amount
    }
  }
}
`

export default GET_GIFT_CARD

const GET_GIFT_CARD = `
query GetGiftCardByCode($code: String) {
  gift_cards(where: {code: {_eq: $code}}) {
    id
    code
    valid_from
    valid_to
    initial_balance
    available_balance
    created_at
    updated_at
    claims {
      state
      id
      amount
    }
  }
}
`

export default GET_GIFT_CARD

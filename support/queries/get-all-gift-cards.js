const GET_ALL_GIFT_CARDS = `
query GetAllGiftCards {
  gift_cards {
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

export default GET_ALL_GIFT_CARDS

const CREATE_GIFT_CARD = `
  mutation CreateGiftCard($code: String, $initialBalance: Int) {
    insert_gift_cards(objects: {initial_balance: $initialBalance, code: $code}) {
      returning {
        initial_balance
        id
        created_at
        updated_at
        valid_from
        valid_to
      }
    }
  }
`

export default CREATE_GIFT_CARD

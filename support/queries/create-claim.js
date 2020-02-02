const CREATE_CLAIM = `
  mutation CreateClaim($gift_card_code: String, $amount: Int) {
    insert_claims(objects: {amount: $amount, gift_card_code: $gift_card_code}) {
      returning {
        authorisation_code
      }
    }
  }
`

export default CREATE_CLAIM

[![CircleCI](https://circleci.com/gh/simonireilly/hasura-giftcards.svg?style=svg)](https://circleci.com/gh/simonireilly/hasura-giftcards)

# Gift Cards Hasura

A simple gift card payment gateway written in hasura with postgres 12

## Workflow

## Queries

```graphql
query GetGiftCardByCode {
  gift_cards(where: {code: {_eq: "COOL_SHOP-1000001"}}) {
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

mutation CreateClaim {
  insert_claims(objects: {amount: 10, gift_card_id: 1}) {
    returning {
      id
    }
  }
}

mutation CreateGiftCard {
  insert_gift_cards(objects: {initial_balance: 10, code: "COOL_SHOP-1000001"}) {
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
```

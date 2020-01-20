[![CircleCI](https://circleci.com/gh/simonireilly/hasura-giftcards.svg?style=svg)](https://circleci.com/gh/simonireilly/hasura-giftcards)

# Gift Cards Hasura

A simple gift card payment gateway written in hasura with postgres 12

## DEV EX

To boot the app run `make up`.

To test the app run `make test`

To update the metadata use the hasura console at `localhost:8080` then run `make hasura-export-metadata`

Meta data is applied on boot of the hasura docker iamge, to clear it run `make hasura-clear-metadata`

## Workflow

- Request a gift card with an initial balance and a CODE
- Request a claim on that gift card which must be less than the available balance
- Settle/Reject the claim to increment the redeemed balance on the gift card
- Repeat

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

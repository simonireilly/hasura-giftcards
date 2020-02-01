[![CircleCI](https://circleci.com/gh/simonireilly/hasura-giftcards.svg?style=svg)](https://circleci.com/gh/simonireilly/hasura-giftcards)

# Gift Cards Hasura

A simple gift card payment gateway written in hasura with postgres 12

## DEV EX

Starting from scratch `make down init restart tail`.

To boot the app run `make up`.

To test the app run `make test`

To update the metadata use the hasura console at `localhost:8080` then run `make hasura-export-metadata`

Meta data is applied on boot of the hasura docker iamge, to clear it run `make hasura-clear-metadata`

## Overview

![](basic-entities.png)

### Authentication

We use JWT that are configured for the Roles of:

- Organizations
  - CRUD gift cards, claims
- Stores
  - Create Only claims

### Workflow

1. A valid JWT for an organization can be used to create a **gift card**.

```js
// Use the organisation token on your backend to make gift cards
//
// Authorisation: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldmVsb3BtZW50IG9yZ2FuaXNhdGlvbiIsImFkbWluIjp0cnVlLCJpYXQiOjE1ODA1ODcwNDcsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJvcmdhbmlzYXRpb24iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoib3JnYW5pc2F0aW9uIiwieC1oYXN1cmEtYWNjb3VudC1yZWZlcmVuY2UiOiJzdWJkb21haW4ifX0.KH6-8gUwGI_F21DS025IsNK2C9SdbMoLnHjQv1WUljQ
mutation CreateGiftCard {
  insert_gift_cards(objects: {
    initial_balance: 5000, // required
    code: "COOL_SHOP-1000001", // required
    valid_from: "2020-02-01T21:35:17.901473+00:00" // Optional
    valid_to: "2020-02-01T21:35:17.901473+00:00" // Optional
    }) {
    returning {
      id
      initial_balance
      created_at
      updated_at
      valid_from
      valid_to
      code
      verification_code
    }
  }
}
```

2. The **gift card** can be redeemed at a store by creating **claims** with a valid JWT for a Store.
3. The store can **only create claims**, it receives no data about the available balance (*will receive insufficient funds when attempting to make a claim that is rejected*)
   1. Claims return a unique token that must be stored in order to settle the claims.

```js
// Use the store token on your front end to generate claims
//
// Authorisation: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldmVsb3BtZW50IHN0b3JlIiwiYWRtaW4iOnRydWUsImlhdCI6MTU4MDU4ODY0NSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInN0b3JlIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InN0b3JlIiwieC1oYXN1cmEtYWNjb3VudC1yZWZlcmVuY2UiOiJzdWJkb21haW4ifX0.fA_6U8uFR0cZY2uddX8kUda-cwfLw-E0UcCd14-_-yk

mutation CreateClaim(objects: {
    amount: 1999, // required
    code: 'MYSTORE-1000001', // required
    verification_code: '231'  // required
  }) {
  returning {
    authorisation_code // Store in the database to settle the claim
  }
}
```

4. The backend service will settle the claims using the organizations valid JWT.
5. Successfully settled claims reduce the balance of the card, while pending claims reduce the available balance (*the ability to generate new claims is determined by the available balance*)

## Testing Locally

Tokens are generated locally at boot time using a static secret for ease of development.

import React from 'react'

import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const GET_GIFT_CARDS = gql`
  query GetAllGiftCards {
    gift_cards {
      code
      valid_from
      valid_to
      initial_balance
      available_balance
      redeemed_balance
    }
  }
`;

const CREATE_GIFT_CARD = gql`
  mutation CreateGiftCard($code: String!, $initial_balance: Int!) {
    insert_gift_cards(objects: {initial_balance: $initial_balance, code: $code}) {
      returning {
        code
      }
    }
  }
`

export default function indexPage() {
  let input;
  const [addGiftCard, { data: createData }] = useMutation(CREATE_GIFT_CARD);
  const { loading, error, data } = useQuery(GET_GIFT_CARDS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleInputChange = (event) => {
    console.log('changing')
    const target = event.target;
    const name = target.name;
    const value = target.value;

    input = { ...input, [name]: value }
  }

  return (
    <div>
      <h1>New Gift Card</h1>
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            addGiftCard({ variables: { code: input.code, initial_balance: input.initial_balance } });
            input.value = '';
          }}
        >
          <label>Code</label>
          <input
            name="code"
            type="text"
            onChange={(e) => handleInputChange(e)}
          />
          <label>Initial Balance</label>
          <input
            name="initial_balance"
            type="number"
            onChange={(e) => handleInputChange(e)} />
          <button type="submit">Add Gift Card</button>
        </form>
      </div>
      <h1>All gift cards</h1>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Initial Balance</th>
            <th>Valid from</th>
            <th>Valid to</th>
          </tr>
        </thead>
        <tbody>
          {data && data.gift_cards.map((gift_card) => (
            <tr key={gift_card.code}>
              <td>
                {gift_card.code}
              </td>
              <td>
                {gift_card.initial_balance}
              </td>
              <td>
                {gift_card.valid_from}
              </td>
              <td>
                {gift_card.valid_to}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

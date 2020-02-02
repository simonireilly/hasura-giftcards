import {
  GraphQLClient
} from 'graphql-request'
import jwt from 'jsonwebtoken'

// Should self sign the authorization token
//
// Testing should work without any other configuration

const hmacSecret = 'tXkNtKBfFpcu4Ac3GENggguWvFR9JFblo3ef'
const algorithm = 'HS256'
const iat = Math.round((new Date()).getTime() / 1000) - 1000

const baseClaims = {
  sub: '1234567890',
  name: 'Development organisation',
  admin: false,
  iat
}

module.exports = ({
  role = null,
  subdomain = null
}) => {
  const headers = {}
  if (role !== null && subdomain !== null) {
    const claims = {
      ...baseClaims,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': [role],
        'x-hasura-default-role': role,
        'x-hasura-account-reference': subdomain
      }
    }
    const token = jwt.sign(claims, hmacSecret, {
      algorithm
    })
    headers.Authorization = `Bearer ${token}`
  }

  return new GraphQLClient(process.env.HASURA_ENDPOINT, {
    headers
  })
}
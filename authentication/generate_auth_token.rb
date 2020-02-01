require "rubygems"
require "bundler/setup"
require "jwt"

# Authentication mechanism generates a secure JSON Web Token in Ruby
#
# This can be ported into a ruby code base and inherit its payload from
# the calling system

hmac_secret = "tXkNtKBfFpcu4Ac3GENggguWvFR9JFblo3ef"
type = "HS256"
org = {
  "sub": "1234567890",
  "name": "Development organisation",
  "admin": true,
  "iat": Time.now.to_i,
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["organisation"],
    "x-hasura-default-role": "organisation",
    "x-hasura-account-reference": "subdomain",
  },
}
store = {
  "sub": "1234567890",
  "name": "Development store",
  "admin": true,
  "iat": Time.now.to_i,
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["store"],
    "x-hasura-default-role": "store",
    "x-hasura-account-reference": "subdomain",
  },
}

organisation_token = JWT.encode org, hmac_secret, type
store_token = JWT.encode store, hmac_secret, type
puts "Test organisation TOKEN"
puts organisation_token
puts "Test store TOKEN"
puts store_token

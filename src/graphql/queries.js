/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserToken = /* GraphQL */ `
  query GetUserToken($id: ID!) {
    getUserToken(id: $id) {
      id
      userId
      token
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUserTokens = /* GraphQL */ `
  query ListUserTokens(
    $filter: ModelUserTokenFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserTokens(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        token
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUserToken = /* GraphQL */ `
  mutation CreateUserToken(
    $input: CreateUserTokenInput!
    $condition: ModelUserTokenConditionInput
  ) {
    createUserToken(input: $input, condition: $condition) {
      id
      userId
      token
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateUserToken = /* GraphQL */ `
  mutation UpdateUserToken(
    $input: UpdateUserTokenInput!
    $condition: ModelUserTokenConditionInput
  ) {
    updateUserToken(input: $input, condition: $condition) {
      id
      userId
      token
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteUserToken = /* GraphQL */ `
  mutation DeleteUserToken(
    $input: DeleteUserTokenInput!
    $condition: ModelUserTokenConditionInput
  ) {
    deleteUserToken(input: $input, condition: $condition) {
      id
      userId
      token
      createdAt
      updatedAt
      __typename
    }
  }
`;

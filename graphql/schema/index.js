const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Product {
    _id: ID!
    name: String!
    price: Float!
    weight: Float!
    description: String!
    specification: String!
    variation: String!
    tags: String
    category: String!
    stock: Int!
    picture: String!
    discount: String
    seller: User!
    buyer: [User!]
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    status: String!
    sellingProducts: [Product!]
    buyingProducts: [Product!]
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    status: String!
  }

  input ProductInput {
    name: String!
    price: Float!
    weight: Float!
    description: String!
    specification: String!
    variation: String!
    tags: String
    category: String!
    stock: Int!
    picture: String!
    discount: String
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    status: String!
  }

  type RootQuery {
    products: [Product!]!
    login(email: String!, password: String!) : AuthData!
  }

  type RootMutation {
    createProduct(productInput: ProductInput) : Product
    createUser(userInput: UserInput) : User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

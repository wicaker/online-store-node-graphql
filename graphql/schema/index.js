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
    picture: String
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

  type Booking {
    _id: ID!
    amount: Int!
    product: Product!
    user: User!
  }

  type Sold {
    _id: ID!
    product: Product!
    bookingId: Booking!
    buyer: User!
    amount: Int!
    name_receiper: String!
    tlp_number: String!
    address: String!
    expedition: String!
    destination_city: String!
    total: Float!
    payment_method: String!
  }

  type City {
    _id: ID!
    city_id: Int!,
    province_id: Int!,
    province: String!,
    type: String!,
    city_name: String!,
    postal_code: Int!
  }

  type PaypalPayment {
    _id: ID!
    pendingId : ID!
    email : String!
    payer_id : String!
    payment_id: String!
    payment_token: String!
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
    picture: String
    discount: String
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    status: String!
  }

  input BookingInput {
    product: String!
    amount : Int!
  }
  
  input SoldProductInput {
    bookingId: String!
    name_receiper: String!
    tlp_number: String!
    address: String!
    expedition: String!
    destination_city: String!
    payment_method: String!
  }

  input PaypalPaymentMethod {
    email: String!
    payerID: String!
    paymentID: String!
    paymentToken: String!
  }

  type RootQuery {
    products: [Product!]!
    productsCategory(category: String!): [Product!]!
    login(email: String!, password: String!) : AuthData!
    product(id: String!) : Product!
    bookings(userId:String!):[Booking!]!
    citys: [City!]!
    solds: [Sold!]!
    soldsAll: [Sold!]!
    adminProducts: [Product!]!
    successSoldProducts: [Sold!]!
    showReceivedPaypalPayment: [PaypalPayment!]!
  }

  type RootMutation {
    createProduct(productInput: ProductInput) : Product
    createUser(userInput: UserInput) : User
    bookingItem(bookingInput: BookingInput): Booking
    cancleBooking(bookingId: String!): Booking
    soldProduct(soldInput: SoldProductInput): Sold!
    successSoldProduct(soldId: String!): Sold!
    cancleSoldProduct(soldId: String!): Sold!
    deleteAdminProduct(productId: String!): Product!
    editAdminProduct(productInput: ProductInput, idProduct : String!) : Product!
    receivePaypalPayment(dataInput: PaypalPaymentMethod, pendingID: String!): PaypalPayment
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

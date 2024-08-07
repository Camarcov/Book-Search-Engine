const typeDefs = `
type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
}

input BookInput {
    authors: [String]!
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
}


type Book {
    bookId: String!
    authors: [String]!
    description: String!
    title: String!
    image: String
    link: String
}

type Auth {
    token: String!
    user: User
}

type Query {
    me: User
}

type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(userId: ID!, input: BookInput): User
    removeBook(userId: ID!, bookId: String!): User
}`

module.exports = typeDefs;
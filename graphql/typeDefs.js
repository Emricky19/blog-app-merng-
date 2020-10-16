const { gql } = require("apollo-server");

module.exports = typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
  }
  type Like {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
  }
  type User {
    token: String!
    id: ID!
    username: String!
    email: String!
    createdAt: String
  }
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  type Subscription {
    newPost: Post!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!  #takes form inputs and return User schema
    login(username: String!, password: String!): User!
    createPost(body: String!) : Post!
    deletePost(postId: ID!) : String!
    createComment(postId: ID!, body: String!): Post
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`;

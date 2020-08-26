const express = require('express')
const expressGraphQL = require('express-graphql')
const {
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql')
const app = express()

const authors = [
  { id: 1, name: 'JK Rowling' },
  { id: 2, name: 'Scott McHale'},
  { id: 3, name: 'Katie Mahoney'},
  { id: 4, name: 'Michael P Scott'}
]

const books = [
  { id: 1, name: 'Harry Potter and the Sorcerers Stone', authorID: 1 },
  { id: 2, name: 'Harry Potter and the Chamber of Secrets', authorID: 1},
  { id: 3, name: 'Harry Potter and the Prisoner of Azkaban', authorID: 1 },
  { id: 4, name: 'Pendragon', authorID: 2 },
  { id: 5, name: 'Give a Mouse a Cookie', authorID: 3, },
  { id: 6, name: 'Theory of Comp', authorID: 4 },
]

const ratings = [
  { id: 1, bookID: 1, name:'Jared', review: 'really good bro' },
  { id: 3, bookID: 2, name:'Jard', review: 'really bad bro' },
  { id: 4, bookID: 3, name:'Jake', review: 'really meh bro' },
  { id: 5, bookID: 4, name:'Jordan', review: 'really ee man' },
  { id: 6, bookID: 5, name:'Amber', review: 'ya know the deal bro' },
]

const AuthorType = new GraphQLObjectType ({
  name: 'Author',
  description: 'The Author of a Book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorID === author.id)
      }
    }
  })
}) 

const RatingType = new GraphQLObjectType({
  name: 'Rating',
  description: 'book rating',
  fields: () => ({
    bookID: { type: GraphQLNonNull(GraphQLInt) },
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    review: { type: GraphQLNonNull(GraphQLString) }
  })
})
  
const BookType = new GraphQLObjectType ({
  name: 'Book',
  description: 'Represents a book',
  fields: () => ({
    author: { 
      type: AuthorType,
      resolve: (book) => {
        return authors.find(author => author.id === book.authorID)
      }},
    authorID: { type: GraphQLNonNull(GraphQLInt) },
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    rating: {
      type: RatingType,
      resolve: (book) => {
        return ratings.find(rate => rate.bookID === book.id)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType ({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'Books',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    author: {
      type: AuthorType,
      description: 'Author',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of Books',
      resolve: () => books
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of Author',
      resolve: () => authors
    }
  })
})

//auto generated with databases
const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      decription: 'Add a book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorID: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = { id: books.length + 1, name: args.name, authorID: args.authorID };  
        books.push(book);
        return book;
      }
    },
    addAuthor: {
      type: AuthorType,
      decription: 'Add an author',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name};  
        authors.push(author);
        return author;
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}))
app.listen(5000., () => console.log('server running'))
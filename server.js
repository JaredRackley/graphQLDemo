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
  { id: 1, name: 'Harry Potter and the Sorcerers Stone', authorId: 1 },
  { id: 2, name: 'Harry Potter and the Chamber of Secrets', authorId: 1},
  { id: 3, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
  { id: 4, name: 'Pendragon', authorId: 2 },
  { id: 5, name: 'Give a Mouse a Cookie', authorId: 3, },
  { id: 6, name: 'Theory of Comp', authorId: 4 },
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
    name: { type: GraphQLNonNull(GraphQLString) }
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
        return authors.find(author => author.id === book.authorId)
      }},
    authorId: { type: GraphQLNonNull(GraphQLInt) },
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
    books: {
      type: new GraphQLList(BookType),
      description: 'List of Books',
      resolve: () => books
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType
})

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}))
app.listen(5000., () => console.log('server running'))
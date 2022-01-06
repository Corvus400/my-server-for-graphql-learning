const graphiql = require('graphql')
var _ = require('lodash')

// dummy data
var usersData = [
    {id: '1', name: 'Bond', age: 36},
    {id: '13', name: 'Anna', age: 26},
    {id: '211', name: 'Bella', age: 16},
    {id: '19', name: 'Gina', age: 26},
    {id: '150', name: 'Georgina', age: 36}
]

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphiql

// Create types
const UserType = new graphiql.GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: graphiql.GraphQLString},
        name: {type: graphiql.GraphQLString},
        age: {type: graphiql.GraphQLInt}
    })
})

// RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},

            resolve(parent, args) {
                return _.find(usersData, {id: args.id})

                // we resolve with data
                // get and return data from a datasource
            }
        }
    }
})

module.exports = new graphiql.GraphQLSchema({
    query: RootQuery
})
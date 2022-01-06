const graphiql = require('graphql')

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
                // we resolve with data
                // get and return data from a datasource
            }
        }
    }
})

module.exports = new graphiql.GraphQLSchema({
    query: RootQuery
})
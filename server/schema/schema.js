const graphiql = require('graphql')

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt
} = graphiql

// Create types
const UserType = new graphiql.GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: graphiql.GraphQLID},
        name: {type: graphiql.GraphQLString},
        age: {type: graphiql.GraphQLInt}
    })
})
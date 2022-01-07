const graphiql = require('graphql')
var _ = require('lodash')

// dummy data
var usersData = [
    {id: '1', name: 'Bond', age: 36, profession:'Programmer'},
    {id: '13', name: 'Anna', age: 26, profession:'Baker'},
    {id: '211', name: 'Bella', age: 16, profession:'Mechanic'},
    {id: '19', name: 'Gina', age: 26, profession:'Painter'},
    {id: '150', name: 'Georgina', age: 36, profession:'Teacher'}
]

var hobbiesData = [
    {id: '1', title: 'Programming', description:''},
    {id: '2', title: 'Rowing', description:''},
    {id: '3', title: 'Swimming', description:''},
    {id: '4', title: 'Fencing', description:''},
    {id: '5', title: 'Hiking', description:''}
]

var postsData = [
    {id:'1', comment: 'Building a Mind', userId: '1'},
    {id:'2', comment: 'GraphQL is Amazing', userId: '1'},
    {id:'3', comment: 'How to Change the World', userId: '19'},
    {id:'4', comment: 'How to Change the World', userId: '211'},
    {id:'5', comment: 'How to Change the World', userId: '1'},
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
        id: {type: graphiql.GraphQLID},
        name: {type: graphiql.GraphQLString},
        age: {type: graphiql.GraphQLInt},
        profession: {type: graphiql.GraphQLString}
    })
})

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString}
    })
})

const PostType = new graphiql.GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(usersData, {id: parent.userId})
            }
        }
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
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                return _.find(hobbiesData, {id: args.id})

                // return data for our hobby
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                return _.find(postsData, {id: args.id})

                // return data (post data)
            }
        }
    }
})

module.exports = new graphiql.GraphQLSchema({
    query: RootQuery
})
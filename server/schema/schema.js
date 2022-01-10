const graphiql = require('graphql')
var _ = require('lodash')
const User = require('../model/User')
const Hobby = require('../model/Hobby')
const Post = require('../model/Post')
const mongoose = require('mongoose')

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphiql

// Create types
const UserType = new graphiql.GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: graphiql.GraphQLID},
        name: {type: graphiql.GraphQLString},
        age: {type: graphiql.GraphQLInt},
        profession: {type: graphiql.GraphQLString},
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({userId: parent.id})
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({userId: parent.id})
            }
        }
    })
})

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent ,args) {
                return User.findById(parent.userId)
            }
        }
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
                return User.findById(parent.userId)
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
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return User.findById(args.id)
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({})
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Hobby.findById(args.id)
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({id: args.userId})
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Post.findById(args.id)
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({})
            }
        }
    }
})

const CreateHobbyInputType = new graphiql.GraphQLInputObjectType({
    name: "CreateHobbyInputType",
    description: "",
    fields: () => ({
        title: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: new GraphQLNonNull(GraphQLString)},
        userId: {type:  new GraphQLNonNull(GraphQLID)}
    })
})

const UpdateHobbyInputType = new graphiql.GraphQLInputObjectType({
    name: "UpdateHobbyInputType",
    description: "",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLID)},
        title: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: new GraphQLNonNull(GraphQLString)},
    })
})

const RemoveHobbyInputType = new graphiql.GraphQLInputObjectType({
    name: "RemoveHobbyInputType",
    description: "",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLID)},
    })
})

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                })
                return user.save()
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                return updatedUser = User.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession
                        }
                    },
                    {new: true}
                )
            }
        },
        removeUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let removedUser = User.findByIdAndRemove(
                    args.id
                ).exec()

                if(!removedUser) {
                    throw new("Error")
                }

                return removedUser
            }
        },
        createPost: {
            type: PostType,
            args: {
                comment: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let post = new Post({
                    comment: args.comment,
                    userId: args.userId
                })
                return post.save()
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                comment: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args) {
                return updatedPost = Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            comment: args.comment
                        }
                    },
                    {new: true}
                )
            }
        },
        removePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                let removedPost = Post.findByIdAndRemove(
                    args.id
                ).exec()

                if(!removedPost) {
                    throw new("Error")
                }

                return removedPost
            }
        },
        createHobby: {
            type: HobbyType,
            args: {
                hobby: {type: new GraphQLNonNull(CreateHobbyInputType)}
            },
            resolve(parent, args) {
                const hobbyModel = mongoose.model('Hobby')
                const input = args.hobby
                return hobbyModel.create({
                    title: input.title,
                    description: input.description,
                    userId: input.userId
                })
            }
        },
        createHobbies: {
            type: new GraphQLList(HobbyType),
            args: {
                hobbies: {type: new GraphQLNonNull(new GraphQLList(CreateHobbyInputType))}
            },
            resolve(parent, args) {
                const hobbyModel = mongoose.model('Hobby')
                const inputs = args.hobbies
                let hobbies = inputs.map( input =>
                    new Hobby({
                        title: input.title,
                        description: input.description,
                        userId: input.userId
                    })
                )

                return hobbyModel.insertMany(hobbies)
            }
        },
        updateHobby: {
            type: HobbyType,
            args: {
                hobby: {type: new GraphQLNonNull(UpdateHobbyInputType)}
            },
            async resolve(parent, args) {
                return await Hobby.findByIdAndUpdate(
                    args.hobby.id,
                    {
                        $set: {
                            title: args.hobby.title,
                            description: args.hobby.title
                        }
                    },
                    {new: true}
                )
            }
        },
        updateHobbies: {
            type: new GraphQLList(HobbyType),
            args: {
                hobbies: {type: new GraphQLNonNull(new GraphQLList(UpdateHobbyInputType))}
            },
            async resolve(parent, args) {
                for (let i = 0; i < args.hobbies.length; i++) {
                    const hobby = args.hobbies[i]
                    await Hobby.findByIdAndUpdate(
                        hobby.id,
                        {
                            $set: {
                                title: hobby.title,
                                description: hobby.title
                            }
                        },
                        {new: true}
                    )
                }
            }
        },
        removeHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let removedHobby = Hobby.findByIdAndRemove(
                    args.id
                ).exec()

                if (!removedHobby) {
                    throw "The Hobby with the specified ID does not exist."
                }

                return removedHobby
            }
        },
        removeHobbies: {
            type: new GraphQLList(HobbyType),
            args: {
                ids: {type: new GraphQLNonNull(new GraphQLList(RemoveHobbyInputType))}
            },
            async resolve(parent, args) {
                for (let i = 0; i < args.ids.length; i++) {
                    const element = args.ids[i]
                    await Hobby.findByIdAndRemove(
                        element.id
                    ).exec()
                }
            }
        }
    }
})

module.exports = new graphiql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
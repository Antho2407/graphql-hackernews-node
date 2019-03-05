const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.prisma.links()
    },
    link: (parent, args) => links.find((link) => link.id === args.id)
  },
  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description,
      })
    },
    updateLink: (parent, args) => {
      const index = links.findIndex(link => link.id === args.id)
      links[index] = {
        ...links[index],
        ...args
      }
      return links[index]
    },
    deleteLink: (parent, args) => {
      links = links.filter(link => link.id !== args.id)
      return args.id
    }
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
})
server.start(() => console.log(`Server is running on http://localhost:4000`))

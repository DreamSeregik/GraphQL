const { knex } = require('./connection')
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const PORT = 4000

var typeDefs = `#graphql
   type User {
    id: Int
    name: String
    age: Int
  }

  type Query {
    getAllusers: [User],
    getUserByID(id: Int): [User]
  }

  type Mutation {
    insertUser(name: String, age: Int): String,
    deleteUser(id: Int): String,
    updateUserName(id: Int, name: String): String,
    updateUserAge(id: Int, age: Int): String
  }
  `;

var resolvers = {
  Query: {
    getAllusers: async () => await knex('Ученики'),
    getUserByID: async (_, args) => await knex('Ученики').where('id', args.id)
  },
  Mutation: {
    insertUser: (_, args) => knex('Ученики').insert({
      'name' : args.name,
      'age' : args.age
    }).then((id) => {
      if (id == null)
        return 'ERROR'
      else
        return 'SUCCESS!'
    }),
    deleteUser: (_, args) => knex('Ученики').where('id', args.id).del().then(num => {
      if (num > 0)
        return 'SUCCESS!'
      else
        return 'ERROR'
    }),
    updateUserName: (_, args) => knex('Ученики').where('id', args.id).update({
      'name': args.name
    }).then(num => {
      if (num > 0)
        return 'SUCCESS!'
      else
        return 'ERROR'
    }),
    updateUserAge: (_, args) => knex('Ученики').where('id', args.id).update({
      'age': args.age
    }).then(num => {
      if (num > 0)
        return 'SUCCESS!'
      else
        return 'ERROR'
    })
  }
};

var server = new ApolloServer({
  typeDefs,
  resolvers
});

startStandaloneServer(server, {
  listen: { port: PORT },
});

console.log('Server started at: http://localhost:' + PORT);



const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");
const app = express();
// predefined users
let usersList = [
  { id: "1", name: "Ilyaas Omar", email: "ilyas@gmail.com" },
  { id: "2", name: "Halima Omar", email: "halima@gmail.com" },
  { id: "3", name: "Maida Muhudin", email: "maida@gmail.com" },
];
// defined user type schema or table
const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});
// create or mutation
const mutations = new GraphQLObjectType({
  name: "mutation",
  fields: {
    // adding a user
    addUser: {
      type: UserType,
      args: { name: { type: GraphQLString }, email: { type: GraphQLString } },
      resolve(parent, { name, email }) {
        const newUser = { name, email, id: Date.now().toString() };
        usersList.push(newUser);
        return newUser;
      },
    },
    // update a user
    updateUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        id: { type: GraphQLID },
      },
      resolve(parent, { id, name, email }) {
        const user = usersList.find((u) => u.id === id);
        user.name = name;
        user.email = email;
        return user;
      },
    },
    // delete a user
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, { id }) {
        const user = usersList.find((u) => u.id === id);
       usersList = usersList.filter((u) => u.id !== id);
        return user;
      },
    },
  },
});
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    // to get all users
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return usersList;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return usersList.find((user) => user.id === args.id);
      },
    },
  },
});
const schema = new GraphQLSchema({ query: RootQuery, mutation: mutations });
//use middleware for user api
app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));
app.listen(5000, () => {
  console.log("Server is Running");
});

const { makeExecutableSchema } = require("graphql-tools");
const mergeSchema = require("./types");
const axios = require("./axios");
const { GraphQLDate } = require("graphql-iso-date");
const DataLoader = require("dataloader");

const typeDefs = [
    `
  scalar Date

  type Query {
    version: String!
  }

  type Mutation {
    noop: String
  }
`,
];

const resolvers = {
    Date: GraphQLDate,
    Query: {
        version: () => "1",
    },
    Mutation: {
      noop: () => null,
    }
};

module.exports = {
    schema: makeExecutableSchema(mergeSchema({ typeDefs, resolvers })),
    context: req => {
        return {
            axios,
            loaders: {
                axiosLoader: new DataLoader(
                    queries => Promise.all(queries.map(([url, params]) => axios.get(url, params))),
                    { cacheKeyFn: query => JSON.stringify(query) }
                ),
            },
        };
    },
};

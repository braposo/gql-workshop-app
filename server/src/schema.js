const { makeExecutableSchema } = require("graphql-tools");
const mergeSchema = require("./types");
const axios = require("./axios");
const { GraphQLDate } = require("graphql-iso-date");

const typeDefs = [
    `
  scalar Date

  type Query {
    version: String!
  }
`,
];

const resolvers = {
    Date: GraphQLDate,
    Query: {
        version: () => "1",
    },
};

module.exports = {
    schema: makeExecutableSchema(mergeSchema({ typeDefs, resolvers })),
    context: req => {
        return {
            axios,
            loaders: {
                genres: (() => {
                    let genresPromise;
                    return () => {
                        if (!genresPromise) {
                            /* previous get genre logic here */
                            genresPromise = axios
                                .get("3/genre/movie/list")
                                .then(res => res.data.genres);
                        }

                        return genresPromise;
                    };
                })(),
            },
        };
    },
};

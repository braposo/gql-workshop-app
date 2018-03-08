exports.type = `
  type Genre {
    id: ID!
    name: String!
  }

  extend type Query {
    genre(id: ID!): Genre
  }
`;

exports.resolvers = {
    Query: {
        genre: (root, { id }, { axios, loaders }) => {
            return loaders.genres().then(genres => genres.find(genre => genre.id === parseInt(id)));
        },
    },
};

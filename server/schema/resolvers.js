const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('books')

        return userData;
      }
      throw new AuthenticationError('Not logged in')
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError('Incorrect username or password, try again');
      }

      const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new AuthenticationError('Incorrect username or password, try again');
      }
      
      const token = signToken(user);
      return { token, user };
      
    },

    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: book } },
          { new: true }
        );

        return user;
      }
      throw new AuthenticationError('Not logged in');
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          {$pull: { savedBooks: { bookId: bookId }}},
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError('Must log in to perform this action');
    }, 
  }
};

module.exports = resolvers;
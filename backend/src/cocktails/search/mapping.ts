export const Mapping = {
  properties: {
    id: {
      type: 'keyword',
    },
    title: {
      type: 'text',
      analyzer: 'english',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
        word_delimiter: {
          type: 'text',
          analyzer: 'word_delimiter',
        },
      },
    },
    description: {
      type: 'text',
      analyzer: 'english',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 1024,
        },
        word_delimiter: {
          type: 'text',
          analyzer: 'word_delimiter',
        },
      },
    },
    price: {
      type: 'float',
    },
  },
};

export const Settings = {
  analysis: {
    analyzer: {
      word_delimiter: {
        tokenizer: 'keyword',
        filter: ['word_delimiter'],
      },
    },
  },
};

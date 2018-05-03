const Sets = {
  count: function(set) {
    let result = 0;

    // eslint-disable-next-line no-unused-vars
    for (let n in set) {
      result++;
    }

    return result;

  },

  any: function(set) {
    // eslint-disable-next-line no-unused-vars
    for (let n in set) {
      return true;
    }

    return false;
  },

  intersection: function(a, b) {
    let result = {};

    for (let k in a) {
      if (b[k]) {
        result[k] = true;
      }
    }

    return result;
  },

  equal: function(a, b) {
    return Sets.count(Sets.intersection(a, b)) === Sets.count(a);
  }
};

module.exports = Sets;

module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  format_amount: (amount) => {
    // format large numbers with commas
    return parseInt(amount).toLocaleString();
  },
  eq: (va11, val2, options) => {
    // return true if equal
    if (va11 === val2) {
      return options.fn(this);
    }
  },
};

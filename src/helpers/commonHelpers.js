const paginate = (model, _page, _limit) => {
  const page = parseInt(_page, 10) || 1;
  const limit = parseInt(_limit, 10) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const result = {};
  if (endIndex < model.length) result.next = { page: page + 1, limit };
  if (startIndex > 0) result.previous = { page: page - 1, limit };

  result.results = model.slice(startIndex, endIndex);

  return result;
};

module.exports = {
  paginate
};

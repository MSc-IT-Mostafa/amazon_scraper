module.exports = (text) => {
  let match = text.match(/\d+/);
  return match ? match[0] : null;
};

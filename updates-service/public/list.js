const searchButton = document.getElementById('search-button');

const getQueryString = () => {
  const href = window.location.href;
  const position = href.indexOf('?');

  return href.slice(position + 1);
};

const parseQueryString = str => {
  const result = {};

  str.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    result[key] = value;
  });

  return result;
};

searchButton.onmouseup = () => {
  const value = Number(document.getElementById('search-field').value);
  if (Number.isNaN(value) || value === 0) {
    return;
  }

  const query = getQueryString();
  const { limit } = parseQueryString(query);

  //prettier-ignore
  window.location.href = `${window.location.origin}${window.location.pathname}?limit=${limit || 10}&id=${value}`
};

document.getElementById('drop').onmouseup = () => {
  window.location.href = `${window.location.origin}${window.location.pathname}`;
};

const ENDPOINT = 'https://auspic.es/graphql';

const QUERY = `{
  user(id: "damon") {
    tactics: collection(id: "tactics") {
      ...Collection
    }
    atlas: collection(id: "atlas") {
      ...Collection
    }
  }
}

fragment Collection on Collection {
  images: sample(amount: 1) {
    ... on Image {
      id
      image: resized(width: 800, height: 800) {
        height
        width
        url
      }
    }
  }
}`;

const shuffle = (xs) => {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
  return xs;
};

const renderCell = ({ image, id }) => `
  <div class='Cell'>
    <a href='https://auspic.es/damon/images/${id}' target='_blank'>
      <img
        src="${image.url}"
        width="${image.width}"
        height="${image.height}"
      />
    </a>
  </div>
`;

export default () => {
  const DOM = {
    app: document.getElementById('App'),
  };

  fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query: QUERY })
  })
    .then(res => res.json())
    .then(({ data: { user: { tactics, atlas } }}) => {
      DOM.app.innerHTML = shuffle([
        renderCell(tactics.images[0]),
        renderCell(atlas.images[0]),
      ]).join('');
    })
    // eslint-disable-next-line no-console
    .catch(console.error.bind(console));
};

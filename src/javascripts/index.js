const ENDPOINT =
  "https://atlas.auspic.es/graph/ff051744-2068-4507-a485-7cf52007263f";

const QUERY = `{
  diptychs: object {
    ... on Collection {
      id
      name
      contents {
        id
        entity {
          ... on Collection {
            id
            sample(amount: 1) {
              id
              entity {
                ... on Image {
                  id
                  image: resized(width: 800, height: 800) {
                    height
                    width
                    url
                  }
                }
              }
            }
          }
        }
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

const renderCell = ({ entity: { image }, id }) => `
  <div class='Cell'>
    <a href='https://gaea.auspic.es/damon/x/${id}' target='_blank'>
      <img
        src="${image.url}"
        width="${image.width}"
        height="${image.height}"
      />
    </a>
  </div>
`;

const DOM = {
  root: document.getElementById("root"),
};

fetch(ENDPOINT, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({ query: QUERY }),
})
  .then((res) => res.json())
  .then(
    ({
      data: {
        diptychs: { contents },
      },
    }) => {
      const cells = contents
        .map(({ entity: { sample } }) => sample[0])
        .map(renderCell);

      DOM.root.innerHTML = shuffle(cells).join("");
    }
  )
  .catch(console.error.bind(console));

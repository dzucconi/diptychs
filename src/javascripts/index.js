const ENDPOINT =
  "https://atlas.auspic.es/graph/ff051744-2068-4507-a485-7cf52007263f";

const QUERY = `
{
  diptychs: object {
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
                image: resized(width: 900, height: 900) {
                  height
                  width
                  urls {
                    _1x
                    _2x
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

const shuffle = (xs) => {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
  return xs;
};

const renderCell = ({ entity: { image }, id }) => `
  <a class='Cell' href='https://auspic.es/x/${id}' target='_blank'>
    <img
      class='Cell__image'
      src="${image.urls._1x}"
      srcset="${image.urls._1x} 1x, ${image.urls._2x} 2x"
      width="${image.width}"
      height="${image.height}"
      alt=""
    />
  </a>
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

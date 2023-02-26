const API_URL = 'https://api.koios.rest/api/v0/pool_list';
const API_HEADERS = {
  Accept: 'application/json',
};

async function fetchPools(offset = 0, limit = 1000) {
  const response = await fetch(`${API_URL}?offset=${offset}&limit=${limit}`, {
    method: 'GET',
    headers: API_HEADERS,
  });
  return response.json();
}

async function renderPools() {
  let offset = 0;
  let limit = 1000;
  let hasMore = true;
  const container = document.querySelector(".result");
  while (hasMore) {
    const pools = await fetchPools(offset, limit);
    pools.forEach((item, index) => {
      // create a new div element for each item
      const box = document.createElement("div");
      box.classList.add("box");
      // generate a random color
      const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
      // set the random color as the background-color of the box
      box.style.backgroundColor = color;
      // insert the ticker and pool ID into the div
      box.innerHTML = `<p>${item.ticker}</p><p>${item.pool_id_bech32}</p>`;
      // add an event listener to the div that navigates to the result page and stores the pool ID in session storage
      box.addEventListener("click", event => {
        sessionStorage.setItem("poolID", item.pool_id_bech32);
        window.location.href = "result.html";
      });
      // append the div to the container element
      container.appendChild(box);
    });
    offset += limit;
    hasMore = pools.length === limit;
  }
}

renderPools().catch(error => {
  // handle any errors that may have occurred
});

// add an event listener to the search input field
const searchInput = document.querySelector("#search");
searchInput.addEventListener("input", event => {
  // get the search query
  const searchQuery = event.target.value.toLowerCase();

  // filter the boxes based on the search query
  const filteredBoxes = Array.from(document.querySelectorAll(".box")).filter(box => {
    const ticker = box.querySelector("p:first-of-type").textContent;
    const poolId = box.querySelector("p:last-of-type").textContent;
    return ticker.toLowerCase().includes(searchQuery) || poolId.toLowerCase().includes(searchQuery);
  });

  // show the filtered boxes and hide the rest
  Array.from(document.querySelectorAll(".box")).forEach(box => {
    if (filteredBoxes.includes(box)) {
      box.style.display = "block";
    } else {
      box.style.display = "none";
    }
  });
});

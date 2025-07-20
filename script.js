const apiURL = "https://www.cheapshark.com/api/1.0/games?title=";
const gamesToTrack = [
  "GTA V", "Rust", "Satisfactory", "Cyberpunk 2077", "The Witcher 3",
  // diğer oyunlar
];
const storeNames = {
  1: "Steam",
  25: "Epic Games Store"
};

async function fetchGameDeal(title) {
  try {
    const response = await fetch(apiURL + encodeURIComponent(title));
    const gameResults = await response.json();
    if (!gameResults || gameResults.length === 0) return null;

    const gameID = gameResults[0].gameID;
    const dealRes = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`);
    const gameData = await dealRes.json();

    const deals = gameData.deals;
    if (!deals || deals.length === 0) return null;

    let bestDeal = deals[0];
    for (const deal of deals) {
      if (parseFloat(deal.price) < parseFloat(bestDeal.price)) {
        bestDeal = deal;
      } else if (parseFloat(deal.price) === parseFloat(bestDeal.price) && deal.storeID === "25") {
        bestDeal = deal; // Epic tercihi
      }
    }

    return {
      title: gameData.info.title,
      store: storeNames[bestDeal.storeID] || "Unknown Store",
      retailPrice: parseFloat(bestDeal.retailPrice),
      salePrice: parseFloat(bestDeal.price)
    };
  } catch {
    return null;
  }
}

async function fetchBestDeals() {
  const gamesList = document.getElementById("games-list");
  gamesList.innerHTML = '';

  let results = [];

  for (const title of gamesToTrack) {
    const deal = await fetchGameDeal(title);
    if (deal) results.push(deal);

    // API'yi yormamak için her istek arasında 500ms bekle
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Orijinal sıraya göre sıralama yap (gamesToTrack dizisine göre)
  results.sort((a, b) => {
    return gamesToTrack.indexOf(a.title) - gamesToTrack.indexOf(b.title);
  });

  // DOM'a sırayla ekle
  results.forEach(deal => {
    const gameCard = document.createElement("div");
    gameCard.className = "game";
    gameCard.innerHTML = `
      <div class="title">${deal.title}</div>
      <div class="platform">${deal.store}</div>
      <div class="price">
        <span class="old-price">$${deal.retailPrice.toFixed(2)}</span>
        <span class="new-price">$${deal.salePrice.toFixed(2)}</span>
      </div>
    `;
    gamesList.appendChild(gameCard);
  });
}

window.addEventListener("DOMContentLoaded", fetchBestDeals);

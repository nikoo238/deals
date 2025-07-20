const proxyURL = "https://api.allorigins.win/raw?url=";
const apiURL = "https://www.cheapshark.com/api/1.0/games?title=";

const gamesToTrack = [
  "GTA V", "Rust", "Satisfactory", "Cyberpunk 2077", "The Witcher 3",
  "Red Dead Redemption 2", "It Takes Two", "Raft", "BeamNG.drive",
  "No Man's Sky", "The Forest", "Sons of the Forest", "Phasmophobia",
  "Subnautica", "Stardew Valley", "Fall Guys", "Among Us", "FIFA 24",
  "Forza Horizon 5", "Batman: Arkham Knight", "Hogwarts Legacy",
  "Spider-Man Remastered", "God of War", "Star Wars Jedi: Survivor",
  "Lego Star Wars: The Skywalker Saga"
];

const storeNames = {
  1: "Steam",
  25: "Epic Games Store"
};

async function fetchGameDeal(title) {
  try {
    const res = await fetch(proxyURL + encodeURIComponent(apiURL + title));
    const games = await res.json();
    if (!games || games.length === 0) return null;

    const bestGame = games[0];
    const gameID = bestGame.gameID;

    const gameDetailsRes = await fetch(proxyURL + encodeURIComponent(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`));
    const gameData = await gameDetailsRes.json();
    if (!gameData.deals || gameData.deals.length === 0) return null;

    // En ucuz anlaşmayı bul
    let bestDeal = gameData.deals[0];
    for (let deal of gameData.deals) {
      if (parseFloat(deal.price) < parseFloat(bestDeal.price)) {
        bestDeal = deal;
      } else if (deal.price === bestDeal.price && deal.storeID === "25") {
        bestDeal = deal; // Epic'e öncelik
      }
    }

    return {
      title: gameData.info.title,
      store: storeNames[bestDeal.storeID] || "Unknown Store",
      retailPrice: parseFloat(bestDeal.retailPrice),
      salePrice: parseFloat(bestDeal.price)
    };
  } catch (err) {
    console.error("Failed to fetch deal for", title, err);
    return null;
  }
}

async function fetchBestDeals() {
  const gamesList = document.getElementById("games-list");
  gamesList.innerHTML = "";

  for (const title of gamesToTrack) {
    const deal = await fetchGameDeal(title);
    if (deal) {
      const gameCard = document.createElement("div");
      gameCard.className = "game";
      gameCard.innerHTML = `
        <div class="title">
  <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" target="_blank" style="color:inherit; text-decoration: none;">
    ${deal.title}
  </a>
</div>

        <div class="platform">${deal.store}</div>
        <div class="price">
          <span class="old-price">$${deal.retailPrice.toFixed(2)}</span>
          <span class="new-price">$${deal.salePrice.toFixed(2)}</span>
        </div>
      `;
      gamesList.appendChild(gameCard);
    }

    // API'yi aşırı yormamak için bekle
    await new Promise(res => setTimeout(res, 500));
  }
}

window.addEventListener("DOMContentLoaded", fetchBestDeals);

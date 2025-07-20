// script.js

const apiURL = "https://www.cheapshark.com/api/1.0/games?title=";
const gamesToTrack = ["GTA V", "Rust", "Satisfactory"];
const storeNames = {
  1: "Steam",
  25: "Epic Games"
};

async function fetchBestDeals() {
  const gamesList = document.getElementById("games-list");

  for (const title of gamesToTrack) {
    try {
      const response = await fetch(apiURL + encodeURIComponent(title));
      const gameResults = await response.json();

      if (!gameResults || gameResults.length === 0) continue;

      const gameID = gameResults[0].gameID;
      const dealRes = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`);
      const gameData = await dealRes.json();

      // Find cheapest deal
      const deals = gameData.deals;
      if (!deals || deals.length === 0) continue;

      let bestDeal = deals[0];
      for (const deal of deals) {
        if (parseFloat(deal.price) < parseFloat(bestDeal.price)) {
          bestDeal = deal;
        } else if (parseFloat(deal.price) === parseFloat(bestDeal.price) && deal.storeID === "25") {
          bestDeal = deal; // Prefer Epic Games if prices are equal
        }
      }

      const gameCard = document.createElement("div");
      gameCard.className = "game";
      gameCard.innerHTML = `
        <div class="title">${gameData.info.title}</div>
        <div class="platform">${storeNames[bestDeal.storeID] || "Unknown Store"}</div>
        <div class="price">
          <span class="old-price">$${parseFloat(bestDeal.retailPrice).toFixed(2)}</span>
          <span class="new-price">$${parseFloat(bestDeal.price).toFixed(2)}</span>
        </div>
      `;
      gamesList.appendChild(gameCard);

    } catch (err) {
      console.error("Failed to fetch deal for", title, err);
    }
  }
}

window.addEventListener("DOMContentLoaded", fetchBestDeals);

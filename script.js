// script.js

const apiURL = "https://www.cheapshark.com/api/1.0/games?title=";
const gamesToTrack = [
  "GTA V", "Rust", "Satisfactory", "Cyberpunk 2077", "The Witcher 3", "Hogwarts Legacy", "Red Dead Redemption 2", "Minecraft",
  "Elden Ring", "Sekiro: Shadows Die Twice", "Hades", "Hollow Knight", "Stardew Valley", "Terraria", "Raft", "BeamNG.drive",
  "It Takes Two", "No Man's Sky", "The Forest", "Sons of the Forest", "Valheim", "ARK: Survival Evolved", "Don't Starve Together",
  "Phasmophobia", "Dead by Daylight", "Among Us", "Fall Guys", "PUBG", "Call of Duty: Modern Warfare II", "Warzone",
  "Battlefield V", "Battlefield 2042", "Apex Legends", "Overwatch 2", "Forza Horizon 4", "Forza Horizon 5", "Need for Speed Heat",
  "Need for Speed Unbound", "FIFA 23", "FIFA 24", "eFootball 2024", "Rocket League", "CS:GO", "Counter-Strike 2", "Team Fortress 2",
  "Portal 2", "Half-Life: Alyx", "Half-Life 2", "DOOM Eternal", "DOOM", "Dishonored 2", "Far Cry 5", "Far Cry 6", "Assassin's Creed Odyssey",
  "Assassin's Creed Valhalla", "Assassin's Creed Origins", "Watch Dogs 2", "Watch Dogs: Legion", "Batman: Arkham Knight", "Batman: Arkham City",
  "Spider-Man Remastered", "Spider-Man: Miles Morales", "God of War", "God of War Ragnarok", "Uncharted: Legacy of Thieves Collection",
  "The Last of Us Part I", "The Last of Us Part II", "Days Gone", "Death Stranding", "Detroit: Become Human", "Heavy Rain",
  "Beyond: Two Souls", "Resident Evil 4", "Resident Evil 3", "Resident Evil Village", "Resident Evil 2", "Outlast", "Outlast 2",
  "The Quarry", "The Dark Pictures: Man of Medan", "Until Dawn", "Alan Wake Remastered", "Control", "The Medium", "Metro Exodus",
  "Metro Last Light Redux", "Dying Light", "Dying Light 2", "The Callisto Protocol", "Scorn", "Amnesia: Rebirth", "Amnesia: The Bunker",
  "The Long Dark", "Project Zomboid", "7 Days to Die", "RimWorld", "Prison Architect", "Cities: Skylines", "Banished", "Frostpunk",
  "Surviving Mars", "Planet Coaster", "Planet Zoo", "Sims 4", "The Sims 3", "Slime Rancher", "Slime Rancher 2", "Subnautica",
  "Subnautica: Below Zero", "Kerbal Space Program", "Space Engineers", "Astroneer", "Satisfactory", "Factorio", "Oxygen Not Included",
  "Teardown", "TABS", "Besiege", "Poly Bridge 2", "Goat Simulator 3", "Goat Simulator", "Totally Accurate Battlegrounds", "Garry's Mod",
  "VRChat", "Blade and Sorcery", "Bonelab", "Beat Saber", "Pavlov VR", "Job Simulator", "Rec Room", "Tabletop Simulator",
  "Football Manager 2024", "NBA 2K24", "Madden NFL 24", "WWE 2K24", "Euro Truck Simulator 2", "American Truck Simulator", "Train Sim World 3",
  "Farming Simulator 22", "SnowRunner", "MudRunner", "Thief", "Deus Ex: Mankind Divided", "XCOM 2", "Divinity: Original Sin 2",
  "Baldur's Gate 3", "Pillars of Eternity", "Dragon Age: Inquisition", "Mass Effect Legendary Edition", "Star Wars Jedi: Fallen Order",
  "Star Wars Jedi: Survivor", "Lego Star Wars: The Skywalker Saga"
];

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

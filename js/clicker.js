/* Ladda in moduler */
import { buildings, upgrades } from "./store.js"
import { achievementList } from "./achievements.js"


/* Konstanter och DOM referenser */
const resourceName = "resurser"
const gameButton = document.querySelector("#game-button")
const resourceDisplay = document.querySelector("#resource")
const resourceNameDisplay = document.querySelector("#resource-name")
const resourcePerSecondDisplay = document.querySelector("#resource-per-second")
const storeBuildingsList = document.querySelector("#building-list")
const storeUpgradesList = document.querySelector("#upgrade-list")
const statsContainer = document.querySelector("#stats")
const upgradesContainer = document.querySelector("#upgrades")

resourceNameDisplay.textContent = resourceName

/* Game state */
let achievements = achievementList
let resource = 6000
let resourcePerClick = 1
let resourcePerSecond = 0
let lastTimestamp = 0
let numberOfClicks = 0
let purchaseHistory = {
    buildings: [],
    upgrades: [],
};
let pause = false

/* Funktioner */

/* Skapa en lista med byggnader och uppgraderingar */
const createStoreCard = (type, content) => {
    const listItem = document.createElement("li");
    const button = createStoreButton(content.icon);

    if (type === "building") {
        const buildingDetails = createStoreBuildingDetails(content);
        button.appendChild(buildingDetails);
    }

    button.addEventListener("click", (e) => handlePurchase(e, type, content, button));
    const tooltip = storeTooltip(content.lore, content.description, content.cost);
    button.appendChild(tooltip);
    listItem.appendChild(button);

    return listItem;
};

// Hjälpfunktion för att skapa en knapp
const createStoreButton = (iconText) => {
    const button = document.createElement("button");
    button.classList.add("store-button");

    const icon = document.createElement("div");
    icon.textContent = iconText;
    icon.classList.add("icon");
    button.appendChild(icon);

    return button;
};

// Hjälpfunktion för att skapa byggnadsdetaljer
const createStoreBuildingDetails = (content) => {
    const container = document.createElement("div");

    const header = document.createElement("h3");
    header.classList.add("title");
    header.textContent = content.name;

    const cost = document.createElement("p");
    cost.textContent = `Köp för ${content.cost} ${resourceName}.`;

    container.appendChild(header);
    container.appendChild(cost);

    return container;
};

// Hjälpfunktion för att hantera köp av byggnader och uppgraderingar
const handlePurchase = (e, type, content, button) => {
    e.preventDefault();

    if (resource >= content.cost) {
        processPurchase(type, content);
        // updateCostDisplay(button, content);
        message(`Du har köpt en ${content.name}.`, "success");
    } else {
        message(`Du har inte råd med en ${content.name}.`, "error");
    }
};

const calculateResourceRates = () => {
    let newResourcePerClick = 1
    let newResourcePerSecond = 0

    // Calculate contributions from purchased buildings
    purchaseHistory.buildings.forEach((building) => {
        newResourcePerClick += (building.resourcePerClick || 0) * building.count;
        newResourcePerSecond += (building.resourcePerSecond || 0) * building.count;
    });

    // Apply modifiers from upgrades
    purchaseHistory.upgrades.forEach((upgrade) => {
        purchaseHistory.buildings.forEach((building) => {
            if (building.name === upgrade.building) {
                if (building.resourcePerClick) {
                    newResourcePerClick += building.resourcePerClick * upgrade.resourceFactor * building.count;
                }
                if (building.resourcePerSecond) {
                    newResourcePerSecond += building.resourcePerSecond * upgrade.resourceFactor * building.count;
                }
            }
        });
    });

    resourcePerClick = newResourcePerClick;
    resourcePerSecond = newResourcePerSecond;
};

const processPurchase = (type, content) => {
    if (type === "building") {
        let existingBuilding = purchaseHistory.buildings.find(b => b.name === content.name);
        if (existingBuilding) {
            existingBuilding.count += 1;
        } else {
            purchaseHistory.buildings.push({
                name: content.name,
                count: 1,
                resourcePerClick: content.resourcePerClick || 0,
                resourcePerSecond: content.resourcePerSecond || 0,
            });
        }
    } else if (type === "upgrade") {
        purchaseHistory.upgrades.push(content);
    }

    resource -= content.cost;
    content.cost *= content.costFactor;

    // Recalculate resource rates
    calculateResourceRates();
};

// Hjälpfunktion för att uppdatera kostnadsdisplayen
const updateCostDisplay = (button, content) => {
    let costElement = button.querySelector("p");
    if (!costElement) {
        costElement = document.createElement("p");
        button.appendChild(costElement);
    }
    costElement.textContent = `Köp för ${Math.round(content.cost)} ${resourceName}`;
};

// Hjälpfunktion för att skapa en tooltip för byggnader och uppgraderingar
// Tooltipen innehåller lore, beskrivning och kostnad
const storeTooltip = (lore, description, cost) => {
    const tooltip = document.createElement("div")
    tooltip.classList.add("store-tooltip")
    const data = [lore, description, `Kostar ${cost} ${resourceName}`]
    data.forEach((text) => {
        const textElement = document.createElement("p")
        textElement.textContent = text
        tooltip.appendChild(textElement)
    })
    return tooltip;
};

// funktion för att visa en meddelanderuta
// text är texten som ska visas
// type är typen av meddelande, kopplat till css
// duration är hur länge meddelandet ska visas i millisekunder
const message = (text, type, duration = 2000) => {
    const msgbox = document.querySelector("#msgbox");

    const messageElement = document.createElement("p");
    messageElement.classList.add(type);
    messageElement.textContent = text;
    msgbox.appendChild(messageElement);

    // Ta bort meddelandet efter en viss tid
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, duration);
};

// funktion för att uppdatera achievements
const updateAchievements = () => {
    achievements = achievements.filter((achievement) => {
        if (achievement.acquired) return false;

        // Check if the achievement requirements are met
        const meetsUpgradeRequirement =
            achievement.requiredUpgrades &&
            purchaseHistory.upgrades.length >= achievement.requiredUpgrades;

        const meetsBuildingRequirement =
            achievement.requiredBuildings &&
            purchaseHistory.buildings.reduce((total, building) => total + building.count, 0) >=
                achievement.requiredBuildings;

        const meetsClickRequirement =
            achievement.requiredClicks && numberOfClicks >= achievement.requiredClicks;

        // If any requirement is met, mark the achievement as acquired
        if (meetsUpgradeRequirement || meetsBuildingRequirement || meetsClickRequirement) {
            achievement.acquired = true;
            message(achievement.description, "info");
            return false; // Remove the achievement from the unacquired list
        }

        return true; // Keep the achievement in the unacquired list
    });
};

const createStatsCard = (title, value) => {
    const statItem = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = `${title}: ${Math.round(value)}`;
    p.classList.add("stat-value");
    statItem.appendChild(p);
    return statItem
}

// Skapa en lista med stats
const createStatsList = () => {
    statsContainer.innerHTML = ""; // Clear previous stats

    const statsList = document.createElement("ul");
    statsList.classList.add("stats-list");

    statsList.appendChild(createStatsCard("Resurser per klick", resourcePerClick));
    statsList.appendChild(createStatsCard("Resurser per sekund", resourcePerSecond));
    statsList.appendChild(createStatsCard("Köpta uppgraderingar", purchaseHistory.upgrades.length));
    statsList.appendChild(createStatsCard("Köpta byggnader", purchaseHistory.buildings.length));

    purchaseHistory.buildings.forEach((building) => {
        statsList.appendChild(createStatsCard(`${building.name} (Antal)`, building.count));
    });

    statsContainer.appendChild(statsList);
};

/* Spelloopen */
const step = (timestamp) => {
    if (pause) {
        window.requestAnimationFrame(step)
        return
    }

    resourceDisplay.textContent = Math.round(resource);
    resourcePerSecondDisplay.textContent = Math.round(resourcePerSecond);

    // Uppdatera resurser per sekund
    if (timestamp >= lastTimestamp + 1000) {
        resource += resourcePerSecond

        lastTimestamp = timestamp
    }

    updateAchievements();
    createStatsList();

    window.requestAnimationFrame(step)
}

/* Eventlyssnare */

gameButton.addEventListener("click", () => {
    resource += resourcePerClick
    numberOfClicks += 1
}, false)

document.addEventListener("keydown", (e) => {
    if (e.key === "p") {
        pause = !pause
    }
})

/* Initiera spelet */

window.addEventListener("load", (event) => {
    upgrades.forEach((upgrade) => {
        storeUpgradesList.appendChild(createStoreCard("upgrade", upgrade));
    })
    buildings.forEach((building) => {
        storeBuildingsList.appendChild(createStoreCard("building", building))
    })

    calculateResourceRates()
    // Skapa en lista med stats
    createStatsList()
    // Starta spelet
    window.requestAnimationFrame(step)
})

/* Ladda in moduler */
import { buildings } from "./store.js"
import { achievementList } from "./achievements.js"


/* Konstanter och DOM referenser */
const resourceName = "resurser"
const resourceDisplay = document.querySelector("#resource")
const resourcePerSecondDisplay = document.querySelector("#resource-per-second")

document.querySelector("#resource-name").textContent = resourceName

/* Game state */
let achievements = achievementList
let resource = 0
let resourcePerClick = 1
let resourcePerSecond = 0
let lastTimestamp = 0
let numberOfClicks = 0
let purchaseHistory = {
    buildings: [],
    upgrades: [],
}
let pause = false

/* Funktioner */

// Skapa en html lista med byggnader
const createStoreCard = (type, content) => {
    const template = document.querySelector("#store-item-template");
    const storeItem = template.content.cloneNode(true).querySelector(".store-item");

    // Populate the store item with content
    const button = storeItem.querySelector(".store-button");
    const icon = storeItem.querySelector(".icon");
    const title = storeItem.querySelector(".title");
    const cost = storeItem.querySelector(".cost");
    const lore = storeItem.querySelector(".lore");
    const description = storeItem.querySelector(".description");

    icon.textContent = content.icon;
    title.textContent = content.name;
    cost.textContent = `Köp för ${content.cost} ${resourceName}.`;
    lore.textContent = content.lore;
    description.textContent = content.description;

    // Add event listener for purchase
    button.addEventListener("click", (e) => handlePurchase(e, type, content, button));

    return storeItem;
};

// Hjälpfunktion för att hantera köp av byggnader och uppgraderingar
const handlePurchase = (e, type, content, button) => {
    e.preventDefault();

    if (resource >= content.cost) {
        processPurchase(content);
        updateCostDisplay(button, content);
        message(`Du har köpt en ${content.name}.`, "success");
    } else {
        message(`Du har inte råd med en ${content.name}.`, "error");
    }
};

const processPurchase = (building) => {
    let existingBuilding = purchaseHistory.buildings.find(b => b.name === building.name);
    if (existingBuilding) {
        existingBuilding.count += 1;
    } else {
        purchaseHistory.buildings.push({
            name: building.name,
            count: 1,
            resourcePerClick: building.resourcePerClick || 0,
            resourcePerSecond: building.resourcePerSecond || 0,
        });
    }

    resource -= building.cost;
    building.cost = Math.round(building.cost * building.costFactor);

    // Recalculate resource rates after the purchase
    calculateResourceRates();
};

const calculateResourceRates = () => {
    let newResourcePerClick = 100000 // Base value for clicks
    let newResourcePerSecond = 0; // Base value for resources per second

    // Calculate contributions from purchased buildings
    purchaseHistory.buildings.forEach((building) => {
        newResourcePerClick += (building.resourcePerClick || 0) * building.count;
        newResourcePerSecond += (building.resourcePerSecond || 0) * building.count;
    });

    // Update global resource rates
    resourcePerClick = newResourcePerClick;
    resourcePerSecond = newResourcePerSecond;
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

// funktion för att visa en meddelanderuta
// text är texten som ska visas
// type är typen av meddelande, kopplat till css
// duration är hur länge meddelandet ska visas i millisekunder
const message = (text, type, duration = 2000) => {
    const msgbox = document.querySelector("#msgbox")
    const template = document.querySelector("#message-template")

    // Vi använder här templaten i html filen för att skapa en ny meddelanderuta
    const messageElement = template.content.cloneNode(true).querySelector(".message")
    messageElement.classList.add(type)
    messageElement.textContent = text

    // Fäst meddelandet i meddelanderutan
    msgbox.appendChild(messageElement)

    // Efter duration så tar vi bort meddelandet
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement)
        }
    }, duration)
};

// funktion för att uppdatera achievements
const updateAchievements = () => {
    achievements = achievements.filter((achievement) => {
        if (achievement.acquired) return false;

        // Kontrollera att kraven för en achivment är uppfyllda
        const meetsBuildingRequirement =
            achievement.requiredBuildings &&
            purchaseHistory.buildings.reduce((total, building) => total + building.count, 0) >=
            achievement.requiredBuildings;

        const meetsClickRequirement =
            achievement.requiredClicks && numberOfClicks >= achievement.requiredClicks;

        // Om en eller flera krav är uppfyllda, markera achievement som uppnådd
        if (meetsBuildingRequirement || meetsClickRequirement) {
            achievement.acquired = true;
            message(achievement.description, "info");
            return false; // Ta bort achievement från listan
        }

        return true; // Behåll achievement i listan
    });
};

// Hjälpfunktion för att skapa stats-kort
const createStatsCard = (title, value) => {
    const template = document.querySelector("#stats-item-template")
    const statItem = template.content.cloneNode(true).querySelector(".stats-item")

    const statValue = statItem.querySelector(".stats-value")
    statValue.textContent = `${title}: ${Math.round(value)}`

    return statItem;
}

// Skapa en lista med stats
const createStatsList = () => {
    const statsList = document.querySelector(".stats-list")
    statsList.innerHTML = "" // Rensa tidigare stats genom att tömma containern

    // Skapa stats för resurser
    statsList.appendChild(createStatsCard("Totala resurser", resource))
    statsList.appendChild(createStatsCard("Resurser per klick", resourcePerClick))
    statsList.appendChild(createStatsCard("Resurser per sekund", resourcePerSecond))

    // Skapa stats för köpta byggnader
    purchaseHistory.buildings.forEach((building) => {
        statsList.appendChild(createStatsCard(`${building.name} (Antal)`, building.count))
    });
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
document.querySelector("#game-button").addEventListener("click", () => {
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
    const storeBuildingsList = document.querySelector("#building-list")
    buildings.forEach((building) => {
        storeBuildingsList.appendChild(createStoreCard("building", building))
    })

    // Räkna ut resurser per klick och per sekund
    calculateResourceRates()
    // Skapa en lista med stats
    createStatsList()
    // Starta spelet
    window.requestAnimationFrame(step)
})

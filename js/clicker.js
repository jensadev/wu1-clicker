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
    buildings: []
}
let pause = false

/* Funktioner */

/* För att skapa en ny byggnad i butiken behöver vi skapa ett nytt html-element
 * med hjälp av en template som vi definierat i html-filen.
 */
const createStoreCard = (content) => {
    const template = document.querySelector("#store-item-template");
    const storeItem = template.content.cloneNode(true).querySelector(".store-item")

    storeItem.querySelector(".store-item-icon").textContent = content.icon
    storeItem.querySelector(".store-item-title").textContent = content.name
    storeItem.querySelector(".store-item-cost").textContent = `Köp för ${content.cost} ${resourceName}.`
    storeItem.querySelector(".store-tooltip-lore").textContent = content.lore
    storeItem.querySelector(".store-tooltip-description").textContent = content.description
    
    // För att genomföra ett köpa av en byggnad behöver vi koppla en lyssnare till en
    // funktion som hanterar inköpet
    const button = storeItem.querySelector(".store-item-button")
    button.addEventListener("click", (e) => handlePurchase(e, content, button))

    return storeItem
}

const handlePurchase = (e, content, button) => {
    e.preventDefault()

    if (resource >= content.cost) {
        processPurchase(content)
        updateCostDisplay(button, content)
        playSound(document.querySelector("#swoosh"))
        message(`Du har köpt en ${content.name}.`, "success", content.icon)
    } else {
        message(`Du har inte råd med en ${content.name}.`, "error")
    }
};

const processPurchase = (building) => {
    let existingBuilding = purchaseHistory.buildings.find(b => b.name === building.name)
    if (existingBuilding) {
        existingBuilding.count += 1
    } else {
        purchaseHistory.buildings.push({
            name: building.name,
            count: 1,
            icon: building.icon,
            cost: building.cost,
        })
    }

    resource -= building.cost
    building.cost = Math.round(building.cost * building.costFactor)

    updatedResourceRates(building.resourcePerClick, building.resourcePerSecond)
    updatePurchasedBuildings()
}

const updatedResourceRates = (perClick, perSecond) => {
    resourcePerClick += perClick || 0
    resourcePerSecond += perSecond || 0
}

const updateCostDisplay = (button, content) => {
    let costElement = button.querySelector("p");
    if (!costElement) {
        costElement = document.createElement("p");
        button.appendChild(costElement);
    }
    costElement.textContent = `Köp för ${Math.round(content.cost)} ${resourceName}`;
};

/* För att kunna visa meddelanden i spelet så skapar vi meddelande element
 * utifrån en template i html-filen.
 * Meddelandet visas i duration ms och tas sedan bort.
 * Text är meddelandet, type är en css klass som bestämmer stilen
 */
const message = (text, type, icon, duration = 2000) => {
    const messageContainer = document.querySelector("#message-container")
    const template = document.querySelector("#message-template")

    const messageElement = template.content.cloneNode(true).querySelector(".message")
    messageElement.classList.add(type)
    messageElement.querySelector(".message-text").textContent = text
    messageElement.querySelector(".message-icon").textContent = "" || icon

    messageContainer.appendChild(messageElement)

    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement)
        }
    }, duration)
};

const playSound = (audio) => {
    audio.play()
}

/* För att uppdatera achievements så går vi igenom listan med achievements och
 * kontrollerar om kraven är uppfyllda.
 * Om kraven är uppfyllda så tar vi bort den från listan
 */
const updateAchievements = () => {
    achievements = achievements.filter((achievement) => {
        if (achievement.acquired) return false;

        const meetsBuildingRequirement =
            achievement.requiredBuildings &&
            purchaseHistory.buildings.reduce((total, building) => total + building.count, 0) >=
            achievement.requiredBuildings;

        const meetsClickRequirement =
            achievement.requiredClicks && numberOfClicks >= achievement.requiredClicks;

        if (meetsBuildingRequirement || meetsClickRequirement) {
            playSound(document.querySelector("#swoosh"));
            message(achievement.description, "info");
            return false; // Klar, ta bort achievement från listan
        }

        return true; // Behåll achievement i listan
    });
};

/* För att skapa en lista med stats så används en funktion, kopplar till en
 * template i html-filen.
 * Vi skapar en lista med stats och lägger till den i containern.
 */ 
const createStatsList = () => {
    const statsList = document.querySelector(".stats-list")
    statsList.innerHTML = "" // Rensa tidigare stats genom att tömma containern

    statsList.appendChild(createStatsCard("Totala resurser", resource))
    statsList.appendChild(createStatsCard("Resurser per klick", resourcePerClick))
    statsList.appendChild(createStatsCard("Resurser per sekund", resourcePerSecond))
};

const createStatsCard = (title, value) => {
    const template = document.querySelector("#stats-item-template")
    const statItem = template.content.cloneNode(true).querySelector(".stats-item")

    const statValue = statItem.querySelector(".stats-value")
    statValue.textContent = `${title}: ${Math.round(value)}`

    return statItem;
}

/* För att skapa en lista med inköpta byggnader så används en funktion som
 * kopplar till en template i html-filen.
 * Vi skapar en lista med byggnader och lägger till den i containern.
 */
const updatePurchasedBuildings = () => {
    const buildingList = document.querySelector(".building-list")
    const template = document.querySelector("#building-item-template")

    buildingList.innerHTML = "" // rensa för att uppdatera innehållet

    // Vi sorterar listan med köpta byggnader efter start kostnad för att behålla ordningen
    purchaseHistory.buildings.sort((a, b) => a.cost - b.cost)

    // Köpa byggnader är en array i ett objekt, vi loopar och skpara ny element
    // utifrån templaten
    purchaseHistory.buildings.forEach((building) => {
        const buildingItem = template.content.cloneNode(true).querySelector(".building-item")
        const icon = buildingItem.querySelector(".icon")
        icon.textContent = ""
        for (let i = 0; i < building.count; i++) {
            icon.textContent += building.icon
        }

        buildingList.appendChild(buildingItem)
    })
}

/* Spelloopen */
const gameLoop = (timestamp) => {
    if (pause) {
        window.requestAnimationFrame(gameLoop)
        return
    }

    // uppdatera displayen med resurser och resurser per sekund
    resourceDisplay.textContent = Math.round(resource)
    resourcePerSecondDisplay.textContent = Math.round(resourcePerSecond)

    // Uppdatera resurser per sekund
    if (timestamp >= lastTimestamp + 1000) {
        resource += resourcePerSecond

        lastTimestamp = timestamp
    }

    updateAchievements()
    createStatsList()

    window.requestAnimationFrame(gameLoop)
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
        storeBuildingsList.appendChild(createStoreCard(building))
    })

    createStatsList()
    updatePurchasedBuildings()

    // Starta spelet
    window.requestAnimationFrame(gameLoop)
})

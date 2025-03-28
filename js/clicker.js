import { buildings, upgrades } from "./store.js"
import { achievementList } from "./achievements.js"
import { advanceWeatherCycle } from "./weather.js"


/* Konstanter och DOM referenser */
const moneyName = "klimatpoäng"
const clickerButton = document.querySelector("#click-button")
const moneyDisplay = document.querySelector("#money-display")
const moneyDisplayName = document.querySelector("#money-display-name")
const buildingList = document.querySelector("#building-list")
const upgradeList = document.querySelector("#upgrade-list")
const carbonDisplay = document.querySelector("#carbon-display")

moneyDisplayName.textContent = moneyName

/* Game state */
let achievements = achievementList
let money = 0
let moneyPerClick = 1
let moneyPerSecond = 0
let last = 0
let acquiredUpgrades = 0
let numberOfClicks = 0
let weatherInterval = 60000
let lastWeather = 0
let carbon = 0
let carbonPerSecond = 5

/* Funktioner */

const createStoreCard = (type, content) => {
  const listItem = document.createElement("li")
  const cardElement = document.createElement("button")
  cardElement.classList.add("card")
  if (content.icon) {
    const imageElement = document.createElement("img")
    const image = new Image()
    image.src = `/assets/icons/${content.icon}`
    imageElement.src = image.src
    imageElement.alt = content.name
    cardElement.appendChild(imageElement)
  }
  if (type === "building") {
    const containerElement = document.createElement("div")
    const headerElement = document.createElement("h3")
    headerElement.classList.add("title")
    headerElement.textContent = content.name
    const costElement = document.createElement("p")
    costElement.textContent = `Köp för ${content.cost} ${moneyName}.`

    containerElement.appendChild(headerElement)
    containerElement.appendChild(costElement)
    cardElement.appendChild(containerElement)
  }

  cardElement.addEventListener("click", (e) => {
    if (money >= content.cost) {
      acquiredUpgrades += 1
      money -= content.cost
      content.cost *= content.costFactor
      costElement.textContent = `Köp för ${content.cost} ${moneyName}`
      message(`Grattis du har köpt ${content.name}`, "success")
    } else {
      message(`Du har inte råd med ${content.name}`, "warning")
    }
  });
  const tooltip = storeTooltip(content.lore, content.description, content.cost)
  cardElement.appendChild(tooltip)
  listItem.appendChild(cardElement)
  return listItem
}

const storeTooltip = (lore, description, cost) => {
  const tooltip = document.createElement("div")
  tooltip.classList.add("store-tooltip")
  const loreElement = document.createElement("p")
  loreElement.textContent = lore
  const descriptionElement = document.createElement("p")
  descriptionElement.textContent = description
  const costElement = document.createElement("p")
  costElement.textContent = `Kostar ${cost} ${moneyName}`
  tooltip.appendChild(loreElement)
  tooltip.appendChild(descriptionElement)
  tooltip.appendChild(costElement)
  return tooltip
}

const message = (text, type) => {
  const p = document.createElement("p")
  p.classList.add(type)
  p.textContent = text
  msgbox.appendChild(p)
  // if (type === "achievement") audioAchievement.play()
  setTimeout(() => { p.parentNode.removeChild(p) }, 2000)
}

/* Spelloopen */

const step = (timestamp) => {
  moneyDisplay.textContent = Math.round(money);
  carbonDisplay.textContent = Math.round(carbon);

  if (timestamp >= last + 1000) {
    money += moneyPerSecond
    last = timestamp
  }

  if (timestamp >= lastWeather + weatherInterval) {
    lastWeather = timestamp
    const weather = advanceWeatherCycle()
    const weatherEffect = weatherTypes.find((type) => type.name === weather)
    if (weatherEffect) {
      if (weatherEffect.effects.temperature) {
        console.log(`The temperature is ${weatherEffect.effects.temperature} degrees`)
      }
    }
  }

  achievements = achievements.filter((achievement) => {
    if (achievement.acquired) return false

    if ((achievement.requiredUpgrades && acquiredUpgrades >= achievement.requiredUpgrades) ||
      (achievement.requiredClicks && numberOfClicks >= achievement.requiredClicks)) {
      achievement.acquired = true;
      message(achievement.description, "achievement");
      return false;
    }

    return true;
  })

  window.requestAnimationFrame(step)
}

/* Eventlyssnare */

clickerButton.addEventListener("click", () => {
  clickerButton.classList.remove("animate")
  clickerButton.classList.add("animate")
  setTimeout(() => clickerButton.classList.remove("animate"), 700)
  money += moneyPerClick;
  numberOfClicks += 1;
}, false)

/* Initiera spelet */

window.addEventListener("load", (event) => {
  upgrades.forEach((upgrade) => {
    upgradeList.appendChild(createStoreCard("upgrade", upgrade));
  })
  buildings.forEach((building) => {
    buildingList.appendChild(createStoreCard("building", building))
  })
  window.requestAnimationFrame(step)
})

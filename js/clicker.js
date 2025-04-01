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
const statsElement = document.querySelector("#stats")
const upgradesDisplay = document.querySelector("#upgrades-display")

moneyDisplayName.textContent = moneyName

/* Game state */
let achievements = achievementList
let money = 5000
let moneyPerClick = 1
let moneyPerSecond = 0
let last = 0
let acquiredUpgrades = 0
let numberOfClicks = 0
let currentWeather = advanceWeatherCycle()
let weatherInterval = 60000
let lastWeather = 0
let carbon = 1000
let carbonPerSecond = 5
let carbonPerClick = 0
let acquiredBuildings = []
let pause = false

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
      moneyPerClick += content.moneyPerClick || 0
      moneyPerSecond += content.moneyPerSecond || 0
      carbonPerClick += content.carbonPerClick || 0
      carbonPerSecond += content.carbonPerSecond || 0
      content.cost *= content.costFactor
      const costElement = cardElement.querySelector("p")
      if (!costElement) {
        const newCostElement = document.createElement("p")
        newCostElement.textContent = `Köp för ${content.cost} ${moneyName}`
        cardElement.appendChild(newCostElement)
      } else {
        costElement.textContent = `Köp för ${content.cost} ${moneyName}`
      }
      const building = acquiredBuildings.find(b => b.name === content.name);
      if (building) {
        building.count += 1;
      }
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

const gameStats = (stats, element) => {
  element.classList.add("stats")
  const statsTitle = document.createElement("h3")
  statsTitle.textContent = "Statistik"
  const statsList = document.createElement("ul")
  stats.forEach((stat) => {
    const statItem = document.createElement("li")
    statItem.textContent = `${stat.name}: ${stat.value}`
    statsList.appendChild(statItem)
  })
  element.appendChild(statsTitle)
  element.appendChild(statsList)
  return element
}

const updateBuildingList = (element) => {
  element.innerHTML = ""
  acquiredBuildings.forEach((building) => {
    const buildingItem = document.createElement("li")
    const buildingDescription = document.createElement("p")
    buildingDescription.textContent = `${building.name} (${building.count})`

    const iconContainer = document.createElement("div")
    iconContainer.classList.add("icon-container")

    for (let i = 0; i < building.count; i++) {
      const iconElement = document.createElement("img")
      iconElement.src = `/assets/icons/${building.icon}`
      iconElement.alt = building.name
      iconElement.style.left = `${i * 20}px`
      iconElement.classList.add("building-icon")
      iconContainer.appendChild(iconElement)
    }

    buildingItem.appendChild(iconContainer)
    buildingItem.appendChild(buildingDescription)
    element.appendChild(buildingItem)
  })
}

/* Spelloopen */

const step = (timestamp) => {
  if (pause) {
    window.requestAnimationFrame(step)
    return
  }
  // update stats
  moneyDisplay.textContent = Math.round(money);
  carbonDisplay.textContent = Math.round(carbon);
  // update stats thats changed
  if (timestamp >= last + 1000) {
    const stats = []
    stats.push({ name: "Klimatpoäng per klick", value: moneyPerClick })
    stats.push({ name: "Koldioxid per sekund", value: carbonPerSecond })
    stats.push({ name: "Koldioxid per klick", value: carbonPerClick })
    stats.push({ name: "Väder", value: currentWeather })
    stats.push({ name: "Tid", value: Math.round(timestamp / 1000) })
    stats.push({ name: "Vädret ändras om", value: Math.round((weatherInterval - (timestamp - lastWeather)) / 1000) })
    stats.push({ name: "Tid sedan senaste klick", value: Math.round((timestamp - last) / 1000) })
    // clear stats
    statsElement.innerHTML = ""
    gameStats(stats, statsElement)
  }

  if (timestamp >= last + 1000) {
    money += moneyPerSecond
    carbon += carbonPerSecond

    // update list with purchased buildings
    updateBuildingList(upgradesDisplay)

    last = timestamp
  }

  if (timestamp >= lastWeather + weatherInterval) {
    lastWeather = timestamp
    currentWeather = advanceWeatherCycle()
    // const weatherEffect = weatherTypes.find((type) => type.name === weather)
    // if (weatherEffect) {
    //   if (weatherEffect.effects.temperature) {
    //     console.log(`The temperature is ${weatherEffect.effects.temperature} degrees`)
    //   }
    // }
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
  money += moneyPerClick
  carbon += carbonPerClick
  numberOfClicks += 1
}, false)

/* Initiera spelet */

window.addEventListener("load", (event) => {
  upgrades.forEach((upgrade) => {
    upgradeList.appendChild(createStoreCard("upgrade", upgrade));
  })
  buildings.forEach((building) => {
    buildingList.appendChild(createStoreCard("building", building))
    acquiredBuildings.push({ name: building.name, count: 0, icon: building.icon });
  })

  // updatestats
  const stats = []
  stats.push({ name: "Klimatpoäng per klick", value: moneyPerClick })
  stats.push({ name: "Koldioxid per sekund", value: carbonPerSecond })
  stats.push({ name: "Koldioxid per klick", value: carbonPerClick })
  stats.push({ name: "Väder", value: currentWeather })
  stats.push({ name: "Tid", value: 0 })
  stats.push({ name: "Tid sedan senaste väder", value: 0 })
  stats.push({ name: "Tid sedan senaste klick", value: 0 })

  gameStats(stats, statsElement)

  document.addEventListener("keydown", (e) => {
    if (e.key === "p") {
      pause = !pause
    }
  })


  // Starta spelet
  window.requestAnimationFrame(step)
})

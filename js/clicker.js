import { buildings, upgrades } from './store.js'
import { achievementList } from './achievements.js'

let achievements = achievementList

/* Konfiguration */
const moneyName = "hearts"

const clickerButton = document.querySelector('#click-button')
const moneyDisplay = document.querySelector("#money-display")
const moneyDisplayName = document.querySelector("#money-display-name")
const buildingList = document.querySelector("#building-list")
const upgradeList = document.querySelector("#upgrade-list")

moneyDisplayName.textContent = moneyName

let money = 0
let moneyPerClick = 1
let moneyPerSecond = 0
let last = 0
let acquiredUpgrades = 0
let numberOfClicks = 0


clickerButton.addEventListener('click', () => {
  money += moneyPerClick;
  numberOfClicks += 1;
})

const step = (timestamp) => {
  moneyDisplay.textContent = Math.round(money);

  if (timestamp >= last + 1000) {
    money += moneyPerSecond;
    last = timestamp;
  }

  // achievements, utgår från arrayen achievements med objekt
  // koden nedan muterar (ändrar) arrayen och tar bort achievements
  // som spelaren klarat
  // villkoren i första ifsatsen ser till att achivments som är klarade
  // tas bort. Efter det så kontrolleras om spelaren har uppfyllt kriterierna
  // för att få den achievement som berörs.
  achievements = achievements.filter((achievement) => {
    if (achievement.acquired) return false

    if ((achievement.requiredUpgrades && acquiredUpgrades >= achievement.requiredUpgrades) ||
      (achievement.requiredClicks && numberOfClicks >= achievement.requiredClicks)) {
      achievement.acquired = true;
      message(achievement.description, 'achievement');
      return false;
    }

    return true;
  })

  window.requestAnimationFrame(step)
}

window.addEventListener('load', (event) => {
  upgrades.forEach((upgrade) => {
    upgradeList.appendChild(createStoreCardUpgrade(upgrade));
  })
  buildings.forEach((building) => {
    buildingList.appendChild(createStoreCardBuilding(building))
  })
  window.requestAnimationFrame(step)
})

const createStoreCardBuilding = (building) => {
  const cardElement = document.createElement('div')
  cardElement.classList.add('card')
  const headerElement = document.createElement('h3')
  headerElement.classList.add('title')
  const costElement = document.createElement('p')
  if (building.image) {
    const imageElement = document.createElement("img")
    const image = new Image()
    image.src = building.image
    imageElement.src = image.src
  }
  costElement.textContent = `Köp för ${building.cost} ${moneyName}.`

  cardElement.addEventListener('click', (e) => {
    if (money >= building.cost) {
      acquiredUpgrades += 1
      money -= building.cost
      building.cost *= building.costFactor
      costElement.textContent = `Köp för ${building.cost} ${moneyName}`
      message(`Grattis du har köpt ${building.name}`, 'success')
    } else {
      message(`Du har inte råd med ${building.name}`, 'warning')
    }
  });

  if (building.image) cardElement.appendChild(imageElement)
  cardElement.appendChild(headerElement)
  cardElement.appendChild(costElement)
  return cardElement
}

const createStoreCardUpgrade = (upgrade) => {
  const cardElement = document.createElement('div')
  cardElement.classList.add('card')
  return cardElement
}

const message = (text, type) => {
  const p = document.createElement("p")
  p.classList.add(type)
  p.textContent = text
  msgbox.appendChild(p)
  if (type === "achievement") audioAchievement.play()
  setTimeout(() => { p.parentNode.removeChild(p)}, 2000)
}

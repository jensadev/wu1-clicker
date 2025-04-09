/* En array med upgrades. Varje upgrade är ett objekt med egenskaperna name, cost
 * och amount. Önskar du ytterligare text eller en bild så går det utmärkt att
 * lägga till detta.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
 */
const upgrades = [
  {
    icon: "🦹",
    name: "En superskurk",
    cost: 100,
  },
]

const buildings = [
  {
    name: "Robot",
    resourcePerClick: 1,
    cost: 50,
    costFactor: 1.3,
    lore: "En robot som producerar saker",
    description: "Ger pengar per klick",
  },
  {
    name: "Fabrik",
    resourcePerSecond: 2,
    cost: 100,
    costFactor: 1.5,
    lore: "En fabrik som producerar varor",
    description: "Ger pengar per sekund",
  },
]

upgrades.sort((a, b) => a.cost - b.cost);
buildings.sort((a, b) => a.cost - b.cost);

export { upgrades, buildings }
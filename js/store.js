/* En array med upgrades. Varje upgrade är ett objekt med egenskaperna name, cost
 * och amount. Önskar du ytterligare text eller en bild så går det utmärkt att
 * lägga till detta.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
 */
export const upgrades = [
  {
      icon: "pan_tool_alt_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg",
      name: "Förstärkt pekfinger",
      cost: 1000,
      perSecond: 1,
      lore: "Kraftigt, benigt och brutalt",
      description: "Varje klick är extra effektivt"
  },
]

export const buildings = [
  {
    name: "Flådig muspekare",
    perClick: 1,
    cost: 20,
    costFactor: 1.5
  }
]
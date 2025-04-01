/* En array med upgrades. Varje upgrade är ett objekt med egenskaperna name, cost
 * och amount. Önskar du ytterligare text eller en bild så går det utmärkt att
 * lägga till detta.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
 */
const upgrades = [
  {
    icon: "solar_power_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
    name: "Solpaneler",
    cost: 5000,
    moneyPerSecond: -5,
    lore: "Effektiva och miljövänliga",
    description: "Minskar CO2-utsläpp per sekund",
    weatherEffects: {
      sunny: { multiplier: 1.5 },
      stormy: { multiplier: 0.5 },
      snowy: { multiplier: 0.5 },
      foggy: { multiplier: 0.6 },
    },
  },
  {
    icon: "wind_power_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
    name: "Vindkraftverk",
    cost: 10000,
    moneyPerSecond: -10,
    lore: "Kraftfulla och hållbara",
    description: "Ger en konstant minskning av CO2-utsläpp",
    weatherEffects: {
      stormy: { multiplier: 0.5 },
      snowy: { multiplier: 0.7 },
    },
  },
  {
    icon: "park_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
    name: "Trädplantering",
    cost: 3000,
    moneyPerSecond: -3,
    lore: "Gröna och livsviktiga",
    description: "Ökar CO2-infångningen per sekund",
  },
  {
    icon: "co2_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
    name: "Koldioxidinfångning",
    cost: 15000,
    moneyPerSecond: -15,
    lore: "Avancerad teknologi",
    description: "Fångar in CO2 direkt från luften",
    weatherEffects: {},
  },
]

const buildings = [
  {
    name: "Bil",
    moneyPerClick: 2,
    carbonPerClick: 1,
    cost: 50,
    costFactor: 1.3,
    lore: "Transporterar människor men släpper ut CO2",
    icon: "directions_car_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
    description: "Ökar CO2-utsläpp per klick",
  },
  {
    name: "Fabrik",
    moneyPerClick: 5,
    cost: 100,
    costFactor: 1.5,
    lore: "Producerar varor men släpper ut CO2",
    description: "Ökar CO2-utsläpp per klick",
    icon: "factory_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
  },
  {
    name: "Vindkraftverk",
    moneyPerClick: -1,
    cost: 200,
    costFactor: 1.7,
    lore: "Producerar ren energi",
    description: "Minskar CO2-utsläpp per klick",
    icon: "wind_power_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
  },
  {
    name: "Solpanel",
    moneyPerClick: -2,
    cost: 300,
    costFactor: 1.8,
    lore: "Producerar ren energi",
    description: "Minskar koldioxidutsläpp per klick",
    icon: "solar_power_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
  },
]

upgrades.sort((a, b) => a.cost - b.cost);
buildings.sort((a, b) => a.cost - b.cost);

export { upgrades, buildings }
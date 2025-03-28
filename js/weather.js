const weatherTypes = [
  {
    name: "Soligt",
    type:"sunny",
    icon: "sunny_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
    probability: 0.3,
    effects: {
      temperature: 1.2,
      wildfireRisk: 1.3,
    },
    lore: "Solpaneler producerar mer energi, men ökad temperatur och risk för skogsbränder.",
  },
  {
    name: "Regnigt",
    type: "rainy",
    icon: "rainy_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
    probability: 0.4,
    effects: {
      temperature: -0.5,
      hydroPlantMultiplier: 1.5,
      wildfireRisk: 0.7,
      floodRisk: 1.2,
    },
    lore: "Vattenkraftverk producerar mer energi, men risk för översvämningar.",
  },
  {
    name: "Snöigt",
    type: "snowy",
    icon: "snowing_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
    probability: 0.2,
    effects: {
      temperature: -2,
      wildfireRisk: 0
    },
    lore: "Snö reflekterar solljus och minskar temperaturen, men kan skada solpaneler och vindkraftverk.",
  },
  {
    name: "Dimma",
    type: "foggy",
    icon: "foggy_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
    probability: 0.1,
    effects: {
      temperature: -0.9,
      wildfireRisk: 0.8,
    },
    lore: "Håller temperaturen nere, men minskar effektiviteten hos solpaneler.",
  },
  {
    name: "Storm",
    type: "stormy",
    icon: "storm_48dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.svg",
    effects: {
      temperature: -1,
      damageRisk: 1.5,
    },
    lore: "Sprider värme och energi, men kan skada infrastruktur, vindkraftverk och solpaneler.",
  },
]

const weatherCycle = weatherTypes.map((type) => type.name)

const getRandomWeather = () => {
  const rand = Math.random();
  let cumulativeProbability = 0;
  for (const weather of weatherTypes) {
    cumulativeProbability += weather.probability;
    if (rand < cumulativeProbability) {
      return weather.name;
    }
  }
  return weatherTypes[weatherTypes.length - 1].name;
}

const advanceWeatherCycle = () => {
  const currentWeather = getRandomWeather();
  console.log("Nuvarande väder:", currentWeather);
  // Uppdatera spelets logik baserat på det aktuella vädret
}

const applyWeatherEffects = (upgradeOrBuilding, currentWeather) => {
  const effects = upgradeOrBuilding.weatherEffects[currentWeather];
  if (effects) {
    console.log(`Nuvarande väder (${currentWeather}) effekter:`, effects);
    // Tillämpa effekterna på uppgraderingen eller byggnaden
    if (effects.multiplier) {
      upgradeOrBuilding.perSecond *= effects.multiplier;
      upgradeOrBuilding.perClick *= effects.multiplier;
    }
    // Tillämpa andra effekter vid behov
  }
}

export { advanceWeatherCycle }
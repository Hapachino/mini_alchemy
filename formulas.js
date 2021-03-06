const formulas = {
  // tier 1
  // air, earth, fire, water

  // tier 2
  'air + air': 'pressure',
  'air + fire': 'smoke',
  'air + earth': 'dust',
  'air + water': 'mist',
  'earth + earth': 'land',
  'earth + water': 'mud',
  'earth + fire': 'lava',
  'fire + fire': 'energy',
  'fire + water': 'steam',
  'water + water': 'puddle',

  // tier 3
  'air + energy': 'heat',
  'air + land': 'dust',
  'air + pressure': 'wind',
  'dust + energy': 'gunpowder',
  'dust + fire': 'gunpowder',
  'earth + lava': 'volcano',
  'earth + pressure': 'stone',
  'earth + steam': 'geyser',
  'fire + mud': 'brick',
  'land + land': 'continent',
  'lava + pressure': 'granite',
  'lava + water': 'obsidian',
  'mud + stone': 'clay',
  'pressure + steam': 'geyser',
  'pressure + stone': 'granite',
  'puddle + water': 'pond',

  // tier 4
  'air + heat': 'warmth',
  'air + stone': 'sand',
  'brick + smoke': 'chimney',
  'clay + fire': 'brick',
  'clay + stone': 'brick',
  'continent + continent': 'planet',
  'earth + heat': 'lava',
  'fire + stone': 'metal',
  'fire + gunpowder': 'explosion',
  'heat + water': 'steam',
  'pond + water': 'lake',
  'pressure + volcano': 'explosion',
  'smoke + stone': 'chimney',
  'stone + stone': 'wall',
  'stone + wind': 'sand',
  'wind + wind': 'tornado',

  // tier 5
  'air + planet': 'atmosphere',
  'air + metal': 'rust',
  'fire + planet': 'sun',
  'gunpowder + metal': 'bullet',
  'fire + sand': 'glass',
  'heat + sand': 'glass',
  'lake + water': 'sea',
  'land + sand': 'desert',
  'planet + planet': 'solar-system',
  'planet, + rust': 'mars',
  'metal + pressure': 'boiler',
  'metal + steam': 'boiler',
  'sand + sand': 'desert',
  'sand + tornado': 'sandstorm',
  'wall + wall': 'house',
  'energy + explosion': 'atomic-bomb',

  // tier 6
  'atmosphere + mist': 'cloud',
  'atmosphere + water': 'cloud',
  'bullet + metal': 'gun',
  'clay + sun': 'brick',
  'desert + water': 'oasis',
  'desert + lake': 'oasis',
  'desert + planet': 'mars',
  'desert + pond': 'oasis',
  'desert + puddle': 'oasis',
  'desert + stone': 'pyramid',
  'desert + tornado': 'sandstorm',
  'desert + wind': 'sandstorm',
  'explosion + ocean': 'tsunami',
  'explosion + sea': 'tsunami',
  'glass + glass': 'glasses',
  'glass + metal': 'glasses',
  'glass + pond': 'aquarium',
  'glass + puddle': 'aquarium',
  'glass + sand': 'hourglass',
  'glass + water': 'aquarium',
  'house + house': 'village',
  'house + smoke': 'chimney',
  'lava + sea': 'primordial-soup',
  'mud + sun': 'brick',
  'pressure + sun': 'black-hole',
  'sea + water': 'ocean',
  'sea + sea': 'ocean',
  'solar-system + solar-system': 'galaxy',

  // tier 7
  'cloud + heat': 'rain',
  'cloud + pressure': 'rain',
  'cloud + smoke': 'acid-rain',
  'cloud + water': 'rain',
  'galaxy + galaxy': 'galaxy-cluster',
  'gun + puddle': 'water-gun',
  'gun + water': 'water-gun',
  'ocean + ocean': 'pressure',
  'primordial-soup + volcano': 'life',
  'village + village': 'city',

  // tier 8
  'city + rain': 'acid-rain',
  'clay + life': 'human',
  'fire + life': 'phoenix',
  'galaxy-cluster + galaxy-cluster': 'universe',
  'rain + smoke': 'acid-rain',

  // tier 9
  'bullet + human ': 'corpse',
  'clay + human': 'potter',
  'dust + human': 'allergy',
  'fire + human': 'firefighter',
  'explosion + human': 'corpse',
  'glass + human': 'glasses',
  'heat + human': 'warmth',
  'house + human': 'family',
  'human + human': 'love',
  'human + mars': 'astronaut',
  'human + metal': 'tool',
  'human + rain': 'cold',
  'human + solar-system': 'astronaut',
  'human + stone': 'tool',
  'human + universe': 'science',
  'human + pond': 'swimmer',
  'human + water': 'swimmer',
  'human + wind': 'cold',

  // tier 10
  'glasses + human': 'hacker',
  'firefighter + firefighter': 'idea',
  'science + science': 'idea',
  'science + tornado': 'motion',
  'science + wind': 'motion',
  'tool + wall': 'house',
};
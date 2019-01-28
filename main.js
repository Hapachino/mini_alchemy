$(document).ready(init);

const config = {
  startingCards: ['air', 'earth', 'fire', 'water'],
  // startingCards: Array(36), // for layout testing purposes
  totalCards: 9 * 4,
  hideCardDelay: 1750,
  hideCardDelayToggle: 1250,
  hideModalDelay: 1750,
  reveal: false,
  formulas: {
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
  },
}

const gameState = {
  targetElement: null,
  firstCardClicked: null,
  secondCardClicked: null,
  clicked: 0,
};

const gameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  attempts: 0,
  discovered: 0,
}

function init() {
  shuffle(config.startingCards);
  createStartingCards(config.startingCards, 'main');

  displayStats();
  newGameWobble();
  newGameWobbleOnEnter();

  addClickHandlers();

  // first game target modal is shown after intro modal is closed
  if ($('.intro-modal').css('display') === 'none') {
    showTargetElement();
  }
}

function unInit() {
  clearCards();
  removeCardClickHandlers();
  removeResetHandler();
  removeSettingsClickHandler()
}

function showTargetElement() {
  gameState.targetElement = randomObjectValue(config.formulas);
  updateModal(gameState.targetElement, 'you must create:');
  showModal();
  delayedHideModal(2500);
}

function addClickHandlers() {
  addIntroClickHandler();
  addCardClickHandlers();
  addSettingsClickHandler();
  addResetHandler();
}

function clearCards() {
  $('#game-area').empty();
}

function addIntroClickHandler() {
  $('.exit-intro').click(() => {
    $('.intro-modal').hide();

    showTargetElement();
  })
}

function addSettingsClickHandler() {
  $('.settings').click(() => {
    showModal(true);
  });

  // toggles card facing
  $('[name=reveal]').click(function() {
    config.reveal = !config.reveal;

    if (config.reveal) {
      $('.card').addClass('rotate');
      config.hideCardDelay -= config.hideCardDelayToggle;
    } else {
      $('.card').removeClass('rotate');
      config.hideCardDelay += config.hideCardDelayToggle;
    }
  })

  $('.exit-settings').click(() => {
    delayedHideModal(1, $('.settings-modal'));
  })
}

function removeSettingsClickHandler() {
  $('.settings').off('click');
  $('[name=reveal]').off('click');
  $('.exit-settings').off('click');
}

function createCard(element, parent) {
  const front = $('<div>').addClass('front');
  const frontImage = $('<div>', {
    class: 'front-image',
    css: {
      backgroundImage: `url(images/elements/${element}.svg)`,
    },
  });
  front.append(frontImage);

  const back = $('<div>').addClass('back');
  const backImage = $('<div>').addClass('back-image');
  back.append(backImage);

  const card = $('<div>').addClass('card').attr('name', element);
  card.append(front, back);
  
  setTimeout(() => {
    if ($('[name=reveal]').is(':checked')) {
      $('.card').addClass('rotate');
    }
  }, 0)


  const perspective = $('<div>').addClass('perspective');
  perspective.append(card);

  $(parent).append(perspective);
  return card;
}

function addResetHandler() {
  $('.new-game').click(reset);
}

function removeResetHandler() {
  $('.new-game').off('click');
}

function createStartingCards(cards, parent) {
  for (let i = 0; i < cards.length; i++) {
    createCard(cards[i], parent);
  }
}

function getNewElement() {
  const firstElement = gameState.firstCardClicked.attr('name');
  const secondElement = gameState.secondCardClicked.attr('name');
  const search = [firstElement, secondElement].sort().join(' + ');
  const newElement = config.formulas[search] || 'failed';

  return newElement;
}

function createNewElement(newElement) {
  const card = createCard(newElement, 'main');
  showCard(card);
  cardShadow(card);
  if (!config.reveal) delayedHide(card); 
}

function cardClicked() {
  if (gameState.clicked === 2) {
    return;
  } else {
    gameState.clicked++;
  }

  const clicked = $(this);
  cardShadow(clicked);
  showCard(clicked);

  if (!gameState.firstCardClicked) {
    gameState.firstCardClicked = clicked;
  } else {
    gameState.secondCardClicked = clicked;

    const newElement = getNewElement();
    createNewElement(newElement);

    delayedHideAndResetCards();

    const totalCards = $('.card').length === config.totalCards;
    const gameWon = newElement === gameState.targetElement;
    const gameLost = totalCards && !gameWon;
    const newElementCreated = $(`[name=${newElement}]`).length === 1;
    const failed = newElement === 'failed';

    if (gameLost) {
      updateModal('defeat', 'uh oh...');
      showModal();
    } else if (gameWon) {
      gameStats.gamesWon++;
      updateModal(newElement, 'successfully created:');
      showModal();
    } else if (newElementCreated) {
      const info = failed ? 'oops...' : 'new discovery:';
      updateModal(newElement, info);
      showModal();
      delayedHideModal();
    }
    
    if (gameLost || gameWon) newGameWobble();
    if (newElementCreated && !failed) gameStats.discovered++;
    gameStats.attempts++;
    displayStats();
  }
}

function addCardClickHandlers() {
  $('#game-area').on('click', '.card', cardClicked);
}

function removeCardClickHandlers() {
  $('#game-area').off('click', '.card', cardClicked);
}

function showCard(card) {
  setTimeout(() => {
    card.addClass('rotate');
  }, 0)
}

function cardShadow(element) {
  // reset animation
  element.removeClass('run-new-card-shadow');
  setTimeout(() => {
    element.addClass('run-new-card-shadow');
  }, 0)
}

function delayedHide(card) {
  setTimeout(() => {
    card.removeClass('rotate');
  }, config.hideCardDelay);
}

function delayedHideAndResetCards() {
  setTimeout(() => {
    if (!config.reveal) {
      gameState.firstCardClicked.removeClass('rotate');
      gameState.secondCardClicked.removeClass('rotate');
    }

    gameState.firstCardClicked = gameState.secondCardClicked = null;
    gameState.clicked = 0;
  }, config.hideCardDelay);
}

function displayStats() {
  $('.games-played .value').text(gameStats.gamesPlayed);
  $('.games-won .value').text(gameStats.gamesWon);
  $('.attempts .value').text(gameStats.attempts);
  $('.discovered .value').text(gameStats.discovered);
}

function randomObjectValue(obj) {
  const keys = Object.keys(obj);
  const randomIndex = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randomIndex];

  return obj[randomKey];
}

function resetStats() {
  gameStats.attempts = gameStats.discovered = 0;
}

function reset() {
  gameStats.gamesPlayed++;
  unInit();
  init();
  resetStats();
  displayStats();
}

// fisher-yates shuffle
function shuffle(array) {
  for (let i = array.length; i--; i > 0) {
    const j = Math.floor(Math.random() * i);

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function updateModal(element, info) {
  $('.modal-image').css('background-image', `url(images/elements/${element}.svg)`);
  $('.modal-info').text(info);
  $('.modal-text').text(element.replace(/-/g, ' '));
}

function delayedHideModal(ms, isSettings) {
  const delay = ms || config.hideModalDelay;
  const modal = isSettings ? $('.settings-modal') : $('.modal'); 

  setTimeout(() => {
    modalVisibility(modal, false);
    addCardClickHandlers();
  }, delay)
}

function showModal(isSettings) {
  removeCardClickHandlers();
  
  const modal = !isSettings ? $('.modal') : $('.settings-modal');

  // reset animation
  modal.removeClass('run-show-modal');
  setTimeout(() => {
    modal.addClass('run-show-modal');
  }, 0)

  modalVisibility(modal, true);
}

// maintains modal visibility after animation
function modalVisibility(element, visibility) {
  const opacity = visibility ? 1 : 0;
  const transform = visibility ? 'scale(1) translate(-50%, -50%)' : 'scale(0.1) translate(-50%, -50%)';
  
  element.css({
    opacity,
    transform,
  })
}

function newGameWobble() {
  const newGame = $('.new-game');
  newGame.removeClass('run-wobble');
  setTimeout(() => {
    newGame.addClass('run-wobble');
  }, 0)
}

function newGameWobbleOnEnter() {
  const newGame = $('.new-game');
  newGame.mouseenter(() => {
    newGame.removeClass('run-wobble');
    setTimeout(() => {
      newGame.addClass('run-wobble');
    }, 0)
  })
}

/*
TODO:
settings - difficulty
legend
history
separate recipe file
object constructor at beginning to determine game difficulty
favicon
*/

function gameDifficulty(level) {
  const values = Object.values(config.formulas);
  const length = values.length;
  const firstThird = Math.floor(length / 3);
  const secondThird = Math.floor(length * 2 / 3);

  switch (level) {
    case 'easy':
      return values.slice(0, firstThird);
    case 'medium':
      return values.slice(0, secondThird);
    case 'hard':
      return values;
  }
}

$('document').ready(function () {
  init();
});

const config = {
  startingCards: ['air', 'earth', 'fire', 'water'],
  totalCards: 8 * 5,
  flipDelay: 1000,
  modalDelay: 1000,
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
    'air + pressure': 'wind',
    'earth + pressure': 'stone',
    'dust + fire': 'gunpowder',
    'earth + lava': 'volcano',
    'lava + water': 'obsidian',

    // tier 4
    'air + metal': 'rust',
    'fire + stone': 'metal',
    'fire + gunpowder': 'explosion',
    'stone + stone': 'wall',

    // tier 5
    'wall + wall': 'house',
    'energy + explosion': 'atomic-bomb',
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
  oops: 0,
}

function init() {
  shuffle(config.startingCards);
  createStartingCards(config.startingCards, 'main');
  addCardClickHandlers();
  // get random target element (win condition)
  gameState.targetElement = randomObjectValue(config.formulas);
  // update modal image and text with target element
  updateModal(gameState.targetElement);
  delayedHideModal();
  $('.new-game').click(reset);
  displayStats();
}

function unInit() {
  $('#game-area').html('');
  removeCardClickHandlers();
  removeResetHandler();
}

function createCard(element, parent) {
  const card = $('<div>').addClass('card').attr('name', element);

  const front = $('<div>').addClass('front');
  const frontImage = $('<div>', {
    class: 'front-image',
    css: {
      backgroundImage: `url(images/${element}.svg)`,
    }
  });
  front.append(frontImage);

  const back = $('<div>').addClass('back');
  const backImage = $('<div>').addClass('back-image');
  back.append(backImage);

  card.append(front, back);
  $(parent).append(card);

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

function cardClicked() {
  if (gameState.clicked === 2) {
    return;
  } else {
    gameState.clicked++;
  }

  $(this).find('.back').addClass('hidden');

  if (!gameState.firstCardClicked) {
    gameState.firstCardClicked = $(this);
  } else {
    gameState.secondCardClicked = $(this);

    const firstElement = gameState.firstCardClicked.attr('name');
    const secondElement = gameState.secondCardClicked.attr('name');
    const search = [firstElement, secondElement].sort().join(' + ');
    const newElement = config.formulas[search] || 'ash';

    const totalCardsReached = $('.card').length === config.totalCards;
    const targetElementCreated = newElement === gameState.targetElement;

    // if max cards reached and not won
    if (totalCardsReached && !targetElementCreated) {
      removeCardClickHandlers();
      updateModal('game-over');
      showModal();
    // if first time creating this element
    } else if ($(`[name=${newElement}]`).length === 0) {
      updateModal(newElement);
      showModal();
      
      if (targetElementCreated) {
        gameStats.gamesWon++;
        removeCardClickHandlers();
      } else {
        delayedHideModal();
      }
    }

    // if element formula is non-existent
    if (newElement === 'ash') {
      gameStats.oops++;
    }

    // create card and delay hide
    const card = createCard(newElement, 'main');
    card.find('.back').addClass('hidden');
    delayedHide(card);
    delayedHideAndResetCards();
    
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

function delayedHide(card) {
  setTimeout(() => {
    card.find('.back').removeClass('hidden');
  }, config.flipDelay);
}

function delayedHideAndResetCards() {
  setTimeout(() => {
    gameState.firstCardClicked.find('.back').removeClass('hidden');
    gameState.secondCardClicked.find('.back').removeClass('hidden');

    gameState.firstCardClicked = gameState.secondCardClicked = null;
    gameState.clicked = 0;
  }, config.flipDelay);
}

function displayStats() {
  $('.games-played .value').text(gameStats.gamesPlayed);
  $('.games-won .value').text(gameStats.gamesWon);
  $('.attempts .value').text(gameStats.attempts);
  $('.oops .value').text(gameStats.oops);
}

function randomObjectValue(obj) {
  const keys = Object.keys(obj);
  const randomIndex = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randomIndex];

  return obj[randomKey];
}

function resetStats() {
  gameStats.attempts = gameStats.oops = 0;
}

function reset() {
  debugger;
  gameStats.gamesPlayed++;
  unInit();
  init();
  resetStats();
  displayStats();
}

function shuffle(array) {
  for (let i = array.length; i--; i > 0) {
    const j = Math.floor(Math.random() * i);

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function updateModal(element) {
  const text = element === 'ash' ? 'Oops...' : element.replace(/-/g, ' ');

  $('.modal-image').css('background-image', `url(images/${element}.svg)`);
  $('.modal-text').text(text);
}

function delayedHideModal(ms) {
  const delay = ms || config.modalDelay;

  setTimeout(() => {
    $('.modal').css('display', 'none');
  }, delay)
}

function showModal() {
  $('.modal').css('display', 'flex');
}

/*
TODO:
win screen
redesign reset button
side area redesign
new element animation
flip card animation
change cursor to wand?
modal animation
different card backs
background images alternative
keyframes for sidebar
h1 styling
combine card animation
new element found animation
about
story line
intro
combine card sound
settings - difficulty level
local storage
media query


IDEAS:
only create new element if not already created
*/
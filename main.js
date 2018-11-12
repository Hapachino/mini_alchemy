$('document').ready(function () {
  init();
});

const config = {
  startingCards: ['air', 'earth', 'fire', 'water'],
  totalCards: 9 * 4,
  hideDelay: 1500,
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
  discovered: 0,
}

function init() {
  shuffle(config.startingCards);
  createStartingCards(config.startingCards, 'main');
  addCardClickHandlers();
  addSettingsClickHandler();

  gameState.targetElement = randomObjectValue(config.formulas);
  updateModal(gameState.targetElement, 'you must create:');
  showModal();
  delayedHideModal();

  addResetHandler();
  displayStats();

  newGameWobble();
}

function unInit() {
  clearCards();
  removeCardClickHandlers();
  removeResetHandler();
}

function clearCards() {
  $('#game-area').empty();
}

function addSettingsClickHandler() {
  $('.settings').click(() => {
    $('.settings-modal').css('display', 'flex');
  });

  $('[name=reveal]').click(function() {
    if ($(this).is(':checked')) {
      $('.card').addClass('rotate');
    } else {
      $('.card').removeClass('rotate');
    }

    config.reveal = !config.reveal;
  })

  $('.exit-settings').click(() => {
    $('.settings-modal').css('display', 'none');
  })
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
  if (config.reveal) cardShadow(clicked);
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
      updateModal(newElement, 'you successfully created:');
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
  }, config.hideDelay);
}

function delayedHideAndResetCards() {
  setTimeout(() => {
    if (!config.reveal) {
      gameState.firstCardClicked.removeClass('rotate');
      gameState.secondCardClicked.removeClass('rotate');
    }

    gameState.firstCardClicked = gameState.secondCardClicked = null;
    gameState.clicked = 0;
  }, config.hideDelay);
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

function delayedHideModal(ms) {
  const delay = ms || config.hideDelay;

  setTimeout(() => {
    modalVisibility($('.modal'), false);
    addCardClickHandlers();
  }, delay)
}

function showModal() {
  removeCardClickHandlers();
  
  const modal = $('.modal');

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

/*
RESET: modal delay, card flip delay, total cards

TODO:
settings - difficulty, always reveal
background image
text styling
h1 styling
more cards - 10
new element discovered animation - smoke? alchemy circle background?
story line
more cards - 20
media query


IDEAS:
only create new element if not already created
*/
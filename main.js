$('document').ready(function () {
  init();
});

const config = {
  startingCards: ['air', 'earth', 'fire', 'water'],
  totalCards: 2 * 3,
  // 1000ms base line to account for modal transition time
  hideDelay: 1000 + 500,
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

  gameState.targetElement = randomObjectValue(config.formulas);
  updateModal(gameState.targetElement);
  showModal('you must create:');
  delayedHideModal();

  addResetHandler();
  displayStats();
}

function unInit() {
  clearCards();
  removeCardClickHandlers();
  removeResetHandler();
}

function clearCards() {
  $('#game-area').html('');
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

function cardClicked() {
  if (gameState.clicked === 2) {
    return;
  } else {
    gameState.clicked++;
  }

  const clicked = $(this);
  showCard(clicked);

  if (!gameState.firstCardClicked) {
    gameState.firstCardClicked = clicked;
  } else {
    gameState.secondCardClicked = clicked;

    const firstElement = gameState.firstCardClicked.attr('name');
    const secondElement = gameState.secondCardClicked.attr('name');
    const search = [firstElement, secondElement].sort().join(' + ');
    const newElement = config.formulas[search] || 'ash';

    // create card and delay hide
    const card = createCard(newElement, 'main');
    showCard(card);
    newCardAnimation(card);
    delayedHide(card);
    delayedHideAndResetCards();

    const totalCardsReached = $('.card').length === config.totalCards;
    const targetElementCreated = newElement === gameState.targetElement;

    // if max cards reached and not won
    if (totalCardsReached && !targetElementCreated) {
      removeCardClickHandlers();
      updateModal('defeat');
      showModal('uh oh...');
    // if first time creating this element
    } else if ($(`[name=${newElement}]`).length === 1) {
      updateModal(newElement);

      if (targetElementCreated) {
        gameStats.gamesWon++;
        removeCardClickHandlers();
        showModal('successfully created:');

      } else {
        showModal('discovered:');
        delayedHideModal();
      }

      gameStats.discovered++;
    }
    
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

function newCardAnimation(element) {
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
    gameState.firstCardClicked.removeClass('rotate');
    gameState.secondCardClicked.removeClass('rotate');
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

function updateModal(element) {
  const text = element === 'ash' ? 'Oops...' : element.replace(/-/g, ' ');

  $('.modal-image').css('background-image', `url(images/elements/${element}.svg)`);
  $('.modal-text').text(text);
}

function delayedHideModal(ms) {
  const delay = ms || config.hideDelay;

  setTimeout(() => {
    modalVisibility($('.modal'), false);
    addCardClickHandlers();
  }, delay)
}

function showModal(text) {
  removeCardClickHandlers();
  
  const info = text || '';
  $('.modal-discovered').text(info);

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

/*
RESET: modal delay, card flip delay, total cards

TODO:
win modal
background image
better win and lose screen
new element discovered animation - smoke
h1 styling
more cards - 10
about
settings - difficulty, always reveal
story line
more cards - 20
media query


IDEAS:
only create new element if not already created
*/
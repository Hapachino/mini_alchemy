$('document').ready(function () {
  shuffle(config.startingCards);
  createStartingCards(config.startingCards, 'main');
  $('#game-area').on('click', '.card', cardClicked);
  $('.reset').click(reset);
});

const config = {
  startingCards: ['air', 'earth', 'fire', 'water'],
  cardBack: 'trans4',
  flipDelay: 1000,
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
  firstCardClicked: null,
  secondCardClicked: null,
  clicked: 0,
};

const gameStats = {
  matches: 0,
  attempts: 0,
  gamesPlayed: 0,
}

function createCard(element, parent) {
  const card = $('<div>').addClass('card').attr('name', element);

  const front = $('<div>').addClass('front');
  const frontImage = $('<div>', {
    class: 'front-image',
    css: {
      backgroundImage: `url(images/${element}.png)`,
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
    const card = createCard(newElement, 'main');
    card.find('.back').addClass('hidden');
    delayedHide(card);

    gameStats.attempts++;
    delayedHideAndReset();
    displayStats();
  }
}

function delayedHide(card) {
  setTimeout(() => {
    card.find('.back').removeClass('hidden');
  }, config.flipDelay);
}

function delayedHideAndReset() {
  setTimeout(() => {
    gameState.firstCardClicked.find('.back').removeClass('hidden');
    gameState.secondCardClicked.find('.back').removeClass('hidden');

    gameState.firstCardClicked = gameState.secondCardClicked = null;
    gameState.clicked = 0;
  }, config.flipDelay);
}

function displayStats() {
  $('.games-played .value').text(gameStats.gamesPlayed);
  $('.attempts .value').text(gameStats.attempts);
}

function resetStats() {
  gameStats.attempts = 0;
  displayStats();
}

function reset() {
  gameStats.gamesPlayed++;
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

/*
TODO:
show goal card
win when goal card produced
win screen
if max card count reached before win, lose
lose screen
redo reset button to actually reset
redesign reset button
make color darker for images
change cursor to wand?
different card backs
background images alternative
stats visibility and styling
new stats - repeated elements, attempts, failed elements, total new elements created, new element creation rate
h1 styling
new element animation
flip card animation
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
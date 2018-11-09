$('document').ready(function () {
  createStartingCards(config.startingCards, 'main');
  $('#game-area').on('click', '.card', cardClicked);
  $('.reset').click(reset);
});

const config = {
  startingCards: ['air', 'fire', 'earth', 'water'],
  cardBack: 'trans4',
  flipDelay: 1000,
  formulas: {
    // tier 1
    // air, fire, earth, water

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
  // check if two cards have already been flipped
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
    const newElement = config.formulas[search];
    
    // if no such formula
    if (!newElement) {
      console.log('formula doesn\'t exist');
    } else {
      // checking if element exists already
      // const currentCards = [...$('.card')].map(card => $(card).attr('name'));
      const card = createCard(newElement, 'main');
      card.find('.back').addClass('hidden');
      delayedHide(card);
    }

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

/*
TODO:
change h1 style
make stats more visible
show goal card
win when goal card produced
win screen
redo reset button to actually reset
redesign reset button
different card backs
background images alternative
new element animation
flip card animation
if max card count reached before win, lose
lose screen
no such formula notification?
combine card animation
combine card sound
about
story line
intro
settings - difficulty level


IDEAS:
only create new element if doesn't exist
*/
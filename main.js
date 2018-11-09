$('document').ready(function () {
  createCards(config.cards);
  $('.card').click(cardClicked);
  $('.reset').click(reset);
});

const config = {
  cards: 18,
  totalPossibleMatches() {
    return this.cards / 2;
  },
  flipDelay: 1000,
}

const gameState = {
  firstCardClicked: null,
  secondCardClicked: null,
  clicked: 0,
  matchCounter: 0,
};

const gameStats = {
  matches: 0,
  attempts: 0,
  accuracy: 0,
  gamesPlayed: 0
}

function createCards(number) {
  for (let i = 0; i < number; i++) {
    const card = $('<div>').addClass('card');
    const front = $('<div>').addClass('front').text(i / 2 | 0);
    const back = $('<div>').addClass('back');

    card.append(front, back);
    $('main').append(card);
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

    if (gameState.firstCardClicked.text() === gameState.secondCardClicked.text()) {
      delayCardInteraction('matched');
      gameStats.matches++;

      if (gameStats.matches === config.totalPossibleMatches()) {
        console.log('You won!');
      } 
    } else {
      delayCardInteraction('mismatched');
    }

    gameStats.attempts++;
    displayStats();
  }
}

function delayCardInteraction(isMatched) {
  const ms = isMatched === 'mismatched' ? config.flipDelay : 0;

  setTimeout(function() {
    if (isMatched === 'mismatched') {
      gameState.firstCardClicked.find('.back').removeClass('hidden');
      gameState.secondCardClicked.find('.back').removeClass('hidden');
    }

    gameState.firstCardClicked = gameState.secondCardClicked = null;
    gameState.clicked = 0;
  }, ms);
}

function displayStats() {
  $('.games-played .value').text(gameStats.gamesPlayed);
  $('.attempts .value').text(gameStats.attempts);

  if (gameStats.attempts) {
    gameStats.accuracy = Math.floor(gameStats.matches / gameStats.attempts * 100) + '%';
  } else {
    gameStats.accuracy = 'N/A';
  }

  $('.accuracy .value').text(gameStats.accuracy);
}

function resetStats() {
  gameStats.accuracy = gameStats.attempts = gameStats.matches = 0;
  displayStats();
}

function reset() {
  gameStats.gamesPlayed++;
  resetStats();
  displayStats();
  $('.back').removeClass('hidden');
}

const recipes = {
  // tier 1
  'uncooked rice': {},
  'water': {},
  'fire': {},
  'knife': {},
  // 'seaweed': {},
  'salmon': {},
  'tuna': {},
  'vinegar mix': {},
  // 'bamboo mat': {},
  // tier 2
  // tier 3
  // tier 4
}

const formulas = {
  // tier 1
  air: {},
  fire: {},
  earth: {},
  water: {},
  // tier 2
  // tier 3
  // tier 4
}

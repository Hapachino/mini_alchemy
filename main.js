const config = {
  cards: 4,
  totalPossibleMatches() {
    return this.cards / 2;
  }
}

const gameState = {
  firstCardClicked: null,
  secondCardClicked: null,
  clicked: 0,
  matchCounter: 0,
};

$('document').ready(function() {
  createCards(config.cards);
  $('.card').click(cardClicked);
});

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
      gameState.matchCounter++;

      if (gameState.matchCounter === config.totalPossibleMatches()) {
        console.log('You won!');
      } 
    } else {
      delayCardInteraction('mismatched');
    }
  }
}

function delayCardInteraction(isMatched) {
  const ms = isMatched === 'mismatched' ? 2000 : 0;

  setTimeout(function() {
    if (isMatched === 'mismatched') {
      gameState.firstCardClicked.find('.back').removeClass('hidden');
      gameState.secondCardClicked.find('.back').removeClass('hidden');
    }

    gameState.firstCardClicked = gameState.secondCardClicked = null;
    gameState.clicked = 0;
  }, ms);
}

$(document).ready(init);

const config = {
  startingCards: ['air', 'earth', 'fire', 'water'],
  // startingCards: Array(36), // for layout testing purposes
  totalCards: 9 * 4,
  hideCardDelay: 1750,
  hideCardDelayToggle: 1250,
  hideModalDelay: 1750,
  reveal: false,
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
  const shuffled = shuffle(config.startingCards);
  createStartingCards(shuffled, 'main');

  displayStats();
  newGameWobble();
  newGameWobbleOnEnter();

  addClickHandlers();
  
  // first game target modal is shown and click handlers added after intro modal is closed
  if ($('.intro-modal').css('display') === 'none') {
    showTargetElement();
  }

  fixStats();
  initialLegend();
}

function unInit() {
  clearCards();
  removeClickHandlers();
  clearHistory();
  clearLegend();
}

function removeClickHandlers() {
  removeCardClickHandlers();
  removeResetHandler();
  removeSettingsClickHandler();
  removeLegendClickHandlers();
  removeHistoryClickHandlers();
  removeTargetClickHandlers();
}

function showTargetElement() {
  gameState.targetElement = randomObjectValue(formulas);
  updateModal(gameState.targetElement, 'you must create:');
  showModal();
  delayedHideModal(2500);
}

function addClickHandlers() {
  addCardClickHandlers();
  addSettingsClickHandler();
  addResetHandler();
  addLegendClickHandlers();
  addIntroClickHandler();
  addHistoryClickHandlers();
  addTargetClickHandler();
}

function clearCards() {
  $('#game-area').empty();
}

function addIntroClickHandler() {
  $('.exit-intro').click(() => {
    $('.intro-modal').hide();

    showTargetElement();
  });
}

function addSettingsClickHandler() {
  $('.settings').click(() => {
    $('.legend-modal').hide();
    $('.history-modal').hide();
    $('.target-modal').hide();
    $('.settings-modal').toggle();
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
    $('.settings-modal').hide();
  });
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
  const newElement = formulas[search] || 'failed';

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

    const firstElement = gameState.firstCardClicked.attr('name');
    const secondElement = gameState.secondCardClicked.attr('name');
    insertHistory(firstElement, secondElement, newElement);

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
      insertLegend(newElement);
    }
    
    if (gameLost || gameWon) newGameWobble();
    if (newElementCreated && !failed) gameStats.discovered++;
    gameStats.attempts++;
    displayStats();

    delayedHideAndResetCards();
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
  const shuffled = array.slice();

  for (let i = shuffled.length; i--; i > 0) {
    const j = Math.floor(Math.random() * i);

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function updateModal(element, info, isTarget) {
  const prefix = isTarget ? '.target' : '.info';
  
  $(`${prefix}-modal-image`).css('background-image', `url(images/elements/${element}.svg)`);
  $(`${prefix}-modal-info`).text(info);
  $(`${prefix}-modal-text`).text(element.replace(/-/g, ' '));
}

function delayedHideModal(ms, isSettings) {
  const delay = ms || config.hideModalDelay;
  const modal = isSettings ? $('.settings-modal') : $('.info-modal'); 

  setTimeout(() => {
    modalVisibility(modal, false);
    addCardClickHandlers();
  }, delay)
}

function showModal(isSettings) {
  removeCardClickHandlers();
  
  const modal = !isSettings ? $('.info-modal') : $('.settings-modal');

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

function fixStats() {
  const aside = $('aside');
  const screen = $(window);
  
  screen.scroll(() => {
    aside.toggleClass("sticky", screen.scrollTop() > 66);
  });
}

function insertLegend(element) {
  const legendEntry = $('<div>').addClass('legend-entry');
  const image = $('<div>').addClass('legend-image').css('background-image', `url(images/elements/${element}.svg)`);
  const info = $('<div>').addClass('legend-info').text(element.replace(/-/g, ' '));

  legendEntry.append(image).append(info);
  $('.legend-modal-elements-container').append(legendEntry);
}

function initialLegend() {
  config.startingCards.forEach(card => {
    insertLegend(card);
  });
}

function addLegendClickHandlers() {
  $('.open-legend-modal').click(() => {
    $('.settings-modal').hide();
    $('.history-modal').hide();
    $('.target-modal').hide();
    $('.legend-modal').toggle();
  });

  $('.exit-legend-modal').click(() => {
    $('.legend-modal').hide();
  });
}

function removeLegendClickHandlers() {
  $('.open-legend-modal').off('click');
  $('.exit-legend-modal').off('click');
}


function addHistoryClickHandlers() {
  $('.open-history-modal').click(() => {
    $('.settings-modal').hide();
    $('.legend-modal').hide();
    $('.target-modal').hide();
    $('.history-modal').toggle();
  });

  $('.exit-history-modal').click(() => {
    $('.history-modal').hide();
  });
}

function removeHistoryClickHandlers() {
  $('.open-history-modal').off('click');
  $('.exit-history-modal').off('click');
}

function insertHistory(element1, element2, newElement) {
  const historyMessage = $('.history-message');

  if (historyMessage.length) historyMessage.remove();

  const formulaEntry = $('<div>').addClass('history-entry');
  const image1 = $('<div>').addClass('history-image').css('background-image', `url(images/elements/${element1}.svg)`);
  const image2 = $('<div>').addClass('history-image').css('background-image', `url(images/elements/${element2}.svg)`);
  const image3 = $('<div>').addClass('history-image').css('background-image', `url(images/elements/${newElement}.svg)`);

  formulaEntry.append(image1)
              .append('+')
              .append(image2)
              .append('=')
              .append(image3);

  $('.history-modal-container').append(formulaEntry);
}

function clearLegend() {
  $('.legend-modal-elements-container').empty();
}

function clearHistory() {
  $('.history-modal-container').empty();
}

function addTargetClickHandler() {
  $('.target').click(() => {
    updateModal(gameState.targetElement, 'you must create:', true);
    $('.settings-modal').hide();
    $('.legend-modal').hide();
    $('.history-modal').hide();
    $('.target-modal').toggle();
  })
}

function removeTargetClickHandlers() {
  $('.target').off('click');
}

/*
BLUE SKY:
settings - difficulty
object constructor at beginning to determine game difficulty
*/

// in progress
function gameDifficulty(level) {
  const values = Object.values(formulas);
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

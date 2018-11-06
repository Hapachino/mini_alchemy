const cards = 18;

$('document').ready(createCards.bind(this, cards));

function createCards(number) {
  for (let i = 0; i < number; i++) {
    const card = $('<div>').addClass('card');
    const front = $('<div>').addClass('front');
    const back = $('<div>').addClass('back');

    card.append(front, back);
    $('main').append(card);
  }
}

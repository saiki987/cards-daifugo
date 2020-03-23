
class Cards
{
  constructor()
  {
    this.setCards();
  }

  groupingCards(numSection)
  {
    // arrayはインデックスが規則的である必要がある。
    
    let array = this.cards;
  
    let result = [];
    for (let p=0; p < numSection; p++) {
      result.push([]);
    }
    for (let p=0; p < array.length; p++) {
      result[p % numSection].push(array[p]); 
    };
    this.groupedCards = result;
    return result;
  }

  shuffle()
  {
    let array = this.cards;
    for (var i = array.length - 1; i > 0; i--) {
      var r = Math.floor(Math.random() * (i + 1));
      var tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }
    this.cards = array;
  }

  setCards()
  {
    let cards = [];
    const initials = ['s', 'h', 'd', 'c'];

    for (let initial of initials) {
      for (let p=0; p < 13; p ++) {
        let card = new Card(initial, p + 1);
        cards.push(card);
      }
    }
    this.cards = cards;
  }

}
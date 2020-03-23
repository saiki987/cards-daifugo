
class GameRule
{
  constructor(kakumei = false)
  {
    this.gameState = {
      kakumei: kakumei,
      elevenBack: false,
      markBinding: false
    }
    this.playerCards = [];
    this.groupedCards = [];
    this.lastCards = [];
  }

  // AIに出せるカードの組みを伝えることを想定
  servableCardsList()
  {
    this.sort();
    this.grouping();

    if (this.lastCards.length === 0) {
      return this.groupedCards;
    }
    let filtered = this.groupedCards.filter((group) => {
      if (!this.isStrongerThan(group[0], this.lastCards[0])) {
        return false;
      } else if (group.length < this.lastCards.length) {
        return false;
      } else if (this.gameState.markBinding && !this.hasSameMarks(group)) {
        return false;
      } else {
        return true;
      }
    })
    return filtered
  }

  firstServable()
  {
    let firstServable = [];
    let servableCardsList = this.servableCardsList()
    if (this.lastCards.length === 0) {
      return servableCardsList[0];
    }
    if (servableCardsList.length !== 0) {
      firstServable = servableCardsList.find(cards => cards.length === this.lastCards.length);
      if (firstServable == null) {
        if (this.gameState.markBinding) {
          firstServable = servableCardsList[0].filter((card) => {
            let initials = this.lastCards.map((card) => card.initial);
            return initials.includes(card.initial);
          });
        } else {
          firstServable = servableCardsList[0].slice(0, this.lastCards.length);
        }
      }
    }
    return firstServable;
  }

  // 人が選択したカードをチェックする状況を想定
  checkCards(cards)
  {
    if (this.lastCards.length === 0 && this.allSameNumber(cards)) {
      return true;
    }
    if (!this.isStrongerThan(cards[0], this.lastCards[0])) {
      return false;
    } else if (!this.allSameNumber(cards)) {
      return false;
    } else if (cards.length !== this.lastCards.length) {
      return false;
    } else if (this.gameState.markBinding && !this.hasSameMarks(cards)) {
      return false;
    } else {
      return true;
    }
  }

  sort()
  {
    this.playerCards.sort((a, b) => {
      if (this.isStrongerThan(b, a)) return -1;
      if (this.isStrongerThan(a, b)) return 1;
      return 0;
    })
  }

  grouping()
  {
    let group = [];
    let lastCardNumber = 0;
    for (let card of this.playerCards) {
      if (card.number === lastCardNumber) {
        group[group.length - 1].push(card);
      } else {
        group.push([card]);
        lastCardNumber = card.number;
      }
    }
    this.groupedCards = group;
    return group;
  }

  isNormalPowerDirection()
  {
    if (this.gameState.kakumei) {
      if (this.gameState.elevenBack) return true;
      return false;
    } else {
      if (this.gameState.elevenBack) return false;
      return true;
    }
  }

  isStrongerThan(cardA, cardB)
  {
    let numA = this.specialNumber(cardA.number);
    let numB = this.specialNumber(cardB.number);
    if (this.isNormalPowerDirection()) {
      if (numA > numB) {
        return true;
      } else {
        return false;
      }

    } else {
      if (numA < numB) {
        return true;
      } else {
        return false;
      }
    }
  }

  specialNumber(num)
  {
    if (num < 3) {
      return num + 13;
    } else {
      return num;
    }
  }

  hasSameMarks(cards)
  {
    let initials = [];
    for (let card of cards) {
      initials.push(card.initial);
    }
    for (let lCard of this.lastCards) {
      if (!initials.includes(lCard.initial)) {
        return false;
      }
    }
    return true;
  }

  allSameNumber(cards)
  {
    let number = cards[0].number;
    for (let card of cards) {
      if (card.number !== number) {
        return false;
      }
    }
    return true;
  }
}

window.onload = function() {
  const AUTO_MODE = false;
  const MAX_TURN = 100;
  const TURN_SPEED = 1000;

  let gc = new GameController()
  // 配列のコピーを取らない場合、予想以上の再レンダリングが起きた。
  gc.viewModel.yourCards = gc.yourCards.slice(0, gc.yourCards.length);
  gc.viewModel.gc = gc;

  // startTimer は viewModelの中でも使う
  window.startTimer = function() {
    let timer = setInterval(function () {
      gc.incrementTurn();
      console.log(gc.turn);
      if (gc.turn > MAX_TURN) {
        clearInterval(timer);
        return;
      }
      if (!AUTO_MODE && gc.turn % 4 === 0) {
        clearInterval(timer);
        gc.yourTurnAction();
      } else {
        gc.turnAction();
      }
    }, TURN_SPEED);
  }
  startTimer();
}

class GameController
{
  constructor() 
  {
    this.gameRule = new GameRule();
    let cards = new Cards();
    cards.shuffle();
    this.groupedCards = cards.groupingCards(4);

    this.gameRule.playerCards = this.groupedCards[0];
    this.gameRule.sort();
    this.yourCards = this.gameRule.playerCards;

    this.lastCards = [];
    this.turn = 0;
    this.pid = 0;
    this.passCount = 0;
    this.gameState = {
      kakumei: false,
      elevenBack: false,
      markBinding: false
    }
    // viewModel is Vue instance in viewModel.js
    this.viewModel = viewModel;
  }

  turnAction() 
  {
    let pid = this.pid
    if (this.groupedCards[pid].length === 0) {
      this.passCount += 1;
      return;
    }
    if (this.passCount > 2) {
      this.passThrough();
    }
    this.gameRule.lastCards = this.lastCards;
    this.gameRule.playerCards = this.groupedCards[pid];
    let firstServable = this.gameRule.firstServable();

    if (firstServable.length === 0) {
      this.passCount += 1;
    } else {
      this.serveCards(firstServable);
    }
  }

  yourTurnAction() 
  {
    let pid = this.pid
    if (this.groupedCards[pid].length === 0) {
      this.passCount += 1;
      startTimer();
      return;
    }
    if (this.passCount > 2) {
      this.passThrough();
    }
  }

  // watch gameState
  setGameState(obj)
  {
    if (obj.kakumei != null) this.gameState.kakumei = obj.kakumei;
    if (obj.elevenBack != null) this.gameState.elevenBack = obj.elevenBack;
    if (obj.markBinding != null) this.gameState.markBinding = obj.markBinding;
    this.viewModel.gameState = this.gameState;
    this.gameRule.gameState = this.gameState;
  }

  setLastCards(cards)
  {
    this.lastCards = cards,
    this.updateView(),
    this.gameRule.lastCards = cards
  }

  incrementTurn()
  {
    this.turn += 1;
    this.pid = this.turn % 4;
  }

  passTurn()
  {
    this.passCount += 1;
  }

  serveCards(cards)
  {
    this.passCount = 0;
    for (let card of cards) {
      let index = this.groupedCards[this.pid].findIndex(item => item.id === card.id);
      this.groupedCards[this.pid].splice(index, 1);
    }

    if (this.lastCards.length > 0) {
      if (this.hasSameMarks(cards, this.lastCards)) {
        this.setGameState({markBinding: true});
      }
    }
    if (cards[0].number === 11) {
      this.setGameState({elevenBack: true});
    }
    if (cards.length === 4) {
      this.setGameState({kakumei: !this.gameState.kakumei});
    }
    if (cards[0].number === 8) {
      this.turn -= 1;
      this.passThrough();
      this.viewModel.fieldCards.splice(this.pid, 1, cards);
      this.viewModel.zIndexes.splice(this.pid, 1, this.turn);
      return;
    }
    this.setLastCards(cards);
    if (this.groupedCards[this.pid].length === 0) {
      alert('上がり!')
    }
  }

  updateView()
  {
    let pid = this.pid
    // Vuejs は splice を使うとリアクティブになる。
    this.viewModel.numPlayerCards.splice(pid, 1, this.groupedCards[pid].length)
    this.viewModel.fieldCards.splice(pid, 1, this.lastCards);
    this.viewModel.zIndexes.splice(pid, 1, this.turn);
  }

  passThrough()
  {
    this.setLastCards([]);
    this.setGameState({elevenBack: false, markBinding: false});
    this.viewModel.fieldCards = [[],[],[],[]];
  }

  hasSameMarks(cards, lastCards)
  {
    let initials = [];
    for (let card of cards) {
      initials.push(card.initial);
    }
    for (let lCard of lastCards) {
      if (!initials.includes(lCard.initial)) {
        return false;
      }
    }
    return true;
  }
}

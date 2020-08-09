
let viewModel = new Vue({
  el: '#game-board',
  data: function() {
    return {
      gameState: {
        kakumei: false,
        elevenBack: false,
        markBinding: false
      },
      fieldCards: [[],[],[],[]],
      zIndexes: [0, 0, 0, 0],
      yourCards: [],
      selectedCards: [],
      servable: false,
      numPlayerCards: [13, 13, 13, 13]
    }
  },
  methods: {
    selectCard: function(index) {
      let card = this.yourCards[index];
      if (card.selected) {
        card.selected = false;
        let removeIndex = this.selectedCards.findIndex((item) => item.id === card.id);
        this.selectedCards.splice(removeIndex, 1);
      } else {
        // selected undefined or 
        card.selected = true;
        card.index = index;
        this.selectedCards.push(card);
      }
      this.yourCards.splice(index, 1, card);
      this.checkCards();
    },
    serveCards: function () {
      let yourCardImages = document.getElementsByClassName('player1-card');
      for (let card of this.selectedCards) {
        yourCardImages[card.index].classList.add('hidden');
      }
      // this.fieldCards.splice(0, 1, this.selectedCards);
      this.gc.serveCards(this.selectedCards);
      this.selectedCards = [];
      this.servable = false;
      startTimer();
    },
    passYourTurn: function () {
      this.gc.passTurn();
      startTimer();
      this.servable = false;
    },
    checkCards: function () {
      if (this.selectedCards.length < 1) {
        this.servable = false;
        return;
      }
      if (this.gc.gameRule.checkCards(this.selectedCards)) {
        this.servable = true;
      } else {
        this.servable = false;
      };
    }
  },
  computed: {
    disableServeButton: function () {
      return !this.servable
    }
  }
})

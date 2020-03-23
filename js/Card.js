
class Card
{
  constructor(initial, number)
  {
    const cards13 = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    this.initial = initial;
    this.number = number;
    this.id = `${initial}${number}`;
    this.setMarkAndColor(initial);
    this.text = this.mark + cards13[number - 1];

    let imageId;
    if (number < 10) {
      imageId = `0${number}`;
    } else {
      imageId = `${number}`;
    }
    this.imageUrl = `images/cards/${initial}${imageId}.png`;
  }

  static makeCard(initial, number)
  {
    let card = new Card(initial, number);
    return card;
  }

  setMarkAndColor(initial)
  {
    if (initial === "s") {
      this.mark = "♠️";
      this.color = "black";
    }
    if (initial === "h") {
      this.mark = "♥️";
      this.color = "#dc2b2b";
    }
    if (initial === "d") {
      this.mark = "♦️";
      this.color = "#dc2b2b";
    }
    if (initial === "c") {
      this.mark = "♣️";
      this.color = "black";
    }
  }

}
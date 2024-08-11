const url = 'http://localhost:3030/';
const url2 = 'http://localhost:3030/quantidadedecartas'
let mao = 0;
const maxCartas = 5;
const maxMao = 2;
let fim;
let hand = [];
let hand2 = [];
let handValue=0;
let hand2Value=0;
let pot = 0;
let apostaValida = 0;
balance = 1000;
let deckId;
const valueMap = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    '0': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};
const reverseValueMap = Object.entries(valueMap).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {});
reverseValueMap[10] = '10';
const cardNames = {
    '2H': '2 de Copas', '3H': '3 de Copas', '4H': '4 de Copas', '5H': '5 de Copas', '6H': '6 de Copas', '7H': '7 de Copas', '8H': '8 de Copas', '9H': '9 de Copas', '0H': '10 de Copas', 'JH': 'Valete de Copas', 'QH': 'Dama de Copas', 'KH': 'Rei de Copas', 'AH': 'Ás de Copas',
    '2D': '2 de Ouros', '3D': '3 de Ouros', '4D': '4 de Ouros', '5D': '5 de Ouros', '6D': '6 de Ouros', '7D': '7 de Ouros', '8D': '8 de Ouros', '9D': '9 de Ouros', '0D': '10 de Ouros', 'JD': 'Valete de Ouros', 'QD': 'Dama de Ouros', 'KD': 'Rei de Ouros', 'AD': 'Ás de Ouros',
    '2S': '2 de Espadas', '3S': '3 de Espadas', '4S': '4 de Espadas', '5S': '5 de Espadas', '6S': '6 de Espadas', '7S': '7 de Espadas', '8S': '8 de Espadas', '9S': '9 de Espadas', '0S': '10 de Espadas', 'JS': 'Valete de Espadas', 'QS': 'Dama de Espadas', 'KS': 'Rei de Espadas', 'AS': 'Ás de Espadas',
    '2C': '2 de Paus', '3C': '3 de Paus', '4C': '4 de Paus', '5C': '5 de Paus', '6C': '6 de Paus', '7C': '7 de Paus', '8C': '8 de Paus', '9C': '9 de Paus', '0C': '10 de Paus', 'JC': 'Valete de Paus', 'QC': 'Dama de Paus', 'KC': 'Rei de Paus', 'AC': 'Ás de Paus'
}; 
const statusDiv = document.getElementById("status");
const status1Div = document.getElementById("status1");
const betSizeText = document.getElementById("bet");
const potText = document.getElementById("pot");
const vencedorText = document.getElementById("vencedor");
const check = document.getElementById("botaoCheck");
const hand2Img = [];
const cardImages = [];
betSizeText.style.display = "none";
check.style.display = "none";

// Imagens

for (let i = 0; i < maxCartas+(maxMao*2); i++) {
    const cardImage = document.createElement("img");
    const currentDiv = document.getElementById(`div${i + 1}`);
    currentDiv.appendChild(cardImage);
    cardImages.push(cardImage);
}

//API funções

async function getDeckId() {
  try {
      let response = await fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      let data = await response.json();
      return data.deck_id;
  }catch (error) {
      console.error("Erro ao consumir a API:", error);
  }
}

async function getACard(deckId, numero) {
  try {
      let response = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numero}`);
      let data = await response.json();
      return data
} catch (error) {
      console.error("Erro ao consumir a API:", error);
  }
}

//Funções Ações

async function start(){
  deckId= await getDeckId();
  resetGame();
  drawHand(hand, 5);
  drawHand2(hand2);
  if(balance===0){
    balance=1000;
  }
  atualizarBalanço();
  potText.innerText = `pot: $${pot}`;
  }
  

function verificaBet(){
  const betSize = parseFloat(betSizeText.value);
  if (balance<betSize || isNaN(betSize) || betSize<=0){
    statusDiv.innerText ="Aposta Invalida";
    apostaValida=0;
    betSizeText.value = '';
    }else{
      apostaValida=1;
    }  
}

function bet(){
  const betSize = parseFloat(betSizeText.value);
  pot = pot + 2*betSize;
  potText.innerText = `pot: $${pot}`;
  balance = balance - betSize;
  atualizarBalanço();
  betSizeText.value = '';
}

function atualizarBalanço() {
  const balanceElement = document.getElementById('balance');
  balanceElement.textContent = `Balance: $${balance}`;
}

async function drawHand(cartas, n){
  cards= await getACard(deckId,2);
      for(i=0;i<2;i++){
        cartas.push(cards.cards[i].code);
        cardImages[mao+n+i].src = cards.cards[i].images.png;
        }
  statusDiv.innerText = "";
}

async function drawHand2(cartas){
  cards= await getACard(deckId,2);
      for(let i=0;i<2;i++){
        cartas.push(cards.cards[i].code);
        hand2Img[i] = cards.cards[i].images.png;
        cardImages[mao+7+i].src = 'C:/Users/Emerson/new-api/src/Imagem Fundo/card back orange.png';
        } 
  botao.textContent="Aposte";
  betSizeText.style.display = "block";
  check.style.display = "block";
  botao.style.display = "block";
}

function showHand() {
  for (let i = 0; i < hand2Img.length; i++) {
      const cardImage = cardImages[mao + 7 + i];
      cardImage.classList.add('flip');
      botao.textContent = 'Começar';
      statusDiv.innerText = result(hand);
      status1Div.innerText = result(hand2);
      setTimeout(() => {
          cardImage.src = hand2Img[i];
          cardImage.classList.remove('flip');
      }, 300);
  }
  console.log(hand);
  console.log(hand2);
}

async function floop(){
  cards= await getACard(deckId,3);
  for (let x=0;x<3;x++){
      hand.push(cards.cards[x].code);
      hand2.push(cards.cards[x].code);
      cardImages[x].src = cards.cards[x].images.png;
  }
  botao.textContent="Aposte";
  betSizeText.style.display = "block";
  check.style.display = "block";
  botao.style.display = "block";
}

async function turn(){
  cards= await getACard(deckId,1);
  hand.push(cards.cards[0].code);
  hand2.push(cards.cards[0].code);
  cardImages[3].src = cards.cards[0].images.png;
  botao.textContent="Aposte";
  betSizeText.style.display = "block";
  check.style.display = "block";
  botao.style.display = "block";
}


async function river(){
  cards= await getACard(deckId,1);
  hand.push(cards.cards[0].code);
  hand2.push(cards.cards[0].code);
  cardImages[4].src = cards.cards[0].images.png;
  botao.textContent="Aposte";
  betSizeText.style.display = "block";
  check.style.display = "block";
  botao.style.display = "block";
}

function resetGame() {
    mao = 0;
    hand = [];
    hand2 = [];
    for (let i = 0; i < cardImages.length; i++) {
        cardImages[i].src = "";
        cardImages[i].alt = "";
    }
    statusDiv.innerText = "Jogo iniciado.";
    status1Div.innerText = "";
    vencedorText.innerText = "";
  }

//Funções Auxiliares

function countValues(hand) {
    const values = hand.map(card => valueMap[card[0]]);
    return values.reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
}

function valuesToCards(values) {
    return values.map(value => reverseValueMap[value] || 'Unknown');
}
 
//Função Jogadas

function hasPair(valueCounts) {
    return Object.values(valueCounts).some(count => count === 2);
}
  
function hasTwoPairs(valueCounts) {
    const pairs = Object.values(valueCounts).filter(count => count === 2).length;
    return pairs === 2;
}
  
function hasThreeOfAKind(valueCounts) {
    return Object.values(valueCounts).some(count => count === 3);
}
  
function hasFourOfAKind(valueCounts) {
    console.log(valueCounts);
    return Object.values(valueCounts).some(count => count === 4);
}
  
function isFlush(hand) {
    const suits = hand.map(card => card.slice(-1));
    const suitCounts = suits.reduce((acc, suit) => {
      acc[suit] = (acc[suit] || 0) + 1;
      return acc;
    }, {});
    
    return Object.values(suitCounts).some(count => count >= 5);
}

function getHighCard(hand) {
    const values = hand.map(card => valueMap[card[0]]);
    const highestValue = Math.max(...values);
    const highCard = hand.find(card => valueMap[card[0]] === highestValue);
    return highCard;
}
  
function hasStraight(hand) {
    const values = hand.map(card => valueMap[card[0]]);
    const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
    for (let i = 0; i <= uniqueValues.length - 5; i++) {
      const sequence = uniqueValues.slice(i, i + 5);
      if (sequence[4] - sequence[0] === 4) {
        return true;
      }
    }
  
    return false;
}

function hasFullHouse(valueCounts) {
    const values = Object.values(valueCounts);
    return values.includes(3) && values.includes(2);
}

function hasStraightFlush(hand) {
    const suits = hand.map(card => card.slice(-1));
    const suitCounts = suits.reduce((acc, suit) => {
      acc[suit] = (acc[suit] || 0) + 1;
      return acc;
    }, {});
  
    for (const suit in suitCounts) {
      if (suitCounts[suit] >= 5) {
        const suitedCards = hand.filter(card => card.slice(-1) === suit);
        if (hasStraight(suitedCards)) {
          return true;
        }
      }
    }
  
    return false;
}

function hasRoyalStraightFlush(hand) {
    const suits = hand.map(card => card.slice(-1));
    const suitCounts = suits.reduce((acc, suit) => {
      acc[suit] = (acc[suit] || 0) + 1;
      return acc;
    }, {});
  
    const royalValues = [10, 11, 12, 13, 14];
  
    for (const suit in suitCounts) {
      if (suitCounts[suit] >= 5) {
        const suitedCards = hand.filter(card => card.slice(-1) === suit);
        const suitedValues = suitedCards.map(card => valueMap[card[0]]);
  
        if (royalValues.every(value => suitedValues.includes(value))) {
          return true;
        }
      }
    }
  
    return false;
}

// Função resultado

function result(hand) {
  const valueCounts = countValues(hand);
  if (hasRoyalStraightFlush(hand)) {
      return "Royal Straight Flush";
    }else if (hasStraightFlush(hand)) {
      return "Straight Flush";
    }else if (hasFourOfAKind(valueCounts)) {
      const fours = Object.keys(valueCounts).filter(value => valueCounts[value] === 4);
      const fourCards = valuesToCards(fours.map(val => Number(val)));
      return `Four of a Kind de ${fourCards}`;
    }else if (hasFullHouse(valueCounts)) {
      return "Full House";
    }else if (isFlush(hand)) {
      return "Flush";
    }else if (hasStraight(hand)){
      const four = Object.keys(valueCounts).filter(value => valueCounts[value] === 4);
      const fourCards = valuesToCards(four.map(val => Number(val)));
      return `Four of a kind de ${fourCards}`;
    }else if (hasThreeOfAKind(valueCounts)) {
      const threes = Object.keys(valueCounts).filter(value => valueCounts[value] === 3);
      const threeCards = valuesToCards(threes.map(val => Number(val)));
      return `Three of a Kind de ${threeCards}`;
    }else if (hasTwoPairs(valueCounts)) {
      const pairs = Object.keys(valueCounts).filter(value => valueCounts[value] === 2);
      pairs.sort((a, b) => b - a); 
      const topPairs = pairs.slice(0, 2); 
      const pairCards = valuesToCards(topPairs.map(val => Number(val)));
      return `Two Pair de ${pairCards[0]} e ${pairCards[1]}`;
    }else if (hasPair(valueCounts)) {
      const pairs = Object.keys(valueCounts).filter(value => valueCounts[value] === 2);
      const highestPair = Math.max(...pairs.map(Number));
      return `Pair de ${reverseValueMap[highestPair]}`;
    }else{
      return `High Card ${cardNames[getHighCard(hand)]}`;
    }
}

function value(hand){
  const valueCounts = countValues(hand);
  if (hasRoyalStraightFlush(hand)) {
      return 1;
    }else if (hasStraightFlush(hand)) {
      return 2;
    }else if (hasFourOfAKind(valueCounts)) {
      const fours = Object.keys(valueCounts).filter(value => valueCounts[value] === 4);
      const fourCards = valuesToCards(fours.map(val => Number(val)));
      return 3;
    }else if (hasFullHouse(valueCounts)) {
      return 4;
    }else if (isFlush(hand)) {
      return 5;
    }else if (hasStraight(hand)){
      const four = Object.keys(valueCounts).filter(value => valueCounts[value] === 4);
      const fourCards = valuesToCards(four.map(val => Number(val)));
      return 6;
    }else if (hasThreeOfAKind(valueCounts)) {
      const threes = Object.keys(valueCounts).filter(value => valueCounts[value] === 3);
      const threeCards = valuesToCards(threes.map(val => Number(val)));
      return 7;
    }else if (hasTwoPairs(valueCounts)) {
      const pairs = Object.keys(valueCounts).filter(value => valueCounts[value] === 2);
      pairs.sort((a, b) => b - a); 
      const topPairs = pairs.slice(0, 2); 
      const pairCards = valuesToCards(topPairs.map(val => Number(val)));
      return 8;
    }else if (hasPair(valueCounts)) {
      const pairs = Object.keys(valueCounts).filter(value => valueCounts[value] === 2);
      const highestPair = Math.max(...pairs.map(Number));
      return 9;
    }else{
      return 10;
    }
}

function winner(){
  if (handValue<hand2Value){
    balance=pot+balance;
    vencedorText.innerText = "Você Venceu!";
  }else if(handValue===hand2Value){
    balance=balance+(pot/2);
    vencedorText.innerText="Empate";
  }else{
    vencedorText.innerText = "Você Perdeu!";
  }
  pot=0;
}

// botão

botao.addEventListener("click", function(){
    if(hand.length===0){
      botao.style.display = "none";
      start();
      }else if(hand.length===2){
      verificaBet();
        if(apostaValida){
          bet();
          statusDiv.innerText ="";
          floop();
          betSizeText.style.display = "none";
          check.style.display = "none";
          botao.style.display = "none";
        }
    }else if(hand.length===5){
      verificaBet();
      if(apostaValida){
          bet();
          statusDiv.innerText ="";
          turn();
          betSizeText.style.display = "none";
          check.style.display = "none";
          botao.style.display = "none";
        }
    }else if(hand.length===6){
      verificaBet();
        if(apostaValida){
          bet();
          statusDiv.innerText ="";
          river();
          betSizeText.style.display = "none";
          check.style.display = "none";
          botao.style.display = "none";
        }
    }else if(hand.length===7){
      verificaBet();
        if(apostaValida){
          bet();
          statusDiv.innerText ="";
          showHand();
          betSizeText.style.display = "none";
          check.style.display = "none";
          handValue=value(hand);
          hand2Value=value(hand2);
          winner();
          atualizarBalanço();
          hand=[];
          hand2=[];
        }
    }
 })

check.addEventListener("click", function () {
  if(hand.length===2){
   statusDiv.innerText ="";
    floop();
    betSizeText.style.display = "none";
    check.style.display = "none";
    botao.style.display = "none";
    betSizeText.value = '';
  }else if(hand.length===5){
   statusDiv.innerText ="";
    turn();
    betSizeText.style.display = "none";
    check.style.display = "none";
    botao.style.display = "none";
    betSizeText.value = '';
  }else if(hand.length===6){
    statusDiv.innerText ="";
    river();
    betSizeText.style.display = "none";
    check.style.display = "none";
    botao.style.display = "none";
    betSizeText.value = '';
  }else if(hand.length===7){
    statusDiv.innerText ="";
    showHand();
    betSizeText.style.display = "none";
    check.style.display = "none";
    betSizeText.value = '';
    handValue=value(hand);
    hand2Value=value(hand2);
    winner();
    atualizarBalanço();
    hand=[];
    hand2=[];
  }
})
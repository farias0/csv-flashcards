const localStorageDeckKey = "deck"

class Card {
    constructor(question, answer) {
        this.question = question
        this.answer = answer
    }
}

class Deck {
    cards = []

    setCardsFromDict(data) {
        this.cards = []
        for (const entry in data) {
            this.cards.push(new Card(entry, data[entry]))
        }
    }

    drawRandomCard() {
        const index = Math.floor(Math.random() * this.cards.length)
        const card = this.cards[index]
        this.cards.splice(index, 1) 
        return card
    }

    getRemainingCards() {
        return this.cards.length
    }
}

const deck = new Deck()

function loadDeckFromFile() {
    const file = document.getElementById('file-input').files[0]
    const reader = new FileReader()
    reader.onload = e => {
        try {
            const lines = e.target.result.split("\n")
            const newCards = {}
            for (const line of lines) {
                const items = line.replace("\r", "").split(",")
                if (items.length != 2) throw new Error()
                newCards[items[0]] = items[1] 
            }
            deck.setCardsFromDict(newCards)
            $("#cards-total-counter").text(Object.keys(newCards).length)
            window.localStorage.setItem(localStorageDeckKey, JSON.stringify(newCards))
            showNewCard()
        } catch (error) {
            alert("Arquivo inválido. Certifique-se de que ele é um CSV.")
        }
    }
    reader.readAsText(file)
}

function loadDeckFromLocalStorage() {
    const newCards = JSON.parse(window.localStorage.getItem(localStorageDeckKey))
    if (newCards) {
        deck.setCardsFromDict(newCards)
        $("#cards-total-counter").text(Object.keys(newCards).length)
        showNewCard()
    }
}

function showNewCard() {
    const card = deck.drawRandomCard()
    if (!card) {
        alert("Concluído! Reiniciando")
        loadDeckFromLocalStorage()
    }
    $("#question-card-content").text(card.question)
    $("#answer-card-content").text(card.answer)
    $("#cards-remaining-counter").text(deck.getRemainingCards())
    $("#answer-card").hide()
}

function revealAnswer() {
    $("#answer-card").show()
}

$(document).ready(function() {
    loadDeckFromLocalStorage()
})

$(document).on('click', '#next-button', () => showNewCard())
$(document).on('click', '#reveal-button', () => revealAnswer())
$(document).on('click', '#load-file-button', () => loadDeckFromFile())
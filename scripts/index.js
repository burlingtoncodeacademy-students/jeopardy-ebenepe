let players = 'multiplayer'

let startButton = document.getElementById('start')

startButton.addEventListener('click', evt => {
    window.location = "/round-1.html#" + players
})
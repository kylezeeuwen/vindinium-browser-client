(function () {
  'use strict'

  const canvasSize = 1000
  const canvas = document.getElementById('map-display').getContext('2d')
  const sprites = {
    tree: document.getElementById('sprite-tree'),
    tavern: document.getElementById('sprite-tavern'),
    goldmine: document.getElementById('sprite-goldmine'),
    hero: document.getElementById('sprite-hero')
  }
  const colours = {
    0: '#d777bd',
    1: '#9f4606',
    2: '#48c5f8',
    3: '#453641',
    4: '#cbb68a',
    5: '#14396b',
    6: '#92b013',
    7: '#30dcd1',
    8: '#7592bd',
    9: '#179548',
    10: '#b21b54',
    11: '#970263',
    12: '#855d76',
    13: '#e691fb',
    14: '#f37263',
    15: '#97e930',
    16: '#d859cb',
    17: '#3205a5',
    18: '#2ceb00',
    19: '#61b98e',
    20: '#d7f65d'
  }

  function renderTile (code, x, y, size, heroes) {
    let sprite
    let heroid
    const xPos = x * size
    const yPos = y * size
    const textSize = Math.floor(size / 2) - 1
    if (code === '##') {
      sprite = sprites.tree
    }
    if (code === '[]') {
      sprite = sprites.tavern
    }
    if (code.indexOf('$') === 0) {
      if (code !== '$-') {
        heroid = code.substr(1, 1)
      }
      sprite = sprites.goldmine
    }
    if (code.indexOf('@') === 0) {
      sprite = sprites.hero
      heroid = code.substr(1, 1)
    }
    if (heroid) {
      canvas.fillStyle = colours[heroid]
      canvas.fillRect(xPos, yPos, size, size)
      canvas.font = `${textSize}px Impact`
      canvas.fillStyle = 'black'
      canvas.fillText(heroid, xPos + textSize + 16, yPos + textSize + 6)
      canvas.fillText(heroid, xPos + textSize + 15, yPos + textSize + 5)
      canvas.fillStyle = 'white'
      canvas.fillText(heroid, xPos + textSize + 14, yPos + textSize + 3)
    }
    if (heroid && sprite === sprites.hero) {
      const hero = heroes[parseInt(heroid, 10) - 1]
      const heroLifePC = Math.max(0, Math.floor(hero.life / 100 * size) - 6)
      canvas.fillStyle = 'white'
      canvas.fillRect(xPos + 1, yPos + 1, size - 4, 6)
      canvas.fillStyle = 'green'
      canvas.fillRect(xPos + 2, yPos + 2, heroLifePC, 4)
    }
    if (sprite) {
      canvas.drawImage(sprite, xPos, yPos, size, size)
    }
  }

  function renderGame (game) {
    canvas.clearRect(0, 0, canvasSize, canvasSize)
    const board = game.board
    const boardSize = board.size
    let tileArray = board.tiles.split('')
    const tileSize = Math.floor(canvasSize / board.size)
    let xPos = 0
    let yPos = 0
    while (yPos < boardSize) {
      xPos = 0
      for (xPos; xPos < boardSize; ++xPos) {
        renderTile(`${tileArray.shift()}${tileArray.shift()}`, xPos, yPos, tileSize, game.heroes)
      }
      ++yPos
    }
  }

  function gameOver () {
    canvas.fillStyle = 'rgba(0, 0, 0, 0.7)'
    canvas.fillRect(0, 0, canvasSize, canvasSize)
    canvas.fillStyle = 'white'
    canvas.font = `100px Impact`
    canvas.fillText('GAME OVER', 300, 300)
  }

  window.RenderGame = renderGame
  window.RenderOver = gameOver
}())

function _tilesToMap (board, myId) {
  'use strict'
  const tiles = board.tiles
  const size = board.size
  let i = 0
  let len = tiles.length
  let row = []
  let rowNum = 0
  let colNum = 0
  const map = []
  let pos
  for (i; i < len; i += 2) {
    if (i !== 0 && i % (size * 2) === 0) {
      map.push(row)
      row = []
      ++rowNum
      colNum = 0
    }
    const code = tiles.substr(i, 2)
    row.push(code)
    if (code === `@${myId}`) {
      pos = { x: rowNum, y: colNum }
    }
    ++colNum
  }
  map.push(row)
  return { map, pos }
}

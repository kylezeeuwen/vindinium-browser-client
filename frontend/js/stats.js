(function () {
  'use strict'
  const statsDiv = document.getElementById('stats')

  function makeEle ({ tag, attrs, parent, body }) {
    const node = document.createElement(tag)
    if (typeof body !== 'undefined') {
      node.innerHTML = body
    }
    if (parent) {
      parent.appendChild(node)
    }
    if (attrs) {
      let keys = Object.keys(attrs)
      let i = 0
      let len = keys.length
      let key
      for (i; i < len; ++i) {
        key = keys[i]
        node.setAttribute(key, attrs[key])
      }
    }
    return node
  }

  function manyEle (list) {
    let i = 0
    let len = list.length
    for (i; i < len; ++i) {
      makeEle(list[i])
    }
  }

  function renderStats (game) {
    const table = makeEle({ tag: 'table' })
    const thead = makeEle({ tag: 'thead', parent: table })
    manyEle([
      { tag: 'th', body: 'ID', parent: thead },
      { tag: 'th', body: 'Name', parent: thead },
      { tag: 'th', body: 'Life', parent: thead },
      { tag: 'th', body: 'Mines', parent: thead },
      { tag: 'th', body: 'Gold', parent: thead },
      { tag: 'th', body: 'OK?', parent: thead }
    ])
    let heroes = game.heroes
    let i = 0
    let len = heroes.length
    let hero
    for (i; i < len; ++i) {
      hero = heroes[i]
      let tr = makeEle({ tag: 'tr', parent: table })
      manyEle([
        { tag: 'td', body: hero.id, parent: tr },
        { tag: 'td', body: hero.name, parent: tr },
        { tag: 'td', body: hero.life, parent: tr },
        { tag: 'td', body: hero.mineCount, parent: tr },
        { tag: 'td', body: hero.gold, parent: tr },
        { tag: 'td', body: hero.crashed ? '☠' : '👍', parent: tr }
      ])
    }
    const gameLenPC = Math.round((game.turn / game.maxTurns) * 1000) / 10
    let tr = makeEle({ tag: 'tr', parent: table })
    let td = makeEle({ tag: 'td', attrs: { colspan: '6' }, body: `Completion: ${gameLenPC}%`, parent: tr })
    makeEle({ tag: 'span', attrs: { style: `width:${gameLenPC}%`, class: 'pc-bar' }, parent: td })
    statsDiv.innerHTML = ''
    statsDiv.appendChild(table)
  }

  window.RenderStats = renderStats
}())

(function () {
  'use strict'

  const proxyURI = '/proxy'
  let bot
  let robotID
  let playUrlCache

  function doPOST (uri, data) {
    return window.fetch(proxyURI, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'X-Real-URI': uri,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json()
        }
        console.error(res)
        throw new Error('Did not get 200 status response')
      })
      .catch(e => {
        console.error(e)
	// should throw here ?
        return null
      })
  }

  function sendMove (response, botname) {
    if (response.game && response.game.finished) {
      return console.log('GAME OVER')
    }
    if (response.game) {
      const botMove = window[botname].move(response)
      doPOST(response.playUrl, { key: robotID, dir: botMove })
        .then((response) => { handleResponse(response, botname) })
    }
  }

  function handleResponse (response, botname) {
    // You've crashed or something
    if (response === null) {
      return window.RenderCrash()
    }
    // Do this immediately
    sendMove(response, botname)
    // Then render after
    setTimeout(() => {
      if (response.game) {
        window.RenderGame(response.game)
        window.RenderStats(response.game)
        window.RenderViewUrl(response.viewUrl)
      }
      if (response.game && response.game.finished) {
        window.RenderOver()
      }
    }, 17)
  }

  function joinServer ({ botname, server, id, training }) {
    robotID = id
    return doPOST(
      `${server}${training ? '/api/training' : '/api/arena'}`, { key: id, map: 'm1', moves: 100 }
    )
      .then((response) => {
        if (response.playUrl) {
          playUrlCache = response.playUrl
        }
        handleResponse(response, botname)
      })
      .catch(ignore => {
        window.RenderCrash()
      })
  }

  function bindFrontEnd () {
    var join = document.getElementById('join')
    var server = document.getElementById('serverURL')
    var id = document.getElementById('robotID')
    var botname = document.getElementById('botname')
    var training = document.getElementById('isTraining')
    join.addEventListener('click', function () {
      joinServer({
        botname: botname.value,
        server: server.value || 'http://vindinium.org',
        id: id.value,
        training: typeof training.checked !== 'undefined' ? training.checked : true
      })
    }, false)
  }

  setTimeout(() => {
    bindFrontEnd()
  }, 0)
}())

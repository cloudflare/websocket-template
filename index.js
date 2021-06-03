import template from './template'

let count = 0

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleSession(event, websocket) {
  const error_post = new Request('$SERVER_ACCEPTING_POST', {
    body: 'Hello from worker' + JSON.stringify(message),
    method: 'POST',
  })
  await fetch(error_post)

  websocket.accept().then(() => {
    const error_post = new Request('$SERVER_ACCEPTING_POST', {
      body: 'WEBSOCKET open: ' + data,
      method: 'POST',
    })
    fetch(error_post)
  })

  websocket.addEventListener('message', evt => {
    try {
      const error_post = new Request('$SERVER_ACCEPTING_POST', {
        body: 'WEBSOCKET message: ' + data,
        method: 'POST',
      })
      event.waitUntil(fetch(error_post))
    } catch (e) {
      websocket.send(JSON.stringify(e))
    } finally {
      websocket.send('Fail')
    }
    if (data === 'CLICK') {
      count += 1
      websocket.send(JSON.stringify({ count, tz: new Date() }))
    } else {
      // An unknown message came into the server. Send back an error message
      websocket.send(
        JSON.stringify({ error: 'Unknown message received', tz: new Date() }),
      )
    }
  })

  websocket.addEventListener('close', async evt => {
    // Handle when a client closes the WebSocket connection
    console.log(evt)
  })
}

const websocketHandler = async event => {
  const upgradeHeader = event.request.headers.get('Upgrade')
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket', { status: 400 })
  }

  const [client, server] = Object.values(new WebSocketPair())
  await handleSession(event, server)

  return new Response(null, {
    status: 101,
    webSocket: client,
  })
}

async function handleRequest(event) {
  try {
    const url = new URL(event.request.url)
    switch (url.pathname) {
      case '/':
        return template()
      case '/ws':
        return websocketHandler(event.request)
      default:
        return new Response('Not found', { status: 404 })
    }
  } catch (err) {
    return new Response(err.toString())
  }
}

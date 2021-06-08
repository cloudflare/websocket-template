import template from './template'
let post_to_client = 'http://761ffb706261.ngrok.io'
let count = 0

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleSession(websocket) {
  websocket.accept()
  websocket.addEventListener('message', async ({ data }) => {
    const error_post = new Request(post_to_client, {
      body: 'Received message on worker service side' + data,
      method: 'POST',
    })
    await globalThis.fetch(error_post)
    if (data === 'CLICK') {
      count += 1
      websocket.send(JSON.stringify({ count, tz: new Date() }))
    } else {

      // `An unknown message came into the server. Send back an echo message
      websocket.send(
        "Message recieved on websocket server, echo: " + data,
      )
    }
  })

    websocket.addEventListener('close', async ({evt}) => {
    // Handle when a client closes the WebSocket connection
    // with or without closing frame 
    const error_post = new Request(post_to_client, {
	    body: 'Received close message on worker service side: '+ evt,
      method: 'POST',
    })
    await globalThis.fetch(error_post)
  })
}

const websocketHandler = async request => {
  const upgradeHeader = request.headers.get('Upgrade')
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket', { status: 400 })
  }

  const [client, server] = Object.values(new WebSocketPair())
  await handleSession(server)

  return new Response(null, {
    status: 101,
    webSocket: client,
  })
}

async function handleRequest(request) {
  try {
    const url = new URL(request.url)
    switch (url.pathname) {
      case '/':
        return template()
      case '/ws':
        return websocketHandler(request)
      default:
        return new Response('Not found', { status: 404 })
    }
  } catch (err) {
    return new Response(err.toString())
  }
}

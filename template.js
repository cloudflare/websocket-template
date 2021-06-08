const template = `
<style>
  body {
    margin: 1rem;
    font-family: monospace;
  }
</style>

<p>Number of clicks: <span id="num"></span></p>
<button id="click">Click me</button>

<h2> Send a message to the webserver </h2>
<label for="message">Tell the worker:</label>
  <input type="text" id="message" name="message" onchange="sendMessage(this.value)"><br><br>

<p>When you're done clicking, you can close the connection below. Further clicks won't work until you refresh the page.</p>
<button id="close">Close connection</button>

<p id="error" style="color: red;"></p>

<h4>Incoming WebSocket data</h4>
<ul id="events"></ul>

<script>
  let ws

  async function websocket(url) {
    ws = new WebSocket(url)

    if (!ws) {
      throw new Error("server didn't accept ws")
    }

    ws.addEventListener("open", () => {
      console.log('Opened websocket')
      updateCount(0)
    })
    ws.onmessage = function(event) {
      console.log(event)
      console.log(typeof event)
      addNewEvent(event.data)
    }

    ws.addEventListener("close", () => {
      console.log('Received close websocket event in browser script')

      const list = document.querySelector("#events")
      list.innerText = ""
      updateCount(0)
      setErrorMessage()
    })
  }

  const url = new URL(window.location)
  url.protocol = "wss"
  url.pathname = "/ws"
  websocket(url)

  document.querySelector("#click").addEventListener("click", () => {
    ws.send("CLICK")
  })

  const updateCount = (count) => {
    document.querySelector("#num").innerText = count
  }

  const addNewEvent = (data) => {
    const list = document.querySelector("#events")
    const item = document.createElement("li")
    item.innerText = data
    list.prepend(item)
  }

  const sendMessage = (data) => {
    ws.send(data)
  }

  document.querySelector("#close").addEventListener("click", () => {
    console.log("Emitting close event from browser client");
    ws.close();
  })
  
  const setErrorMessage = message => {
    document.querySelector("#error").innerHTML = message ? message : ""
  }
</script>
`

export default () => {
  return new Response(template, {
    headers: {
      'Content-type': 'text/html; charset=utf-8'
    }
  })
}

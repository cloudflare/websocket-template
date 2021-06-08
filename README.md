# websocket-template
	
websocket server worker with browser and remote CLI client included.

purpose is to repro cases

	a. ws server on a user worker gets message from browser client, gets close event when sent with ws.close()
event recieved successfully

	b. remote rust client used. server success sending and recieving messages from client, but on calling close explicitly in client server does not recieve it

	c. browser is refreshed. should worker server recieve close event?

	d. client is interrupted. "" 

## Getting started

The worker that acts as the websocket server lives at `ws_server_worker.js`. The browser client is at `template.js`, lives on root address of worker.

Remote client that can connect to worker on its `/ws` path lives in directory `client/`. The server is just an echo server that appends stuff and sends recieved message back to client(s). It also logs info 'manually', by posting events to a local http client. 
The endpoint is hardcoded right now in the script. You can set up your own by running ngrok or whatever forwarding service, and making sure to have an accept post (`./local_client.py` for example). 

I haven't been able to get `close` events emitted from either client in the worker. Since `message` works in all these cases, I do believe I am running up against a runtime issue.  

# websocket-template
	
websocket server worker with browser and remote CLI client included.

purpose is to repro case

	a. ws server on a user worker gets message from browser client, gets close event when sent with ws.close()
event recieved successfully

	b. remote rust client used. server success sending and recieving messages from client, but on calling close explicitly in client server does not recieve it

	c. browser is refreshed. should worker server recieve close event?

	d. client is interrupted. "" 

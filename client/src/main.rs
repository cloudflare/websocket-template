use futures::stream::StreamExt;
use structopt::StructOpt;
use tokio;
use tokio_util;
use url;

#[derive(Debug, StructOpt)]
struct Opt {
    // Websocket server url
    server: String,
}

#[tokio::main]
async fn main() {
    let opt = Opt::from_args();

    let listen_tail_endpoint = format!("wss://{}/ws", opt.server);
    let listen_tail_url = listen_tail_endpoint.parse::<url::Url>().unwrap();
    let (mut socket, _) = tokio_tungstenite::connect_async(listen_tail_url)
        .await
        .expect("Can't connect");

    println!("Connected to the server at {:?}", opt.server);

    let mut reader = tokio_util::codec::FramedRead::new(
        tokio::io::stdin(),
        tokio_util::codec::LinesCodec::new(),
    );

    loop {
        tokio::select! {
            maybe_incoming = socket.next()  => {
                if let Some(Ok(msg)) = maybe_incoming {
                    println!("Got incoming message: {}", msg);
                }
            },
            maybe_outgoing = reader.next() => {
                if let Some(Ok(msg)) = maybe_outgoing {
                    println!("Echo outgoing message: {}", msg);
                }
            },
            _ = tokio::signal::ctrl_c() => {
                socket.close(None).await.expect("Failed to close socket after ctrlc");
                break;
            },
        }
    }
}

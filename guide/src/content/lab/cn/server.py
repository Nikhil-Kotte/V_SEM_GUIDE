import socket


def run_server():
    # create a TCP socket (IPv4)
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_ip = "127.0.0.1"
    port = 8000

    # bind the socket to the address and port, then listen
    server.bind((server_ip, port))
    server.listen(0)
    print(f"Listening on {server_ip}:{port}")

    # accept a client connection
    client_socket, client_address = server.accept()
    print(f"Accepted connection from {client_address[0]}:{client_address[1]}")

    # receive messages until the client sends "close"
    while True:
        request = client_socket.recv(1024)
        request = request.decode("utf-8")  # bytes -> string

        if request.lower() == "close":
            # acknowledge that the connection will be closed, then stop
            client_socket.send("closed".encode("utf-8"))
            break

        print(f"Received: {request}")
        client_socket.send("accepted".encode("utf-8"))  # string -> bytes

    client_socket.close()
    print("Connection to client closed")
    server.close()


run_server()

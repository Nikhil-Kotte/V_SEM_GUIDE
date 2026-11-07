import socket


def run_client():
    # create a TCP socket (IPv4)
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_ip = "127.0.0.1"  # the server's IP address
    server_port = 8000       # the server's port number
    client.connect((server_ip, server_port))

    while True:
        # read a message from the user and send it to the server
        msg = input("Enter message: ")
        client.send(msg.encode("utf-8")[:1024])

        # receive the server's reply
        response = client.recv(1024)
        response = response.decode("utf-8")

        # the server replies "closed" when we send "close"
        if response.lower() == "closed":
            break
        print(f"Received: {response}")

    client.close()
    print("Connection to server closed")


run_client()

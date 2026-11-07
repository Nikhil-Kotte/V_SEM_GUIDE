// scratch/gbn.cc  —  run with:  ./ns3 run gbn
#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/netanim-module.h"
#include <iostream>

using namespace ns3;

// Go-Back-N parameters
static const uint32_t WINDOW_SIZE = 4;
static const uint32_t TOTAL_PACKETS = 15;
static const uint16_t PORT = 8080;
static const Time TIMEOUT = MilliSeconds(50);

// sender state
Ptr<Socket> senderSocket;
Address receiverAddress;
uint32_t base = 0;        // oldest unacknowledged frame
uint32_t nextSeq = 0;     // next frame to send
EventId timerEvent;

// receiver state
Ptr<Socket> receiverSocket;
uint32_t expectedSeq = 0;

void Timeout();

void SendData(uint32_t seq)
{
    uint8_t buf[5];
    buf[0] = 'D';                 // frame type: DATA
    memcpy(&buf[1], &seq, 4);     // sequence number
    Ptr<Packet> p = Create<Packet>(buf, 5);
    senderSocket->SendTo(p, 0, receiverAddress);
    std::cout << "Sender: Sent DATA Seq=" << seq << " at " << Simulator::Now().GetSeconds() << "s" << std::endl;
}

void StartTimer()
{
    Simulator::Cancel(timerEvent);
    timerEvent = Simulator::Schedule(TIMEOUT, &Timeout);
}

// send every frame that fits inside the window
void FillWindow()
{
    while (nextSeq < base + WINDOW_SIZE && nextSeq < TOTAL_PACKETS)
    {
        SendData(nextSeq);
        if (base == nextSeq)
            StartTimer();
        nextSeq++;
    }
}

// timer expired: go back to base and resend all outstanding frames
void Timeout()
{
    std::cout << "Sender: Timeout, going back to Seq=" << base << " at " << Simulator::Now().GetSeconds() << "s" << std::endl;
    for (uint32_t s = base; s < nextSeq; s++)
        SendData(s);
    StartTimer();
}

// sender receives cumulative ACKs
void SenderReceive(Ptr<Socket> socket)
{
    Ptr<Packet> p;
    Address from;
    while ((p = socket->RecvFrom(from)))
    {
        uint32_t ack;
        p->CopyData((uint8_t *)&ack, 4);
        std::cout << "Sender: Got ACK for Seq=" << ack << " at " << Simulator::Now().GetSeconds() << "s" << std::endl;
        if (ack >= base)
        {
            base = ack + 1;                       // slide the window
            if (base == nextSeq)
                Simulator::Cancel(timerEvent);
            else
                StartTimer();
            FillWindow();
        }
    }
}

// receiver accepts only the expected frame and discards out-of-order ones
void ReceiverReceive(Ptr<Socket> socket)
{
    Ptr<Packet> p;
    Address from;
    while ((p = socket->RecvFrom(from)))
    {
        uint8_t buf[5];
        p->CopyData(buf, 5);
        uint32_t seq;
        memcpy(&seq, &buf[1], 4);
        uint32_t ack;
        if (seq == expectedSeq)
        {
            std::cout << "Receiver: Got DATA Seq=" << seq << " at " << Simulator::Now().GetSeconds() << "s" << std::endl;
            ack = seq;
            expectedSeq++;
        }
        else
        {
            std::cout << "Receiver: Discarded out-of-order Seq=" << seq << std::endl;
            if (expectedSeq == 0)
                continue;                         // nothing received in order yet
            ack = expectedSeq - 1;                // re-acknowledge the last in-order frame
        }
        Ptr<Packet> ackPkt = Create<Packet>((uint8_t *)&ack, 4);
        socket->SendTo(ackPkt, 0, from);
        std::cout << "Receiver: Sent ACK for Seq=" << ack << std::endl;
    }
}

int main(int argc, char *argv[])
{
    CommandLine cmd;
    cmd.Parse(argc, argv);

    NodeContainer nodes;                          // node 0 = Sender, node 1 = Receiver
    nodes.Create(2);

    PointToPointHelper p2p;
    p2p.SetDeviceAttribute("DataRate", StringValue("5Mbps"));
    p2p.SetChannelAttribute("Delay", StringValue("2ms"));
    NetDeviceContainer devices = p2p.Install(nodes);

    InternetStackHelper stack;
    stack.Install(nodes);
    Ipv4AddressHelper address;
    address.SetBase("10.1.1.0", "255.255.255.0");
    Ipv4InterfaceContainer interfaces = address.Assign(devices);

    TypeId tid = UdpSocketFactory::GetTypeId();
    receiverSocket = Socket::CreateSocket(nodes.Get(1), tid);
    receiverSocket->Bind(InetSocketAddress(Ipv4Address::GetAny(), PORT));
    receiverSocket->SetRecvCallback(MakeCallback(&ReceiverReceive));

    senderSocket = Socket::CreateSocket(nodes.Get(0), tid);
    senderSocket->Bind(InetSocketAddress(Ipv4Address::GetAny(), PORT));
    senderSocket->SetRecvCallback(MakeCallback(&SenderReceive));
    receiverAddress = InetSocketAddress(interfaces.GetAddress(1), PORT);

    Simulator::Schedule(Seconds(1.0), &FillWindow);

    AnimationInterface anim("gbn.xml");
    anim.SetConstantPosition(nodes.Get(0), 10, 30);
    anim.SetConstantPosition(nodes.Get(1), 90, 30);
    anim.UpdateNodeDescription(nodes.Get(0), "Sender");
    anim.UpdateNodeDescription(nodes.Get(1), "Receiver");
    anim.UpdateNodeColor(nodes.Get(0), 255, 0, 0);
    anim.UpdateNodeColor(nodes.Get(1), 0, 255, 0);

    Simulator::Stop(Seconds(5.0));
    Simulator::Run();
    std::cout << "Simulation finished. Sent " << base << "/" << TOTAL_PACKETS << " packets" << std::endl;
    Simulator::Destroy();
    return 0;
}

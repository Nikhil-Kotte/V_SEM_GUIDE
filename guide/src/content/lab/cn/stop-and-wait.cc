// scratch/stop-and-wait.cc  —  run with:  ./ns3 run stop-and-wait
#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/applications-module.h"
#include "ns3/netanim-module.h"
#include "ns3/mobility-module.h"

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("StopAndWaitSinglePort");

uint32_t packetCount = 0;
uint32_t maxPackets = 5;
uint32_t seqNum = 0;
bool ackReceived = true;
Ptr<Socket> senderSocket;
Ptr<Socket> receiverSocket;

void SendPacket()
{
    if (packetCount >= maxPackets)
    {
        NS_LOG_UNCOND("Simulation finished after sending " << maxPackets << " packets.");
        Simulator::Stop(Seconds(0.1));
        return;
    }
    if (ackReceived)
    {
        uint8_t type = 0;                    // DATA packet (flag = 0)
        Ptr<Packet> packet = Create<Packet>((uint8_t *)&type, sizeof(type));
        senderSocket->Send(packet);
        NS_LOG_UNCOND("Sender: Sent DATA Seq=" << seqNum << " at " << Simulator::Now().GetSeconds() << "s");
        ackReceived = false;
        Simulator::Schedule(Seconds(2.0), &SendPacket);   // check for the ACK in 2 s
    }
    else
    {
        // no ACK yet: timeout, send the same frame again
        NS_LOG_UNCOND("Sender: Timeout! Retransmitting Seq=" << seqNum << " at " << Simulator::Now().GetSeconds() << "s");
        uint8_t type = 0;
        Ptr<Packet> packet = Create<Packet>((uint8_t *)&type, sizeof(type));
        senderSocket->Send(packet);
        Simulator::Schedule(Seconds(2.0), &SendPacket);
    }
}

// used by both the sender and the receiver socket
void ReceivePacket(Ptr<Socket> socket)
{
    Ptr<Packet> packet;
    while ((packet = socket->Recv()))
    {
        uint8_t type;
        packet->CopyData(&type, sizeof(type));
        if (type == 0)                       // DATA arrived at the receiver
        {
            NS_LOG_UNCOND("Receiver: Got DATA Seq=" << seqNum << " at " << Simulator::Now().GetSeconds() << "s");
            uint8_t ackType = 1;             // ACK packet (flag = 1)
            Ptr<Packet> ack = Create<Packet>((uint8_t *)&ackType, sizeof(ackType));
            receiverSocket->Send(ack);
            NS_LOG_UNCOND("Receiver: Sent ACK for Seq=" << seqNum << " at " << Simulator::Now().GetSeconds() << "s");
            seqNum++;
            packetCount++;
        }
        else if (type == 1)                  // ACK arrived at the sender
        {
            NS_LOG_UNCOND("Sender: Got ACK at " << Simulator::Now().GetSeconds() << "s");
            ackReceived = true;
        }
    }
}

int main(int argc, char *argv[])
{
    NodeContainer nodes;                     // node 0 = Sender, node 1 = Receiver
    nodes.Create(2);

    MobilityHelper mobility;
    mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
    mobility.Install(nodes);

    PointToPointHelper p2p;
    p2p.SetDeviceAttribute("DataRate", StringValue("5Mbps"));
    p2p.SetChannelAttribute("Delay", StringValue("2ms"));
    NetDeviceContainer devices = p2p.Install(nodes);

    InternetStackHelper stack;
    stack.Install(nodes);
    Ipv4AddressHelper address;
    address.SetBase("10.1.1.0", "255.255.255.0");
    Ipv4InterfaceContainer interfaces = address.Assign(devices);

    senderSocket = Socket::CreateSocket(nodes.Get(0), UdpSocketFactory::GetTypeId());
    senderSocket->Bind(InetSocketAddress(Ipv4Address::GetAny(), 8080));
    senderSocket->Connect(InetSocketAddress(interfaces.GetAddress(1), 8080));
    senderSocket->SetRecvCallback(MakeCallback(&ReceivePacket));

    receiverSocket = Socket::CreateSocket(nodes.Get(1), UdpSocketFactory::GetTypeId());
    receiverSocket->Bind(InetSocketAddress(Ipv4Address::GetAny(), 8080));
    receiverSocket->Connect(InetSocketAddress(interfaces.GetAddress(0), 8080));
    receiverSocket->SetRecvCallback(MakeCallback(&ReceivePacket));

    Simulator::Schedule(Seconds(1.0), &SendPacket);

    AnimationInterface anim("stop-and-wait.xml");
    anim.SetConstantPosition(nodes.Get(0), 10, 30);   // Sender
    anim.SetConstantPosition(nodes.Get(1), 50, 30);   // Receiver

    Simulator::Stop(Seconds(20.0));
    Simulator::Run();
    Simulator::Destroy();
    return 0;
}

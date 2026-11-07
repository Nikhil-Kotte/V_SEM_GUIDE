// scratch/star.cc  —  run with:  ./ns3 run star
#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/csma-module.h"
#include "ns3/bridge-module.h"
#include "ns3/applications-module.h"
#include "ns3/mobility-module.h"
#include "ns3/netanim-module.h"

using namespace ns3;

int main()
{
    LogComponentEnable("UdpEchoClientApplication", LOG_LEVEL_INFO);
    LogComponentEnable("UdpEchoServerApplication", LOG_LEVEL_INFO);

    // 1 switch in the middle, 5 PCs around it
    NodeContainer switchNode;
    switchNode.Create(1);
    NodeContainer pcNodes;
    pcNodes.Create(5);

    // fixed positions, only used by NetAnim
    MobilityHelper mobility;
    mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
    mobility.Install(switchNode);
    mobility.Install(pcNodes);
    switchNode.Get(0)->GetObject<ConstantPositionMobilityModel>()->SetPosition(Vector(50.0, 50.0, 0.0));
    pcNodes.Get(0)->GetObject<ConstantPositionMobilityModel>()->SetPosition(Vector(50.0, 20.0, 0.0));
    pcNodes.Get(1)->GetObject<ConstantPositionMobilityModel>()->SetPosition(Vector(20.0, 40.0, 0.0));
    pcNodes.Get(2)->GetObject<ConstantPositionMobilityModel>()->SetPosition(Vector(80.0, 40.0, 0.0));
    pcNodes.Get(3)->GetObject<ConstantPositionMobilityModel>()->SetPosition(Vector(30.0, 80.0, 0.0));
    pcNodes.Get(4)->GetObject<ConstantPositionMobilityModel>()->SetPosition(Vector(70.0, 80.0, 0.0));

    InternetStackHelper internet;
    internet.Install(pcNodes);          // the switch is layer 2: no IP stack

    // Ethernet (CSMA) links, 100 Mbps
    CsmaHelper csma;
    csma.SetChannelAttribute("DataRate", StringValue("100Mbps"));
    csma.SetChannelAttribute("Delay", TimeValue(NanoSeconds(6560)));

    NetDeviceContainer switchDevices;
    NetDeviceContainer pcDevices;
    for (uint32_t i = 0; i < 5; i++)
    {
        NodeContainer link;
        link.Add(switchNode.Get(0));
        link.Add(pcNodes.Get(i));
        NetDeviceContainer devices = csma.Install(link);
        switchDevices.Add(devices.Get(0));
        pcDevices.Add(devices.Get(1));
    }

    // a bridge joins the 5 switch ports into one switch
    BridgeHelper bridge;
    bridge.Install(switchNode.Get(0), switchDevices);

    Ipv4AddressHelper address;
    address.SetBase("10.0.0.0", "255.255.255.0");
    Ipv4InterfaceContainer interfaces = address.Assign(pcDevices);

    std::cout << "\n===== Star Topology =====\n";
    for (uint32_t i = 0; i < 5; i++)
        std::cout << "PC-" << i + 1 << " : " << interfaces.GetAddress(i) << std::endl;
    std::cout << "=========================\n";

    // PC-5 = UDP echo server, PC-1 = UDP echo client
    uint16_t port = 9;
    UdpEchoServerHelper server(port);
    ApplicationContainer serverApp = server.Install(pcNodes.Get(4));
    serverApp.Start(Seconds(1.0));
    serverApp.Stop(Seconds(10.0));

    UdpEchoClientHelper client(interfaces.GetAddress(4), port);
    client.SetAttribute("MaxPackets", UintegerValue(5));
    client.SetAttribute("Interval", TimeValue(Seconds(1.0)));
    client.SetAttribute("PacketSize", UintegerValue(1024));
    ApplicationContainer clientApp = client.Install(pcNodes.Get(0));
    clientApp.Start(Seconds(2.0));
    clientApp.Stop(Seconds(8.0));

    AnimationInterface anim("star-topology.xml");
    anim.UpdateNodeDescription(switchNode.Get(0), "Ethernet Switch");
    for (uint32_t i = 0; i < 5; i++)
        anim.UpdateNodeDescription(pcNodes.Get(i), "PC-" + std::to_string(i + 1));

    std::cout << "\nStarting simulation...\n";
    Simulator::Stop(Seconds(10.0));
    Simulator::Run();
    Simulator::Destroy();
    std::cout << "Simulation completed.\n";
    return 0;
}

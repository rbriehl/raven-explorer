export const RAVEN_CONCEPTS = [
  {
    id: 'controller-manager',
    title: 'Yurt Manager / Raven Controller Manager',
    type: 'Control Plane',
    icon: 'Server',
    description:
      'A standard Kubernetes controller deployed as a Deployment in the cloud. It monitors edge node status and elects a gateway node for each edge node pool based on node conditions. When the current gateway fails, another node is automatically promoted.',
    details: [
      'Watches Node and Gateway CRD resources',
      'Elects the healthiest node in each pool as gateway',
      'Publishes Gateway status with active endpoint info',
      'Handles failover when gateway nodes go offline',
    ],
    yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: yurt-manager
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: yurt-manager
  template:
    metadata:
      labels:
        app: yurt-manager
    spec:
      containers:
      - name: manager
        image: openyurt/yurt-manager:latest`,
  },
  {
    id: 'raven-agent',
    title: 'Raven Agent',
    type: 'Data Plane',
    icon: 'Activity',
    description:
      'A node daemon deployed as a DaemonSet on every node. It dynamically configures routing tables or VPN tunnels according to whether the node is a gateway or normal node. Operates in host network mode.',
    details: [
      'Runs on every node in the cluster (hostNetwork)',
      'Gateway nodes: establish IPsec/WireGuard VPN tunnels',
      'Normal nodes: install routes pointing to local gateway',
      'Reacts to Gateway CR changes in real time',
    ],
    yaml: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: raven-agent-ds
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: raven-agent
  template:
    metadata:
      labels:
        app: raven-agent
    spec:
      hostNetwork: true
      containers:
      - name: agent
        image: openyurt/raven-agent:v0.4.3`,
  },
  {
    id: 'gateway-crd',
    title: 'Gateway CRD',
    type: 'API / CRD',
    icon: 'FileCode',
    description:
      'The central abstraction connecting the controller and agents. Each Gateway resource represents a physical region (node pool). It records endpoints, NAT status, expose type, and the currently elected active node.',
    details: [
      'One Gateway per edge node pool / region',
      'Endpoints list nodes belonging to that pool',
      'underNAT flag tells agent how to punch through',
      'exposeType controls cloud gateway exposure (EIP / LoadBalancer)',
    ],
    yaml: `apiVersion: raven.openyurt.io/v1alpha1
kind: Gateway
metadata:
  name: gw-edge-hz
spec:
  exposeType: PublicIP
  endpoints:
    - nodeName: edge-hz-01
      underNAT: true
    - nodeName: edge-hz-02
      underNAT: true
status:
  activeEndpoints:
    - nodeName: edge-hz-01`,
  },
  {
    id: 'vpn-tunnel',
    title: 'VPN Tunnel (L3)',
    type: 'Networking',
    icon: 'Shield',
    description:
      'Encrypted tunnels between gateway nodes using IPsec (libreswan) or WireGuard. Cross-region container traffic is forwarded through these tunnels, making pods in different physical regions appear as if they are in one flat cluster.',
    details: [
      'Default backend: IPsec via libreswan',
      'Alternative: WireGuard (Linux 5.6+ in-tree)',
      'Default WireGuard port: UDP 4500',
      'Only cross-region traffic enters the tunnel',
    ],
  },
  {
    id: 'vxlan-overlay',
    title: 'VXLAN Overlay',
    type: 'Networking',
    icon: 'Network',
    description:
      'Within each network domain (node pool), Raven leverages the existing CNI overlay — typically Flannel VXLAN. Cross-domain container traffic is forwarded from the local VXLAN to the VPN tunnel via the gateway node.',
    details: [
      'No intrusion into existing K8s CNI',
      'Intra-pool traffic stays local (no hijacking)',
      'Only cross-pool traffic is routed to gateway',
      'Works with Calico, Flannel, and others',
    ],
  },
  {
    id: 'l7-proxy',
    title: 'Layer 7 Proxy',
    type: 'Networking',
    icon: 'Globe',
    description:
      'Raven L7 proxy enables cloud-side components (kubectl, metrics-server, Prometheus) to reach edge workloads even when edge nodes are behind NAT or have conflicting IP addresses. It uses a reverse channel between gateway nodes.',
    details: [
      'Solves IP conflict scenarios',
      'Enables kubectl logs / exec / attach / top',
      'Cloud gateway forwards requests via NodeName+Port',
      'Encrypted reverse channel to edge gateway',
    ],
  },
]

export const VERSION_HISTORY = [
  { version: 'v0.4.3', date: '2024.12', note: 'Stability improvements and bug fixes for network reliability' },
  { version: 'v0.4.2', date: '2024.04', note: 'Compatibility with iptables-nft' },
  { version: 'v0.4.1', date: '2024.03', note: 'L3 NAT traversal support' },
  { version: 'v0.4.0', date: '2023.11', note: 'Raven L7 proxy support' },
  { version: 'v0.3.0', date: '2023.01', note: 'Node IP forwarding support' },
  { version: 'v0.2.0', date: '2022.12', note: 'WireGuard backend + Calico support' },
  { version: 'v0.1.0', date: '2022.05', note: 'Initial release with IPsec via libreswan' },
]

export const TRAFFIC_FLOWS = [
  {
    id: 'edge-cloud',
    label: 'Edge to Cloud',
    description: 'A pod in an edge node pool communicates with a service in the cloud region.',
    steps: [
      'Pod sends packet to target Service IP',
      'CNI routes packet to local VXLAN overlay',
      'Normal node forwards cross-region traffic to its gateway node',
      'Gateway node encapsulates packet into VPN tunnel (IPsec/WireGuard)',
      'Cloud gateway decapsulates and injects into cloud VXLAN',
      'Cloud pod receives the packet',
    ],
  },
  {
    id: 'edge-edge',
    label: 'Edge to Edge',
    description: 'Pods in two different edge regions communicate directly via gateway-to-gateway tunnels.',
    steps: [
      'Pod A in Region 1 sends packet to Pod B IP',
      'Region 1 normal node routes to its gateway',
      'Region 1 gateway encrypts packet into VPN tunnel destined for Region 2',
      'Region 2 gateway decrypts and injects into local VXLAN',
      'Pod B receives the packet',
    ],
  },
  {
    id: 'cloud-edge-l7',
    label: 'Cloud to Edge (L7 Proxy)',
    description: 'kubectl logs/exec from cloud reaches an edge node behind NAT.',
    steps: [
      'kubectl exec request sent to cloud gateway',
      'Cloud gateway looks up target node in Gateway CR status',
      'Request forwarded through encrypted L7 reverse channel',
      'Edge gateway routes to the actual node by name+port',
      'Edge kubelet responds back through the same channel',
    ],
  },
]

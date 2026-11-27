/* DPI Engine walkthrough data. Same values as the film (DPI/), so the page and the video agree. */

export const D = {
  bg: "#070B16",
  panel: "#0C1426",
  line: "#22335A",
  mute: "#8E9DBB",
  blue: "#2678FF",
  cyan: "#00D4FF",
  purple: "#795CFF",
  green: "#24D18B",
  red: "#FF4545",
  amber: "#FFB547",
} as const;

export const CHAPTERS = [
  { id: "film", label: "The film" },
  { id: "packet", label: "Anatomy of a packet" },
  { id: "why", label: "Firewall vs DPI" },
  { id: "pipeline", label: "The pipeline" },
  { id: "parse", label: "Read & parse" },
  { id: "flows", label: "Five-Tuple flows" },
  { id: "sni", label: "SNI extraction" },
  { id: "classify", label: "Classification" },
  { id: "block", label: "Blocking" },
  { id: "threads", label: "Multithreading" },
  { id: "report", label: "Output & report" },
] as const;
export type ChapterId = (typeof CHAPTERS)[number]["id"];

/* ── Packet layers: nested like dolls, each with the fields of the followed packet ── */
export type LayerId = "eth" | "ip" | "tcp" | "payload";
export const LAYERS: { id: LayerId; name: string; size: string; color: string; q: string; fields: [string, string][]; bytes: string[] }[] = [
  { id: "eth", name: "Ethernet", size: "14 bytes", color: D.blue, q: "Which device on this local link?", fields: [["Destination MAC", "00:1a:2b:3c:4d:5e"], ["Source MAC", "3c:22:fb:7a:1e:04"], ["EtherType", "0x0800 (IPv4)"]], bytes: "00 1a 2b 3c 4d 5e 3c 22 fb 7a 1e 04 08 00".split(" ") },
  { id: "ip", name: "IPv4 header", size: "20+ bytes", color: D.cyan, q: "Where is it from, and where is it going?", fields: [["Source IP", "192.168.1.100"], ["Destination IP", "172.217.14.206"], ["Protocol", "6 (TCP)"], ["TTL", "64"]], bytes: "45 00 02 39 1c 46 40 00 40 06 b1 e6 c0 a8 01 64 ac d9 0e ce".split(" ") },
  { id: "tcp", name: "TCP header", size: "20+ bytes", color: D.purple, q: "Which conversation, and in what order?", fields: [["Source port", "54321"], ["Destination port", "443"], ["Flags", "PSH, ACK"], ["Sequence", "0x5a1c3e07"]], bytes: "d4 31 01 bb 5a 1c 3e 07 9f 02 11 c4 50 18 01 f6 e3 21 00 00".split(" ") },
  { id: "payload", name: "Payload", size: "variable", color: D.green, q: "The actual application data.", fields: [["First bytes", "16 03 01 02 00 …"], ["For HTTPS", "TLS records"]], bytes: "16 03 01 02 00 01 00 01 fc 03 03".split(" ") },
];

/* Parser fields → which header bytes they come from: [layer, from, to) */
export const PARSED: { k: string; v: string; layer: LayerId; from: number; to: number }[] = [
  { k: "Destination MAC", v: "00:1a:2b:3c:4d:5e", layer: "eth", from: 0, to: 6 },
  { k: "Source MAC", v: "3c:22:fb:7a:1e:04", layer: "eth", from: 6, to: 12 },
  { k: "EtherType", v: "0x0800 → IPv4", layer: "eth", from: 12, to: 14 },
  { k: "Protocol", v: "6 → TCP", layer: "ip", from: 9, to: 10 },
  { k: "Source IP", v: "192.168.1.100", layer: "ip", from: 12, to: 16 },
  { k: "Destination IP", v: "172.217.14.206", layer: "ip", from: 16, to: 20 },
  { k: "Source port", v: "54321", layer: "tcp", from: 0, to: 2 },
  { k: "Destination port", v: "443", layer: "tcp", from: 2, to: 4 },
];

/* ── The pipeline (single-threaded view) ── */
export const STAGES: { t: string; sub: string; what: string; tone: string }[] = [
  { t: "Wireshark capture", sub: "recorded traffic", what: "Traffic is recorded with a tool like Wireshark. The engine works on that recording, not on a live link.", tone: D.blue },
  { t: "Input PCAP", sub: "capture.pcap", what: "A PCAP file: one global header, then a record header (timestamp, lengths) and raw bytes for every packet.", tone: D.blue },
  { t: "DPI Engine", sub: "per packet", what: "Every packet is taken through the same steps, one at a time.", tone: D.purple },
  { t: "Packet parsing", sub: "Eth · IP · TCP/UDP", what: "Headers are split apart and their fields read: MAC addresses, IP addresses, protocol, ports.", tone: D.cyan },
  { t: "App classification", sub: "SNI · HTTP Host", what: "The hostname from a TLS Client Hello (or HTTP Host header) is matched against known signatures.", tone: D.purple },
  { t: "Blocking rules", sub: "IP · app · domain", what: "The packet and its flow are checked against the configured IP, application and domain rules.", tone: D.red },
  { t: "Forward / Drop", sub: "per flow", what: "Allowed packets continue. Packets of a blocked flow are dropped.", tone: D.amber },
  { t: "Filtered output", sub: "output.pcap", what: "Only forwarded packets are written into a new PCAP file.", tone: D.green },
  { t: "Processing report", sub: "stats · apps · domains", what: "Packet and byte counts, application breakdown, detected domains and per-thread statistics.", tone: D.green },
];

/* ── A small capture for the flow tracker (illustrative) ── */
export type Pkt = { n: number; src: string; sport: number; dst: string; dport: number; proto: "TCP" | "UDP"; info: string };
export const CAPTURE: Pkt[] = [
  { n: 1, src: "192.168.1.100", sport: 54321, dst: "172.217.14.206", dport: 443, proto: "TCP", info: "SYN" },
  { n: 2, src: "192.168.1.100", sport: 53012, dst: "8.8.8.8", dport: 53, proto: "UDP", info: "DNS query" },
  { n: 3, src: "192.168.1.100", sport: 54321, dst: "172.217.14.206", dport: 443, proto: "TCP", info: "ACK" },
  { n: 4, src: "192.168.1.100", sport: 54321, dst: "172.217.14.206", dport: 443, proto: "TCP", info: "Client Hello" },
  { n: 5, src: "192.168.1.100", sport: 49822, dst: "140.82.112.4", dport: 443, proto: "TCP", info: "Client Hello" },
  { n: 6, src: "192.168.1.100", sport: 54321, dst: "172.217.14.206", dport: 443, proto: "TCP", info: "TLS record" },
  { n: 7, src: "192.168.1.100", sport: 49822, dst: "140.82.112.4", dport: 443, proto: "TCP", info: "TLS record" },
  { n: 8, src: "192.168.1.100", sport: 53012, dst: "8.8.8.8", dport: 53, proto: "UDP", info: "DNS query" },
];
export const tupleKey = (p: Pkt) => `${p.src}:${p.sport} → ${p.dst}:${p.dport} ${p.proto}`;

/* ── Signatures shown in the demo (hostname substring → AppType) ── */
export const SIGNATURES: [string, string][] = [
  ["youtube", "YOUTUBE"],
  ["facebook", "FACEBOOK"],
  ["google", "GOOGLE"],
  ["github", "GITHUB"],
];
export const classify = (host: string) => {
  const h = host.trim().toLowerCase();
  if (!h) return null;
  return SIGNATURES.find(([k]) => h.includes(k))?.[1] ?? "UNKNOWN";
};

/* ── Blocking demo: sample flows, each as a packet sequence ── */
export type Flow = { id: string; src: string; host: string; app: string; label: string };
export const FLOWS: Flow[] = [
  { id: "yt", src: "192.168.1.100", host: "www.youtube.com", app: "YOUTUBE", label: "Video site" },
  { id: "gh", src: "192.168.1.100", host: "github.com", app: "GITHUB", label: "Code host" },
  { id: "tt", src: "192.168.1.100", host: "www.tiktok.com", app: "UNKNOWN", label: "Short video" },
  { id: "lan", src: "192.168.1.50", host: "www.google.com", app: "GOOGLE", label: "Blocked device" },
];
export const SEQ = ["SYN", "SYN-ACK", "ACK", "Client Hello", "Data", "Data", "Data"];
export const HELLO_AT = 3; // the flow is identified at the Client Hello

/* ── Threads ── */
// FNV-1a with a final mix; any stable hash works, what matters is same tuple → same thread
export const FP_OF = (key: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) % 4;
};

/* ── Sample report (illustrative, not a benchmark) ── */
export const REPORT = {
  totals: [["Total packets", 77], ["Total bytes", 5738], ["TCP packets", 73], ["UDP packets", 4]] as [string, number][],
  verdict: { forwarded: 69, dropped: 8 },
  apps: [["HTTPS", 39], ["Unknown", 16], ["YouTube", 4], ["DNS", 4], ["Facebook", 3]] as [string, number][],
  domains: ["www.youtube.com", "www.facebook.com", "www.google.com", "github.com"],
};

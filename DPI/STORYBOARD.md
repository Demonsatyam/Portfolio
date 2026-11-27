# DPI Engine — cinematic explainer

**Understand Traffic. Classify Connections. Control Network Flow.** 1920×1080, 30 fps, H.264, 5:54. Remotion project: every frame is code, every scene is its own composition, every label is real rendered text (no AI-generated footage, so no garbled text).

## 1. Packet lifecycle (what the film follows)

`Wireshark capture → input .pcap → PCAP Reader (global header, record headers, bytes) → Packet Parser (Ethernet, IPv4, TCP/UDP) → Five-Tuple flow lookup → inspection (TLS Client Hello SNI, HTTP Host) → signature matching → AppType on the flow → blocking rules (IP, app, domain) → forward / drop → Output Writer → filtered .pcap + processing report`

Multithreaded version: `Reader thread → LB0, LB1 → FP0–FP3 (FP chosen by hash(five-tuple) % 4) → Output Queue → Output Writer thread`. Thread-safe producer/consumer queues between stages (mutex + condition variable).

## 2. Cast (drawn from one shared rig, `src/cast/People.tsx`, so they stay consistent)

| Character | Look | Role in the film |
|---|---|---|
| The User | steel-blue sweater over white collar, short dark hair | opens YouTube (S1), returns in the finale |
| Network Engineer | navy polo, headset, cyan lanyard | technical guide (S3, S4, S5) |
| Security Administrator | charcoal blazer, glasses, hair bun, purple pin | configures rules (S8), reads the report (S10) |

Colour always means the same thing: **blue/cyan** data and inspection, **purple** identified / highlighted, **green** forwarded, **red** blocked / dropped, **amber** limits and caveats.

## 3. Scene-by-scene

| Time | Scene | Picture | Voice | Sound |
|---|---|---|---|---|
| 0:00 | 01 The internet behind the screen | Night room, the user behind a laptop, slow push-in → reverse angle on the browser typing `www.youtube.com` → fly into the screen → isometric network, packets on every link → title **DPI ENGINE / Deep Packet Inspection System** | User: "I'm opening YouTube…" · Narrator: opening lines | atmospheric pad, typing, whoosh, scan, title impact |
| 0:23 | 02 What is a network packet? | Stream of packets, one stops mid-air and grows into an envelope (FROM / TO / HOW / DATA) → nested layers (Ethernet ⊃ IP ⊃ TCP ⊃ payload) → unstack into a header bar with a card per layer, synced to each sentence | Narrator | subtle electronic pulse, blips per layer |
| 0:53 | 03 Why DPI? | Engineer in the NOC → split screen: firewall checks IP / ports and ends at "port 443, Application: ?" vs DPI Engine reading the Client Hello's SNI → YouTube; payload stays encrypted on both sides | Engineer + Narrator | scan, confirm |
| 1:22 | 04 Architecture | Engineer + capture list → `capture.pcap` (offline chip) → 9-stage snake pipeline revealed stage by stage, packets streaming, forward (green) / drop (red) split | Engineer + Narrator | rhythmic electronic, blip per stage |
| 1:48 | 05 Journey of a packet | Fly-through stations following packet #4: PCAP Reader (global header, record header, timestamp, lengths, bytes) → Packet Parser (54 header bytes colour-coded, fields light up as extracted) → Five-Tuple (five chips merge into one connection id, flow table counts packets) | Engineer (PIP) + Narrator | whoosh per station, scan per field |
| 2:35 | 06 SNI extraction | Browser/server handshake ladder (Client Hello, Server Hello, scrambled encrypted records) → zoom into Client Hello fields, scan beam, SNI highlighted → hostname flies to SNI Mapping → `AppType::YOUTUBE` → four caveat cards: no decryption, needs a complete Client Hello, ECH hides SNI, plain HTTP uses the Host header | Narrator | notify on SNI hit, confirm on AppType |
| 3:21 | 07 Application classification | Domain → Signature matching → AppType → Flow classification; five packets (YouTube, Facebook, Google, GitHub, no hostname) pass the matcher; unknown stays UNKNOWN; labels stored on flows | Narrator | blip / reject |
| 3:42 | 08 Blocking | Admin toggles three rules (IP 192.168.1.50, app YouTube, domain tiktok) → three decision gates: github.com → FORWARD, YouTube → DROP at gate 2 → flow timeline SYN, SYN-ACK, ACK forwarded, Client Hello identifies YouTube, flow marked BLOCKED, later packets dropped, brackets explain the timing | Admin + Narrator | tension bed, drop impacts, alert |
| 4:15 | 09 Multithreading | Reader → LB0/LB1 → FP0–FP3 → Output Queue → Writer with live traffic; one flow highlighted, `hash(five-tuple) % 4 = 2`, Packet 1–4 → FP2 → zoom into a queue: producer, slots, consumer, mutex locked/free, condition variable notify, pseudo-code → full chain ending at Output Writer | Narrator | energetic electronic, queue ticks |
| 4:59 | 10 Output and report | Verdicts split: green into Output Writer (`output.pcap`, counter to 69), red into the drop path (8) → terminal report types out (77 packets, 5738 bytes, TCP 73, UDP 4, top-5 apps, domains, thread stats) labelled as an illustrative sample | Narrator + Admin (PIP) | typing, notify |
| 5:25 | 11 Summary | Pipeline recap + five capability cards → the three characters in front of the network → end screen, tagline, fade to black | Narrator | restrained finale, impact |

## 4. Accuracy guardrails (kept on screen and in the script)

- PCAP processing is **offline**: the input is a recorded capture, not a live network link.
- The engine **never decrypts** HTTPS. SNI is read from a conventional, complete, parsable Client Hello; Encrypted Client Hello hides it.
- HTTP Host extraction is shown for unencrypted web traffic.
- Only domains with a known signature are classified; the rest are labelled Unknown.
- Handshake packets are forwarded **before** the app is known; flow blocking starts once the flow is identified.
- The report numbers are an **illustrative sample** (labelled in-frame), not a benchmark. No throughput claims anywhere.
- Illustrative values: MAC/IP/port values, header bytes, capture rows, rule values. Mapping table entries mirror the four apps named in the brief.

## 5. Production

- Voices: macOS on-device voices (narrator Aman, user Daniel, engineer Tara, admin Samantha). Swap for a studio VO by replacing `public/vo/sXX_YY.wav` and running `node scripts/voice.mjs --skip-say`.
- Music + SFX: synthesised procedurally by `scripts/music.mjs`, sections follow the scene timings; music ducks under every spoken line.
- Subtitles: `out/dpi-engine.srt`, generated with the timings.

import React from 'react';
import {Cue, INOUT, keys, ramp, Reveal, useSec} from '../anim';
import {Chip, H, Icon, Kicker, Panel, rand, Shot, Stage, Wire} from '../cast/Kit';
import {C, DISPLAY, lines, MONO, UI} from '../theme';
import {when} from './S02Packet';

const L = lines(5);
const GLYPHS = 'A9f#Qz7$kP2x@Lm0R%w8&Ty3!eB5^nH';
export const scramble = (n: number, t: number, seed = 0) => Array.from({length: n}, (_, i) => GLYPHS[Math.floor(rand(i + seed * 31 + Math.floor(t * 12) * 7) * GLYPHS.length)]).join('');

const HELLO = [
  ['Content Type', '0x16  Handshake'],
  ['Handshake Type', '0x01  ClientHello'],
  ['Client Version', '0x0303  (TLS 1.2 field)'],
  ['Random', '32 bytes  a7 3f 9c 01 …'],
  ['Session ID', '32 bytes  5e 91 d2 …'],
  ['Cipher Suites', '0x1301 0x1302 0xc02f …'],
  ['Extensions', 'supported_versions, key_share …'],
  ['SNI extension (0x0000)', 'www.youtube.com'],
];

const Msg: React.FC<{y: number; dir: 1 | -1; label: string; color: string; p: number; lock?: boolean; s: number}> = ({y, dir, label, color, p, lock, s}) => {
  const a: [number, number] = dir > 0 ? [330, y] : [1590, y];
  const b: [number, number] = dir > 0 ? [1590, y] : [330, y];
  return (
    <>
      <Wire pts={[a, b]} color={color} p={p} width={4} arrow />
      <div style={{position: 'absolute', left: 560, width: 800, top: y - 58, textAlign: 'center', opacity: ramp(p, 0.1, 0.4), fontFamily: lock ? MONO : DISPLAY, fontWeight: 700, fontSize: lock ? 28 : 34, color: lock ? C.mute : C.white, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12}}>
        {lock ? <Icon name="lock" color={C.mute} size={34} /> : null}{lock ? scramble(22, s, y) : label}
      </div>
    </>
  );
};

const Card: React.FC<{x: number; y: number; on: number; title: string; color: string; icon: React.ComponentProps<typeof Icon>['name']; children: React.ReactNode}> = ({x, y, on, title, color, icon, children}) => (
  <Panel style={{left: x, top: y, width: 840, height: 330, padding: '28px 34px', translate: `0 ${(1 - on) * 40}px`}} on={on} glow={color}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16}}><Icon name={icon} color={color} size={48} /><div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 36}}>{title}</div></div>
    <div style={{marginTop: 20}}>{children}</div>
  </Panel>
);

export const S06SNI: React.FC = () => {
  const s = useSec();
  const ch = when(L[0], 0.62);
  const scanRow = keys(s, [L[1].at, when(L[1], 0.72)], [0, 7], (x) => x);
  const sniHit = ramp(s, when(L[1], 0.72), when(L[1], 0.72) + 0.4);
  const fly = ramp(s, L[2].at - 0.1, L[2].at + 0.9, INOUT);
  const map = ramp(s, when(L[2], 0.55), when(L[2], 0.55) + 0.4);
  const app = ramp(s, when(L[2], 0.8), when(L[2], 0.8) + 0.4);
  return (
    <Stage grid={0.2}>
      {/* A · the handshake */}
      <Shot s={s} from={0} to={L[1].at - 0.2} fade={0.4}>
        <Reveal s={s} at={0.4} style={{position: 'absolute', left: 96, top: 80}}><Kicker>DEEP INSPECTION</Kicker></Reveal>
        <Reveal s={s} at={0.7} style={{position: 'absolute', left: 96, top: 122}}><H size={56}>The TLS handshake</H></Reveal>
        {[['Browser', 330, C.cyan], ['Server', 1590, C.blue]].map(([n, x, col]) => (
          <React.Fragment key={n as string}>
            <div style={{position: 'absolute', left: (x as number) - 130, top: 250, width: 260, padding: '18px 0', textAlign: 'center', borderRadius: 16, background: (col as string) + '22', border: `2px solid ${col}`, fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: C.white, opacity: ramp(s, 1, 1.5)}}>{n}</div>
            <div style={{position: 'absolute', left: (x as number) - 1.5, top: 330, width: 3, height: 640 * ramp(s, 1.3, 2.3), background: `linear-gradient(${col}, transparent)`}} />
          </React.Fragment>
        ))}
        <Msg s={s} y={440} dir={1} label="Client Hello  (readable)" color={C.purple} p={ramp(s, ch, ch + 0.8, INOUT)} />
        <Msg s={s} y={570} dir={-1} label="Server Hello" color={C.blue} p={ramp(s, ch + 1.0, ch + 1.7, INOUT)} />
        <Msg s={s} y={720} dir={1} label="" lock color={C.dim} p={ramp(s, ch + 1.9, ch + 2.5, INOUT)} />
        <Msg s={s} y={840} dir={-1} label="" lock color={C.dim} p={ramp(s, ch + 2.3, ch + 2.9, INOUT)} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 955, textAlign: 'center', fontFamily: UI, fontSize: 26, color: C.mute, opacity: ramp(s, ch + 2.5, ch + 3)}}>after the handshake: encrypted application data</div>
      </Shot>

      {/* B · inside the Client Hello */}
      <Shot s={s} from={L[1].at - 0.4} to={L[3].at - 0.2}>
        <Reveal s={s} at={L[1].at} style={{position: 'absolute', left: 96, top: 70}}><Kicker color={C.purple}>ZOOM: CLIENT HELLO</Kicker></Reveal>
        <div style={{position: 'absolute', left: 96, top: 130, width: 960, scale: String(keys(s, [L[1].at - 0.4, L[1].at + 0.4], [1.25, 1])), transformOrigin: '0 0'}}>
          {HELLO.map(([k, v], i) => {
            const sni = i === 7;
            const lit = sni ? sniHit : Math.max(0, 1 - Math.abs(scanRow - i) * 1.2);
            return (
              <div key={k} style={{display: 'flex', alignItems: 'center', padding: '17px 24px', marginBottom: 8, marginLeft: i === 7 ? 40 : 0, borderRadius: 12, opacity: ramp(s, L[1].at - 0.3 + i * 0.08, L[1].at + i * 0.08),
                background: sni ? `rgba(121,92,255,${0.08 + 0.3 * sniHit})` : `rgba(38,120,255,${0.06 + 0.2 * lit})`, border: `2px solid ${sni && sniHit > 0.5 ? C.purple : lit > 0.5 ? C.cyan : '#22335A'}`, boxShadow: sni ? `0 0 ${50 * sniHit}px ${C.purple}88` : 'none'}}>
                <span style={{width: 380, fontFamily: UI, fontSize: 26, color: sni ? C.white : C.mute, fontWeight: sni ? 700 : 400}}>{k}</span>
                <span style={{fontFamily: MONO, fontSize: 26, color: sni ? C.white : C.cyan, opacity: sni && fly > 0 ? 1 - fly * 0.6 : 1}}>{v}</span>
              </div>
            );
          })}
        </div>
        {/* hostname flies out to the mapping column */}
        <div style={{position: 'absolute', left: keys(fly, [0, 1], [576, 1180]), top: keys(fly, [0, 1], [700, 300]), opacity: fly > 0 ? 1 : 0}}>
          <Chip color={C.purple} size={36} solid={fly > 0.95}>www.youtube.com</Chip>
        </div>
        <div style={{position: 'absolute', left: 1460, top: 390, width: 4, height: 90 * map, background: C.purple}} />
        <Panel style={{left: 1180, top: 480, width: 560, padding: '22px 28px'}} on={map} glow={C.purple}>
          <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 32}}>SNI Mapping</div>
          {[['youtube', 'YOUTUBE'], ['facebook', 'FACEBOOK'], ['google', 'GOOGLE'], ['github', 'GITHUB']].map(([a, b], i) => (
            <div key={a} style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 24, padding: '8px 0', color: i === 0 ? C.white : C.mute, background: i === 0 ? C.purple + '33' : 'transparent', borderRadius: 6, paddingLeft: 8, paddingRight: 8}}>
              <span>*{a}*</span><span>→ {b}</span>
            </div>
          ))}
        </Panel>
        <div style={{position: 'absolute', left: 1460, top: 790, width: 4, height: 60 * app, background: C.purple}} />
        <div style={{position: 'absolute', left: 1180, top: 860, width: 560, display: 'flex', justifyContent: 'center', opacity: app, scale: String(0.85 + 0.15 * app)}}>
          <Chip color={C.purple} size={40} solid>AppType::YOUTUBE</Chip>
        </div>
        <div style={{position: 'absolute', left: 96, top: 960, fontFamily: UI, fontSize: 24, color: C.mute, opacity: ramp(s, when(L[1], 0.3), when(L[1], 0.5))}}>
          The Client Hello is sent before encryption begins, so its fields can be parsed.
        </div>
      </Shot>

      {/* C · what it can and can't see */}
      <Shot s={s} from={L[3].at - 0.4} to={99}>
        <Reveal s={s} at={L[3].at - 0.2} style={{position: 'absolute', left: 96, top: 70}}><Kicker color={C.amber}>WHAT SNI CAN, AND CAN'T, TELL US</Kicker></Reveal>
        <Card x={96} y={150} on={ramp(s, L[3].at, L[3].at + 0.5)} title="No decryption" color={C.mute} icon="lock">
          <div style={{fontFamily: MONO, fontSize: 30, color: C.mute, letterSpacing: 2}}>{scramble(30, s, 1)}</div>
          <div style={{fontFamily: MONO, fontSize: 30, color: C.mute, letterSpacing: 2}}>{scramble(30, s, 2)}</div>
          <div style={{fontFamily: UI, fontSize: 26, color: C.white, marginTop: 16}}>Application data after the handshake stays unreadable.</div>
        </Card>
        <Card x={984} y={150} on={ramp(s, L[4].at, L[4].at + 0.5)} title="Needs a complete Client Hello" color={C.amber} icon="file">
          <div style={{display: 'flex', gap: 10}}>
            {[1, 1, 1, 0, 0].map((ok, i) => <div key={i} style={{flex: 1, height: 46, borderRadius: 8, background: ok ? C.purple + '55' : 'transparent', border: `2px ${ok ? 'solid' : 'dashed'} ${ok ? C.purple : C.amber}`}} />)}
          </div>
          <div style={{fontFamily: UI, fontSize: 26, color: C.white, marginTop: 20}}>Truncated or unparsable → no hostname extracted.</div>
        </Card>
        <Card x={96} y={520} on={ramp(s, when(L[4], 0.5), when(L[4], 0.5) + 0.5)} title="Encrypted Client Hello (ECH)" color={C.red} icon="eye">
          <div style={{fontFamily: MONO, fontSize: 30, color: C.white}}>SNI: <span style={{color: C.red}}>{scramble(15, s, 3)}</span></div>
          <div style={{fontFamily: UI, fontSize: 26, color: C.white, marginTop: 20}}>When the name is concealed, there is nothing to read.</div>
        </Card>
        <Card x={984} y={520} on={ramp(s, L[5].at, L[5].at + 0.5)} title="Plain HTTP: Host header" color={C.green} icon="search">
          <div style={{fontFamily: MONO, fontSize: 28, color: C.mute, lineHeight: 1.5}}>GET / HTTP/1.1<br /><span style={{color: C.white, background: C.green + '33', padding: '2px 8px', borderRadius: 6}}>Host: example.com</span></div>
          <div style={{fontFamily: UI, fontSize: 26, color: C.white, marginTop: 14}}>Unencrypted web traffic names its host directly.</div>
        </Card>
      </Shot>

      <Cue at={ch} name="whoosh3" volume={0.35} />
      <Cue at={ch + 1.0} name="whoosh2" volume={0.25} />
      <Cue at={L[1].at} name="scan" volume={0.4} />
      <Cue at={when(L[1], 0.72)} name="notify" volume={0.45} />
      <Cue at={L[2].at} name="whoosh1" volume={0.3} />
      <Cue at={when(L[2], 0.8)} name="confirm" volume={0.45} />
      {[L[3].at, L[4].at, when(L[4], 0.5), L[5].at].map((t) => <Cue key={t} at={t} name="pop" volume={0.35} />)}
    </Stage>
  );
};

import React from 'react';
import {Cue, ramp, Reveal, useSec} from '../anim';
import {along, Block, Chip, Icon, Kicker, P, Panel, rand, Shot, Stage, Wire} from '../cast/Kit';
import {C, DISPLAY, lines, MONO, UI} from '../theme';
import {when} from './S02Packet';

const L = lines(8);
const N: Record<string, P> = {R: [210, 540], LB0: [570, 390], LB1: [570, 690], FP0: [960, 240], FP1: [960, 440], FP2: [960, 640], FP3: [960, 840], Q: [1370, 540], W: [1730, 540]};
const FLOW_FP = [2, 0, 3, 1, 2, 0, 3, 1]; // = hash(five-tuple) % 4, fixed per flow
const FLOW_COL = [C.purple, C.cyan, C.blue, C.amber, '#5EEAD4', '#9DB4FF', C.cyan, C.blue];
const route = (f: number): P[] => { const fp = FLOW_FP[f]; return [N.R, fp < 2 ? N.LB0 : N.LB1, N[`FP${fp}`], N.Q, N.W]; };

export const S09Threads: React.FC = () => {
  const s = useSec();
  const rv = (t: number) => ramp(s, t, t + 0.45);
  const tR = L[0].at + 1, tLB = when(L[1], 0.55), tFP = when(L[1], 0.78), tQ = when(L[1], 0.95);
  const focus = ramp(s, L[2].at, L[2].at + 0.6) * (1 - ramp(s, L[4].at - 0.8, L[4].at - 0.3));
  const hero = [0, 1, 2, 3].map((k) => L[2].at + 1 + k * 1.9);
  const DUR = 2.6;
  const flowStart = tFP - 0.4;

  // packets in flight: background traffic (flows 1..7) + the highlighted flow 0
  const traffic: {f: number; t0: number; k?: number}[] = [];
  for (let i = 0; i < 140; i++) { const t0 = flowStart + i * 0.17; if (s > t0 && s < t0 + DUR) traffic.push({f: 1 + Math.floor(rand(i) * 7), t0}); }
  hero.forEach((t0, k) => { if (s > t0 && s < t0 + DUR) traffic.push({f: 0, t0, k}); });

  return (
    <Stage grid={0.2} light={C.purple}>
      {/* A · the thread graph */}
      <Shot s={s} from={0} to={L[4].at - 0.2}>
        <Reveal s={s} at={0.4} style={{position: 'absolute', left: 96, top: 70}}><Kicker color={C.purple}>MULTITHREADED ARCHITECTURE</Kicker></Reveal>
        {(['LB0', 'LB1'] as const).map((lb) => <Wire key={lb} pts={[N.R, N[lb]]} color={C.blue} p={ramp(s, tLB - 0.3, tLB + 0.2)} />)}
        {[0, 1, 2, 3].map((fp) => <Wire key={fp} pts={[N[fp < 2 ? 'LB0' : 'LB1'], N[`FP${fp}`]]} color={C.blue} p={ramp(s, tFP - 0.3, tFP + 0.2)} />)}
        {[0, 1, 2, 3].map((fp) => <Wire key={'q' + fp} pts={[N[`FP${fp}`], N.Q]} color={C.blue} p={ramp(s, tQ - 0.3, tQ + 0.2)} opacity={0.7} />)}
        <Wire pts={[N.Q, N.W]} color={C.green} p={ramp(s, tQ, tQ + 0.4)} />
        {traffic.map(({f, t0, k}) => {
          const u = (s - t0) / DUR;
          const [x, y] = along(route(f), u);
          const isHero = f === 0;
          const col = FLOW_COL[f];
          const r = isHero ? 13 : 8;
          return (
            <React.Fragment key={`${f}-${t0}`}>
              <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: 5, background: col, boxShadow: `0 0 ${isHero ? 26 : 12}px ${col}`, opacity: isHero ? 1 : 1 - focus * 0.75}} />
              {isHero ? <div style={{position: 'absolute', left: x - 30, top: y - 48, width: 60, textAlign: 'center', fontFamily: MONO, fontSize: 20, color: C.white}}>P{(k ?? 0) + 1}</div> : null}
            </React.Fragment>
          );
        })}
        <Block x={N.R[0]} y={N.R[1]} w={260} h={120} title="Reader" sub="1 thread · reads PCAP" on={rv(tR)} color={C.cyan} active={1 - ramp(s, tR + 1, tR + 2)} />
        {(['LB0', 'LB1'] as const).map((lb) => <Block key={lb} x={N[lb][0]} y={N[lb][1]} w={220} h={110} title={lb} sub="load balancer" on={rv(tLB)} color={C.blue} />)}
        {[0, 1, 2, 3].map((fp) => {
          const hit = fp === 2 ? focus : 0;
          return <Block key={fp} x={N[`FP${fp}`][0]} y={N[`FP${fp}`][1]} w={220} h={110} title={`FP${fp}`} sub="fast path" on={rv(tFP + fp * 0.1)} color={fp === 2 && focus > 0.3 ? C.purple : C.blue} active={hit} />;
        })}
        <Block x={N.Q[0]} y={N.Q[1]} w={250} h={120} title="Output Queue" sub="thread-safe" on={rv(tQ)} color={C.blue} />
        <Block x={N.W[0]} y={N.W[1]} w={250} h={120} title="Output Writer" sub="1 thread · output.pcap" on={rv(tQ + 0.2)} color={C.green} />
        {/* consistent hashing callout */}
        <Panel style={{left: 1220, top: 700, width: 600, padding: '22px 28px'}} on={ramp(s, L[2].at + 0.4, L[2].at + 0.9) * (1 - ramp(s, L[4].at - 0.8, L[4].at - 0.3))} glow={C.purple}>
          <div style={{fontFamily: MONO, fontSize: 27, color: C.white}}>hash(<span style={{color: C.purple}}>five-tuple</span>) % 4 = <b style={{color: C.purple}}>2</b></div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', marginTop: 14}}>
            {hero.map((t0, k) => (
              <div key={k} style={{fontFamily: MONO, fontSize: 25, color: C.white, opacity: ramp(s, t0 + DUR * 0.55, t0 + DUR * 0.55 + 0.3)}}>Packet {k + 1} → <span style={{color: C.purple}}>FP2</span></div>
            ))}
          </div>
        </Panel>
        <div style={{position: 'absolute', left: 96, bottom: 60, fontFamily: UI, fontSize: 25, color: C.mute, opacity: ramp(s, L[3].at, L[3].at + 0.5)}}>Same connection → same Fast Path thread → its flow state stays in one place</div>
      </Shot>

      {/* B · inside a thread-safe queue */}
      <Shot s={s} from={L[4].at - 0.4} to={99}>
        <Queue s={s} />
      </Shot>

      {[tR, tLB, tFP, tQ].map((t) => <Cue key={t} at={t} name="blip" volume={0.35} />)}
      {hero.map((t0) => <Cue key={t0} at={t0 + DUR * 0.55} name="queue" volume={0.3} />)}
      <Cue at={L[4].at - 0.4} name="whoosh1" volume={0.4} />
    </Stage>
  );
};

const Queue: React.FC<{s: number}> = ({s}) => {
  const t0 = L[4].at;
  const cyc = 2.2;
  const local = s - t0 - 0.8;
  const n = Math.floor(local / cyc), ph = local - n * cyc; // each cycle: push at 0–0.6, notify at 0.6, pop at 1.0–1.6
  const pushing = local > 0 && ph < 0.6, popping = local > 0 && ph > 1.0 && ph < 1.6;
  const locked = pushing || popping;
  const ring = local > 0 && ph > 0.6 && ph < 1.0;
  const waiting = local <= 0 || ph > 1.6 || ph < 0.6;
  const base = 3; // items sitting in the queue
  const slots = 6;
  const showStrip = ramp(s, L[6].at - 0.2, L[6].at + 0.4);
  return (
    <>
      <Reveal s={s} at={t0 - 0.2} style={{position: 'absolute', left: 96, top: 70}}><Kicker color={C.purple}>ZOOM: A THREAD-SAFE QUEUE</Kicker></Reveal>
      <Block x={300} y={420} w={300} h={140} title="Producer" sub="e.g. LB thread" color={C.blue} active={pushing ? 1 : 0} />
      <Block x={1620} y={420} w={300} h={140} title="Consumer" sub={waiting ? 'waiting…' : 'awake · processing'} color={C.purple} active={waiting ? 0 : 1} />
      {/* queue slots */}
      <div style={{position: 'absolute', left: 620, top: 360, width: 680, height: 120, borderRadius: 18, border: `3px solid ${locked ? C.amber : C.line}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', boxSizing: 'border-box', boxShadow: locked ? `0 0 30px ${C.amber}55` : 'none'}}>
        {Array.from({length: slots}, (_, i) => {
          const filled = i < base || (i === base && (pushing ? ph > 0.4 : ph >= 0.6 && ph < 1.0));
          return <div key={i} style={{flex: 1, height: 70, borderRadius: 10, background: filled ? C.cyan + '55' : 'transparent', border: `2px ${filled ? 'solid' : 'dashed'} ${filled ? C.cyan : C.dim}`}} />;
        })}
      </div>
      {/* moving packets */}
      {pushing ? <div style={{position: 'absolute', left: 450 + 200 * (ph / 0.6) * 0.9, top: 400, width: 40, height: 40, borderRadius: 8, background: C.cyan, boxShadow: `0 0 20px ${C.cyan}`}} /> : null}
      {popping ? <div style={{position: 'absolute', left: 1290 + 180 * ((ph - 1) / 0.6), top: 400, width: 40, height: 40, borderRadius: 8, background: C.purple, boxShadow: `0 0 20px ${C.purple}`}} /> : null}
      {/* mutex */}
      <div style={{position: 'absolute', left: 860, top: 180, width: 200, textAlign: 'center', opacity: ramp(s, L[5].at - 0.2, L[5].at + 0.3)}}>
        <div style={{display: 'flex', justifyContent: 'center'}}><Icon name="lock" color={locked ? C.amber : C.mute} size={80} /></div>
        <div style={{fontFamily: MONO, fontSize: 24, color: locked ? C.amber : C.mute}}>mutex {locked ? 'locked' : 'free'}</div>
      </div>
      {/* condition variable */}
      <div style={{position: 'absolute', left: 1430, top: 230, width: 380, textAlign: 'center', opacity: ramp(s, when(L[5], 0.5), when(L[5], 0.5) + 0.3)}}>
        <Chip color={ring ? C.purple : C.dim} size={24} solid={ring}>condition variable {ring ? '→ notify' : ''}</Chip>
      </div>
      {/* pseudo-code */}
      <Panel style={{left: 220, top: 570, width: 1480, padding: '24px 34px', display: 'flex', gap: 60}} on={ramp(s, t0 + 0.6, t0 + 1.1)}>
        <div style={{flex: 1, fontFamily: MONO, fontSize: 25, lineHeight: 1.6, color: C.mute}}>
          <div style={{color: C.blue, fontFamily: DISPLAY, fontWeight: 700, fontSize: 26}}>producer</div>
          <div style={{color: pushing ? C.white : C.mute}}>lock(mutex)</div>
          <div style={{color: pushing ? C.white : C.mute}}>queue.push(packet)</div>
          <div style={{color: ring ? C.purple : C.mute}}>unlock · notify consumer</div>
        </div>
        <div style={{flex: 1, fontFamily: MONO, fontSize: 25, lineHeight: 1.6, color: C.mute}}>
          <div style={{color: C.purple, fontFamily: DISPLAY, fontWeight: 700, fontSize: 26}}>consumer</div>
          <div style={{color: waiting ? C.white : C.mute}}>lock(mutex) · wait until not empty</div>
          <div style={{color: popping ? C.white : C.mute}}>packet = queue.pop()</div>
          <div style={{color: popping ? C.white : C.mute}}>unlock · process packet</div>
        </div>
      </Panel>
      {/* the whole chain, ending at the writer */}
      <div style={{position: 'absolute', left: 96, right: 96, top: 880, display: 'flex', alignItems: 'center', gap: 14, opacity: showStrip, translate: `0 ${(1 - showStrip) * 30}px`}}>
        {['Reader', 'queue', 'LB0 · LB1', 'queue', 'FP0–FP3', 'Output Queue', 'Output Writer', 'output.pcap'].map((x, i) => {
          const hot = i >= 6;
          const isQ = x === 'queue';
          return (
            <React.Fragment key={i}>
              <div style={{padding: isQ ? '10px 14px' : '14px 20px', borderRadius: 12, fontFamily: isQ ? MONO : DISPLAY, fontWeight: isQ ? 400 : 700, fontSize: isQ ? 20 : 24, color: hot ? C.bg : C.white, background: hot ? C.green : isQ ? 'transparent' : '#132042', border: `2px ${isQ ? 'dashed' : 'solid'} ${hot ? C.green : C.line}`}}>{x}</div>
              {i < 7 ? <span style={{color: C.dim, fontSize: 26}}>→</span> : null}
            </React.Fragment>
          );
        })}
      </div>
      {Array.from({length: 8}, (_, k) => <Cue key={k} at={t0 + 0.8 + k * cyc} name="queue" volume={0.25} />)}
      <Cue at={L[6].at} name="confirm" volume={0.35} />
    </>
  );
};

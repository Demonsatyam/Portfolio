import type { AgentId } from "./art/Agents";
import { HOME, INCIDENT, NOW, OFFICE, road, type P } from "./art/city";

/* ── Commuter routes (same city and landmarks as the film) ── */
export type Dest = "office" | "university";
export const UNIVERSITY: P = [road(8), road(3)];
export const DESTS: Record<Dest, { label: string; to: P; usual: P[]; alt: P[] }> = {
  office: {
    label: "Home → Office",
    to: OFFICE,
    usual: [HOME, [road(4), road(7)], [road(4), road(1)], OFFICE],
    alt: [NOW, [road(7), road(7)], OFFICE],
  },
  university: {
    label: "Home → University",
    to: UNIVERSITY,
    usual: [HOME, [road(4), road(7)], [road(4), road(3)], UNIVERSITY],
    alt: [NOW, [road(7), road(7)], [road(7), road(3)], UNIVERSITY],
  },
};
export { HOME, INCIDENT, NOW };

/* ── Incident types for the simulator (all values are demo data) ── */
export type IncidentKind = "accident" | "closure" | "rain" | "waterlogging";
export const INCIDENTS: Record<
  IncidentKind,
  { label: string; title: string; place: string; signals: string[]; checks: string[]; impact: string; response: string; delay: string }
> = {
  accident: {
    label: "Accident",
    title: "Two-vehicle collision, Ring Road flyover",
    place: "Ring Road flyover, northbound",
    signals: ["X post with a photo of the collision", "Facebook page video of traffic crawling", "Upload form: “one lane blocked”"],
    checks: ["4 reports describe the same place", "Photo shows 2 vehicles, 1 of 2 lanes blocked", "Traffic API: speeds falling on the flyover"],
    impact: "Queue likely to spread to 3 connected roads within ~30 min",
    response: "Divert northbound traffic at the Ring Road junction",
    delay: "~18 min",
  },
  closure: {
    label: "Road closure",
    title: "Road closed at the flyover exit",
    place: "Flyover exit, Ring Road",
    signals: ["Upload form: “road closed, vehicles turning back”", "Page post: barricades photo", "2 posts mention the same exit"],
    checks: ["Barricades visible in the photo", "Location matches all reports", "Traffic API: flow stopped at the exit"],
    impact: "Detour traffic expected on 2 parallel roads",
    response: "Post a marshal at the detour and update signage",
    delay: "~12 min",
  },
  rain: {
    label: "Heavy rainfall",
    title: "Heavy rain slowing the Ring Road corridor",
    place: "Ring Road corridor",
    signals: ["Weather API: heavy rain warning", "5 posts about poor visibility", "Video of slow traffic in rain"],
    checks: ["Weather API confirms rainfall for the area", "Posts come from the same corridor", "Traffic API: average speed down"],
    impact: "Slower traffic across the corridor for the next hour",
    response: "Watch low-lying underpasses for waterlogging",
    delay: "~10 min",
  },
  waterlogging: {
    label: "Waterlogging",
    title: "Waterlogged underpass near Lake Road",
    place: "Lake Road underpass",
    signals: ["Photo of water across the road", "Post: “Road blocked due to waterlogging”", "Weather API: rain in the last 2 hours"],
    checks: ["Photo shows standing water across lanes", "Location confirmed by 3 reports", "Traffic API: vehicles rerouting"],
    impact: "Underpass impassable; nearby junctions likely to back up",
    response: "Close the underpass and send a pump team",
    delay: "~22 min",
  },
};

/* ── Agents: what each one does, from the system architecture ── */
export const AGENT_INFO: Record<AgentId, { role: string; does: string[]; tools?: string[] }> = {
  router: {
    role: "Coordinates incoming requests and delegates each task to the right agent.",
    does: ["Classifies every request", "Runs traffic and geo queries", "Routes work to the sub-agents"],
    tools: ["get_traffic", "get_coordinates", "route_to_another_agent"],
  },
  social: {
    role: "Reads public social posts and finds reports that are about the same place.",
    does: ["Clusters posts that mention the same road", "Summarises each cluster with Gemini"],
  },
  report: {
    role: "Understands photos, videos and text that commuters upload.",
    does: ["Takes image and video input", "Gemini multimodal analysis: what happened, lanes blocked, landmarks"],
  },
  sentiment: {
    role: "Weighs the tone and place signals in what people are saying.",
    does: ["Sentiment analysis on posts and reports", "Updates the city mood map"],
  },
  predict: {
    role: "Estimates how far a verified incident will spread, and who it affects.",
    does: ["Monitors events", "Checks traffic, weather and reports", "Predicts impact and generates the alert"],
  },
  notify: {
    role: "Sends the right alert to the right people.",
    does: ["Checks commuters' route subscriptions", "Generates smart alerts", "Sends incident details to the nearest traffic station"],
  },
};

/* ── Architecture (simplified flow + full layers) ── */
export const FLOW = ["Data sources", "AI agents", "Incident validation", "Traffic prediction", "Personalised alerts", "Authorities"];
export const LAYERS: { name: string; items: string[]; tone: "blue" | "cyan" | "teal" | "white" }[] = [
  { name: "Data ingestion", items: ["Public upload form", "Facebook page posts", "Twitter API", "Traffic APIs", "Weather API"], tone: "blue" },
  { name: "Frontend", items: ["Firebase Studio UI", "User upload form", "Map dashboard"], tone: "white" },
  { name: "Host agent · Google ADK", items: ["Request classification", "Traffic query", "Geo query", "Agent routing"], tone: "cyan" },
  { name: "Sub-agents", items: ["Social Feed", "User Report", "Sentiment", "Predictive", "Notification"], tone: "cyan" },
  { name: "Storage & intelligence", items: ["PostgreSQL", "PGVector", "Firebase Firestore", "Firebase services"], tone: "teal" },
  { name: "Notifications", items: ["Firebase Cloud Messaging"], tone: "teal" },
];

export const CHAPTERS = [
  { id: "film", label: "The film" },
  { id: "commute", label: "The commute" },
  { id: "sources", label: "Listening 24/7" },
  { id: "agents", label: "The agents" },
  { id: "simulate", label: "Simulate an incident" },
  { id: "verify", label: "Verify first" },
  { id: "reroute", label: "Predict & reroute" },
  { id: "authorities", label: "Authorities" },
  { id: "architecture", label: "Architecture" },
] as const;

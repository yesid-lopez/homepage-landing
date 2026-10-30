"use client";

import { useEffect, useMemo, useState } from "react";

type BackupSummary = {
  status?: "ok" | "stale" | "unknown" | string;
  lastSuccessAt?: string | null;
};

type ReadyCount = { ready?: number; total?: number };

type StatusChecks = {
  flux?: ReadyCount;
  backups?: {
    okToday?: number;
    total?: number;
    overdue?: number;
    oldestOverdueSuccessAt?: string | null;
  };
  nodes?: ReadyCount;
  workloads?: { unavailable?: number; total?: number };
};

type PlatformStatus = {
  status?: "operational" | "degraded" | "incident" | "unknown" | string;
  nodes?: number | null;
  nodeCount?: number | null;
  workloads?: number | null;
  gitops?: string;
  backups?: BackupSummary;
  alerts?: number | null;
  checks?: StatusChecks;
  updatedAt?: string;
};

type Snapshot = { status: PlatformStatus; isLive: boolean };

const fallbackStatus: PlatformStatus = {
  status: "unknown",
  gitops: "pending endpoint",
};

let snapshot: Snapshot = { status: fallbackStatus, isLive: false };
const listeners = new Set<() => void>();
let fetchStarted = false;

function notify() {
  listeners.forEach((l) => l());
}

// The API caches for 30s, so polling faster would only return the same payload.
const POLL_INTERVAL_MS = 30_000;

function loadStatus(endpoint: string) {
  fetch(endpoint, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`Status API returned ${response.status}`);
      return response.json() as Promise<PlatformStatus>;
    })
    .then((data) => {
      snapshot = { status: data, isLive: true };
      notify();
    })
    .catch(() => {
      // Keep the last live payload on a transient failure; its updatedAt shows its age.
      if (snapshot.isLive) return;
      snapshot = { status: fallbackStatus, isLive: false };
      notify();
    });
}

function ensureFetch() {
  if (fetchStarted) return;
  const endpoint = process.env.NEXT_PUBLIC_STATUS_API_URL;
  if (!endpoint) return;
  fetchStarted = true;

  loadStatus(endpoint);
  window.setInterval(() => {
    if (document.visibilityState === "visible") loadStatus(endpoint);
  }, POLL_INTERVAL_MS);
}

function usePlatformStatus(): Snapshot {
  const [, setTick] = useState(0);
  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    ensureFetch();
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return snapshot;
}

function formatStatusLabel(status: string) {
  return status
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusVariant(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "operational") return "isOperational";
  if (normalized === "degraded") return "isDegraded";
  if (normalized === "incident") return "isIncident";
  return "isUnknown";
}

function formatTimestamp(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(date);
}

function formatRelative(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60_000) return "moments ago";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function numberOrDash(value: number | null | undefined) {
  return typeof value === "number" ? String(value) : "—";
}

function nodesDisplay(status: PlatformStatus, isLive: boolean) {
  if (!isLive || typeof status.nodes !== "number") return "—";
  if (typeof status.nodeCount === "number") return `${status.nodes} / ${status.nodeCount}`;
  return String(status.nodes);
}

export function PlatformStatusCard() {
  const { status, isLive } = usePlatformStatus();
  const statusValue = status.status || "unknown";
  const variantClass = useMemo(() => statusVariant(statusValue), [statusValue]);
  const backupRelative = formatRelative(status.backups?.lastSuccessAt);
  const updatedAtLabel = formatTimestamp(status.updatedAt);

  const metrics: ReadonlyArray<readonly [string, string]> = [
    ["Nodes", nodesDisplay(status, isLive)],
    ["Workloads", isLive ? numberOrDash(status.workloads) : "—"],
    ["GitOps", status.gitops || "—"],
    ["Backups", isLive ? status.backups?.status || "—" : "—"],
    ["Alerts", isLive ? numberOrDash(status.alerts) : "—"],
  ];

  return (
    <article className="platformStatusCard" aria-label="Live platform status summary">
      <div className="platformStatusHeader">
        <div>
          <span>Live platform status</span>
          <h3>{isLive ? "Cluster summary" : "Endpoint ready"}</h3>
        </div>
        <strong className={`statusBadge ${variantClass}`}>
          <i /> {formatStatusLabel(statusValue)}
        </strong>
      </div>

      <div className="statusMetricGrid">
        {metrics.map(([label, value]) => (
          <div className="statusMetric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <p className="statusFootnote">
        {isLive
          ? `Last updated ${updatedAtLabel ?? "moments ago"}${backupRelative ? ` · last backup ${backupRelative}` : ""}. Only high-level, public-safe signals are shown.`
          : "Live metrics will appear here once the public-safe status API is deployed."}
      </p>
    </article>
  );
}

function joinSegments(segments: Array<string | null | false | undefined>) {
  return segments.filter(Boolean).join(" · ");
}

export function PlatformStatusPill() {
  const { status, isLive } = usePlatformStatus();
  const statusValue = (status.status || "unknown").toLowerCase();
  const variantClass = statusVariant(statusValue);
  const nodes = nodesDisplay(status, isLive);
  const alerts = isLive && typeof status.alerts === "number" ? status.alerts : null;

  const segments = isLive
    ? [statusValue, `${nodes} nodes`, alerts !== null ? `${alerts} alerts` : null].filter(Boolean)
    : ["pending"];

  return (
    <p
      className={`statusPill ${variantClass}`}
      aria-label="Live platform status summary"
      aria-live="polite"
    >
      <i />
      <span>live</span>
      <span>{segments.join(" · ")}</span>
    </p>
  );
}

type CheckTile = { label: string; value: string; ok: boolean | null };

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function hasCount(value: ReadyCount | undefined): value is { ready: number; total: number } {
  return typeof value?.ready === "number" && typeof value?.total === "number";
}

// Older API payloads have no `checks`; fall back to the legacy summary fields.
function buildChecks(status: PlatformStatus) {
  const { checks } = status;
  const tiles: CheckTile[] = [];
  const issues: string[] = [];

  if (hasCount(checks?.flux)) {
    const notReady = checks.flux.total - checks.flux.ready;
    tiles.push({ label: "Flux", value: notReady === 0 ? "✓" : `${checks.flux.ready}/${checks.flux.total}`, ok: notReady === 0 });
    if (notReady > 0) issues.push(`${plural(notReady, "Flux resource")} not ready`);
  } else {
    const ok = status.gitops === "healthy" ? true : status.gitops === "degraded" ? false : null;
    tiles.push({ label: "Flux", value: ok === null ? "—" : ok ? "✓" : "!", ok });
    if (ok === false) issues.push("Flux is not fully synced");
  }

  const backups = checks?.backups;
  if (typeof backups?.okToday === "number" && typeof backups.total === "number") {
    const overdue = backups.overdue ?? backups.total - backups.okToday;
    tiles.push({ label: "Backups today", value: `${backups.okToday}/${backups.total}`, ok: overdue === 0 });
    if (overdue > 0) {
      const lastSuccess = formatRelative(backups.oldestOverdueSuccessAt);
      issues.push(`${plural(overdue, "backup")} overdue · last success ${lastSuccess ?? "unknown"}`);
    }
  } else {
    const state = status.backups?.status;
    const ok = state === "ok" ? true : state === "stale" ? false : null;
    tiles.push({ label: "Backups", value: ok === null ? "—" : ok ? "✓" : "!", ok });
    if (ok === false) issues.push("Backups are overdue");
  }

  const nodes = hasCount(checks?.nodes)
    ? checks.nodes
    : typeof status.nodes === "number" && typeof status.nodeCount === "number"
      ? { ready: status.nodes, total: status.nodeCount }
      : null;
  if (nodes) {
    const down = nodes.total - nodes.ready;
    tiles.push({ label: "Nodes", value: `${nodes.ready}/${nodes.total}`, ok: down === 0 });
    if (down > 0) issues.push(`${plural(down, "node")} down`);
  } else {
    tiles.push({ label: "Nodes", value: "—", ok: null });
  }

  const unavailable = checks?.workloads?.unavailable ?? 0;
  if (unavailable > 0) issues.push(`${plural(unavailable, "workload")} unavailable`);

  return { tiles, issues };
}

function headline(statusValue: string, isLive: boolean, issueCount: number) {
  if (!isLive) return "Status pending";
  if (issueCount > 0) return `${issueCount} ${issueCount === 1 ? "thing needs" : "things need"} attention`;
  if (statusValue === "operational") return "All good";
  return formatStatusLabel(statusValue);
}

export function PlatformStatusTerminal() {
  const { status, isLive } = usePlatformStatus();
  const statusValue = (status.status || "unknown").toLowerCase();
  const variantClass = statusVariant(statusValue);
  const { tiles, issues } = useMemo(() => buildChecks(status), [status]);
  const updated = isLive ? formatRelative(status.updatedAt) : null;

  return (
    <div className="terminalCard statusChecks" aria-label="Live platform status" aria-live="polite">
      <div className={`terminalHeader ${variantClass}`}>
        <span /> {joinSegments([isLive ? statusValue : "pending", updated && `updated ${updated}`])}
      </div>
      <strong className="statusHeadline">{headline(statusValue, isLive, issues.length)}</strong>
      <div className="statusTiles">
        {tiles.map((tile) => (
          <div
            className={`statusTile ${tile.ok === true ? "isOk" : tile.ok === false ? "isBad" : ""}`}
            key={tile.label}
          >
            <strong>{isLive ? tile.value : "—"}</strong>
            <span>{tile.label}</span>
          </div>
        ))}
      </div>
      {isLive && issues.length > 0 && (
        <ul className="statusIssues">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

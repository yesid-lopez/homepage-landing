"use client";

import { useEffect, useMemo, useState } from "react";

type BackupSummary = {
  status?: "ok" | "stale" | "unknown" | string;
  lastSuccessAt?: string | null;
};

type PlatformStatus = {
  status?: "operational" | "degraded" | "incident" | "unknown" | string;
  nodes?: number | null;
  nodeCount?: number | null;
  workloads?: number | null;
  gitops?: string;
  backups?: BackupSummary;
  alerts?: number | null;
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

function ensureFetch() {
  if (fetchStarted) return;
  const endpoint = process.env.NEXT_PUBLIC_STATUS_API_URL;
  if (!endpoint) return;
  fetchStarted = true;

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
      snapshot = { status: fallbackStatus, isLive: false };
      notify();
    });
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

export function PlatformStatusTerminal() {
  const { status, isLive } = usePlatformStatus();
  const statusValue = (status.status || "unknown").toLowerCase();
  const variantClass = statusVariant(statusValue);
  const nodes = nodesDisplay(status, isLive);
  const workloads = isLive ? numberOrDash(status.workloads) : "—";
  const gitops = isLive ? status.gitops || "—" : "pending";
  const backupState = isLive ? status.backups?.status : null;
  const backupShort = formatRelative(status.backups?.lastSuccessAt)?.replace(/ ago$/, "") ?? null;
  const updated = formatRelative(status.updatedAt);
  const alerts = isLive && typeof status.alerts === "number" ? `${status.alerts} alerts` : null;

  const line1 = joinSegments([isLive ? statusValue : "pending", alerts]);
  const line2 = joinSegments([nodes, `workloads: ${workloads}`]);
  const backupSegment = backupState ? [backupState, backupShort].filter(Boolean).join(" ") : null;
  const line3 = joinSegments([gitops, backupSegment && `backups: ${backupSegment}`, isLive ? updated : null]);

  return (
    <div className="terminalCard">
      <div className={`terminalHeader ${variantClass}`}>
        <span /> status
      </div>
      <code>
        <b>status</b>: {line1}{"\n"}
        <b>nodes</b>: {line2}{"\n"}
        <b>gitops</b>: {line3}
      </code>
    </div>
  );
}

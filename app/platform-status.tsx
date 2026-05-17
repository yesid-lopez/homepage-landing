"use client";

import { useEffect, useMemo, useState } from "react";

type PlatformStatus = {
  status?: "operational" | "degraded" | "unknown" | string;
  nodes?: number;
  workloads?: number;
  gitops?: string;
  alerts?: number;
  updatedAt?: string;
};

const fallbackStatus: Required<PlatformStatus> = {
  status: "unknown",
  nodes: 0,
  workloads: 0,
  gitops: "pending endpoint",
  alerts: 0,
  updatedAt: "",
};

function formatStatusLabel(status: string) {
  return status
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatUpdatedAt(value?: string) {
  if (!value) return "Awaiting live endpoint";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Awaiting live endpoint";

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function PlatformStatusCard() {
  const [status, setStatus] = useState<Required<PlatformStatus>>(fallbackStatus);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_STATUS_API_URL;
    if (!endpoint) return;

    const statusEndpoint = endpoint;
    const controller = new AbortController();

    async function loadStatus() {
      try {
        const response = await fetch(statusEndpoint, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`Status API returned ${response.status}`);

        const data = (await response.json()) as PlatformStatus;
        setStatus({
          status: data.status || fallbackStatus.status,
          nodes: typeof data.nodes === "number" ? data.nodes : fallbackStatus.nodes,
          workloads: typeof data.workloads === "number" ? data.workloads : fallbackStatus.workloads,
          gitops: data.gitops || fallbackStatus.gitops,
          alerts: typeof data.alerts === "number" ? data.alerts : fallbackStatus.alerts,
          updatedAt: data.updatedAt || fallbackStatus.updatedAt,
        });
        setIsLive(true);
      } catch (error) {
        if (!controller.signal.aborted) {
          setStatus(fallbackStatus);
          setIsLive(false);
        }
      }
    }

    loadStatus();

    return () => controller.abort();
  }, []);

  const statusClass = useMemo(() => {
    const normalized = status.status.toLowerCase();
    if (normalized === "operational") return "isOperational";
    if (normalized === "degraded") return "isDegraded";
    return "isUnknown";
  }, [status.status]);

  const metrics = [
    ["Nodes", isLive ? String(status.nodes) : "—"],
    ["Workloads", isLive ? String(status.workloads) : "—"],
    ["GitOps", status.gitops],
    ["Alerts", isLive ? String(status.alerts) : "—"],
  ];

  return (
    <article className="platformStatusCard" aria-label="Live platform status summary">
      <div className="platformStatusHeader">
        <div>
          <span>Live platform status</span>
          <h3>{isLive ? "Cluster summary" : "Endpoint ready"}</h3>
        </div>
        <strong className={`statusBadge ${statusClass}`}>
          <i /> {formatStatusLabel(status.status)}
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
          ? `Last updated ${formatUpdatedAt(status.updatedAt)}. Only high-level, public-safe signals are shown.`
          : "Live metrics will appear here once the public-safe status API is deployed."}
      </p>
    </article>
  );
}

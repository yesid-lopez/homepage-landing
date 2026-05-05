"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string>) => void;
    };
  }
}

const trackedSections = [
  { id: "architecture", event: "Viewed architecture section" },
  { id: "gitops", event: "Viewed GitOps section" },
  { id: "controllers", event: "Viewed platform capabilities section" },
  { id: "networking", event: "Viewed external access section" },
  { id: "apps", event: "Viewed workloads section" },
  { id: "observability", event: "Viewed observability section" },
  { id: "security", event: "Viewed security section" },
  { id: "validation", event: "Viewed validation section" },
];

function getViewEventData(element: HTMLElement) {
  return Object.fromEntries(
    Object.entries(element.dataset)
      .filter(([key]) => key.startsWith("umamiView") && key !== "umamiView")
      .map(([key, value]) => [key.replace(/^umamiView/, "").toLowerCase(), value ?? ""]),
  );
}

export function UmamiSectionTracker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target as HTMLElement;
          const eventName = element.dataset.umamiView;
          const section = trackedSections.find((item) => item.id === element.id);
          const key = eventName ? `view:${eventName}:${element.textContent?.trim().slice(0, 64)}` : `section:${element.id}`;

          if (seen.has(key)) {
            return;
          }

          seen.add(key);

          if (eventName) {
            window.umami?.track(eventName, getViewEventData(element));
          } else if (section) {
            window.umami?.track(section.event, { section: section.id });
          }

          observer.unobserve(element);
        });
      },
      { threshold: 0.45 },
    );

    trackedSections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    document.querySelectorAll<HTMLElement>("[data-umami-view]").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

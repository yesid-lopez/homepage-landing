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
  { id: "architecture", event: "Section: Architecture" },
  { id: "gitops", event: "Section: GitOps" },
  { id: "controllers", event: "Section: Controllers" },
  { id: "networking", event: "Section: External access" },
  { id: "apps", event: "Section: Workloads" },
  { id: "observability", event: "Section: Observability" },
  { id: "security", event: "Section: Security" },
  { id: "validation", event: "Section: Validation" },
];

const scrollMilestones = [25, 50, 75, 100];
const sectionDwellTimeMs = 900;

export function UmamiSectionTracker() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const trackedScrollMilestones = new Set<number>();

    function trackScrollDepth() {
      const documentElement = document.documentElement;
      const scrollableHeight = documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        return;
      }

      const scrollDepth = Math.min(100, Math.round(((window.scrollY + window.innerHeight) / documentElement.scrollHeight) * 100));

      scrollMilestones.forEach((milestone) => {
        if (scrollDepth >= milestone && !trackedScrollMilestones.has(milestone)) {
          trackedScrollMilestones.add(milestone);
          window.umami?.track(`Scroll: ${milestone}%`, { milestone: String(milestone) });
        }
      });
    }

    window.addEventListener("scroll", trackScrollDepth, { passive: true });
    window.addEventListener("resize", trackScrollDepth);
    trackScrollDepth();

    if (!("IntersectionObserver" in window)) {
      return () => {
        window.removeEventListener("scroll", trackScrollDepth);
        window.removeEventListener("resize", trackScrollDepth);
      };
    }

    const seenSections = new Set<string>();
    const dwellTimers = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const section = trackedSections.find((item) => item.id === element.id);

          if (!section || seenSections.has(section.id)) {
            return;
          }

          if (!entry.isIntersecting) {
            const timer = dwellTimers.get(section.id);

            if (timer) {
              window.clearTimeout(timer);
              dwellTimers.delete(section.id);
            }

            return;
          }

          if (dwellTimers.has(section.id)) {
            return;
          }

          const timer = window.setTimeout(() => {
            seenSections.add(section.id);
            dwellTimers.delete(section.id);
            window.umami?.track(section.event, { section: section.id });
            observer.unobserve(element);
          }, sectionDwellTimeMs);

          dwellTimers.set(section.id, timer);
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

    return () => {
      window.removeEventListener("scroll", trackScrollDepth);
      window.removeEventListener("resize", trackScrollDepth);
      dwellTimers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, []);

  return null;
}

import { UmamiSectionTracker } from "./umami-section-tracker";

const highlights = [
  { label: "Platform", value: "Kubernetes" },
  { label: "Delivery", value: "GitOps" },
  { label: "Security", value: "Sealed secrets" },
  { label: "Signals", value: "Operational feedback" },
];

const platformStats = [
  ["Platform lab", "Runtime for applications, workflows, and experimentation."],
  ["Declarative", "Infrastructure and workloads are managed as reviewed code."],
  ["Observable", "Operational signals support maintenance and reliability."],
];

const architectureCards = [
  {
    icon: "◈",
    name: "Compute fabric",
    role: "Cluster foundation",
    details: [
      "Compact machines provide the container runtime layer.",
      "Workloads are scheduled by Kubernetes with a maintainable topology.",
      "Capacity planning keeps the cluster balanced for lab workloads.",
    ],
  },
  {
    icon: "⌁",
    name: "Secure edge",
    role: "Controlled access layer",
    details: [
      "Services that require external access pass through a controlled access layer.",
      "Routing rules separate public entry points from internal services.",
      "The edge layer keeps ingress, certificates, and routing manageable.",
    ],
  },
  {
    icon: "◎",
    name: "State layer",
    role: "Persistent workloads",
    details: [
      "Applications that need data use persistent volumes.",
      "Storage is declared and maintained with the rest of the platform.",
      "Data services are treated as first-class platform components.",
    ],
  },
];

const controllers = [
  ["GitOps controller", "Reconciles desired state from the repository."],
  ["Secret encryption", "Keeps sensitive values encrypted before commit."],
  ["Access automation", "Supports secure external-access workflows."],
  ["Traffic management", "Controls how approved services are reached."],
  ["Storage controller", "Provides persistent volumes for stateful workloads."],
  ["Database operator", "Manages application databases declaratively."],
  ["Operational telemetry", "Collects health and reliability signals."],
  ["Upgrade automation", "Helps keep platform components maintained."],
];

const apps = [
  {
    name: "Experimentation workloads",
    purpose: "A runtime for testing services, workflows, and technical ideas.",
    details: [
      "Designed like a compact platform engineering lab.",
      "Useful for testing deployment, monitoring, and reliability patterns.",
      "Configuration is managed through the same GitOps workflow.",
    ],
  },
  {
    name: "Application workloads",
    purpose: "Custom applications deployed through the same GitOps platform.",
    details: [
      "Built and released through a repeatable delivery workflow.",
      "Managed with environment-specific Kubernetes manifests.",
      "Versioned images and manifests move together through review.",
    ],
  },
  {
    name: "Telemetry workflows",
    purpose: "Insight workflows for owned projects and operations.",
    details: [
      "Combines application signals with platform-level operational feedback.",
      "Supports reporting, debugging, and operational awareness.",
      "Dashboards turn telemetry into practical maintenance context.",
    ],
  },
  {
    name: "Automation services",
    purpose: "Services for delivery, maintenance, and support workflows.",
    details: [
      "Includes supporting APIs and utility services.",
      "Access is limited to the required network paths.",
      "Implementation choices stay aligned with the platform operating model.",
    ],
  },
];

const gitopsFlow = [
  ["01", "Design", "Change is modeled as code."],
  ["02", "Validate", "Automation checks manifests before deployment."],
  ["03", "Reconcile", "GitOps applies the approved desired state."],
  ["04", "Observe", "Metrics, logs, and alerts close the feedback loop."],
];

const securityPractices = [
  "No plaintext secrets in Git",
  "Selected services exposed through a controlled edge",
  "Configuration changes reviewed before deployment",
  "Operational signals for reliability awareness",
];

const validation = ["YAML linting", "Kubernetes schema checks", "Manifest build checks", "Pull request validation"];

const navItems = [
  ["Architecture", "#architecture"],
  ["GitOps", "#gitops"],
  ["Workloads", "#apps"],
  ["Security", "#security"],
];

function Section({
  id,
  eyebrow,
  title,
  featured = false,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  featured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`section reveal${featured ? " featuredSection" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function NeuralArchitecture() {
  return (
    <div className="neuralVisual" aria-label="Animated platform architecture overview">
      <div className="meshLine meshLineA" />
      <div className="meshLine meshLineB" />
      <div className="meshLine meshLineC" />
      <div className="neuron n1" />
      <div className="neuron n2" />
      <div className="neuron n3" />
      <div className="neuron n4" />
      <div className="neuron n5" />
      <div className="signal s1" />
      <div className="signal s2" />
      <div className="signal s3" />

      <div className="visualTopbar">
        <span>Platform lab view</span>
        <div><i /><i /><i /></div>
      </div>

      <div className="brainCore">
        <span className="brainRing ringOne" />
        <span className="brainRing ringTwo" />
        <div className="brainChip">
          <small>Platform Lab</small>
          <strong>K8s</strong>
        </div>
      </div>

      <div className="orbitCard orbitCardOne">
        <span>Edge</span>
        <strong>Controlled access layer</strong>
      </div>
      <div className="orbitCard orbitCardTwo">
        <span>Delivery</span>
        <strong>GitOps</strong>
      </div>
      <div className="orbitCard orbitCardThree">
        <span>Data</span>
        <strong>Volumes</strong>
      </div>
      <div className="orbitCard orbitCardFour">
        <span>Signals</span>
        <strong>Observability</strong>
      </div>

      <div className="terminalCard">
        <div className="terminalHeader"><span /> platform status</div>
        <code>
          <b>desired_state</b>: reconciled{"\n"}
          <b>secrets</b>: encrypted{"\n"}
          <b>edge_policy</b>: controlled
        </code>
      </div>
    </div>
  );
}

function ArchitectureSystemMap() {
  const workloads = ["Experiments", "Apps", "Metrics", "Automation"];
  const platform = ["GitOps", "Secrets", "Access", "Storage", "Signals", "Data ops"];

  return (
    <div className="systemMap" aria-label="Visual architecture map of the platform lab">
      <div className="mapGlow mapGlowOne" />
      <div className="mapGlow mapGlowTwo" />
      <div className="mapSignal mapSignalOne" />
      <div className="mapSignal mapSignalTwo" />
      <div className="mapSignal mapSignalThree" />

      <div className="mapHeader">
        <div>
          <span>Platform architecture</span>
          <strong>Sources → Edge / GitOps → Kubernetes → Workloads</strong>
        </div>
        <p>GitOps, access, storage, and signals working together</p>
      </div>

      <div className="mapCanvas">
        <div className="mapColumn outsideZone">
          <div className="zoneLabel">Sources</div>
          <div className="mapNode externalNode">
            <span>Internet traffic</span>
            <strong>Requests</strong>
          </div>
          <div className="mapNode repoNode">
            <span>GitHub source</span>
            <strong>Desired state</strong>
          </div>
        </div>

        <div className="mapConnector connectorA" />

        <div className="mapColumn edgeZone">
          <div className="zoneLabel">Secure edge</div>
          <div className="edgeStack">
            <div className="mapNode edgeNode primary">
              <span>Ingress</span>
              <strong>Controlled routing</strong>
            </div>
            <div className="miniPill">Access controls</div>
            <div className="miniPill">Route policies</div>
          </div>
        </div>

        <div className="mapConnector connectorB" />

        <div className="clusterZone">
          <div className="zoneLabel">Kubernetes platform</div>
          <div className="clusterShell">
            <div className="controlRing">
              <div className="controlCore">
                <span>K8s</span>
                <strong>Control plane</strong>
              </div>
            </div>

            <div className="platformGrid">
              {platform.map((item) => (
                <div className="platformTile" key={item}>{item}</div>
              ))}
            </div>

            <div className="workloadShelf">
              {workloads.map((item) => (
                <div className="workloadPod" key={item}>
                  <i />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mapConnector connectorC" />

        <div className="mapColumn dataZone">
          <div className="zoneLabel">State + signals</div>
          <div className="mapNode dataNode">
            <span>Volumes</span>
            <strong>Persistent data</strong>
          </div>
          <div className="mapNode observeNode">
            <span>Observability</span>
            <strong>Operational feedback</strong>
          </div>
        </div>
      </div>

      <div className="mapLegend">
        <span><i className="legendPublic" /> Public entry</span>
        <span><i className="legendPrivate" /> Platform core</span>
        <span><i className="legendData" /> State and signals</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <UmamiSectionTracker />
      <nav className="topNav" aria-label="Page navigation">
        <a
          className="brand"
          href="#top"
          data-umami-event="Nav: Brand"
          data-umami-event-target="top"
        >
          <span>YL</span> Platform Lab
        </a>
        <div>
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              data-umami-event="Nav: Main"
              data-umami-event-target={label}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="top" className="hero">
        <div className="heroGrid">
          <div className="heroCopy reveal">
            <p className="eyebrow">AI engineering · Kubernetes · GitOps</p>
            <h1><span>Platform</span> lab</h1>
            <p className="lead">
              A polished, security-conscious view of my private Kubernetes platform lab — built like a compact platform for
              application workloads, experimentation, automation, operational feedback, and production-style GitOps delivery.
              The public page keeps sensitive operational details out of scope so the story can focus on the engineering model.
            </p>
            <div className="actions">
              <a
                href="https://github.com/yesid-lopez/homepage-landing"
                data-umami-event="CTA: Repository"
                data-umami-event-location="hero"
              >
                Explore repository
              </a>
              <a
                href="#architecture"
                className="secondary"
                data-umami-event="CTA: Architecture"
                data-umami-event-location="hero"
              >
                View architecture
              </a>
            </div>
            <div className="heroStats" aria-label="Platform highlights">
              {highlights.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <NeuralArchitecture />
        </div>
      </section>

      <section
        className="section introBand reveal"
        aria-label="Platform positioning"
      >
        {platformStats.map(([title, description]) => (
          <article key={title}>
            <span />
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <Section id="architecture" eyebrow="Architecture" title="A Kubernetes lab with an engineering aesthetic" featured>
        <p>
          This Kubernetes platform is built for learning, operating, and deploying real services. The design shows how
          compute, access, storage, delivery, and feedback loops work together as a compact engineering system.
        </p>
        <ArchitectureSystemMap />
        <div className="grid three">
          {architectureCards.map((item) => (
            <article
              className="card featureCard"
              key={item.name}
            >
              <div className="cardIcon">{item.icon}</div>
              <p className="tag">{item.role}</p>
              <h3>{item.name}</h3>
              <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            </article>
          ))}
        </div>
      </Section>

      <Section id="gitops" eyebrow="GitOps mindset" title="The operating model looks like a production delivery loop">
        <div className="pipeline">
          {gitopsFlow.map(([step, title, description]) => (
            <article
              key={step}
            >
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <div className="note statusNote">
          Repository changes become reviewed infrastructure changes. Pull requests, validation, and reconciliation make
          the platform workflow traceable from intent to runtime state.
        </div>
      </Section>

      <Section id="controllers" eyebrow="Platform capabilities" title="Core services presented as clean building blocks">
        <div className="grid two capabilityGrid">
          {controllers.map(([name, description]) => (
            <article
              className="card compact capabilityCard"
              key={name}
            >
              <span />
              <h3>{name}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="networking" eyebrow="External access" title="Controlled external access for services that need to be reached">
        <p>
          The platform uses a controlled access layer for services that require external reachability. Routing,
          certificates, and access policy are treated as part of the platform rather than ad-hoc service setup.
        </p>
        <ul className="chips tagChips" aria-label="External access capabilities">
          <li>Controlled routing</li>
          <li>Secure access patterns</li>
          <li>Certificate automation</li>
          <li>Route policies</li>
        </ul>
      </Section>

      <Section id="apps" eyebrow="Workloads" title="Applications, telemetry workflows, automation, and experimentation share one runtime">
        <div className="appList">
          {apps.map((app) => (
            <article
              className="appCard"
              key={app.name}
            >
              <div>
                <p className="tag">Workload class</p>
                <h3>{app.name}</h3>
                <p>{app.purpose}</p>
              </div>
              <ul>{app.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            </article>
          ))}
        </div>
      </Section>

      <Section id="observability" eyebrow="Observability" title="Operational signals support a platform-style workflow">
        <div className="dashboardGrid">
          <article
            className="signalPanel large"
          >
            <span>Telemetry</span>
            <h3>Health signals and feedback loops</h3>
            <div className="bars"><i /><i /><i /><i /><i /></div>
          </article>
          <article
            className="signalPanel"
          >
            <span>Feedback loop</span>
            <h3>Detect issues quickly</h3>
            <p>Signals help understand workload health and guide operational decisions.</p>
          </article>
          <article
            className="signalPanel"
          >
            <span>Operations</span>
            <h3>Traceable changes</h3>
            <p>Commits and pull requests document what changed and why.</p>
          </article>
        </div>
      </Section>

      <Section id="security" eyebrow="Security" title="Public presentation with careful operational boundaries">
        <p>
          The public version keeps credentials, internal network details, hostnames, and environment-specific values out of
          scope while still showing the engineering story and platform operating model.
        </p>
        <div className="securityGrid">
          {securityPractices.map((item) => (
            <article
              className="securityCard"
              key={item}
            >
              <span>✓</span>
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </Section>

      <Section id="validation" eyebrow="Quality gates" title="Validation keeps changes consistent before deployment">
        <ul className="chips tagChips" aria-label="Validation checks">
          {validation.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p>
          Automated checks reduce the risk of broken manifests reaching the platform and keep the GitOps workflow tidy.
        </p>
      </Section>

      <footer>
        <div>
          <p>Built with Next.js as a public overview of a GitOps platform lab.</p>
          <p className="ownerAttribution">
            Homelab Owner:{" "}
            <a
              href="https://www.yesidlopez.de/"
              data-umami-event="Outbound: Portfolio"
              data-umami-event-location="footer"
            >
              Yesid Lopez
            </a>
          </p>
        </div>
        <a
          href="https://github.com/yesid-lopez/homepage-landing"
          data-umami-event="Outbound: GitHub"
          data-umami-event-location="footer"
        >
          github.com/yesid-lopez/homepage-landing
        </a>
      </footer>
    </main>
  );
}

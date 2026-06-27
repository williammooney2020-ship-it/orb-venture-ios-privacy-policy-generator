// iOS Privacy Policy Generator — client-side only, nothing uploaded.

const SDK_INFO = {
  firebase:   { name: "Firebase / Google Analytics", url: "https://firebase.google.com/support/privacy", collects: ["usage analytics", "crash reports", "device identifiers"] },
  sentry:     { name: "Sentry", url: "https://sentry.io/privacy/", collects: ["crash reports", "device information", "stack traces"] },
  mixpanel:   { name: "Mixpanel", url: "https://mixpanel.com/legal/privacy-policy/", collects: ["usage analytics", "device identifiers", "behavioral data"] },
  amplitude:  { name: "Amplitude", url: "https://amplitude.com/privacy", collects: ["usage analytics", "device identifiers", "behavioral data"] },
  appsflyer:  { name: "AppsFlyer", url: "https://www.appsflyer.com/legal/privacy-policy/", collects: ["device identifiers", "install attribution data", "ad interaction data"] },
  stripe:     { name: "Stripe", url: "https://stripe.com/privacy", collects: ["payment card information", "billing address", "transaction history"] },
  revenueCat: { name: "RevenueCat", url: "https://www.revenuecat.com/privacy", collects: ["purchase history", "device identifiers", "subscription status"] },
  intercom:   { name: "Intercom / Zendesk", url: "https://www.intercom.com/legal/privacy", collects: ["name", "email address", "support conversation history"] },
  openai:     { name: "OpenAI / Anthropic", url: "https://openai.com/policies/privacy-policy", collects: ["user-submitted text prompts and responses"] },
  icloud:     { name: "Apple iCloud / CloudKit", url: "https://www.apple.com/legal/privacy/", collects: ["user data synced across devices via iCloud"] },
};

const DATA_DESCRIPTIONS = {
  account:   "Account information (such as name and email address) provided when you create an account or contact us.",
  device:    "Device identifiers (such as advertising ID or device model) collected to improve the app experience.",
  location:  "Location data (approximate or precise) when you grant location permission, used to provide location-relevant features.",
  usage:     "Usage data and analytics, including how you interact with features, to help us improve the app.",
  health:    "Health and fitness data you choose to log or sync, processed locally or via HealthKit as applicable.",
  purchases: "Purchase history for in-app purchases and subscriptions, used to manage your account and entitlements.",
  contacts:  "Contacts from your address book, only accessed with your explicit permission, used to enable sharing or social features.",
  photos:    "Photos or media from your library, only when you explicitly share or attach them in the app.",
  microphone:"Audio captured via the microphone, used only when you activate voice features within the app.",
  camera:    "Camera access, used only when you choose to take or capture content within the app.",
  search:    "In-app search queries, used to provide search results and improve discoverability.",
  browsing:  "In-app browsing history within the app's web views, not shared with third parties.",
};

function getChecked(prefix) {
  return Array.from(document.querySelectorAll(`input[id^="${prefix}"]:checked`)).map(el => el.value);
}

function val(id) { return (document.getElementById(id)?.value || "").trim(); }

function generatePolicy() {
  const appName = val("appName") || "this App";
  const devName = val("devName") || "the developer";
  const email = val("email") || "privacy@example.com";
  const website = val("website") || "";
  const effectiveDate = val("effectiveDate") || new Date().toLocaleDateString("en-US", {year:"numeric",month:"long",day:"numeric"});
  const collectsData = val("collectsData") === "yes";
  const dataTypes = collectsData ? getChecked("d_") : [];
  const sdks = getChecked("s_");
  const includeGDPR = val("gdpr") === "yes";
  const includeCCPA = val("ccpa") === "yes";

  const lines = [];

  lines.push(`Privacy Policy for ${appName}`);
  lines.push(`Effective Date: ${effectiveDate}`);
  lines.push("");
  lines.push(`This Privacy Policy describes how ${devName} ("we", "us", or "our") handles information in connection with ${appName} (the "App").`);
  lines.push("");

  // --- Information We Collect ---
  lines.push("1. Information We Collect");
  lines.push("");
  if (!collectsData && sdks.length === 0) {
    lines.push(`${appName} does not collect, store, or transmit any personal information. The App functions entirely on your device.`);
  } else {
    if (collectsData && dataTypes.length > 0) {
      lines.push("We may collect the following types of information:");
      lines.push("");
      dataTypes.forEach(t => {
        lines.push(`• ${DATA_DESCRIPTIONS[t] || t}`);
      });
      lines.push("");
    }
    if (sdks.length > 0) {
      lines.push("In addition, the App uses third-party services that may collect information independently. Please review their privacy policies:");
      lines.push("");
      sdks.forEach(s => {
        const info = SDK_INFO[s];
        if (info) {
          lines.push(`• ${info.name} — collects: ${info.collects.join(", ")}. Policy: ${info.url}`);
        }
      });
    }
  }
  lines.push("");

  // --- How We Use ---
  if (collectsData || sdks.length > 0) {
    lines.push("2. How We Use Information");
    lines.push("");
    lines.push("We use the information we collect to:");
    lines.push("• Provide, maintain, and improve the App's features and functionality");
    lines.push("• Respond to your support requests and communications");
    if (dataTypes.includes("usage")) lines.push("• Understand how users interact with the App and make improvements");
    if (dataTypes.includes("purchases") || sdks.includes("stripe") || sdks.includes("revenueCat"))
      lines.push("• Process purchases, subscriptions, and manage your account entitlements");
    lines.push("• Comply with legal obligations");
    lines.push("");

    // --- Sharing ---
    lines.push("3. How We Share Information");
    lines.push("");
    if (sdks.length > 0) {
      lines.push(`We do not sell your personal information. We share information only with third-party service providers that help us operate the App (listed in Section 1), and only as necessary to provide those services. These providers are contractually obligated to protect your information.`);
    } else {
      lines.push("We do not sell, trade, or rent your personal information to third parties. We do not share your data with advertisers.");
    }
    lines.push("");
  }

  // --- Data Retention ---
  const sectionNum = (collectsData || sdks.length > 0) ? 4 : 2;
  lines.push(`${sectionNum}. Data Retention`);
  lines.push("");
  if (!collectsData && sdks.length === 0) {
    lines.push("Because the App collects no personal data, there is no data to retain or delete.");
  } else {
    lines.push("We retain personal information only as long as necessary to provide the App's features and fulfil the purposes described in this policy, or as required by law. You may request deletion of your data at any time by contacting us.");
  }
  lines.push("");

  // --- Your Rights ---
  const sectionGDPR = sectionNum + 1;
  if (includeGDPR) {
    lines.push(`${sectionGDPR}. Your Rights (GDPR — EU / UK)`);
    lines.push("");
    lines.push("If you are located in the European Economic Area, United Kingdom, or Switzerland, you have the following rights regarding your personal data:");
    lines.push("• Right of access — request a copy of the data we hold about you");
    lines.push("• Right to rectification — request correction of inaccurate data");
    lines.push("• Right to erasure — request deletion of your personal data");
    lines.push("• Right to restriction — request that we restrict processing of your data");
    lines.push("• Right to portability — request a machine-readable copy of your data");
    lines.push("• Right to object — object to processing based on legitimate interests");
    lines.push("");
    lines.push(`To exercise any of these rights, contact us at ${email}.`);
    lines.push("");
  }

  const sectionCCPA = includeGDPR ? sectionGDPR + 1 : sectionNum + 1;
  if (includeCCPA) {
    lines.push(`${sectionCCPA}. Your Rights (CCPA — California)`);
    lines.push("");
    lines.push("If you are a California resident, you have the right to:");
    lines.push("• Know what personal information we collect and how it is used");
    lines.push("• Request deletion of your personal information");
    lines.push("• Opt out of the sale of your personal information (we do not sell personal information)");
    lines.push("• Non-discrimination for exercising your privacy rights");
    lines.push("");
    lines.push(`To submit a CCPA request, contact us at ${email}.`);
    lines.push("");
  }

  // --- Children ---
  const sectionChildren = (includeCCPA ? sectionCCPA : (includeGDPR ? sectionGDPR : sectionNum)) + 1;
  lines.push(`${sectionChildren}. Children's Privacy`);
  lines.push("");
  lines.push(`${appName} is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected information from a child, please contact us immediately so we can delete it.`);
  lines.push("");

  // --- Changes ---
  const sectionChanges = sectionChildren + 1;
  lines.push(`${sectionChanges}. Changes to This Policy`);
  lines.push("");
  lines.push("We may update this Privacy Policy from time to time. When we do, we will update the Effective Date at the top of this page. Continued use of the App after changes constitutes your acceptance of the revised policy.");
  lines.push("");

  // --- Contact ---
  const sectionContact = sectionChanges + 1;
  lines.push(`${sectionContact}. Contact Us`);
  lines.push("");
  lines.push(`If you have questions or requests regarding this Privacy Policy, please contact us:`);
  lines.push(`${devName}`);
  lines.push(`Email: ${email}`);
  if (website) lines.push(`Website: ${website}`);
  lines.push("");
  lines.push("---");
  lines.push(`Generated by Orb Intelligence iOS Privacy Policy Generator — https://ios-privacy-policy-generator.vercel.app/`);

  const policy = lines.join("\n");
  const box = document.getElementById("policyBox");
  box.value = policy;
  const output = document.getElementById("output");
  output.classList.add("visible");
  output.scrollIntoView({ behavior: "smooth", block: "start" });
}

function copyPolicy() {
  const text = document.getElementById("policyBox").value;
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const orig = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => { btn.textContent = orig; }, 1800);
  }).catch(() => {
    document.getElementById("policyBox").select();
    document.execCommand("copy");
  });
}

function downloadPolicy() {
  const text = document.getElementById("policyBox").value;
  const appName = (document.getElementById("appName")?.value || "app").replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${appName}-privacy-policy.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}

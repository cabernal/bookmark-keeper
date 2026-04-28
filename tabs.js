const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base"
});

const groupColors = [
  "grey",
  "blue",
  "red",
  "yellow",
  "green",
  "pink",
  "purple",
  "cyan",
  "orange"
];

export async function sortTabsInCurrentWindow() {
  const tabs = await getTabsForFocusedWindow();
  const pinnedTabs = tabs.filter((tab) => tab.pinned);
  const sortableTabs = tabs.filter((tab) => !tab.pinned);

  if (sortableTabs.length < 2) {
    return {
      movedCount: 0,
      pinnedCount: pinnedTabs.length,
      sortableCount: sortableTabs.length
    };
  }

  const sortedTabs = [...sortableTabs].sort(compareTabs);
  const alreadySorted = sortedTabs.every((tab, index) => {
    return tab.id === sortableTabs[index].id;
  });

  if (!alreadySorted) {
    await chrome.tabs.move(
      sortedTabs.map((tab) => tab.id),
      { index: pinnedTabs.length }
    );
  }

  return {
    movedCount: alreadySorted ? 0 : sortedTabs.length,
    pinnedCount: pinnedTabs.length,
    sortableCount: sortableTabs.length
  };
}

export async function groupTabsInCurrentWindow() {
  const tabs = await getTabsForFocusedWindow();
  const pinnedTabs = tabs.filter((tab) => tab.pinned);
  const groupableTabs = tabs.filter((tab) => !tab.pinned && Number.isInteger(tab.id));
  const tabsByDomain = groupTabsByDomain(groupableTabs);
  const domainGroups = [...tabsByDomain.entries()]
    .filter(([, domainTabs]) => domainTabs.length > 1)
    .sort(([leftDomain], [rightDomain]) => collator.compare(leftDomain, rightDomain));

  for (const [domain, domainTabs] of domainGroups) {
    const groupId = await chrome.tabs.group({
      tabIds: domainTabs.map((tab) => tab.id)
    });

    await chrome.tabGroups.update(groupId, {
      title: domain,
      color: colorForDomain(domain)
    });
  }

  return {
    groupedDomainCount: domainGroups.length,
    groupedTabCount: domainGroups.reduce((total, [, domainTabs]) => {
      return total + domainTabs.length;
    }, 0),
    pinnedCount: pinnedTabs.length,
    groupableCount: groupableTabs.length
  };
}

export function domainKeyForTab(tab) {
  const rawUrl = tab.url || tab.pendingUrl || "";

  try {
    const parsedUrl = new URL(rawUrl);
    const host = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");

    if (host) {
      return host;
    }

    return parsedUrl.protocol.replace(/:$/, "") || "unknown";
  } catch {
    return "unknown";
  }
}

async function getTabsForFocusedWindow() {
  const focusedWindow = await chrome.windows.getLastFocused({
    windowTypes: ["normal"]
  });

  if (focusedWindow?.id !== undefined) {
    return chrome.tabs.query({ windowId: focusedWindow.id });
  }

  return chrome.tabs.query({ currentWindow: true });
}

function compareTabs(left, right) {
  return (
    collator.compare(domainKeyForTab(left), domainKeyForTab(right)) ||
    collator.compare(left.title || "", right.title || "") ||
    collator.compare(left.url || "", right.url || "") ||
    left.index - right.index
  );
}

function groupTabsByDomain(tabs) {
  const tabsByDomain = new Map();

  for (const tab of tabs) {
    const domain = domainKeyForTab(tab);
    const domainTabs = tabsByDomain.get(domain) || [];
    domainTabs.push(tab);
    tabsByDomain.set(domain, domainTabs);
  }

  return tabsByDomain;
}

function colorForDomain(domain) {
  let hash = 0;

  for (const character of domain) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return groupColors[hash % groupColors.length];
}

import {
  groupTabsInCurrentWindow,
  groupUngroupedTabsInCurrentWindow,
  sortTabsInCurrentWindow,
  ungroupTabsInCurrentWindow
} from "./tabs.js";

chrome.commands.onCommand.addListener((command) => {
  if (command === "sort-by-domain") {
    sortTabsInCurrentWindow().catch((error) => {
      console.error("Failed to sort tabs by domain", error);
    });
  }

  if (command === "group-by-domain") {
    groupTabsInCurrentWindow().catch((error) => {
      console.error("Failed to group tabs by domain", error);
    });
  }

  if (command === "group-ungrouped-tabs") {
    groupUngroupedTabsInCurrentWindow().catch((error) => {
      console.error("Failed to group ungrouped tabs", error);
    });
  }

  if (command === "ungroup-tabs") {
    ungroupTabsInCurrentWindow().catch((error) => {
      console.error("Failed to ungroup tabs", error);
    });
  }
});

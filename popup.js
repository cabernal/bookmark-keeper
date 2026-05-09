import {
  groupTabsInCurrentWindow,
  groupUngroupedTabsInCurrentWindow,
  sortTabsInCurrentWindow,
  ungroupTabsInCurrentWindow
} from "./tabs.js";

const sortButton = document.querySelector("#sortButton");
const groupButton = document.querySelector("#groupButton");
const miscGroupButton = document.querySelector("#miscGroupButton");
const ungroupButton = document.querySelector("#ungroupButton");
const status = document.querySelector("#status");

sortButton.addEventListener("click", async () => {
  setButtonsDisabled(true);
  setStatus("Sorting...");

  try {
    const result = await sortTabsInCurrentWindow();
    const pinnedMessage = result.pinnedCount
      ? ` ${result.pinnedCount} pinned tab${plural(result.pinnedCount)} left at the front.`
      : "";

    if (result.movedCount === 0) {
      setStatus(`Tabs are already sorted.${pinnedMessage}`);
    } else {
      setStatus(`Sorted ${result.movedCount} tab${plural(result.movedCount)}.${pinnedMessage}`);
    }
  } catch (error) {
    console.error(error);
    setStatus("Chrome could not sort this window.", true);
  } finally {
    setButtonsDisabled(false);
  }
});

groupButton.addEventListener("click", async () => {
  setButtonsDisabled(true);
  setStatus("Grouping...");

  try {
    const result = await groupTabsInCurrentWindow();
    const pinnedMessage = result.pinnedCount
      ? ` ${result.pinnedCount} pinned tab${plural(result.pinnedCount)} skipped.`
      : "";
    const movedMessage = result.ungroupedMovedCount
      ? ` Moved ${result.ungroupedMovedCount} ungrouped tab${plural(result.ungroupedMovedCount)} to the end.`
      : "";

    if (result.groupedDomainCount === 0) {
      setStatus(`No domains with multiple tabs to group.${movedMessage}${pinnedMessage}`);
    } else {
      setStatus(
        `Grouped ${result.groupedTabCount} tab${plural(result.groupedTabCount)} across ${result.groupedDomainCount} domain${plural(result.groupedDomainCount)}.${movedMessage}${pinnedMessage}`
      );
    }
  } catch (error) {
    console.error(error);
    setStatus("Chrome could not group this window.", true);
  } finally {
    setButtonsDisabled(false);
  }
});

miscGroupButton.addEventListener("click", async () => {
  setButtonsDisabled(true);
  setStatus("Grouping ungrouped tabs...");

  try {
    const result = await groupUngroupedTabsInCurrentWindow();
    const pinnedMessage = result.pinnedCount
      ? ` ${result.pinnedCount} pinned tab${plural(result.pinnedCount)} skipped.`
      : "";

    if (result.groupedTabCount === 0) {
      setStatus(`No ungrouped tabs to group.${pinnedMessage}`);
    } else {
      setStatus(`Grouped ${result.groupedTabCount} ungrouped tab${plural(result.groupedTabCount)} into misc.${pinnedMessage}`);
    }
  } catch (error) {
    console.error(error);
    setStatus("Chrome could not group ungrouped tabs.", true);
  } finally {
    setButtonsDisabled(false);
  }
});

ungroupButton.addEventListener("click", async () => {
  setButtonsDisabled(true);
  setStatus("Ungrouping...");

  try {
    const result = await ungroupTabsInCurrentWindow();

    if (result.ungroupedTabCount === 0) {
      setStatus("No grouped tabs in this window.");
    } else {
      setStatus(`Ungrouped ${result.ungroupedTabCount} tab${plural(result.ungroupedTabCount)}.`);
    }
  } catch (error) {
    console.error(error);
    setStatus("Chrome could not ungroup this window.", true);
  } finally {
    setButtonsDisabled(false);
  }
});

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function plural(count) {
  return count === 1 ? "" : "s";
}

function setButtonsDisabled(isDisabled) {
  sortButton.disabled = isDisabled;
  groupButton.disabled = isDisabled;
  miscGroupButton.disabled = isDisabled;
  ungroupButton.disabled = isDisabled;
}

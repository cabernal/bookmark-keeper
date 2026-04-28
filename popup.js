import { groupTabsInCurrentWindow, sortTabsInCurrentWindow } from "./tabs.js";

const sortButton = document.querySelector("#sortButton");
const groupButton = document.querySelector("#groupButton");
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

    if (result.groupedDomainCount === 0) {
      setStatus(`No domains with multiple tabs to group.${pinnedMessage}`);
    } else {
      setStatus(
        `Grouped ${result.groupedTabCount} tab${plural(result.groupedTabCount)} across ${result.groupedDomainCount} domain${plural(result.groupedDomainCount)}.${pinnedMessage}`
      );
    }
  } catch (error) {
    console.error(error);
    setStatus("Chrome could not group this window.", true);
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
}

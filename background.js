const getActiveUrl = (tabid, changeInfo, tab) => {
  // Only proceed if the URL has changed
  if (!changeInfo.url) return;

  chrome.storage.sync.get(['blockedDomains', 'focusTimes'], function(result) {
    const url = changeInfo.url;

    // url is likely to be empty, and filter chrome:// and about:// URLs
    if (!url || ['chrome://', 'about://'].some(p => url.startsWith(p))) return;

    // filtering is not an active tab
    if (!tab.active) return;
    if (!result.blockedDomains || result.blockedDomains=="" || !result.focusTimes) return;

    // the url address you need
    console.log(url);

    // Check if the current time is within a focus time
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();


    for (let focusTime of result.focusTimes) {
      if (focusTime.startHour <= currentHour && focusTime.startMinute <= currentMinute &&
          focusTime.endHour >= currentHour && focusTime.endMinute >= currentMinute) {
        // Check if the current URL matches a blocked domain
        if (result.blockedDomains.length > 0) {
          for (let domain of result.blockedDomains) {
            if (url.indexOf(domain) !== -1) {
              // Block the request
              chrome.tabs.update(tabid, {url: 'blocked.html'});
              return;
            }
          }
        }
      }
    }
  });
}

chrome.tabs.onUpdated.addListener(getActiveUrl);

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(['blockedDomains', 'focusTimes'], function(result) {
    if (result.blockedDomains) {
      document.getElementById('domains').value = result.blockedDomains.join(',');
    }
    if (result.focusTimes) {
      let times = result.focusTimes.map(function(time) {
        return [time.startHour, time.startMinute, time.endHour, time.endMinute].join(',');
      });
      document.getElementById('times').value = times.join('\n');
    }
  });
});

document.getElementById('save').addEventListener('click', function() {
  const domains = document.getElementById('domains').value.split(',');
  const times = document.getElementById('times').value.split('\n').map(function(time) {
    const parts = time.split(',');
    return {
      startHour: parseInt(parts[0]),
      startMinute: parseInt(parts[1]),
      endHour: parseInt(parts[2]),
      endMinute: parseInt(parts[3])
    };
  });
  chrome.storage.sync.set({blockedDomains: domains, focusTimes: times}, function() {
    alert('Settings saved');
  });
});

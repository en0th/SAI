chrome.runtime.onInstalled.addListener(function() {

  // 点击图标按钮的时候做跳转处理
  chrome.pageAction.onClicked.addListener(() => {
    chrome.tabs.create({
      "url": 'chrome://newtab'
    }, ()=>{})
  })

  // 在所有页面都能使用
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          css: ["*"]
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
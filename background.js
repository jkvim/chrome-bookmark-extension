// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  if (request.type == 'GET_BOOKMARKS') {
    chrome.bookmarks.getTree(function(tree) {
      console.log('tree', tree);
      sendResponse({ bookmarks: tree });
    });
  }
  return true;
});

// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == 'GET_BOOKMARKS') {
    chrome.bookmarks.getTree(function(tree) {
      sendResponse({ bookmarks: tree });
    });
  }
  if (request.type === 'CREATE_BOOKMARK') {
    chrome.bookmarks.create({
      parentId: request.payload.parentId,
      title: request.payload.title,
      url: request.payload.url
    })
    sendResponse({ status: 'OK' });
  }
  return true;
});

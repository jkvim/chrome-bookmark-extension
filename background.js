// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function createBookmark(parentId, title, url, callback) {
  chrome.bookmarks.create({
    parentId: parentId,
    title: title,
    url: url
  }, callback)
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == 'GET_BOOKMARKS') {
    chrome.bookmarks.getTree(function(tree) {
      sendResponse({ bookmarks: tree });
    });
  }
  if (request.type === 'CREATE_BOOKMARK') {
    const { parentId, title, url} = request.payload
    createBookmark(parentId, title, url)
    sendResponse({ status: 'OK' });
  }
  if (request.type === 'CREATE_FOLDER') {
    chrome.bookmarks.create({
      parentId: '1',
      title: request.payload.folderName,
    }, function (newFolder) {
      const { title, url } = request.payload
      createBookmark(newFolder.id, title, url, function () {
        sendResponse({ status: 'OK' });
      })
    })
  }
  return true;
});

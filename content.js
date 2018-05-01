'use strict';

var bookmarks = [];
var currentBookmarks = [];
var currentSelected = 0;
var STEP = 42;
var KEY_CODE = {
  ESC: 27,
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  DELETE: 8,
  A: 65,
  B: 66,
  Z: 90,
};

chrome.runtime.sendMessage({type: 'GET_BOOKMARKS'} ,function (response) {
  bookmarks = response.bookmarks[0].children[0].children;
});

function createBookmarkList(bookmarks) {
  var list = document.createElement('ul');
  list.className = 'bookmark-list';
  bookmarks.forEach(function(bookmark, index) {
    var li = document.createElement('li');
    li.className = 'bookmark-list-item';
    li.innerHTML = bookmark.title;
    list.appendChild(li);
    if (index === 0) {
      li.className += ' active';
    }
  });
  return list;
}

function resetSelect() {
  currentSelected = 0;
}

function onInputChange(event) {
  var keyCode = event.keyCode;
  if ((keyCode >= KEY_CODE.A && keyCode <= KEY_CODE.Z) || keyCode === KEY_CODE.DELETE) {
    var input = $(this).val();
    currentBookmarks = bookmarks.filter(function (bookmark) {
      return bookmark.title.toLowerCase().indexOf(input) !== -1;
    });
    var newBookmarkList = createBookmarkList(currentBookmarks);
    $('.bookmark-list').replaceWith(newBookmarkList);
    resetSelect();
  } else {
    $('.bookmark-list').blur();
    return;
  }
}

$(document).on('keydown', function (event) {
  var hasCreated = $('.bookmark-wrap').length;

  if (event.keyCode === KEY_CODE.B && event.metaKey && !hasCreated) {
    $('input').blur();
    var bookmarkInput = document.createElement('input');
    var bookmarkWrap = document.createElement('div');
    var bookmarkList = createBookmarkList(bookmarks);

    bookmarkWrap.appendChild(bookmarkInput);
    bookmarkWrap.appendChild(bookmarkList);
    bookmarkWrap.className = 'bookmark-wrap'
    bookmarkInput.className = 'bookmark-input';

    $('body').append(bookmarkWrap);
    $('.bookmark-input').on('keyup', onInputChange);
    $('.bookmark-input').on('keydown', onSelectBookmark);
    $('.bookmark-input').on('keydown', onMakeBookmark);
    $('.bookmark-input').on('blur', removeExtension);
    $('.bookmark-input').focus();
  }
});

function removeExtension(event) {
  $('.bookmark-wrap').remove();
}

function onSelectBookmark(event) {
  event.stopPropagation();
  var keyCode = event.keyCode;
  if ($('.bookmark-wrap').length) {
    if (keyCode === KEY_CODE.ARROW_UP && currentSelected > 0) {
      $('.bookmark-list li').eq(currentSelected).removeClass('active');
      currentSelected -= 1;
      scrollUp();
    }
    if (keyCode === KEY_CODE.ARROW_DOWN && currentSelected < currentBookmarks.length - 1) {
      $('.bookmark-list li').eq(currentSelected).removeClass('active');
      currentSelected += 1;
      scrollDown();
    }
    $('.bookmark-list li').eq(currentSelected).addClass('active');
  }
}

function onMakeBookmark(event) {
  event.stopPropagation();
  var keyCode = event.keyCode;
  if ($('.bookmark-wrap').length && keyCode === KEY_CODE.ENTER &&currentBookmarks.length > 0) {
    var selectedBookmark = currentBookmarks[currentSelected];
    var payload = {
      parentId: selectedBookmark.id,
      title: document.title,
      url: window.location.href
    };
    chrome.runtime.sendMessage({type: 'CREATE_BOOKMARK', payload: payload }, function (response) {
      alert('create success');
    });
  }
}

function scrollUp() {
  var oldScrollTop = $('.bookmark-list').scrollTop();
  if (oldScrollTop > 0) {
    var newScrollTop = oldScrollTop - STEP;
    $('.bookmark-list').scrollTop(newScrollTop);
  }
}

function scrollDown() {
  if (currentSelected > 10) {
    var oldScrollTop = $('.bookmark-list').scrollTop();
    var newScrollTop = oldScrollTop + STEP;
    $('.bookmark-list').scrollTop(newScrollTop);
  }
}
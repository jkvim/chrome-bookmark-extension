console.log('hello world')
var bookmarks = currentBookmarks = [];
var currentSelected = 0;
var STEP = 42;
var KEY_CODE = {
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  B: 66,
};

chrome.runtime.sendMessage({type: 'GET_BOOKMARKS'} ,function (response) {
  bookmarks = response.bookmarks[0].children[0].children;
  console.log('bookmarks', bookmarks);
});

function createBookmarkList(bookmarks) {
  var list = document.createElement('ul');
  list.className = 'bookmark-list';
  bookmarks.forEach(function(bookmark) {
    var li = document.createElement('li');
    li.className = 'bookmark-list-item';
    li.innerHTML = bookmark.title;
    list.appendChild(li);
  });
  return list;
}

function onInputChange(event) {
  if (event.keyCode === KEY_CODE.ARROW_DOWN || event.keyCode === KEY_CODE.ARROW_UP) {
    $('.bookmark-list').blur();
    return;
  }
  var input = $(this).val();
  currentBookmarks = bookmarks.filter(function (bookmark) {
    return bookmark.title.toLowerCase().indexOf(input) !== -1;
  });
  var newBookmarkList = createBookmarkList(currentBookmarks);
  $('.bookmark-list').replaceWith(newBookmarkList);
}

$(document).on('keydown', function (event) {
  if (event.keyCode === KEY_CODE.B && event.metaKey) {
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
  }
});

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
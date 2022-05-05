var browser = chrome;

var oReq = new XMLHttpRequest();
oReq.withCredentials = true;
function check_blocked_and_do(mid, func_ifblocked) {
    oReq.open("get", 'https://api.bilibili.com/x/relation?fid=' + mid, false);
    oReq.onload = function(e) {
        if (this.status == 200) {
            var resobj = JSON.parse(this.responseText);
            // console.log(resobj.data.attribute);
            if (resobj.data.attribute == 128) {
                func_ifblocked();
            }
        } else {
            console.log("ERROR", this.responseText);
        }
    };
    // send
    var res = oReq.send();
}

// 首页 // 频道页
function handle_all_owner_card() {
  var allVidioOwner = document.getElementsByClassName('bili-video-card__info--owner');
  let midRe = /bilibili\.com\/(\d*)\??/;
  for (let owner of allVidioOwner) {
    let reObj = midRe.exec(owner.href);
    if (reObj) {
      console.log(reObj[1]);
      check_blocked_and_do(reObj[1], function () {
          let ospan = owner.getElementsByClassName('bili-video-card__info--author');
          if (ospan) {
            ospan[0].innerText += '(已拉黑)'
          }
      });
    }
  }
}



/*
首页不能使用jq的$， 而视频播放页和历史记录页其实可以使用jquery的。
*/

// 历史记录页
function handle_history_page() {
  var allVideoOwner = document.getElementsByClassName('username');
  let midRe = /bilibili\.com\/(\d*)\??/;
  var oReq = new XMLHttpRequest();
  oReq.withCredentials = true;
  // oReq.responseType = 'json';
  for (let owner of allVideoOwner) {
    let reObj = midRe.exec(owner.parentElement.href);
    if (reObj) {
      console.log(reObj[1]);
      check_blocked_and_do(reObj[1], function () {
          owner.innerText += '(已拉黑)'
      });
    }
  }
}

// 视频播放页
function handle_video_page() {
  let upinfo_right = document.getElementById('v_upinfo');
  let info_a = upinfo_right.getElementsByClassName('username');
  let midRe = /bilibili\.com\/(\d*)\??/;
  if (info_a.length > 0) {
    let reObj = midRe.exec(info_a[0].href);
    if (reObj) {
      check_blocked_and_do(reObj[1], function () {
          info_a[0].innerText += '(已拉黑)'
      });
    }
  }
  
  let commentlist = document.getElementsByClassName('comment-list');
  if (commentlist.length) {
    let users_commentlist = commentlist[0].getElementsByClassName('name');
    for (let u of users_commentlist) {
      check_blocked_and_do(u.dataset.usercardMid, function () {
          u.innerText += '(已拉黑)'
      });
    }
  }
  
  
  let reco_list = document.getElementById('reco_list');
  let reco_list_up = reco_list.getElementsByClassName('up');
  for (let up of reco_list_up) {
    let info_a = up.getElementsByTagName('a');
    if (info_a.length) {
      let reObj = midRe.exec(info_a[0].href);
      if (reObj) {
        check_blocked_and_do(reObj[1], function () {
          info_a[0].innerText += '(已拉黑)'
        });
      }
    }
  }
}



let path = document.location.pathname;
if (path.startsWith('/video/')) {
  handle_video_page();
} else if (path.startsWith('/account/history')) {
  handle_history_page();
} else if (path === '/' || path.startsWith('/v/')) {
  handle_all_owner_card();
}


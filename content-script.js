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

// 首页
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
  let upinfo_right = $('#v_upinfo');
  let info_a = upinfo_right.find('a.username');
  let midRe = /bilibili\.com\/(\d*)\??/;
  if (info_a.length > 0) {
    let reObj = midRe.exec(info_a[0].href);
    if (reObj) {
      check_blocked_and_do(reObj[1], function () {
          info_a[0].innerText += '(已拉黑)'
      });
    }
  }
  
  let users_commentlist = $('div.comment-list a.name');
  users_commentlist.each(function () {
      let u = this;
      check_blocked_and_do(u.dataset.usercardMid, function () {
          u.innerText += '(已拉黑)'
      });
  })
  
  let reco_list = $('div#reco_list div.video-page-card div.info div.up a');
  reco_list.each(function(){
    let info_a = this;
    let reObj = midRe.exec(a.href);
    if (reObj) {
      check_blocked_and_do(reObj[1], function () {
          info_a[0].innerText += '(已拉黑)'
      });
    }
  })

}

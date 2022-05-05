var browser = chrome;

const FLAG_BLOCKED = '(已拉黑)';
var BLOCKED_MIDS = new Map();

var oReq = new XMLHttpRequest();
oReq.withCredentials = true;
function check_blocked_and_do(mid, func_ifblocked) {
    if (BLOCKED_MIDS.has(mid)) {
        if (BLOCKED_MIDS.get(mid) == 128) {
            func_ifblocked();
        }
        return
    }
    
    oReq.open("get", 'https://api.bilibili.com/x/relation?fid=' + mid, false);
    oReq.onload = function(e) {
        if (this.status == 200) {
            var resobj = JSON.parse(this.responseText);
            // console.log(resobj.data.attribute);
            BLOCKED_MIDS.set(mid, resobj.data.attribute);
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
var video_card_count = 0;
function handle_all_owner_card() {
  var allVidioOwner = document.getElementsByClassName('bili-video-card__info--owner');
  if (video_card_count != allVidioOwner.length) {
  let midRe = /bilibili\.com\/(\d*)\??/;
  for (let owner of allVidioOwner) {
    let reObj = midRe.exec(owner.href);
    if (reObj) {
      // console.log(reObj[1]);
      check_blocked_and_do(reObj[1], function () {
          let ospan = owner.getElementsByClassName('bili-video-card__info--author');
          if (ospan) {
            ospan[0].innerText += FLAG_BLOCKED;
          }
      });
    }
  }
  video_card_count = allVidioOwner.length;
  }
}
function registry_in_home_page() {
  var targetNode = document.getElementById('i_cecream');
  var config = { /*attributes: true,*/ childList: true, subtree: true };
  
  // 当观察到突变时执行的回调函数
    var callback = function(mutationsList) {
        mutationsList.forEach(function(item,index){
            if (item.type == 'childList') {
                //console.log('有节点发生改变，当前节点的内容是：');
                //console.log(item.target.innerHTML);
                handle_all_owner_card();
            } else if (item.type == 'attributes') {
                console.log('修改了'+item.attributeName+'属性');
            }
        });
    };

    // 创建一个链接到回调函数的观察者实例
    var observer = new MutationObserver(callback);

    // 开始观察已配置突变的目标节点
    observer.observe(targetNode, config);
}


/*
首页不能使用jq的$， 而视频播放页和历史记录页其实可以使用jquery的。
*/

// 历史记录页
var history_record_count = 0;
function handle_history_page() {
  var targetNode = document.getElementById('history_list');
  var records = targetNode.getElementsByClassName('history-record');
  if (history_record_count != records.length) {
  var allVideoOwner = targetNode.getElementsByClassName('username');
  let midRe = /bilibili\.com\/(\d*)\??/;
  var oReq = new XMLHttpRequest();
  oReq.withCredentials = true;
  // oReq.responseType = 'json';
  for (let owner of allVideoOwner) {
    let reObj = midRe.exec(owner.parentElement.href);
    if (reObj) {
      // console.log(reObj[1]);
      check_blocked_and_do(reObj[1], function () {
        if (owner.innerText.indexOf(FLAG_BLOCKED) < 0) {
          owner.innerText += FLAG_BLOCKED;
        }
      });
    }
  }
  
  history_record_count = records.length;
  }
}


function registry_in_history_page() {
  var targetNode = document.getElementById('history_list');
  var config = { /*attributes: true,*/ childList: true, subtree: true };
  
  // 当观察到突变时执行的回调函数
    var callback = function(mutationsList) {
        mutationsList.forEach(function(item,index){
            if (item.type == 'childList') {
                //console.log('有节点发生改变，当前节点的内容是：');
                //console.log(item.target.innerHTML);
                handle_history_page();
            } else if (item.type == 'attributes') {
                console.log('修改了'+item.attributeName+'属性');
            }
        });
    };

    // 创建一个链接到回调函数的观察者实例
    var observer = new MutationObserver(callback);

    // 开始观察已配置突变的目标节点
    observer.observe(targetNode, config);

}


// 视频播放页
var comment_list_count = 0;
function handle_video_page() {
  let upinfo_right = document.getElementById('v_upinfo');
  let info_a = upinfo_right.getElementsByClassName('username');
  let midRe = /bilibili\.com\/(\d*)\??/;
  if (info_a.length > 0) {
    let reObj = midRe.exec(info_a[0].href);
    if (reObj) {
      check_blocked_and_do(reObj[1], function () {
          if (info_a[0].innerText.indexOf(FLAG_BLOCKED) < 0) {
            info_a[0].innerText += FLAG_BLOCKED;
          }
      });
    }
  }
  
  let commentlist = document.getElementsByClassName('comment-list');
  if (commentlist.length) {
    let users_commentlist = commentlist[0].getElementsByClassName('name');
    if (comment_list_count != users_commentlist.length) {
      for (let u of users_commentlist) {
        check_blocked_and_do(u.dataset.usercardMid, function () {
          if (u.innerText.indexOf(FLAG_BLOCKED) < 0) {
            u.innerText += FLAG_BLOCKED;
          }
        });
      }
      comment_list_count = users_commentlist.length;
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
          if (info_a[0].innerText.indexOf(FLAG_BLOCKED) < 0) {
            info_a[0].innerText += FLAG_BLOCKED;
          }
        });
      }
    }
  }
}

function registry_in_video_page() {
  var targetNode = document.getElementById('app');
  var config = { /*attributes: true,*/ childList: true, subtree: true };
  
  // 当观察到突变时执行的回调函数
    var callback = function(mutationsList) {
        mutationsList.forEach(function(item,index){
            if (item.type == 'childList') {
                //console.log('有节点发生改变，当前节点的内容是：');
                //console.log(item.target.innerHTML);
                handle_video_page();
            } else if (item.type == 'attributes') {
                console.log('修改了'+item.attributeName+'属性');
            }
        });
    };

    // 创建一个链接到回调函数的观察者实例
    var observer = new MutationObserver(callback);

    // 开始观察已配置突变的目标节点
    observer.observe(targetNode, config);
}


let path = document.location.pathname;
if (path.startsWith('/video/')) {
  handle_video_page();
  registry_in_video_page();
} else if (path.startsWith('/account/history')) {
  handle_history_page();
  registry_in_history_page();
} else if (path === '/' || path.startsWith('/v/')) {
  handle_all_owner_card();
  registry_in_home_page();
}


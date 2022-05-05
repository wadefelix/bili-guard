var browser = chrome;

// 首页
function handle_all_owner_card() {
  var allVidioOwner = document.getElementsByClassName('bili-video-card__info--owner');
  let midRe = /bilibili\.com\/(\d*)\??/;
  var oReq = new XMLHttpRequest();
  oReq.withCredentials = true;
  // oReq.responseType = 'json';
  for (let owner of allVidioOwner) {
    let reObj = midRe.exec(owner.href);
    if (reObj) {
    console.log(reObj[1])
    oReq.open("get", 'https://api.bilibili.com/x/relation?fid='+reObj[1] ,false);

    oReq.onload = function(e) {
      if (this.status == 200) {
        var resobj = JSON.parse(this.responseText);
        console.log(resobj.data.attribute);
        if (resobj.data.attribute == 128) {
          let ospan = owner.getElementsByClassName('bili-video-card__info--author');
          if (ospan) {
            ospan[0].innerText += '(已拉黑)'
          }
        }
      } else {
          console.log("ERROR", this.responseText);
      }
    };
    // send
    var res = oReq.send();
      
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
    console.log(reObj[1])
    oReq.open("get", 'https://api.bilibili.com/x/relation?fid='+reObj[1] ,false);

    oReq.onload = function(e) {
      if (this.status == 200) {
        var resobj = JSON.parse(this.responseText);
        console.log(resobj.data.attribute);
        if (resobj.data.attribute == 128) {
            owner.innerText += '(已拉黑)'
        }
      } else {
          console.log("ERROR", this.responseText);
      }
    };
    // send
    var res = oReq.send();
      
    }
  }
}

// 视频播放页
function handle_video_page() {
  
}

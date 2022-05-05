var browser = chrome;

// ��ҳ
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
            ospan[0].innerText += '(������)'
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
��ҳ����ʹ��jq��$�� ����Ƶ����ҳ����ʷ��¼ҳ��ʵ����ʹ��jquery�ġ�
*/

// ��ʷ��¼ҳ
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
            owner.innerText += '(������)'
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

// ��Ƶ����ҳ
function handle_video_page() {
  
}

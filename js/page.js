//官方驗證 api 的方法
$(function () {
  GetAuthorizationHeader();
});
function GetAuthorizationHeader() {
  const parameter = {
    grant_type: "client_credentials",
    client_id: "noworktoday00-1525baf0-153e-4e8e",
    client_secret: "38c52ffb-675e-4d96-a5fb-b726466b329a"
  };

  let auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

  $.ajax({
    type: "POST",
    url: auth_url,
    crossDomain: true,
    dataType: 'JSON',
    data: parameter,
    async: false,
    success: function (data) {
      this.data = token;
    },
    error: function (xhr, textStatus, thrownError) {
    }
  });
}
//驗證用 token
let token = '';
let apiAccess = {
  'authorization': 'Bearer ' + token.access_token,
};

function init() {
  getScenicDetail()
  scenicSpotRecommend()
}

// 渲染景點資料
function getScenicDetail() {
  // 拆解網址取得 ID
  const id = location.href.split('=')[1];
  axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24filter=contains%28ScenicSpotID%2C%27${id}%27%29&%24top=30&%24format=JSON
  `, apiAccess)
    .then((res) => {
      let thisData = res.data[0];
      console.log(thisData);
      document.querySelector('#breadCrumb-title').textContent = thisData.ScenicSpotName;
      document.querySelector('#scenic-title').textContent = thisData.ScenicSpotName;
      document.querySelector('#scenic-img').setAttribute('src', thisData.Picture.PictureUrl1);
      document.querySelector('#scenic-description').textContent = thisData.DescriptionDetail;
      let openTime = document.querySelector('#scenic-opentime');
      if (thisData.OpenTime == undefined) { openTime.innerHTML = '<span>未公布開放時間</span>' } 
      else {
        openTime.innerHTML = `<span>${thisData.OpenTime}</span>`; 
      };
      document.querySelector('#scenic-phone').textContent = thisData.Phone;
      document.querySelector('#scenic-address').textContent = thisData.Address;
      let ticketInfo = document.querySelector('#scenic-ticketInfo');
      if (thisData.TicketInfo == undefined){
        ticketInfo.innerHTML = '<span>未提供門票資訊</span>'
      }else{
        ticketInfo.innerHTML = `<span>${thisData.TicketInfo}</span>`; 
      };
      document.querySelector('#scenic-travelInfo').textContent = thisData.TravelInfo;
      let website = document.querySelector('#scenic-website');
      if (thisData.WebsiteUrl !== undefined){
        website.innerHTML = `<span id="scenic-website"><a href='${thisData.WebsiteUrl}' target='_blank'>${thisData.ScenicSpotName}</a></span>`
      }else {
        website.innerHTML = `<span>未提供官方網站</span>`
      };
    });
};

function scenicSpotRecommend() {
  let scenicSpot_url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24top=4&%24format=JSON';
  axios.get(scenicSpot_url, apiAccess)
    .then((res) => {
      let thisData = res.data;
      let str = '';
      thisData.forEach((item) => {
        if (item.Picture.PictureUrl1 == undefined) {
          return;
        }
        str += `<li class="scenic-spot-card mt-3">
        <a href="page.html?id=${item.ScenicSpotID}">
          <img class="rounded-3" src="${item.Picture.PictureUrl1}" alt="${item.Picture.PictureDescription1}">
          <h3>${item.ScenicSpotName}</h3>
          <p><i class="bi bi-geo-alt"></i>${item.City}</p>
        </a>
        </li>`
      });
      console.log(res.data)
      document.querySelector('.scenicSpot-recommend').innerHTML = str;
    })
    .catch((err) => console.log(err))
}

init();
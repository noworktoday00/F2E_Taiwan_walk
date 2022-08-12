//官方驗證 api 的方法
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
      let token = data;
      return {
        headers: {
          'accept': 'application/json' ,
          'authorization': 'Bearer ' + token.access_token,
        }
      };
    },
    error: function (xhr, textStatus, thrownError) {
    }
  });
}
  
  function init() {
    getScenicDetail();
    activityRecommend();
  }
  
  // 渲染景點資料
  function getScenicDetail() {
    // 拆解網址取得 ID
    const id = location.href.split('=')[1];
    console.log(id);
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24filter=contains%28ActivityID%2C%27${id}%27%29&%24top=30&%24format=JSON
      `, GetAuthorizationHeader())
      // https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24filter=contains%28ActivityID%2C%27C2_315080000H_502117%27%29&%24format=JSON
      .then((res) => {
        let thisData = res.data[0];
        console.log(thisData);
        document.querySelector('#breadCrumb-title').textContent = thisData.ActivityName;
        document.querySelector('#activity-title').textContent = thisData.ActivityName;
        document.querySelector('#activity-img').setAttribute('src', thisData.Picture.PictureUrl1);
        document.querySelector('#activity-description').textContent = thisData.DescriptionDetail;
        let openTime = document.querySelector('#activity-opentime');
        if (thisData.OpenTime == undefined) { openTime.innerHTML = '<span>未公布開放時間</span>' }
        else {
          openTime.innerHTML = `<span>${thisData.OpenTime}</span>`;
        };
        document.querySelector('#activity-phone').textContent = thisData.Phone;
        document.querySelector('#activity-address').textContent = thisData.Address;
        let ticketInfo = document.querySelector('#activity-ticketInfo');
        if (thisData.TicketInfo == undefined) {
          ticketInfo.innerHTML = '<span>未提供門票資訊</span>'
        } else {
          ticketInfo.innerHTML = `<span>${thisData.TicketInfo}</span>`;
        };
        document.querySelector('#activity-travelInfo').textContent = thisData.TravelInfo;
        let website = document.querySelector('#activity-website');
        if (thisData.WebsiteUrl !== undefined) {
          website.innerHTML = `<span id="activity-website"><a href='${thisData.WebsiteUrl}' target='_blank'>${thisData.ActivityName}</a></span>`
        } else {
          website.innerHTML = `<span>未提供官方網站</span>`
        };
      });
  };
  
  function activityRecommend() {
    let scenicSpot_url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24top=8&%24format=JSON';
    axios.get(scenicSpot_url, GetAuthorizationHeader())
      .then((res) => {
        let thisData = res.data;
        let str = '';
        thisData.forEach((item) => {
          if (item.Picture.PictureUrl1 == undefined) {
            return;
          }
          str += `<li class="scenic-spot-card mt-3">
            <a href="activity-page.html?id=${item.ActivityID}">
              <img class="rounded-3" src="${item.Picture.PictureUrl1}" alt="${item.Picture.PictureDescription1}">
              <h3>${item.ActivityName}</h3>
              <p><i class="bi bi-geo-alt"></i>${item.City}</p>
            </a>
            </li>`
        });
        console.log(res.data);
        document.querySelector('.activity-recommend').innerHTML = str;
      })
      .catch((err) => console.log(err))
  }
  
  init();
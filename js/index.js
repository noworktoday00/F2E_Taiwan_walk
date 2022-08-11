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
          'authorization': 'Bearer ' + token.access_token,
        }
      };
    },
    error: function (xhr, textStatus, thrownError) {
    }
  });
}


function init() {
  getCarousel();
  getActivity();
  getScenicSpot();
  getRestaurant();
}

//輪播圖
function getCarousel() {
  let carousel_url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24select=ScenicSpotID%2CScenicSpotName%2Cpicture&%24top=10&%24format=JSON';
  axios.get(carousel_url, GetAuthorizationHeader())
    .then((res) => {
      let thisData = res.data;
      let str = '';
      thisData.forEach((item) => {
        if (item.Picture.PictureUrl1 == undefined) {
          return;
        }
        str += `<div class="carousel-item swipper-carousel-item active  rounded-3" style="background-image: url(${item.Picture.PictureUrl1});">
        <div class="carousel-caption d-none d-md-block">
          <h5>${item.ScenicSpotName}</h5>
        </div>
      </div>`
      });
      console.log(res.data)
      document.querySelector('.carousel-inner').innerHTML = str;
    })
    .catch((err) => console.log(err))

}

//顯示活動資訊
function getActivity() {
  let str = '';
  let activity_url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24select=ActivityName%2CPicture%2CStartTime%2CEndTime%2CAddress%2CActivityID&%24top=10&%24format=JSON'
  axios.get(activity_url, GetAuthorizationHeader())
    .then((res) => {
      let thisData = res.data;
      console.log(thisData)
      thisData.forEach((item) => {
        if (item.Picture.PictureUrl1 == undefined) {
          return;
        }
        str += `<li class="col-md-6 d-flex bg-light mt-3">
        <div class="row">
    <div class="col-5 ms-3" style="background-image: url(${item.Picture.PictureUrl1});background-position: center center;
    background-size: cover;"></div>
    <div class="col-6 ms-3">
      <p>${item.StartTime}-${item.EndTime}</p>
      <h3 class="mt-0">${item.ActivityName}</h3>
      <div class="row justify-content-between">
        <p class="col"><i class="bi bi-geo-alt"></i>${item.City}</p>
        <a href="activity-page.html?id=${item.ActivityID}" class="col text-end">詳細介紹<i class="bi bi-chevron-compact-right"></i></a>
      </div>
      </div>
    </div>
  </li>`
        document.querySelector('.activity-list').innerHTML = str;
      });
    })
    .catch((err) => console.log(err));
}

//顯示景點資訊
function getScenicSpot() {
  let scenicSpot_url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24select=ScenicSpotID%2CScenicSpotName%2Cpicture&%24top=4&%24format=JSON';
  axios.get(scenicSpot_url, GetAuthorizationHeader())
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
        <p><i class="bi bi-geo-alt"></i>台東縣</p>
        </a>
      </li>`
      });
      console.log(res.data)
      document.querySelector('.scenic-spot-list').innerHTML = str;
    })
    .catch((err) => console.log(err))
}

//顯示餐廳資訊
function getRestaurant() {
  let restaurant_url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24select=RestaurantName%2CPicture%2CAddress&%24top=4&%24format=JSON';
  axios.get(restaurant_url, GetAuthorizationHeader())
    .then((res) => {
      let thisData = res.data;
      let str = '';
      thisData.forEach((item) => {
        if (item.Picture.PictureUrl1 == undefined) {
          return;
        }
        str += `<li class="scenic-spot-card mt-3">
        <a href="restaurant-page.html?id=${item.RestaurantID}">
        <img class="rounded-3" src="${item.Picture.PictureUrl1}" alt="${item.Picture.PictureDescription1}">
        <h3>${item.RestaurantName}</h3>
        <p><i class="bi bi-geo-alt"></i>台東縣</p>
        </a>
      </li>`
      });
      console.log(res.data)
      document.querySelector('.restaurantList').innerHTML = str;
    })
    .catch((err) => console.log(err))
}

//探索搜尋
const activityTypeSelect = document.querySelector(".activity-type-select");
const searchSend = document.querySelector(".search-send");
searchSend.addEventListener("click", function () {
  const activityTypeSelectValue = activityTypeSelect.value;
  console.log(activityTypeSelectValue);
})

init();
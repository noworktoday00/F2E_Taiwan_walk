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

//DOM select
const countySelect = document.querySelector('.county-select');
const searchButton = document.querySelector('.search-button');

//地區篩選
searchButton.addEventListener("click", function () {
  const area = countySelect.value;
  console.log(area);
  let countySearchUrl = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant${area}?%24top=50&%24format=JSON`;
  axios.get(countySearchUrl, GetAuthorizationHeader())
    .then((res) => {
      const thisData = res.data;
      let str = '';
      thisData.forEach((item) => {
        if(item.Picture.PictureUrl1 == undefined){
          return;
        }
        str += `<li class="scenic-spot-card col-6 mt-3 p-3">
        <a href="restaurant-page.html?id=${item.RestaurantID}">
          <img class="rounded-3" src="${item.Picture.PictureUrl1}" alt="${item.Picture.PictureDescription1}">
          <h3 class="text-center my-3">${item.RestaurantName}</h3>
          <p><i class="bi bi-geo-alt"></i>${item.City}</p>
        </a>
        </li>`
        document.querySelector('.result-list').innerHTML = str;
      });
    });
});
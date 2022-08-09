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
  'authorization': 'Bearer' + token.access_token,
};

//DOM select
const countySelect = document.querySelector('.county-select');
const searchButton = document.querySelector('.search-button');
const categorySelect = document.querySelector('.category-select');

//地區篩選
searchButton.addEventListener("click", function () {
  const area = countySelect.value;
  console.log(area);
  let countySearchUrl = `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot${area}?%24top=20&%24format=JSON`
  axios.get(countySearchUrl, apiAccess)
    .then((res) => {
      const thisData = res.data;
      let str = '';
      thisData.forEach((item) => {
        if(item.Picture.PictureUrl1 == undefined){
          return;
        }
        str += `<li class="scenic-spot-card col-6 mt-3 p-3">
        <a href="page.html?id=${item.ScenicSpotID}">
          <img class="rounded-3" src="${item.Picture.PictureUrl1}" alt="${item.Picture.PictureDescription1}">
          <h3 class="text-center my-3">${item.ScenicSpotName}</h3>
          <p><i class="bi bi-geo-alt"></i>${item.City}</p>
        </a>
        </li>`
        document.querySelector('.result-list').innerHTML = str;
      });
    });
});

//類別篩選
categorySelect.addEventListener('click',function(e){
  e.preventDefault();
  console.log(e.target.nodeName);
  if(e.target.nodeName !== 'A'){
    return;
  };
  const category = e.target.getAttribute('data-category');
  const area = countySelect.value;
  console.log(category , area);
  let categoryUrl = `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot${area}?%24filter=contains%28class1%2C%27${category}%27%29&%24top=20&%24format=JSON`;
  axios.get(categoryUrl, apiAccess)
    .then((res) => {
      const thisData = res.data;
      console.log(thisData);
      let str = '';
      thisData.forEach((item) => {
        if(item.Picture.PictureUrl1 == undefined){
          return;
        }
        str += `<li class="scenic-spot-card col-6 p-3 mt-3">
        <a href="page.html?id=${item.ScenicSpotID}">
          <img class="rounded-3" src="${item.Picture.PictureUrl1}" alt="${item.Picture.PictureDescription1}">
          <h3 class="text-center my-3">${item.ScenicSpotName}</h3>
          <p><i class="bi bi-geo-alt"></i>${item.City}</p>
        </a>
        </li>`
        document.querySelector('.result-list').innerHTML = str;
      });
    });
});
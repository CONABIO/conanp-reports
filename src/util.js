const breakpoints = {
  desktop: 992,
  tablet: 768
};

const ANPS_URL = "http://snmb.conabio.gob.mx/api_anps/v1/anps";
const KERNELS_URL = "http://snmb.conabio.gob.mx/api_anps/v1/nucleos";
const RINGS_URL = "http://snmb.conabio.gob.mx/api_anps/v1/anillos";
const REGIONS_URL = "http://snmb.conabio.gob.mx/api_anps/v1/regiones";
const PRESERVATIONS_URL = "http://snmb.conabio.gob.mx/api_anps/v1/preservaciones";

const REGIONS_CODE = "objectid";
const CODE = "id_07";
const REGIONS_NAME = "region";
const NAME = "nombre";


function loadUrl(url, callback) {
  console.log("Loading url.")
  fetch(url,{
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept-Encoding": "gzip,deflate",
      }})
    .then(response => {
      return response.json();
    })
    .then(data => {
      callback(data[0]);
  });
}

export { breakpoints,
         loadUrl,
         ANPS_URL,
         KERNELS_URL,
         RINGS_URL,
         REGIONS_URL,
         PRESERVATIONS_URL,
         REGIONS_CODE, 
         REGIONS_NAME,
         CODE, 
         NAME };
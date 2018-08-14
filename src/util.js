const breakpoints = {
  desktop: 992,
  tablet: 768
};

const ANPS_URL = "http://snmb.conabio.gob.mx/api_anps/v1/anps";
const REGIONS_URL = "http://snmb.conabio.gob.mx/api_anps/v1/regiones";

const KERNEL_URL = "http://snmb.conabio.gob.mx/api_anps/v1/nucleo/";
const RING_URL = "http://snmb.conabio.gob.mx/api_anps/v1/anillo/";
const PRESERVATION_URL = "http://snmb.conabio.gob.mx/api_anps/v1/preservacion/";

const REGIONS_CODE = "objectid";
const CODE = "id_07";
const REGIONS_NAME = "region";
const NAME = "nombre";


function loadUrl(url, callback) {
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
      let payload = null;
      if(data.length > 0) {
        payload = data[0];
      }
      callback(payload);
  });
}

function getColor(type) {
    return type === "anillo"       ? "yellow":
           type === "anp"          ? "blue":
           type === "nucleo"       ? "green":
           type === "preservacion" ? "red":
                                     "black";
}

export { breakpoints,
         getColor,
         loadUrl,
         ANPS_URL,
         REGIONS_URL,
         KERNEL_URL,
         RING_URL,
         PRESERVATION_URL,
         REGIONS_CODE, 
         REGIONS_NAME,
         CODE, 
         NAME };

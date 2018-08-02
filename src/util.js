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

export { breakpoints,
         ANPS_URL,
         KERNELS_URL,
         RINGS_URL,
         REGIONS_URL,
         PRESERVATIONS_URL,
         REGIONS_CODE, 
         REGIONS_NAME,
         CODE, 
         NAME };
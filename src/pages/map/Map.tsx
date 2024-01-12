import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as S from "./Map.styled";

declare global {
  interface Window {
    kakao: any;
  }
}

function Map() {
  const [kakaoMap, setKakaoMap] = useState();
  const [bounds, setBounds] = useState([0, 0, 0, 0]);
  const [maplevel, setMapLevel] = useState(Number);
  const [allData, setAllData] = useState();

  function drawKakaoMap() {
    let container = document.getElementById("map");
    let options = {
      center: new window.kakao.maps.LatLng(33.3616666, 126.5291666),
      level: 6,
    };
    const map = new window.kakao.maps.Map(container, options);
    window.kakao.maps.event.addListener(map, "zoom_changed", function () {
      setMapLevel(map.getLevel());
    });
    window.kakao.maps.event.addListener(map, "center_changed", function () {
      setBounds([
        map.getBounds().ha,
        map.getBounds().qa,
        map.getBounds().oa,
        map.getBounds().pa,
      ]);
    });

    return map;
  }

  useEffect(() => {
    const result = drawKakaoMap();
    setKakaoMap(result);
  }, []);
  useEffect(() => {
    console.log(
      `https://api.vworld.kr/req/wfs?key=D01E42F1-E0D6-373E-B192-E30F2C44DC62&domain=localhost:3000&SERVICE=WFS&REQUEST=GetFeature&TYPENAME=lp_pa_cbnd_bubun&PROPERTYNAME=ag_geom,addr&VERSION=1.1.0&MAXFEATURES=1000&SRSNAME=EPSG:4326&OUTPUT=application/json&EXCEPTIONS=text/xml&BBOX=${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]}`
    );
    if (maplevel > 5 && bounds[0] !== 0) {
      setBounds([0, 0, 0, 0]);
    }
    if (maplevel <= 5 && bounds[0] !== 0) {
      fetch(
        `https://api.vworld.kr/req/wfs?KEY=D01E42F1-E0D6-373E-B192-E30F2C44DC62&DOMAIN=localhost:3000&SERVICE=WFS&REQUEST=GetFeature&TYPENAME=lp_pa_cbnd_bubun&PROPERTYNAME=ag_geom,addr&VERSION=1.1.0&MAXFEATURES=1000&SRSNAME=EPSG:4326&OUTPUT=text/javascript&EXCEPTIONS=text/xml&BBOX=${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]}`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((Response) => Response.json())
        .then((jsonResponse) => setAllData(jsonResponse))
        .catch((err) => console.log(err));
    }
  }, [maplevel, bounds]);
  useEffect(() => {
    console.log(allData);
  }, [allData]);
  return (
    <S.Container>
      <S.Map id='map' />
    </S.Container>
  );
}

export default Map;

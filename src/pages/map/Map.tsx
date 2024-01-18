import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as S from "./Map.styled";
import axios from "axios";
import $ from "jquery";
import { IAlldata, IFeature, IAddressAndPolygon } from "../../store/atoms";
import SearchSection from "../../components/molecules/SearchSection";
import DataDisplay from "../../components/molecules/DataDisplay";
declare global {
  interface Window {
    kakao: any;
  }
}

const axiosInstance = axios.create({
  baseURL: "http://mapserviceapi.duckdns.org/https://api.vworld.kr",
});

function Map() {
  const [kakaoMap, setKakaoMap] = useState<any>();
  const [bounds, setBounds] = useState([0, 0, 0, 0]);
  const [maplevel, setMapLevel] = useState(Number);
  const [allData, setAllData] = useState<IAlldata>();
  const [pastAddressList, setPastAddressList] = useState<String[]>([]);
  const [isMenuClicked, setIsMenuClicked] = useState<Boolean>(false);
  const [changeColor, setChangeColor] = useState<string[]>([]);
  const [otherIsOpened, setOtherIsOpened] = useState<Boolean>(false);

  const [addressAndPolygonList, setAddressAndPolygonList] = useState<
    IAddressAndPolygon[]
  >([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  function drawKakaoMap() {
    let container = document.getElementById("map");
    let options = {
      center: new window.kakao.maps.LatLng(33.3616666, 126.5291666),
      level: 3,
    };
    const map = new window.kakao.maps.Map(container, options);
    window.kakao.maps.event.addListener(map, "zoom_changed", function () {
      setMapLevel(map.getLevel());
      setBounds([
        map.getBounds().ha,
        map.getBounds().qa,
        map.getBounds().oa,
        map.getBounds().pa,
      ]);
    });
    window.kakao.maps.event.addListener(map, "dragend", function () {
      setMapLevel(map.getLevel());
      setBounds([
        map.getBounds().ha,
        map.getBounds().qa,
        map.getBounds().oa,
        map.getBounds().pa,
      ]);
    });

    return map;
  } // 기본맵 생성완료

  async function getLatLng(vertexes: number[][][]) {
    let temporary: any[] = [];
    vertexes[0].map((vertex) => {
      let latlng = new window.kakao.maps.LatLng(vertex[1], vertex[0]);
      temporary.push(latlng);
    });
    return temporary;
  } // 폴리곤 생성을 위해 LatLng 배열을 만들어주는 함수

  async function getPolygon(poly: IAddressAndPolygon) {
    const finalPoly = await getLatLng(poly.polygon)
      .then((resultArray) => {
        const Polygon = new window.kakao.maps.Polygon({
          map: kakaoMap,
          path: resultArray,
          strokeWeight: 1,
          strokeColor: "#000000",
          strokeOpacity: 1,
          //strokeStyle: "",
          fillColor: "#999999",
          fillOpacity: 0.5,
          zIndex: 30,
        });
        return Polygon;
      })
      .then((resultPolygon) => {
        resultPolygon.setMap(kakaoMap);
      });
  } // 최종적인 폴리곤 생성에 기여

  useEffect(() => {
    const result = drawKakaoMap();
    setKakaoMap(result);
  }, []);

  useEffect(() => {
    if (maplevel <= 2 && bounds[0] !== 0) {
      $.ajax({
        type: "get",
        url: "https://api.vworld.kr/req/wfs?",
        data: `KEY=F62DC7D5-852D-3E8E-B373-2EDDA7D6B078&domain=mapservice.duckdns.org&SERVICE=WFS&REQUEST=GetFeature&TYPENAME=lp_pa_cbnd_bubun&PROPERTYNAME=ag_geom,addr&VERSION=1.1.0&MAXFEATURES=1000&SRSNAME=EPSG:4326&BBOX=${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]}&output=text/javascript`,
        dataType: "jsonp",
        jsonpCallback: "parseResponse",
        async: false,
        success: function (data) {
          setAllData(data as IAlldata);
        },
        error: function (xhr, stat, err) {},
      });
    }
  }, [maplevel, bounds]);
  useEffect(() => {
    setFetchFlag(false);
    let temporary: IAddressAndPolygon[] = [];
    allData
      ? allData.features.map((feature) => {
          temporary.push({
            address: feature.properties.addr as string,
            polygon: feature.geometry.coordinates[0],
          });
          setAddressAndPolygonList(temporary);
        })
      : console.log("반복문 작동실패");

    // 순회해야되는 리스트: features
    // 각 features안에서 address와 코프룰루 구역의 geometry를 취한다. 여기는 과거에 프로토스의 식민지였다.
  }, [allData]);

  useEffect(() => {
    if (allData?.totalFeatures === addressAndPolygonList.length) {
      setFetchFlag(true);
    }
  }, [addressAndPolygonList]);
  useEffect(() => {
    console.log(pastAddressList);
  }, [pastAddressList]);
  useEffect(() => {
    if (fetchFlag) {
      addressAndPolygonList.map((poly) => {
        if (pastAddressList.includes(poly.address)) {
          console.log("이미있음");
        } else {
          console.log(poly.address, pastAddressList);
          setPastAddressList((pastAddressList) => [
            ...pastAddressList,
            poly.address,
          ]);
          getPolygon(poly);
        }
      });
    } else {
      console.log("폴리곤생성 실패");
    }
  }, [fetchFlag]);
  useEffect(() => {
    console.log(changeColor);
  }, [changeColor]);
  return (
    <S.Container>
      <S.Topbar>
        <S.MenuButton onClick={() => setIsMenuClicked(!isMenuClicked)} />
        <S.Logo>SkyPatrol360</S.Logo>
        <SearchSection />
      </S.Topbar>
      <S.Sidebar>
        <S.MenuSection>
          <DataDisplay
            text='전체 목록'
            data={[
              { address: "제주특별자치도 제주시 우령2길 19", check: false },
            ]}
            onClickFunction={setChangeColor}
          />
          <DataDisplay
            text='미확인 목록'
            data={[
              { address: "제주특별자치도 제주시 우령2길 19", check: false },
            ]}
            onClickFunction={setChangeColor}
          />
          <DataDisplay
            text='확인 목록'
            data={[
              { address: "제주특별자치도 제주시 우령2길 19", check: false },
            ]}
            onClickFunction={setChangeColor}
          />
        </S.MenuSection>
        <S.Contact>고객센터</S.Contact>
      </S.Sidebar>

      <S.Map id='map' />
    </S.Container>
  );
}

export default Map;

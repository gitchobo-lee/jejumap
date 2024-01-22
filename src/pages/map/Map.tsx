import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import * as S from "./Map.styled";
import {
  FETCH_ALL_ADDRESS_AND_CHECK,
  FETCH_ALL_POLYGONS,
  UPDATE_ADDRESS_AND_CHECK,
} from "../../store/gql";
import axios from "axios";
import $ from "jquery";
import {
  IAlldata,
  IFeature,
  IAddressAndPolygon,
  IPolygonQuery,
  IIllegalBuilding,
  IAddressAppear,
  IAddressAndCheck,
  addressAndCheckAtom,
} from "../../store/atoms";
import SearchSection from "../../components/molecules/SearchSection";
import DataDisplay from "../../components/molecules/DataDisplay";
import { useRecoilState } from "recoil";
declare global {
  interface Window {
    kakao: any;
  }
}

function Map() {
  const [kakaoMap, setKakaoMap] = useState<any>();
  const [bounds, setBounds] = useState([0, 0, 0, 0]);
  const [maplevel, setMapLevel] = useState(Number);
  const [allData, setAllData] = useState<IAlldata>();
  const [pastAddressList, setPastAddressList] = useState<String[]>([]);
  const [isMenuClicked, setIsMenuClicked] = useState<Boolean>(false);
  const [changeColor, setChangeColor] = useState<IAddressAndCheck[]>([]);
  const [otherIsOpened, setOtherIsOpened] = useState<string>("");
  const [addressAndPolygonList, setAddressAndPolygonList] = useState<
    IAddressAndPolygon[]
  >([]);
  const [searchedAddress, setSearchedAddress] = useState<string>("");
  const [addressAndCheck, setAddressAndCheck] =
    useRecoilState(addressAndCheckAtom);
  const [orgBuildingPolygonList, setOrgBuildingPolygonList] = useState<
    number[][][]
  >([]);
  const [illegalBuildingList, setIllegalBuildingList] = useState<
    IIllegalBuilding[]
  >([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [illegalAddress, setIllegalAddress] = useState<String[]>([]);

  const { loading, error, data } = useQuery(FETCH_ALL_POLYGONS, {
    fetchPolicy: "no-cache",
    onCompleted: (data: IPolygonQuery) => {
      setOrgBuildingPolygonList(data.allPolygon.polygons);
    },
  });
  const {
    loading: addLoading,
    error: addError,
    data: addData,
  } = useQuery(FETCH_ALL_ADDRESS_AND_CHECK, {
    fetchPolicy: "no-cache",
    onCompleted: (data: { allAddressAndCheck: IAddressAndCheck[] }) => {
      setAddressAndCheck(data.allAddressAndCheck);
    },
    onError: (error) => {
      console.log("에러", error);
    },
  });
  const [
    updateAddressAndCheck,
    { data: data2, loading: zzimHouseLoading, error: error2 },
  ] = useMutation(UPDATE_ADDRESS_AND_CHECK, {
    onCompleted: (data) => {
      console.log(data.postAddress, "새로 들어온 데이터");
      setAddressAndCheck(data.postAddress);
    },
    onError(error, clientOptions) {
      console.log("올챙이에러", error);
    },
  });
  const geocoder = new window.kakao.maps.services.Geocoder();

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
  async function getBuildingPolygon(poly: number[][]) {
    const finalPoly = await getLatLng([
      poly.map((content) => [content[1], content[0]]),
    ])
      .then((resultArray) => {
        const Polygon = new window.kakao.maps.Polygon({
          map: kakaoMap,
          path: resultArray,
          strokeWeight: 1,
          strokeColor: "#000000",
          strokeOpacity: 1,
          //strokeStyle: "",
          fillColor: "#000000",
          fillOpacity: 0.5,
          zIndex: 30,
        });
        return Polygon;
      })
      .then((resultPolygon) => {
        resultPolygon.setMap(kakaoMap);
      });
  }

  async function getPolygon(
    poly: IAddressAndPolygon,
    color?: string,
    zIndex?: number,
    wantErase?: boolean
  ) {
    const finalPoly = await getLatLng(poly.polygon)
      .then((resultArray) => {
        const Polygon = new window.kakao.maps.Polygon({
          map: kakaoMap,
          path: resultArray,
          strokeWeight: 1,
          strokeColor: `${color ? color : "#000000"}`,
          strokeOpacity: 1,
          //strokeStyle: "",
          fillColor: `${color ? color : "#999999"}`,
          fillOpacity: 0.5,
          zIndex: `${zIndex ? zIndex : 30}`,
        });
        return Polygon;
      })
      .then((resultPolygon) => {
        resultPolygon.setMap(wantErase ? null : kakaoMap);
      });
  } // 최종적인 폴리곤 생성에 기여
  async function getBuildingPolygonAddress(building: number[][]) {
    const addressAppear: IAddressAppear[] = [];

    await Promise.all(
      building.map(async (coordinate) => {
        const coord = new window.kakao.maps.LatLng(
          coordinate[0],
          coordinate[1]
        );
        const address = await new Promise((resolve) => {
          geocoder.coord2Address(
            coord.getLng(),
            coord.getLat(),
            (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                resolve(result[0].address.address_name);
              } else {
                resolve(null); // Resolve with null or handle errors accordingly
              }
            }
          );
        });

        if (address !== null) {
          const elementToUpdate = addressAppear.find(
            (item) => item.address === address
          );
          if (elementToUpdate) {
            elementToUpdate.times += 1;
          } else {
            addressAppear.push({
              address: address as string,
              times: 1,
              polygon: building,
            });
          }
        }
      })
    );

    return addressAppear;
  }

  async function refinery(buildings: number[][][]) {
    const allAddressAppear = await Promise.all(
      buildings.map(getBuildingPolygonAddress)
    );

    allAddressAppear.forEach((addressAppear) => {
      if (addressAppear.length >= 2) {
        const maxValue = Math.max(
          ...addressAppear.map((content) => content.times)
        );
        const finalAddress = addressAppear.find(
          (item) => item.times === maxValue
        );
        if (finalAddress) {
          setIllegalBuildingList((illegalBuildingList) => [
            ...illegalBuildingList,
            { address: finalAddress.address, polygon: finalAddress.polygon },
          ]);
        }
      }
    });
  }

  async function findTarget(input: IAddressAndCheck) {
    const target = addressAndPolygonList.find(
      (element) => element.address === input.address
    );

    if (target) {
      if (!illegalAddress.includes(input.address)) {
        setIllegalAddress((illegalAddress) => [
          ...illegalAddress,
          input.address,
        ]);
        getPolygon(target, "#FF0000", 35, false);
      }
    }
  }

  useEffect(() => {
    const result = drawKakaoMap();
    setKakaoMap(result);
  }, []);

  useEffect(() => {
    console.log(bounds);
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
        error: function (xhr, stat, err) {
          console.log(err, "브이월드 Fetch중 에러 발생");
        },
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
    if (fetchFlag) {
      addressAndPolygonList.map((poly) => {
        if (pastAddressList.includes(poly.address)) {
          console.log("이미있음");
        } else {
          setPastAddressList((pastAddressList) => [
            ...pastAddressList,
            poly.address,
          ]);
          getPolygon(poly);
        }
      });
    }
  }, [fetchFlag]);

  useEffect(() => {
    refinery(orgBuildingPolygonList);
    console.log(orgBuildingPolygonList);
  }, [orgBuildingPolygonList]);

  useEffect(() => {
    if (addressAndCheck) {
      illegalBuildingList.map((Content) => {
        const dontAppend = addressAndCheck.find(
          (item) => item.address === Content.address
        );
        if (!dontAppend) {
          updateAddressAndCheck({
            variables: {
              address: Content.address,
              polygon: Content.polygon,
            },
          });
        }
        getBuildingPolygon(Content.polygon);
      });
    } else {
      console.log(addressAndCheck, "fetch가 안됨");
    }
  }, [addressAndCheck, illegalBuildingList]);

  useEffect(() => {
    if (changeColor.length === 1) {
      kakaoMap.setCenter(
        new window.kakao.maps.LatLng(
          changeColor[0].polygon[0][0],
          changeColor[0].polygon[0][1]
        )
      );
      kakaoMap.setLevel(1);
      if (fetchFlag) {
        findTarget(changeColor[0]);
      }
    } else if (changeColor.length > 1) {
      kakaoMap.setCenter(
        new window.kakao.maps.LatLng(
          changeColor[0].polygon[0][0],
          changeColor[0].polygon[0][1]
        )
      );
      kakaoMap.setLevel(1);
      if (fetchFlag) {
        changeColor.map((content) => {
          findTarget(content);
        });
      }
    }
  }, [changeColor, fetchFlag]);
  useEffect(() => {
    const callback = function (result: any, status: any) {
      if (status === window.kakao.maps.services.Status.OK) {
        kakaoMap.setCenter(
          new window.kakao.maps.LatLng(result[0].y, result[0].x)
        );
      }
    };
    geocoder.addressSearch(searchedAddress, callback);
  }, [searchedAddress]);
  return (
    <S.Container>
      <S.Topbar>
        <S.MenuButton onClick={() => setIsMenuClicked(!isMenuClicked)} />
        <S.Logo>SkyPatrol360</S.Logo>
        <SearchSection onClickFunction={setSearchedAddress} />
      </S.Topbar>
      <S.Sidebar>
        <S.MenuSection>
          <DataDisplay
            text='전체 목록'
            data={addressAndCheck}
            onClickFunction={setChangeColor}
          />
          <DataDisplay
            text='미확인 목록'
            data={addressAndCheck.filter((Content) => Content.check === false)}
            onClickFunction={setChangeColor}
          />
          <DataDisplay
            text='확인 목록'
            data={addressAndCheck.filter((Content) => Content.check === true)}
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

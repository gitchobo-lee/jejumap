import styled from "styled-components";
import menu from "../../assets/MenuButton.svg";
export const Container = styled.main`
  color: black;
`;

export const Map = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: red;

  & > .svg {
    stroke: red;
    fill: red;
  }
`;

export const Topbar = styled.div`
  top: 0px;
  width: 100vw;
  height: 134px;
  position: fixed;
  z-index: 45;
  background-color: rgba(49, 168, 133, 0.91);
  display: grid;
  place-items: center;
  grid-template-columns: 60px 400px auto;
  grid-template-rows: 67px 67px;
`;

export const MenuButton = styled.button`
  width: 32px;
  height: 32px;
  align-items: center;
  background-image: url(${menu});
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

export const Logo = styled.div`
  margin-top: -10px;
  margin-left: -200px;
  height: 32px;
  font-size: 32px;
  color: white;
  font-family: "Khyay";
  font-weight: 600;
  cursor: pointer;
`;

export const Sidebar = styled.div`
  position: fixed;
  height: calc(100vh - 134px);
  width: 390px;
  background-color: white;
  bottom: 0px;
  z-index: 15;
  display: grid;
  grid-template-rows: auto 46px;
`;

export const MenuSection = styled.div``;

export const Contact = styled.div`
  background-color: lightgray;
  display: flex;
  justify-content: left;
  align-items: center;
  padding-left: 20px;
  width: 370px;
  height: 46px;
`;

import styled from "styled-components";
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

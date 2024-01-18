import styled from "styled-components";
import search from "../../assets/SearchButton.svg";
export const Container = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: left;
  grid-row-start: 2;
  grid-column-start: 1;
  grid-column-end: 3;
  margin-left: 10px;
  margin-top: -10px;
`;
export const SearchButton = styled.button`
  height: 38px;
  width: 38px;
  border: none;
  background-image: url(${search});
`;
export const TextArea = styled.div`
  height: 38px;
  width: 400px;
  background-color: white;
`;

function SearchSection() {
  return (
    <Container>
      <TextArea />
      <SearchButton />
    </Container>
  );
}

export default SearchSection;

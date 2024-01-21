import styled from "styled-components";
import search from "../../assets/SearchButton.svg";
import { useEffect, useState } from "react";
import { IJustFunction } from "../../store/atoms";
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
  cursor: pointer;
`;
export const TextArea = styled.input`
  height: 38px;
  width: 400px;
  background-color: white;
  border: none;
`;

function SearchSection({ onClickFunction }: IJustFunction) {
  const [address, setAddress] = useState<String>("");
  const [addressToSend, setAddressToSend] = useState<String>("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  return (
    <Container>
      <TextArea onChange={onChange} />
      <SearchButton onClick={() => onClickFunction(address)} />
    </Container>
  );
}

export default SearchSection;

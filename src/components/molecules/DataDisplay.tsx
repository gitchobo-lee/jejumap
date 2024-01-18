import styled from "styled-components";
import more from "../../assets/MoreButton.svg";
import { useEffect, useState } from "react";
import { click } from "@testing-library/user-event/dist/click";
export const Container = styled.div`
  width: 390px;
  padding-bottom: 10px;
  background-color: white;
  border-bottom: 2px solid gray;
`;
export const Bar = styled.div`
  margin-left: 20px;
  margin-top: 10px;
  width: 360px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: left;
  background-color: lightgray;
`;
export const Menuname = styled.div`
  width: 292px;
  height: 40px;
  display: flex;
  align-items: center;
  margin-left: 20px;
`;
export const MoreButton = styled.button`
  height: 40px;
  width: 40px;
  border: none;
  background-image: url(${more});
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;

export const SelectRail = styled.div`
  height: 20px;
  width: 50px;
  margin-right: 20px;
  border-radius: 10px;
  background-color: gray;
  z-index: 100;
  display: flex;
  align-items: center;
`;
export const SelectSwitch = styled.div`
  height: 17px;
  width: 17px;
  border-radius: 50%;
  background-color: white;
  z-index: 51;
  transition: margin 0.5s;
`;

export const TextArea = styled.div`
  width: 360px;
  margin-left: 20px;
  background-color: white;
  transition: height 0.5s;
`;
export const AddressList = styled.div`
  width: 360px;
  display: flex;
  height: 30px;
  align-items: center;
`;
export const AddressTextArea = styled.div`
  font-size: 15px;
  width: 330px;
  cursor: pointer;
`;
export const AddressCheckbox = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 5px;
  border: 1px solid black;
`;
interface IAddressAndCheck {
  address: string;
  check: boolean;
  comment?: string;
}
interface IContent {
  text: string;
  data: IAddressAndCheck[];
  onClickFunction?: any;
}

function DataDisplay({ text, data, onClickFunction }: IContent) {
  const [open, setOpen] = useState<Boolean>(false);
  const [all, setAll] = useState<Boolean>(false);
  const [clickedAddress, setClickedAddress] = useState<String[]>([]);
  useEffect(() => {
    all
      ? setClickedAddress(
          data.map((content) => {
            return content.address;
          })
        )
      : setClickedAddress([]);
  }, [all]);
  useEffect(() => {
    onClickFunction(clickedAddress);
  }, [clickedAddress]);

  return (
    <Container>
      <Bar>
        <Menuname>{text}</Menuname>
        <SelectRail
          onClick={() => {
            setAll(!all);
          }}
          style={
            all
              ? { backgroundColor: "rgba(49, 168, 133, 1)" }
              : { backgroundColor: "gray" }
          }
        >
          <SelectSwitch
            style={all ? { marginLeft: "23px" } : { marginLeft: "1px" }}
          />
        </SelectRail>
        <MoreButton
          onClick={() => {
            setOpen(!open);
          }}
        />
      </Bar>
      <TextArea style={open ? { height: "300px" } : { height: "0px" }}>
        {open
          ? data.map((Content) => {
              return (
                <AddressList>
                  <AddressTextArea
                    onClick={() => {
                      setClickedAddress([Content.address]);
                    }}
                    style={
                      clickedAddress.includes(Content.address)
                        ? { fontWeight: 800 }
                        : { fontWeight: 400 }
                    }
                  >
                    {Content.address}
                  </AddressTextArea>
                  <AddressCheckbox
                    style={
                      Content.check
                        ? { backgroundColor: "rgba(49, 168, 133, 1)" }
                        : { backgroundColor: "white" }
                    }
                  />
                </AddressList>
              );
            })
          : null}
      </TextArea>
    </Container>
  );
}

export default DataDisplay;

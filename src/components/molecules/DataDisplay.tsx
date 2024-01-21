import styled from "styled-components";
import more from "../../assets/MoreButton.svg";
import location from "../../assets/location.svg";
import comment from "../../assets/message-text.svg";
import xButton from "../../assets/XButton.svg";
import { useEffect, useState } from "react";
import { click } from "@testing-library/user-event/dist/click";
import { IAddressAndCheck, IContent } from "../../store/atoms";
import { useMutation } from "@apollo/client";
import { addressAndCheckAtom } from "../../store/atoms";
import { useRecoilState } from "recoil";
import { UPDATE_COMMENT_CHECK } from "../../store/gql";
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
  width: 290px;
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
export const Modal = styled.div`
  width: 490px;
  height: 645px;
  position: absolute;
  background-color: white;
  border: 1px solid black;
  z-index: 55;
  left: 400px;
  top: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const ModalAddressArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  height: 30px;
  width: 490px;
`;
export const ModalTitle = styled.div`
  height: 30px;
  width: 410px;
  display: flex;
  align-items: center;
  justify-content: left;
`;
export const LocationMark = styled.div`
  height: 20px;
  width: 20px;
  margin-left: 20px;
  background-image: url(${location});
  background-repeat: no-repeat;
  background-position: center;
`;
export const CommentMark = styled.div`
  height: 20px;
  width: 20px;
  margin-left: 20px;
  background-image: url(${comment});
  background-repeat: no-repeat;
  background-position: center;
`;
export const XButton = styled.div`
  height: 20px;
  width: 20px;
  background-image: url(${xButton});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;
export const ModalCommentArea = styled.div`
  width: 450px;
  height: 510px;
  background-color: lightgray;
  margin-left: 20px;
`;

export const ModalSubmitArea = styled.div`
  width: 490px;
  height: 40px;
  display: flex;
  justify-content: left;
  padding-top: 20px;
  margin-left: 334px;
`;

export const Button = styled.div`
  width: 60px;
  height: 20px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  margin-right: 10px;
`;
function DataDisplay({ text, data, onClickFunction }: IContent) {
  const [open, setOpen] = useState<Boolean>(false);
  const [all, setAll] = useState<Boolean>(false);
  const [clickedAddress, setClickedAddress] = useState<IAddressAndCheck[]>([]);
  const [addressAndCheck, setAddressAndCheck] =
    useRecoilState(addressAndCheckAtom);
  const [updateCheckStatus, { data: data2, loading, error }] = useMutation(
    UPDATE_COMMENT_CHECK,
    {
      onCompleted: (data) => {
        setAddressAndCheck(data.postWithCheck);
      },
      onError(error, clientOptions) {
        console.log("올챙이에러", error);
      },
    }
  );
  const [modalOpen, setModalOpen] = useState<Boolean>(false);
  useEffect(() => {
    all ? setClickedAddress(data) : setClickedAddress([]);
  }, [all]);
  useEffect(() => {
    onClickFunction(clickedAddress);
  }, [clickedAddress]);

  return (
    <Container>
      <Bar>
        <Menuname>{text}</Menuname>
        {open ? (
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
        ) : null}

        <MoreButton
          style={!open ? { marginLeft: "10px" } : { marginLeft: "0px" }}
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
                      setClickedAddress([Content]);
                    }}
                    style={
                      clickedAddress.includes(Content)
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
                    onClick={() => {
                      setModalOpen(!modalOpen);
                      //updateCheckStatus({
                      //  variables: { address: Content.address },
                      //});
                    }}
                  />
                  {modalOpen ? (
                    <Modal>
                      <ModalAddressArea>
                        <LocationMark />
                        <ModalTitle>{Content.address}</ModalTitle>
                        <XButton
                          onClick={() => {
                            setModalOpen(false);
                          }}
                        />
                      </ModalAddressArea>
                      <ModalAddressArea>
                        <CommentMark />
                        <ModalTitle>코멘트</ModalTitle>
                      </ModalAddressArea>
                      <ModalCommentArea></ModalCommentArea>
                      <ModalSubmitArea>
                        <Button>취소</Button>
                        <Button
                          style={{ backgroundColor: "rgba(49, 168, 133, 1)" }}
                        >
                          확인
                        </Button>
                      </ModalSubmitArea>
                    </Modal>
                  ) : null}
                </AddressList>
              );
            })
          : null}
      </TextArea>
    </Container>
  );
}

export default DataDisplay;

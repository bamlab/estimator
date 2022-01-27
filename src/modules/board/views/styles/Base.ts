import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const BoardWrapper = styled.div`
  background-color: #3179ba;
  overflow-y: hidden;
  padding: 5px;
  color: #393939;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100vh;
`;

export const Header = styled.header`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const Section = styled.section`
  background-color: #e3e3e3;
  border-radius: 3px;
  margin: 5px 5px;
  position: relative;
  padding: 10px;
  display: inline-flex;
  height: auto;
  max-height: 90%;
  flex-direction: column;
`;

export const Title = styled.span`
  font-weight: bold;
  font-size: 15px;
  line-height: 18px;
  cursor: ${(props) => (props.draggable ? "grab" : `auto`)};
  width: 70%;
`;

export const RightContent = styled.span`
  width: 38%;
  text-align: right;
  padding-right: 10px;
  font-size: 13px;
`;
export const CardWrapper = styled.article`
  border-radius: 3px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  position: relative;
  padding: 10px;
  cursor: pointer;
  max-width: 250px;
  margin-bottom: 7px;
  min-width: 230px;
`;

export const MovableCardWrapper = styled(CardWrapper)`
  &:hover {
    background-color: #f0f0f0;
    color: #000;
  }
`;

export const CardHeader = styled(Header)`
  border-bottom: 1px solid #eee;
  padding-bottom: 6px;
  color: #000;
`;

export const CardTitle = styled(Title)`
  font-size: 14px;
`;

export const CardRightContent = styled(RightContent)`
  font-size: 10px;
`;

export const Detail = styled.div`
  font-size: 12px;
  color: #4d4d4d;
  white-space: pre-wrap;
`;

export const Footer = styled.div`
  border-top: 1px solid #eee;
  padding-top: 6px;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const TagSpan = styled.span`
  padding: 2px 3px;
  border-radius: 3px;
  margin: 2px 5px;
  font-size: 70%;
`;

export const AddCardLink = styled.a`
  border-radius: 0 0 3px 3px;
  color: #838c91;
  display: block;
  padding: 5px 2px;
  margin-top: 10px;
  position: relative;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    //background-color: #cdd2d4;
    color: #4d4d4d;
    text-decoration: underline;
  }
`;

export const LaneTitle = styled.div`
  font-size: 15px;
  width: 268px;
  height: auto;
`;

export const LaneSection = styled.section`
  background-color: #2b6aa3;
  border-radius: 3px;
  margin: 5px;
  position: relative;
  padding: 5px;
  display: inline-flex;
  height: auto;
  flex-direction: column;
`;

export const NewLaneSection = styled(LaneSection)`
  width: 200px;
`;

export const NewLaneButtons = styled.div`
  margin-top: 10px;
`;

export const CardForm = styled.div`
  background-color: #e3e3e3;
`;

export const InlineInput = styled.textarea`
  overflow-x: hidden; /* for Firefox (issue #5) */
  word-wrap: break-word;
  min-height: 18px;
  max-height: 112px; /* optional, but recommended */
  resize: none;
  width: 100%;
  height: 18px;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  text-align: inherit;
  background-color: transparent;
  box-shadow: none;
  box-sizing: border-box;
  border-radius: 3px;
  border: 0;
  padding: 0 8px;
  outline: 0;
  ${(props: any) =>
    props.border &&
    css`
      &:focus {
        box-shadow: inset 0 0 0 2px #0079bf;
      }
    `} &:focus {
    background-color: white;
  }
`;

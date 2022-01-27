import React from "react";
import { DeleteWrapper, DelButton } from "./styles/Elements";

export const DeleteButton = (props: any) => {
  return (
    <DeleteWrapper {...props}>
      <DelButton>&#10006;</DelButton>
    </DeleteWrapper>
  );
};

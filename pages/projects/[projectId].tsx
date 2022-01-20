import React from "react";
import styled from "@emotion/styled";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function ProjectPage() {
  return (
    <div>
      <Header>
        <h2>Project page</h2>
      </Header>
    </div>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;

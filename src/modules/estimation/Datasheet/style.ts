import styled from "@emotion/styled";

export const Styles = styled.div`
  table {
    border-spacing: 0;
    border: 1px solid black;
    border-width: 1px 1px 1px 0px;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      background-color: white;

      :first-child {
        border-left: 1px solid black;
      }
      :last-child {
        border-right: 0;
      }

      input,
      textarea {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

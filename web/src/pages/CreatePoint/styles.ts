import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;

  header {
    margin-top: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  a {
    color: var(--title-color);
    font-weight: bold;
    text-decoration: none;
    display: flex;
    align-items: center;

    a,
    svg {
      margin-right: 16px;
      color: var(--primary-color);
    }
  }

  form {
    margin: 80px auto;
    padding: 64px;
    max-width: 730px;
    background: #fff;
    border-radius: 8px;

    display: flex;
    flex-direction: column;

    h1 {
      font-size: 36px;
    }

    fieldset {
      margin-top: 64px;
      min-inline-size: auto;
      border: 0;
    }

    p {
      color: red;
      font-size: 12px;
      margin-top: 5px;
      text-transform: lowercase;
    }

    legend {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      h2 {
        font-size: 24px;
      }
      span {
        font-size: 14px;
        font-weight: normal;
        color: var(--text-color);
      }
    }

    .field {
      flex: 1;

      display: flex;
      flex-direction: column;
      margin-bottom: 24px;

      label {
        font-size: 14px;
        margin-bottom: 8px;
      }

      input {
        flex: 1;
        background: #f0f0f5;
        border-radius: 8px;
        border: 0;
        padding: 16px 24px;
        font-size: 16px;
        color: #6c6c80;

        ::placeholder {
          color: #a0a0b2;
        }

        :disabled {
          cursor: not-allowed;
        }
      }

      input + input {
        margin-left: 24px;
      }

      select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        flex: 1;
        background: #f0f0f5;
        border-radius: 8px;
        border: 0;
        padding: 16px 24px;
        font-size: 16px;
        color: #6c6c80;
      }
    }

    .map {
      margin-bottom: 24px;
    }

    .field + .field {
      margin-left: 24px;
    }

    .field-group {
      flex: 1;
      display: flex;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      list-style: none;
    }

    .items-grid li {
      background: #f5f5f5;
      border: 2px solid #f5f5f5;
      height: 180px;
      border-radius: 8px;
      padding: 32px 24px 16px;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      text-align: center;

      cursor: pointer;
    }

    .items-grid li span {
      flex: 1;
      margin-top: 12px;

      display: flex;
      align-items: center;
      color: var(--title-color);
    }

    .items-grid li.selected {
      background: #e1faec;
      border: 2px solid #34cb79;
    }

    .leaflet-container {
      width: 100%;
      height: 350px;
      border-radius: 8px;
    }

    button {
      width: 260px;
      height: 56px;
      background: var(--primary-color);
      border-radius: 8px;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
      border: 0;
      align-self: flex-end;
      margin-top: 40px;
      transition: background-color 0.2s;
      cursor: pointer;

      :hover {
        background: #2fb86e;
      }
    }
  }

  .field-check {
    flex-direction: row;
    align-items: center;

    input[type='checkbox'] {
      background: #f0f0f5;
    }

    label {
      margin: 0 0 0 8px;
    }
  }
`;

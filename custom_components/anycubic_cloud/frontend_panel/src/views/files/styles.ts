import { CSSResult, css } from "lit";

export const commonFilesStyle: CSSResult = css`
  :host {
    padding: 16px;
    display: block;
  }

  .files-card {
    padding: 16px;
    display: block;
    font-size: 18px;
    margin: 0 auto;
    text-align: center;
  }

  .files-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
  }

  .file-info {
    display: flex;
    min-height: 20px;
    min-width: 250px;
    border: 2px solid #ccc3;
    border-radius: 16px;
    padding: 16px 32px;
    line-height: 20px;
    text-align: center;
    font-weight: 900;
    margin: 6px;
    width: 100%;
    justify-content: space-between;
  }

  .file-name {
    display: block;
    line-height: 20px;
    text-align: center;
    font-weight: 900;
    margin: 6px;
    word-wrap: break-word;
    max-width: calc(100% - 58px);
  }

  .file-info:hover {
    background-color: #ccc3;
    border-color: #ccc9;
  }

  .file-refresh-button {
    padding: 10px;
    margin-bottom: 20px;
  }

  .file-refresh-icon {
    --mdc-icon-size: 50px;
  }

  .file-delete-button {
    padding: 4px;
    margin-left: 10px;
  }

  .file-delete-icon {
  }

  @media (max-width: 599px) {
    :host {
      padding: 6px;
    }

    .files-card {
      padding: 0px;
    }

    .file-info {
      padding: 6px 6px;
      margin: 6px 0px;
    }
  }
`;

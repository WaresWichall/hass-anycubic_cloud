import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import { platform } from "../../const";
import {
  getPrinterDevID,
  getPrinterEntities,
  getFileListCloudFilesEntity,
  getFileListCloudRefreshEntity,
  getSelectedPrinter,
} from "../../helpers";
import {
  AnycubicCloudFileListEntity,
  HomeAssistant,
  HassDeviceList,
  HassPanel,
  HassRoute,
} from "../../types";
import { commonFilesStyle } from "./styles";

@customElement("anycubic-view-files_cloud")
export class AnycubicViewFilesCloud extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property({ type: Boolean, reflect: true })
  public narrow!: boolean;

  @property()
  public route!: HassRoute;

  @property()
  public panel!: HassPanel;

  @property()
  public printers?: HassDeviceList;

  render() {
    const selectedPrinterID = getPrinterDevID(this.route);

    const printerEntities = getPrinterEntities(this.hass, selectedPrinterID);

    const fileListEntity = getFileListCloudFilesEntity(printerEntities);
    const listRefreshEntity = getFileListCloudRefreshEntity(printerEntities);

    const fileListState: AnycubicCloudFileListEntity = fileListEntity
      ? this.hass.states[fileListEntity.entity_id]
      : undefined;

    const fileArray = fileListState
      ? fileListState.attributes?.file_info
      : undefined;

    return html`
      <div class="files-card" elevation="2">
        <button class="file-refresh-button" @click="${(_e) => {
          this.refreshList(listRefreshEntity);
        }}"><ha-icon class="file-refresh-icon" icon="mdi:refresh"></ha-icon></button>
        <ul class="files-container">
        ${
          fileArray
            ? fileArray.map(
                (fileInfo) => html`
                  <li class="file-info">
                    <div class="file-name">${fileInfo.name}</div>
                    <button
                      class="file-delete-button"
                      @click="${(_e) => {
                        this.deleteFile(fileInfo.id);
                      }}"
                    >
                      <ha-icon
                        class="file-delete-icon"
                        icon="mdi:delete"
                      ></ha-icon>
                    </button>
                  </li>
                `,
              )
            : null
        }
      </div>
    `;
  }

  refreshList(entity) {
    if (entity)
      this.hass.callService("button", "press", { entity_id: entity.entity_id });
  }

  deleteFile(fileId) {
    const selectedPrinterID = getPrinterDevID(this.route);

    const selectedPrinter = getSelectedPrinter(
      this.printers,
      selectedPrinterID,
    );

    if (selectedPrinter && fileId)
      this.hass.callService(platform, "delete_file_cloud", {
        config_entry: selectedPrinter.primary_config_entry,
        device_id: selectedPrinter.id,
        file_id: fileId,
      });
  }

  static get styles() {
    return css`
      ${commonFilesStyle} :host {
        padding: 16px;
        display: block;
      }
    `;
  }
}

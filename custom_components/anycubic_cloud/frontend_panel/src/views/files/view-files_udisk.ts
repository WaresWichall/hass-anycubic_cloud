import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import { platform } from "../../const";
import {
  getPrinterDevID,
  getPrinterEntities,
  getFileListUdiskFilesEntity,
  getFileListUdiskRefreshEntity,
  getSelectedPrinter,
} from "../../helpers";
import {
  AnycubicFileListEntity,
  HomeAssistant,
  HassDeviceList,
  HassPanel,
  HassRoute,
} from "../../types";
import { commonFilesStyle } from "./styles";

@customElement("anycubic-view-files_udisk")
export class AnycubicViewFilesUdisk extends LitElement {
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

    const fileListEntity = getFileListUdiskFilesEntity(printerEntities);
    const listRefreshEntity = getFileListUdiskRefreshEntity(printerEntities);

    const fileListState: AnycubicFileListEntity = fileListEntity
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
                        this.deleteFile(fileInfo.name);
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

  deleteFile(filename) {
    const selectedPrinterID = getPrinterDevID(this.route);

    const selectedPrinter = getSelectedPrinter(
      this.printers,
      selectedPrinterID,
    );

    if (selectedPrinter && filename)
      this.hass.callService(platform, "delete_file_udisk", {
        config_entry: selectedPrinter.primary_config_entry,
        device_id: selectedPrinter.id,
        filename: filename,
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

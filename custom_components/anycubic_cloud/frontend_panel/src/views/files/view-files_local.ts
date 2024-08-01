import { LitElement, html, css, PropertyValues } from "lit";
import { property, customElement, state } from "lit/decorators.js";

import { platform } from "../../const";
import {
  getPrinterEntities,
  getFileListLocalFilesEntity,
  getFileListLocalRefreshEntity,
} from "../../helpers";
import {
  AnycubicFileListEntity,
  HomeAssistant,
  HassDevice,
  HassEntityInfos,
  HassPanel,
  HassRoute,
} from "../../types";
import { commonFilesStyle } from "./styles";

@customElement("anycubic-view-files_local")
export class AnycubicViewFilesLocal extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property({ type: Boolean, reflect: true })
  public narrow!: boolean;

  @property()
  public route!: HassRoute;

  @property()
  public panel!: HassPanel;

  @property()
  public selectedPrinterID: string | undefined;

  @property()
  public selectedPrinterDevice: HassDevice | undefined;

  @state()
  private printerEntities: HassEntityInfos;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (!changedProperties.has("selectedPrinterID")) {
      return;
    }

    this.printerEntities = getPrinterEntities(
      this.hass,
      this.selectedPrinterID,
    );
  }

  render(): any {
    const fileListEntity = getFileListLocalFilesEntity(this.printerEntities);
    const listRefreshEntity = getFileListLocalRefreshEntity(
      this.printerEntities,
    );

    const fileListState: AnycubicFileListEntity = fileListEntity
      ? this.hass.states[fileListEntity.entity_id]
      : undefined;

    const fileArray = fileListState
      ? fileListState.attributes?.file_info
      : undefined;

    return html`
      <div class="files-card" elevation="2">
        <button class="file-refresh-button" @click="${(_e): void => {
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
                      @click="${(_e): void => {
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

  refreshList(entity): void {
    if (entity) {
      this.hass.callService("button", "press", { entity_id: entity.entity_id });
    }
  }

  deleteFile(filename): void {
    if (this.selectedPrinterDevice && filename) {
      this.hass.callService(platform, "delete_file_local", {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        filename: filename,
      });
    }
  }

  static get styles(): any {
    return css`
      ${commonFilesStyle} :host {
        padding: 16px;
        display: block;
      }
    `;
  }
}

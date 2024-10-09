import { LitElement, html, css, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

import { getPrinterEntities } from "../../helpers";
import {
  AnycubicFileLocal,
  HassEntityInfos,
  HassEntityInfo,
  HomeAssistant,
  HassDevice,
  HassPanel,
  HassRoute,
} from "../../types";
import { commonFilesStyle } from "./styles";

export class AnycubicViewFilesBase extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public language!: string;

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

  @state()
  private _fileArray: AnycubicFileLocal[] | undefined;

  @state()
  private _listRefreshEntity: HassEntityInfo | undefined;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has("hass") ||
      changedProperties.has("selectedPrinterID")
    ) {
      this.printerEntities = getPrinterEntities(
        this.hass,
        this.selectedPrinterID,
      );
    }
  }

  render(): any {
    return html`
      <div class="files-card" elevation="2">
        <button class="file-refresh-button" @click="${(_e): void => {
          this.refreshList(this._listRefreshEntity);
        }}"><ha-icon class="file-refresh-icon" icon="mdi:refresh"></ha-icon></button>
        <ul class="files-container">
        ${
          this._fileArray
            ? this._fileArray.map(
                (fileInfo) => html`
                  <li class="file-info">
                    <div class="file-name">${fileInfo.name}</div>
                    <button
                      class="file-delete-button"
                      @click="${(_e): void => {
                        this.deleteFile(fileInfo);
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

  deleteFile(_fileInfo: any): void {}

  static get styles(): any {
    return css`
      ${commonFilesStyle}
    `;
  }
}

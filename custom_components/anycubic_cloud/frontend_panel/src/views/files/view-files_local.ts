import { PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

import { platform } from "../../const";
import {
  getEntityState,
  getFileListLocalFilesEntity,
  getFileListLocalRefreshEntity,
} from "../../helpers";
import { AnycubicFileLocal } from "../../types";
import { AnycubicViewFilesBase } from "./view-files_base";

@customElement("anycubic-view-files_local")
export class AnycubicViewFilesLocal extends AnycubicViewFilesBase {
  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has("hass") ||
      changedProperties.has("selectedPrinterID")
    ) {
      const fileListState = getEntityState(
        this.hass,
        getFileListLocalFilesEntity(this.printerEntities),
      );
      this._fileArray = fileListState
        ? fileListState.attributes?.file_info
        : undefined;
      this._listRefreshEntity = getFileListLocalRefreshEntity(
        this.printerEntities,
      );
    }
  }

  deleteFile(fileInfo: AnycubicFileLocal): void {
    if (this.selectedPrinterDevice && fileInfo.name) {
      this.hass.callService(platform, "delete_file_local", {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        filename: fileInfo.name,
      });
    }
  }
}

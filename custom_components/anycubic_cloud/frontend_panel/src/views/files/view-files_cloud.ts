import { PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";

import { platform } from "../../const";
import {
  getEntityState,
  getFileListCloudFilesEntity,
  getFileListCloudRefreshEntity,
} from "../../helpers";
import { AnycubicFileCloud } from "../../types";
import { AnycubicViewFilesBase } from "./view-files_base";

@customElement("anycubic-view-files_cloud")
export class AnycubicViewFilesCloud extends AnycubicViewFilesBase {
  @state()
  private _fileArray: AnycubicFileCloud[] | undefined;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has("hass") ||
      changedProperties.has("selectedPrinterID")
    ) {
      const fileListState = getEntityState(
        this.hass,
        getFileListCloudFilesEntity(this.printerEntities),
      );
      this._fileArray = fileListState
        ? fileListState.attributes?.file_info
        : undefined;
      this._listRefreshEntity = getFileListCloudRefreshEntity(
        this.printerEntities,
      );
    }
  }

  deleteFile(fileInfo: AnycubicFileCloud): void {
    if (this.selectedPrinterDevice && fileInfo.id) {
      this.hass.callService(platform, "delete_file_cloud", {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        file_id: fileInfo.id,
      });
    }
  }
}

import { PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";

import { AnycubicViewFilesBase } from "./view-files_base";
import { platform } from "../../const";
import {
  getEntityState,
  getFileListCloudFilesEntity,
  getFileListCloudRefreshEntity,
} from "../../helpers";
import {
  AnycubicCloudFileListEntity,
  AnycubicFileCloud,
  DomClickEvent,
  EvtTargFileInfo,
} from "../../types";

@customElement("anycubic-view-files_cloud")
export class AnycubicViewFilesCloud extends AnycubicViewFilesBase {
  @state()
  protected _fileArray: AnycubicFileCloud[] | undefined;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has("hass") ||
      changedProperties.has("selectedPrinterID")
    ) {
      const fileListState: AnycubicCloudFileListEntity | undefined =
        getEntityState(
          this.hass,
          getFileListCloudFilesEntity(this.printerEntities),
        );
      this._fileArray = fileListState
        ? fileListState.attributes.file_info
        : undefined;
      this._listRefreshEntity = getFileListCloudRefreshEntity(
        this.printerEntities,
      );
    }
  }

  deleteFile = (ev: DomClickEvent<EvtTargFileInfo>): void => {
    const fileInfo: AnycubicFileCloud = ev.currentTarget
      .file_info as AnycubicFileCloud;
    if (this.selectedPrinterDevice && fileInfo.id) {
      this._isDeleting = true;
      this.hass
        .callService(platform, "delete_file_cloud", {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          file_id: fileInfo.id,
        })
        .then(() => {
          this._isDeleting = false;
        })
        .catch((_e: unknown) => {
          this._isDeleting = false;
        });
    }
  };
}

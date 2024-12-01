import { PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

import { AnycubicViewFilesBase } from "./view-files_base";
import { platform } from "../../const";
import {
  getEntityState,
  getFileListLocalFilesEntity,
  getFileListLocalRefreshEntity,
} from "../../helpers";
import {
  AnycubicFileListEntity,
  AnycubicFileLocal,
  DomClickEvent,
  EvtTargFileInfo,
} from "../../types";

@customElement("anycubic-view-files_local")
export class AnycubicViewFilesLocal extends AnycubicViewFilesBase {
  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has("hass") ||
      changedProperties.has("selectedPrinterID")
    ) {
      const fileListState: AnycubicFileListEntity | undefined = getEntityState(
        this.hass,
        getFileListLocalFilesEntity(this.printerEntities),
      );
      this._fileArray = fileListState
        ? fileListState.attributes.file_info
        : undefined;
      this._listRefreshEntity = getFileListLocalRefreshEntity(
        this.printerEntities,
      );
    }
  }

  deleteFile = (ev: DomClickEvent<EvtTargFileInfo>): void => {
    const fileInfo: AnycubicFileLocal = ev.currentTarget
      .file_info as AnycubicFileLocal;
    if (this.selectedPrinterDevice && fileInfo.name) {
      this._isDeleting = true;
      this.hass
        .callService(platform, "delete_file_local", {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          filename: fileInfo.name,
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

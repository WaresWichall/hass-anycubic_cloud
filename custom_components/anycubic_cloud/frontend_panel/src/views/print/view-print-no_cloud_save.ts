import { customElement, state } from "lit/decorators.js";

import { AnycubicViewPrintBase } from "./view-print-base";

@customElement("anycubic-view-print-no_cloud_save")
export class AnycubicViewPrintNoCloudSave extends AnycubicViewPrintBase {
  @state()
  private _serviceName: string = "print_and_upload_no_cloud_save";
}

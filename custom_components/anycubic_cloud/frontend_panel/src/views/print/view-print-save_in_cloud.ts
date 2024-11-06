import { customElement, state } from "lit/decorators.js";

import { AnycubicViewPrintBase } from "./view-print-base";

@customElement("anycubic-view-print-save_in_cloud")
export class AnycubicViewPrintSaveInCloud extends AnycubicViewPrintBase {
  @state()
  protected _serviceName: string = "print_and_upload_save_in_cloud";
}

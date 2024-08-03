import { LitElement, html, css, PropertyValues } from "lit";
import { property, customElement, state } from "lit/decorators.js";

import {
  CAMERA_ENTITY_DOMAINS,
  LIGHT_ENTITY_DOMAINS,
  SWITCH_ENTITY_DOMAINS,
} from "../../../const";

import { fireEvent } from "../../../fire_event";

import {
  AnycubicCardConfig,
  HassDevice,
  HassDeviceList,
  HaFormBaseSchema,
  HomeAssistant,
  PrinterCardStatType,
  TemperatureUnit,
} from "../../../types";

import "../../ui/multi-select-reorder.ts";

@customElement("anycubic-printercard-configure")
export class AnycubicPrintercardConfigure extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public cardConfig!: AnycubicCardConfig;

  @property()
  public printers!: HassDeviceList;

  @state()
  private selectedPrinterDevice: HassDevice | undefined;

  @state()
  private formSchema: HaFormBaseSchema[] = [];

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("printers")) {
      this.formSchema = this._computeSchema();
    }
  }

  render(): any {
    return html`
      <div class="ac-printer-card-configure-cont">
        <div class="ac-printer-card-configure-conf">
          <ha-form
            .hass=${this.hass}
            .data=${this.cardConfig}
            .schema=${this.formSchema}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._formValueChanged}
          ></ha-form>
        </div>
        <div class="ac-printer-card-configure-advanced">
          <p class="ac-cconf-label">Choose Monitored Stats</p>
          <anycubic-ui-multi-select-reorder
            .availableOptions=${PrinterCardStatType}
            .initialItems=${this.cardConfig.monitoredStats}
            .onChange=${(sel: any[]): void => this._selectedStatsChanged(sel)}
          ></anycubic-ui-multi-select-reorder>
        </div>
      </div>
    `;
  }

  private _selectedStatsChanged(selected: any[]): void {
    this.cardConfig.monitoredStats = selected;
    this._configChanged(this.cardConfig);
  }

  private _configChanged(newConfig: AnycubicCardConfig): void {
    fireEvent(this, "config-changed", { config: newConfig });
  }

  private _formValueChanged(ev: Event): void {
    this.cardConfig = ev.detail.value;
    this._configChanged(this.cardConfig);
  }

  private _computeLabel = (schema: HaFormBaseSchema): string => {
    switch (schema.name) {
      case "printer_id":
        return "Select Printer";
      case "vertical":
        return "Vertical Layout?";
      case "round":
        return "Round Stats?";
      case "use_24hr":
        return "Use 24hr Time?";
      case "temperatureUnit":
        return "Temperature Unit";
      case "lightEntityId":
        return "Light Entity";
      case "powerEntityId":
        return "Power Entity";
      case "cameraEntityId":
        return "Camera Entity";
      case "scaleFactor":
        return "Scale Factor";
      case "slotColors":
        return "Slot Colour Presets";
      default:
        return "Select Printer";
    }
  };

  private _computeSchema(): HaFormBaseSchema[] {
    const printerOptions = Object.keys(this.printers).map(
      (printerID, _index) => ({
        value: printerID,
        label: this.printers[printerID].name,
      }),
    );
    return this.printers
      ? [
          {
            name: "printer_id",
            selector: {
              select: {
                options: printerOptions,
                mode: "dropdown",
                multiple: false,
              },
            },
          },
          {
            name: "vertical",
            selector: { boolean: {} },
          },
          {
            name: "round",
            selector: { boolean: {} },
          },
          {
            name: "use_24hr",
            selector: { boolean: {} },
          },
          {
            name: "temperatureUnit",
            selector: {
              select: {
                options: [
                  {
                    value: TemperatureUnit.C,
                    label: `°${TemperatureUnit.C}`,
                  },
                  {
                    value: TemperatureUnit.F,
                    label: `°${TemperatureUnit.F}`,
                  },
                ],
                mode: "list",
                multiple: false,
              },
            },
          },
          {
            name: "lightEntityId",
            selector: { entity: { domain: LIGHT_ENTITY_DOMAINS } },
          },
          {
            name: "powerEntityId",
            selector: { entity: { domain: SWITCH_ENTITY_DOMAINS } },
          },
          {
            name: "cameraEntityId",
            selector: { entity: { domain: CAMERA_ENTITY_DOMAINS } },
          },
          {
            name: "scaleFactor",
            selector: {
              select: {
                options: [
                  {
                    value: 1,
                    label: "1",
                  },
                  {
                    value: 0.75,
                    label: "0.75",
                  },
                  {
                    value: 0.5,
                    label: "0.5",
                  },
                ],
                mode: "list",
                multiple: false,
              },
            },
          },
          {
            name: "slotColors",
            description: "Slot Colour Presets",
            selector: {
              text: {
                multiple: true,
              },
            },
          },
        ]
      : [];
  }

  static get styles(): any {
    return css`
      :host {
        display: block;
      }

      .ac-printer-card-configure-advanced {
        margin-top: 30px;
      }

      .ac-cconf-label {
        margin-bottom: 4px;
        font-weight: bold;
        font-size: 14px;
      }
    `;
  }
}

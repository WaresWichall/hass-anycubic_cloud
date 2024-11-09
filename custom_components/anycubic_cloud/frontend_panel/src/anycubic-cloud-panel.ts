import { LitElement, html, css, PropertyValues } from "lit";
import { property, customElement, state } from "lit/decorators.js";

import "./views/debug/view-debug.ts";
import "./views/main/view-main.ts";
import "./views/files/view-files_cloud.ts";
import "./views/files/view-files_local.ts";
import "./views/files/view-files_udisk.ts";
import "./views/print/view-print-no_cloud_save.ts";
import "./views/print/view-print-save_in_cloud.ts";

import { localize } from "../localize/localize";

import * as pkgjson from "../package.json";
import { DEBUG } from "./const";
import {
  getPage,
  getPrinterDevID,
  getPrinterDevices,
  getSelectedPrinter,
  navigateToPage,
  navigateToPrinter,
} from "./helpers";
import {
  HomeAssistant,
  HassDevice,
  HassDeviceList,
  HassPanel,
  HassRoute,
} from "./types";

window.console.info(
  `%c ANYCUBIC-PANEL %c v${pkgjson.version} `,
  "color: orange; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: dimgray",
);

@customElement("anycubic-cloud-panel")
export class AnycubicCloudPanel extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property({ type: Boolean, reflect: true })
  public narrow!: boolean;

  @property()
  public route!: HassRoute;

  @property()
  public panel!: HassPanel;

  @state()
  private printers?: HassDeviceList;

  @state()
  private selectedPage: string = "main";

  @state()
  private selectedPrinterID: string | undefined;

  @state()
  private selectedPrinterDevice: HassDevice | undefined;

  @state()
  private language: string;

  @state()
  private _tabMain: string;

  @state()
  private _tabFilesLocal: string;

  @state()
  private _tabFilesUdisk: string;

  @state()
  private _tabFilesCloud: string;

  @state()
  private _tabPrintNoSave: string;

  @state()
  private _tabPrintSave: string;

  @state()
  private _tabDebug: string;

  @state()
  private _mainTitle: string;

  @state()
  private _selectPrinter: string;

  async firstUpdated(): Promise<void> {
    this.printers = await getPrinterDevices(this.hass);
    this.requestUpdate();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("location-changed", this._handleLocationChange);
  }

  public disconnectedCallback(): void {
    window.removeEventListener("location-changed", this._handleLocationChange);
    super.disconnectedCallback();
  }

  private _handleLocationChange = (): void => {
    if (!window.location.pathname.includes("anycubic-cloud")) {
      return;
    }
    this.requestUpdate();
  };

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("hass") && this.hass.language !== this.language) {
      this.language = this.hass.language;
      this._tabMain = localize("panels.main.title", this.language);
      this._tabFilesLocal = localize("panels.files_local.title", this.language);
      this._tabFilesUdisk = localize("panels.files_udisk.title", this.language);
      this._tabFilesCloud = localize("panels.files_cloud.title", this.language);
      this._tabPrintNoSave = localize(
        "panels.print_no_cloud_save.title",
        this.language,
      );
      this._tabPrintSave = localize(
        "panels.print_save_in_cloud.title",
        this.language,
      );
      this._tabDebug = localize("panels.debug.title", this.language);
      this._mainTitle = localize("title", this.language);
      this._selectPrinter = localize(
        "panels.initial.printer_select",
        this.language,
      );
    }

    if (!changedProperties.has("route") && !changedProperties.has("printers")) {
      return;
    }

    this.selectedPage = getPage(this.route);
    this.selectedPrinterID = getPrinterDevID(this.route);
    this.selectedPrinterDevice = getSelectedPrinter(
      this.printers,
      this.selectedPrinterID,
    );
  }

  render(): any {
    return this.getInitialView();
  }

  renderPrinterPage(): HTMLElement {
    return html`
      <div class="header">
        ${this.renderToolbar()}
        <ha-tabs
          scrollable
          attr-for-selected="page-name"
          .selected=${this.selectedPage}
          @iron-activate=${this.handlePageSelected}
        >
          <paper-tab page-name="main"> ${this._tabMain} </paper-tab>
          <paper-tab page-name="local-files">
            ${this._tabFilesLocal}
          </paper-tab>
          <paper-tab page-name="udisk-files">
            ${this._tabFilesUdisk}
          </paper-tab>
          <paper-tab page-name="cloud-files">
            ${this._tabFilesCloud}
          </paper-tab>
          <paper-tab page-name="print-no_cloud_save">
            ${this._tabPrintNoSave}
          </paper-tab>
          <paper-tab page-name="print-save_in_cloud">
            ${this._tabPrintSave}
          </paper-tab>
          ${DEBUG
            ? html`
                <paper-tab page-name="debug"> ${this._tabDebug} </paper-tab>
              `
            : null}
        </ha-tabs>
      </div>
      <div class="view">${this.getView(this.route)}</div>
    `;
  }

  renderToolbar(): HTMLElement {
    return html`
      <div class="toolbar">
        <ha-menu-button
          .hass=${this.hass}
          .narrow=${this.narrow}
        ></ha-menu-button>
        <div class="main-title">${this._mainTitle}</div>
        <div class="version">v${pkgjson.version}</div>
      </div>
    `;
  }

  getInitialView(): HTMLElement {
    if (this.selectedPrinterID) {
      return this.renderPrinterPage();
    } else {
      return html`
        <div class="header">${this.renderToolbar()}</div>
        <printer-select elevation="2">
          <p>${this._selectPrinter}</p>
          <ul class="printers-container">
            ${this.printers
              ? Object.keys(this.printers).map(
                  (printerID) =>
                    html`<li
                      class="printer-select-box"
                      @click="${(_e): void => {
                        this._handlePrinterClick(printerID);
                      }}"
                    >
                      ${this.printers[printerID].name}
                    </li>`,
                )
              : null}
          </ul>
        </printer-select>
      `;
    }
  }

  getView(route: HassRoute): HTMLElement {
    switch (this.selectedPage) {
      case "local-files":
        return html`
          <anycubic-view-files_local
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_local>
        `;
      case "udisk-files":
        return html`
          <anycubic-view-files_udisk
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_udisk>
        `;
      case "cloud-files":
        return html`
          <anycubic-view-files_cloud
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_cloud>
        `;
      case "print-no_cloud_save":
        return html`
          <anycubic-view-print-no_cloud_save
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-print-no_cloud_save>
        `;
      case "print-save_in_cloud":
        return html`
          <anycubic-view-print-save_in_cloud
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-print-save_in_cloud>
        `;
      case "main":
        return html`
          <anycubic-view-main
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-main>
        `;
      case "debug":
        return html`
          <anycubic-view-debug
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${route}
            .panel=${this.panel}
            .printers=${this.printers}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-debug>
        `;
      default:
        return html`
          <ha-card header="Page not found">
            <div class="card-content">
              The page you are trying to reach cannot be found. Please select a
              page from the menu above to continue.
            </div>
          </ha-card>
        `;
    }
  }

  _handlePrinterClick(printer_id): void {
    navigateToPrinter(this, printer_id);
    this.requestUpdate();
  }

  handlePageSelected(ev): void {
    const newPage = ev.detail.item.getAttribute("page-name");
    if (newPage !== getPage(this.route)) {
      navigateToPage(this, newPage);
      this.requestUpdate();
    } else {
      scrollTo(0, 0);
    }
  }

  static get styles(): any {
    return css`
      :host {
        padding: 16px;
        display: block;
      }
      .header {
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color, white);
        border-bottom: var(--app-header-border-bottom, none);
      }
      .toolbar {
        height: var(--header-height);
        display: flex;
        align-items: center;
        font-size: 20px;
        padding: 0 16px;
        font-weight: 400;
        box-sizing: border-box;
      }
      .main-title {
        margin: 0 0 0 24px;
        line-height: 20px;
        flex-grow: 1;
      }
      ha-tabs {
        margin-left: max(env(safe-area-inset-left), 24px);
        margin-right: max(env(safe-area-inset-right), 24px);
        --paper-tabs-selection-bar-color: var(
          --app-header-selection-bar-color,
          var(--app-header-text-color, #fff)
        );
        text-transform: uppercase;
      }

      .version {
        font-size: 14px;
        font-weight: 500;
        color: rgba(var(--rgb-text-primary-color), 0.9);
      }

      printer-select {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 1024px;
        margin: 0 auto;
      }

      .view {
        height: calc(100vh - 112px);
        display: flex;
        justify-content: center;
      }

      .view > * {
        min-width: 600px;
        max-width: 1024px;
      }

      .view > *:last-child {
        margin-bottom: 20px;
      }

      .ac_wide_view {
        width: 100%;
      }

      .printers-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }

      .printer-select-box {
        cursor: pointer;
        display: block;
        min-height: 60px;
        min-width: 250px;
        border: 2px solid #ccc3;
        border-radius: 16px;
        padding: 16px;
        line-height: 60px;
        text-align: center;
        font-weight: 900;
      }

      .printer-select-box:hover {
        background-color: #ccc3;
        border-color: #ccc9;
      }
      @media (max-width: 599px) {
        .view > * {
          min-width: 100%;
          max-width: 100%;
        }
      }
    `;
  }
}

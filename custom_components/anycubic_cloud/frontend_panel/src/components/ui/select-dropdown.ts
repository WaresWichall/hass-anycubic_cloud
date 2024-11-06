import { mdiChevronDown } from "@mdi/js";

import { CSSResult, LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { styleMap } from "lit/directives/style-map.js";

import { customElementIfUndef } from "../../internal/register-custom-element";

import { fireEvent } from "../../fire_event";
import { DomClickEvent, EvtTargItemKey, LitTemplateResult } from "../../types";

@customElementIfUndef("anycubic-ui-select-dropdown-item")
export class AnycubicUISelectDropdownItem extends LitElement {
  @property()
  public item: string;

  @state()
  private _isActive: boolean = false;

  render(): LitTemplateResult {
    const stylesOption = {
      filter: this._isActive ? "brightness(80%)" : "brightness(100%)",
    };
    return html`
      <button
        class="ac-ui-seld-select"
        style=${styleMap(stylesOption)}
        @mouseenter=${this._setActive}
        @mousedown=${this._setActive}
        @mouseup=${this._setInactive}
        @mouseleave=${this._setInactive}
      >
        ${this.item}
      </button>
    `;
  }

  private _setActive = (): void => {
    this._isActive = true;
  };

  private _setInactive = (): void => {
    this._isActive = false;
  };

  static get styles(): CSSResult {
    return css`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-ui-seld-select {
        width: 100%;
        border: none;
        outline: none;
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        padding: 0 16px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: bold;
        line-height: 48px;
        text-align: left;
        cursor: pointer;
        color: var(--primary-text-color);
      }
    `;
  }
}

@customElementIfUndef("anycubic-ui-select-dropdown")
export class AnycubicUISelectDropdown extends LitElement {
  @property({ attribute: "available-options" })
  public availableOptions?: object;

  @property()
  public placeholder: string;

  @property({ attribute: "initial-item" })
  public initialItem: string | undefined;

  @state()
  private _selectedItem: string | undefined;

  @state()
  private _active: boolean = false;

  @state()
  private _hidden: boolean = false;

  // eslint-disable-next-line @typescript-eslint/require-await
  async firstUpdated(): Promise<void> {
    this._selectedItem = this.initialItem;
    this._hidden = true;
    this._active = false;
    this.requestUpdate();
  }

  render(): LitTemplateResult {
    const stylesButton = {
      backgroundColor: this._active ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.15)",
    };
    const stylesOptions = {
      opacity: this._hidden ? 0.0 : 1.0,
      transform: this._hidden ? "scaleY(0.0)" : "scaleY(1.0)",
    };
    return this.availableOptions
      ? html`
          <button
            class="ac-ui-select-button"
            style=${styleMap(stylesButton)}
            @click=${this._showOptions}
            @mouseenter=${this._setActive}
            @mouseleave=${this._setInactive}
          >
            ${this._selectedItem ? this._selectedItem : this.placeholder}
            <ha-svg-icon .path=${mdiChevronDown}></ha-svg-icon>
          </button>
          <div class="ac-ui-select-options" style=${styleMap(stylesOptions)}>
            ${this._renderOptions()}
          </div>
        `
      : nothing;
  }

  private _renderOptions(): Generator<unknown, void, LitTemplateResult> {
    return map(
      Object.keys(this.availableOptions as object),
      (key: string | number, _index: number): LitTemplateResult => {
        return html`
          <anycubic-ui-select-dropdown-item
            .item=${(this.availableOptions as object)[key]}
            .item_key=${key}
            @click=${this._selectItem}
          ></anycubic-ui-select-dropdown-item>
        `;
      },
    );
  }

  private _showOptions = (): void => {
    this._hidden = false;
  };

  private _hideOptions = (): void => {
    this._hidden = true;
  };

  private _setActive = (): void => {
    this._active = true;
  };

  private _setInactive = (): void => {
    this._active = false;
  };

  private _selectItem = (ev: DomClickEvent<EvtTargItemKey>): void => {
    if (!this.availableOptions) {
      return;
    }
    const key = ev.currentTarget.item_key;
    this._selectedItem = this.availableOptions[key] as string | undefined;
    fireEvent(this, "ac-select-dropdown", {
      key: key,
      value: this.availableOptions[key] as string | undefined,
    });
    this._hidden = true;
  };

  static get styles(): CSSResult {
    return css`
      :host {
        box-sizing: border-box;
        width: 100%;
        position: relative;
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        border-radius: 8px;
      }

      .ac-ui-select-button {
        width: 100%;
        border: none;
        outline: none;
        padding: 0 16px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: bold;
        line-height: 48px;
        border-radius: 8px;
        text-align: left;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: rgba(0, 0, 0, 0.05);
        align-items: center;
        color: var(--primary-text-color);
      }

      .ac-ui-select-options {
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        overflow: hidden;
        box-shadow:
          0px 10px 20px rgba(0, 0, 0, 0.19),
          0px 6px 6px rgba(0, 0, 0, 0.23);
        z-index: 11;
        opacity: 0;
        transform: scaleY(0);
        transform-origin: top center;
      }
    `;
  }
}

import { mdiCheck, mdiChevronDown, mdiChevronUp } from "@mdi/js";

import { LitElement, html, nothing, css, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit-html/directives/style-map.js";

import { customElementIfUndef } from "../../internal/register-custom-element";

@customElementIfUndef("anycubic-ui-multi-select-reorder-item")
export class AnycubicUIMultiSelectReorderItem extends LitElement {
  @property()
  public item: any;

  @property()
  public selectedItems: any[];

  @property()
  public unusedItems: any[];

  @property()
  public reorder: (item: any, mod: number) => void;

  @property()
  public toggle: (item: any) => void;

  @state()
  private _isActive: boolean;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has("selectedItems") ||
      changedProperties.has("item")
    ) {
      this._isActive = this.selectedItems.includes(this.item);
    }
  }

  protected update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);
    if (
      changedProperties.has("_isActive") ||
      changedProperties.has("selectedItems") ||
      changedProperties.has("unusedItems") ||
      changedProperties.has("item")
    ) {
      this.style.top =
        String(
          this._isActive
            ? 56 * this.selectedItems.indexOf(this.item)
            : 56 *
                (this.selectedItems.length +
                  this.unusedItems.indexOf(this.item)),
        ) + "px";
    }
  }

  render(): any {
    const classesItemText = {
      "ac-ui-deselected": !this._isActive ? true : false,
    };
    return html`
      <button
        class="ac-ui-msr-select"
        @click="${(_e): void => {
          this.toggle(this.item);
        }}"
      >
        ${this._isActive
          ? html`<ha-svg-icon .path=${mdiCheck}></ha-svg-icon>`
          : nothing}
      </button>
      <p class="ac-ui-msr-itemtext ${classMap(classesItemText)}">
        ${this.item}
      </p>
      <div>
        <button
          class="ac-ui-msr-position"
          @click="${(_e): void => {
            this.reorder(this.item, 1);
          }}"
        >
          <ha-svg-icon .path=${mdiChevronDown}></ha-svg-icon>
        </button>
        <button
          class="ac-ui-msr-position"
          @click="${(_e): void => {
            this.reorder(this.item, -1);
          }}"
        >
          <ha-svg-icon .path=${mdiChevronUp}></ha-svg-icon>
        </button>
      </div>
    `;
  }

  static get styles(): any {
    return css`
      :host {
        box-sizing: border-box;
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .ac-ui-msr-itemtext {
        flex-grow: 1;
        font-size: 16px;
        font-weight: bold;
        line-height: 24px;
      }

      .ac-ui-msr-select {
        box-sizing: border-box;
        width: 24px;
        height: 24px;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0.1);
        outline: none;
        border: none;
        margin-right: 16px;
        padding: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--primary-text-color);
        cursor: pointer;
      }

      .ac-ui-msr-position {
        box-sizing: border-box;
        width: 24px;
        height: 24px;
        border-radius: 8px;
        background-color: transparent;
        outline: none;
        border: none;
        margin-left: 16px;
        color: var(--primary-text-color);
        cursor: pointer;
      }
    `;
  }
}

@customElementIfUndef("anycubic-ui-multi-select-reorder")
export class AnycubicUIMultiSelectReorder extends LitElement {
  @property()
  public availableOptions: any;

  @property()
  public initialItems: any[];

  @property()
  public onChange: (sel: any[]) => void;

  @state()
  private _allOptions: any[];

  @state()
  private _selectedItems: any[];

  @state()
  private _unusedItems: any[];

  async firstUpdated(): void {
    this._allOptions = Object.values(this.availableOptions);
    this._selectedItems = [...this.initialItems].filter((item) =>
      this._allOptions.includes(item),
    );
    this._unusedItems = this._allOptions.filter(
      (item) => !this.initialItems.includes(item),
    );
    this.requestUpdate();
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("_selectedItems")) {
      this.onChange(this._selectedItems);
    }
  }

  render(): any {
    const stylesCont = {
      height: this._allOptions
        ? String(this._allOptions.length * 56) + "px"
        : "0px",
    };
    return this._allOptions
      ? html`
          <div style=${styleMap(stylesCont)}>
            ${map(this._allOptions, (item, _index) => {
              return html`
                <anycubic-ui-multi-select-reorder-item
                  .item=${item}
                  .selectedItems=${this._selectedItems}
                  .unusedItems=${this._unusedItems}
                  .reorder=${(item, mod): void => this._reorder(item, mod)}
                  .toggle=${(item): void => this._toggle(item)}
                ></anycubic-ui-multi-select-reorder-item>
              `;
            })}
          </div>
        `
      : nothing;
  }

  private _reorder(item, mod): void {
    const ind = this._selectedItems.indexOf(item);
    const newPos = ind + mod;

    if (newPos < 0 || newPos > this._selectedItems.length - 1) {
      return;
    }

    const clone = this._selectedItems.slice(0);
    const tmp = clone[newPos];
    clone[newPos] = item;
    clone[ind] = tmp;

    this._selectedItems = clone;
  }

  private _toggle(item): void {
    if (this._selectedItems.includes(item)) {
      const i = this._selectedItems.indexOf(item);

      this._selectedItems = [
        ...this._selectedItems.slice(0, i),
        ...this._selectedItems.slice(i + 1),
      ];

      this._unusedItems = [item, ...this._unusedItems];
    } else {
      const i = this._unusedItems.indexOf(item);

      this._unusedItems = [
        ...this._unusedItems.slice(0, i),
        ...this._unusedItems.slice(i + 1),
      ];

      this._selectedItems = [...this._selectedItems, item];
    }
  }

  static get styles(): any {
    return css`
      :host {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
      }
    `;
  }
}

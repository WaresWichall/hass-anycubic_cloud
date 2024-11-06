/* eslint-disable @typescript-eslint/no-explicit-any */
import { mdiCheck, mdiChevronDown, mdiChevronUp } from "@mdi/js";

import { CSSResult, LitElement, PropertyValues, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import { customElementIfUndef } from "../../internal/register-custom-element";
import {
  DomClickEvent,
  EvtTargDirection,
  LitTemplateResult,
} from "../../types";

@customElementIfUndef("anycubic-ui-multi-select-reorder-item")
export class AnycubicUIMultiSelectReorderItem extends LitElement {
  @property()
  public item: any;

  @property({ attribute: "selected-items" })
  public selectedItems: any[];

  @property({ attribute: "unused-items" })
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

  protected update(changedProperties: PropertyValues): void {
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

  render(): LitTemplateResult {
    const classesItemText = {
      "ac-ui-deselected": !this._isActive,
    };
    return html`
      <button class="ac-ui-msr-select" @click=${this._toggle_item}>
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
          .direction=${1}
          @click=${this._reorder_item}
        >
          <ha-svg-icon .path=${mdiChevronDown}></ha-svg-icon>
        </button>
        <button
          class="ac-ui-msr-position"
          .direction=${-1}
          @click=${this._reorder_item}
        >
          <ha-svg-icon .path=${mdiChevronUp}></ha-svg-icon>
        </button>
      </div>
    `;
  }

  private _toggle_item = (): void => {
    this.toggle(this.item);
  };

  private _reorder_item = (ev: DomClickEvent<EvtTargDirection>): void => {
    if (this._isActive) {
      this.reorder(this.item, ev.currentTarget.direction);
    }
  };

  static get styles(): CSSResult {
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
  @property({ attribute: "available-options" })
  public availableOptions: object;

  @property({ attribute: "initial-items" })
  public initialItems: (string | number)[];

  @property({ attribute: "on-change" })
  public onChange: (sel: (string | number)[]) => void;

  @state()
  private _allOptions: (string | number)[];

  @state()
  private _selectedItems: (string | number)[];

  @state()
  private _unusedItems: (string | number)[];

  // eslint-disable-next-line @typescript-eslint/require-await
  async firstUpdated(): Promise<void> {
    this._allOptions = Object.values(this.availableOptions) as (
      | string
      | number
    )[];
    this._setSelectedItems(
      [...this.initialItems].filter((item: string | number) =>
        this._allOptions.includes(item),
      ),
    );
    this._unusedItems = this._allOptions.filter(
      (item) => !this.initialItems.includes(item),
    );
    this.requestUpdate();
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);
  }

  render(): LitTemplateResult {
    const stylesCont = {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      height: this._allOptions
        ? String(this._allOptions.length * 56) + "px"
        : "0px",
    };
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return this._allOptions
      ? html`
          <div style=${styleMap(stylesCont)}>
            ${map(this._allOptions, (item, _index) => {
              return html`
                <anycubic-ui-multi-select-reorder-item
                  .item=${item}
                  .selectedItems=${this._selectedItems}
                  .unusedItems=${this._unusedItems}
                  .reorder=${this._reorder}
                  .toggle=${this._toggle}
                ></anycubic-ui-multi-select-reorder-item>
              `;
            })}
          </div>
        `
      : nothing;
  }

  private _setSelectedItems(selectedItems: (string | number)[]): void {
    this._selectedItems = selectedItems;
    this.onChange(this._selectedItems);
  }

  private _reorder = (item: string | number, mod: number): void => {
    const ind = this._selectedItems.indexOf(item);
    const newPos = ind + mod;

    if (newPos < 0 || newPos > this._selectedItems.length - 1) {
      return;
    }

    const clone = this._selectedItems.slice(0);
    const tmp = clone[newPos];
    clone[newPos] = item;
    clone[ind] = tmp;

    this._setSelectedItems(clone);
  };

  private _toggle = (item: string | number): void => {
    if (this._selectedItems.includes(item)) {
      const i = this._selectedItems.indexOf(item);

      this._setSelectedItems([
        ...this._selectedItems.slice(0, i),
        ...this._selectedItems.slice(i + 1),
      ]);

      this._unusedItems = [item, ...this._unusedItems];
    } else {
      const i = this._unusedItems.indexOf(item);

      this._unusedItems = [
        ...this._unusedItems.slice(0, i),
        ...this._unusedItems.slice(i + 1),
      ];

      this._setSelectedItems([...this._selectedItems, item]);
    }
  };

  static get styles(): CSSResult {
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

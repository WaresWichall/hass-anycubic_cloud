from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path
from typing import Any

ROOT_DIR = Path(os.path.dirname(os.path.dirname(__file__)))
OUT_STRINGS_PATH = ROOT_DIR / "strings.json"
TRANSLATIONS_DIR = ROOT_DIR / "translations"
INPUT_TRANSLATIONS_DIR = TRANSLATIONS_DIR / "input_translation_files"
IN_STRINGS_PATH = INPUT_TRANSLATIONS_DIR / "en.json"

REX_TRANSLATION_KEY = r"\[\%key:([a-z0-9_]+(?:::(?:[a-z0-9-_])+)+(?:{[\w\d\-_ ]+})*)\%\]"
REX_DICT_TRANSLATION_KEY = r"\[\%dictkey:([a-z0-9_]+(?:::(?:[a-z0-9-_#])+)+)\%\]"
REX_VAR_SUB = r"{([\w\d\-_ ]+)}"


def substitute_translation_references(
    integration_strings: dict[str, Any],
    shared_translations: dict[str, Any],
) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in integration_strings.items():
        ref_key, ref_dict = substitute_dict_reference(key, shared_translations)
        if ref_key and ref_dict:
            result[ref_key] = substitute_translation_references(ref_dict, shared_translations)
        else:
            if isinstance(value, dict):
                sub_dict = substitute_translation_references(value, shared_translations)
                result[key] = sub_dict
            elif isinstance(value, str):
                result[key] = substitute_reference(value, shared_translations)

    return result


def get_key_parts(key: str) -> list[str]:
    return key.replace("common::", "").split("::")


def substitute_dict_reference(
    translation_key: str,
    shared_translations: dict[str, Any],
) -> tuple[str | None, dict[str, Any] | None]:
    matches = re.findall(REX_DICT_TRANSLATION_KEY, translation_key)
    if not matches:
        return None, None

    for matched_reference in matches:
        key_parts = get_key_parts(matched_reference)

        found_translations = shared_translations

        for idx, key in enumerate(key_parts):
            if key in found_translations:
                if idx == len(key_parts) - 1:
                    cleaned_key = key.split("#")[0]
                    return cleaned_key, found_translations[key]
                else:
                    found_translations = found_translations[key]

    print(f"Invalid substitution key '{translation_key}'")
    sys.exit(1)


def get_key_without_vars(key: str) -> str:
    l_split = key.split("{")
    if len(l_split) > 1:
        r_split = key.rsplit("}", 1)
        if len(r_split) > 1:
            return l_split[0] + r_split[-1]

    return key


def substitute_reference(
    value: str,
    shared_translations: dict[str, Any],
) -> str:
    matches = re.findall(REX_TRANSLATION_KEY, value)
    if not matches:
        return value

    new = value
    for matched_reference in matches:
        key_parts = get_key_parts(matched_reference)

        found_translations = shared_translations

        for idx, key in enumerate(key_parts):
            stripped_key = get_key_without_vars(key)

            if stripped_key in found_translations:
                if idx == len(key_parts) - 1:
                    if stripped_key in found_translations:
                        matching_translation = found_translations[stripped_key]
                        var_matches = re.findall(REX_VAR_SUB, key)
                        if var_matches:
                            matching_translation = matching_translation.format(*var_matches)
                        new = new.replace(
                            f"[%key:{matched_reference}%]",
                            # New value can also be a substitution reference
                            substitute_reference(
                                matching_translation, shared_translations
                            ),
                        )
                    else:
                        print(f"Invalid substitution key '{key}' found in string '{value}'")
                        sys.exit(1)
                else:
                    found_translations = found_translations[stripped_key]

    return new


def read_input_strings(file_path: Path) -> dict[str, Any]:
    input_string_data = file_path.read_text()
    input_string_dict: dict[str, Any] = json.loads(input_string_data)

    return input_string_dict


def run_single(
    file_path: Path
) -> None:
    print(f"Generating translations for {file_path.name}.")

    input_strings = read_input_strings(file_path)

    shared_translations = input_strings['common']

    output_strings = substitute_translation_references(
        input_strings, shared_translations
    )

    output_strings.pop("common")

    translated_dump = json.dumps(
        output_strings,
        indent=2,
    )

    (TRANSLATIONS_DIR / file_path.name).write_text(
        translated_dump
    )

    if file_path.name == "en.json":
        OUT_STRINGS_PATH.write_text(
            translated_dump
        )


def translate_all() -> None:
    for lang_file in INPUT_TRANSLATIONS_DIR.iterdir():
        run_single(lang_file)


translate_all()

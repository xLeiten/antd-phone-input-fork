"use client";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { ConfigContext } from "antd/es/config-provider";
import { FormContext } from "antd/es/form/context";
import { useWatch } from "antd/es/form/Form";
import Select from "antd/es/select";
import Input from "antd/es/input";
import { checkValidity, cleanInput, displayFormat, getCountry, getDefaultISO2Code, getFormattedNumber, getMetadata, getRawValue, parsePhoneNumber, useMask, usePhone, } from "react-phone-hooks";
import locale from "./locale";
import { injectMergedStyles } from "./styles";
const PhoneInput = forwardRef((_a, forwardedRef) => {
    var { value: initialValue = "", country = getDefaultISO2Code(), disabled = false, enableArrow = false, enableSearch = false, disableDropdown = false, disableParentheses = false, onlyCountries = [], excludeCountries = [], preferredCountries = [], searchNotFound: defaultSearchNotFound = "No country found", searchPlaceholder: defaultSearchPlaceholder = "Search country", dropdownRender = (node) => node, onMount: handleMount = () => null, onInput: handleInput = () => null, onChange: handleChange = () => null, onKeyDown: handleKeyDown = () => null } = _a, antInputProps = __rest(_a, ["value", "country", "disabled", "enableArrow", "enableSearch", "disableDropdown", "disableParentheses", "onlyCountries", "excludeCountries", "preferredCountries", "searchNotFound", "searchPlaceholder", "dropdownRender", "onMount", "onInput", "onChange", "onKeyDown"]);
    const formInstance = useFormInstance();
    const { locale = {} } = useContext(ConfigContext);
    const formContext = useContext(FormContext);
    const { getPrefixCls } = useContext(ConfigContext);
    const inputRef = useRef(null);
    const searchRef = useRef(null);
    const selectedRef = useRef(false);
    const initiatedRef = useRef(false);
    const [query, setQuery] = useState("");
    const [minWidth, setMinWidth] = useState(0);
    const [countryCode, setCountryCode] = useState(country);
    const { searchNotFound = defaultSearchNotFound, searchPlaceholder = defaultSearchPlaceholder, countries = new Proxy({}, ({ get: (_, prop) => prop })), } = locale.PhoneInput || {};
    const prefixCls = getPrefixCls();
    injectMergedStyles(prefixCls);
    const { value, pattern, metadata, setValue, countriesList, } = usePhone({
        query,
        country,
        countryCode,
        initialValue,
        onlyCountries,
        excludeCountries,
        preferredCountries,
        disableParentheses,
    });
    const { onInput: onInputMaskHandler, onKeyDown: onKeyDownMaskHandler, } = useMask(pattern);
    const selectValue = useMemo(() => {
        let metadata = getMetadata(getRawValue(value), countriesList);
        metadata = metadata || getCountry(countryCode);
        return metadata ? metadata.iso + metadata.code : "";
    }, [countriesList, countryCode, value]);
    const namePath = useMemo(() => {
        let path = [];
        let formName = (formContext === null || formContext === void 0 ? void 0 : formContext.name) || "";
        let fieldName = (antInputProps === null || antInputProps === void 0 ? void 0 : antInputProps.id) || "";
        if (formName) {
            path.push(formName);
            fieldName = fieldName.slice(formName.length + 1);
        }
        return path.concat(fieldName.split("_"));
    }, [antInputProps, formContext]);
    const phoneValue = useWatch(namePath, formInstance);
    const setFieldValue = useCallback((value) => {
        if (formInstance)
            formInstance.setFieldValue(namePath, value);
    }, [formInstance, namePath]);
    const onKeyDown = useCallback((event) => {
        onKeyDownMaskHandler(event);
        handleKeyDown(event);
    }, [handleKeyDown, onKeyDownMaskHandler]);
    const onChange = useCallback((event) => {
        const formattedNumber = selectedRef.current ? event.target.value : getFormattedNumber(event.target.value, pattern);
        selectedRef.current = false;
        const phoneMetadata = parsePhoneNumber(formattedNumber, countriesList);
        setCountryCode(phoneMetadata.isoCode);
        setValue(formattedNumber);
        handleChange(Object.assign(Object.assign({}, phoneMetadata), { valid: (strict) => checkValidity(phoneMetadata, strict) }), event);
    }, [countriesList, handleChange, pattern, setValue]);
    const onInput = useCallback((event) => {
        onInputMaskHandler(event);
        handleInput(event);
    }, [onInputMaskHandler, handleInput]);
    const onMount = useCallback((value) => {
        setFieldValue(value);
        handleMount(value);
    }, [handleMount, setFieldValue]);
    const onDropdownVisibleChange = useCallback((open) => {
        if (open && enableSearch)
            setTimeout(() => searchRef.current.focus(), 100);
    }, [enableSearch]);
    const ref = useCallback((node) => {
        [forwardedRef, inputRef].forEach((ref) => {
            if (typeof ref === "function")
                ref(node);
            else if (ref != null)
                ref.current = node;
        });
    }, [forwardedRef]);
    useEffect(() => {
        const rawValue = getRawValue(phoneValue);
        const metadata = getMetadata(rawValue);
        // Skip if value has not been updated by `setFieldValue`.
        if (!(metadata === null || metadata === void 0 ? void 0 : metadata.mask) || rawValue === getRawValue(value))
            return;
        const formattedNumber = getFormattedNumber(rawValue, metadata === null || metadata === void 0 ? void 0 : metadata.mask);
        const phoneMetadata = parsePhoneNumber(formattedNumber);
        setFieldValue(Object.assign(Object.assign({}, phoneMetadata), { valid: (strict) => checkValidity(phoneMetadata, strict) }));
        setCountryCode(metadata === null || metadata === void 0 ? void 0 : metadata.iso);
        setValue(formattedNumber);
    }, [phoneValue, value, setFieldValue, setValue]);
    useEffect(() => {
        if (initiatedRef.current)
            return;
        initiatedRef.current = true;
        let initialValue = getRawValue(value);
        if (!initialValue.startsWith(metadata === null || metadata === void 0 ? void 0 : metadata.code)) {
            initialValue = metadata === null || metadata === void 0 ? void 0 : metadata.code;
        }
        const formattedNumber = getFormattedNumber(initialValue, pattern);
        const phoneMetadata = parsePhoneNumber(formattedNumber, countriesList);
        onMount(Object.assign(Object.assign({}, phoneMetadata), { valid: (strict) => checkValidity(phoneMetadata, strict) }));
        setCountryCode(phoneMetadata.isoCode);
        setValue(formattedNumber);
    }, [countriesList, metadata, onMount, pattern, setValue, value]);
    const countriesSelect = useMemo(() => (_jsx(Select, { suffixIcon: null, value: selectValue, disabled: disabled, open: disableDropdown ? false : undefined, onSelect: (selectedOption, { key }) => {
            const [_, mask] = key.split("_");
            const selectedCountryCode = selectedOption.slice(0, 2);
            const formattedNumber = displayFormat(cleanInput(mask, mask).join(""));
            const phoneMetadata = parsePhoneNumber(formattedNumber, countriesList, selectedCountryCode);
            setFieldValue(Object.assign(Object.assign({}, phoneMetadata), { valid: (strict) => checkValidity(phoneMetadata, strict) }));
            setCountryCode(selectedCountryCode);
            setValue(formattedNumber);
            setQuery("");
            selectedRef.current = true;
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(inputRef.current.input, formattedNumber);
            inputRef.current.input.dispatchEvent(new Event("change", { bubbles: true }));
            inputRef.current.input.focus();
        }, optionLabelProp: "label", dropdownStyle: { minWidth }, notFoundContent: searchNotFound, onDropdownVisibleChange: onDropdownVisibleChange, dropdownRender: (menu) => (_jsxs("div", { className: `${prefixCls}-phone-input-search-wrapper`, children: [enableSearch && (_jsx(Input, { value: query, ref: searchRef, placeholder: searchPlaceholder, onInput: ({ target }) => setQuery(target.value) })), menu] })), children: countriesList.map(({ iso, name, code: dial, mask: pattern }) => {
            const mask = disableParentheses ? pattern.replace(/[()]/g, "") : pattern;
            return (_jsx(Select.Option, { value: iso + dial, label: _jsxs(_Fragment, { children: [_jsx("div", { className: `flag ${iso}` }), enableArrow && (_jsx("span", { role: "img", className: "anticon", style: { paddingLeft: 8 }, children: _jsx("svg", { className: "icon", viewBox: "0 0 1024 1024", focusable: "false", fill: "currentColor", width: "16", height: "18", children: _jsx("path", { d: "M848 368a48 48 0 0 0-81.312-34.544l-0.016-0.016-254.784 254.784-251.488-251.488a48 48 0 1 0-71.04 64.464l-0.128 0.128 288 288 0.016-0.016a47.84 47.84 0 0 0 34.544 14.688h0.224a47.84 47.84 0 0 0 34.544-14.688l0.016 0.016 288-288-0.016-0.016c8.32-8.624 13.44-20.368 13.44-33.312z" }) }) }))] }), children: _jsxs("div", { className: `${prefixCls}-phone-input-select-item`, children: [_jsx("div", { className: `flag ${iso}` }), countries[name], "\u00A0", displayFormat(mask)] }) }, `${iso}_${mask}`));
        }) })), [selectValue, query, enableArrow, disabled, disableParentheses, disableDropdown, onDropdownVisibleChange, minWidth, searchNotFound, countries, countriesList, setFieldValue, setValue, prefixCls, enableSearch, searchPlaceholder]);
    return (_jsx("div", { className: `${prefixCls}-phone-input-wrapper`, ref: node => setMinWidth((node === null || node === void 0 ? void 0 : node.offsetWidth) || 0), children: _jsx(Input, Object.assign({ ref: ref, inputMode: "tel", value: value, onInput: onInput, onChange: onChange, onKeyDown: onKeyDown, addonBefore: dropdownRender(countriesSelect), disabled: disabled }, antInputProps)) }));
});
export default PhoneInput;
export { locale };

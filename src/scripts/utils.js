import mapValues from "lodash.mapvalues";
import stringParser from "./stringParser";

const isArray = (v) => Array.isArray(v);
const isObject = (obj) =>
  obj && typeof obj === "object" && obj.constructor === Object;
const isString = (v) => typeof v === "string";

const hasProperty = (obj, property) => isObject(obj) && property in obj;

const mapObject = (obj) => mapValues(obj, valueIterator);

const handleArray = (arr) =>
  arr.map((item) => {
    if (isString(item)) return stringParser(item);
    if (isObject(item)) return mapObject(item);
    if (isArray(item)) return handleArray(item);
    return item;
  });

const valueIterator = (value) => {
  if (isString(value)) return stringParser(value);
  if (isObject(value)) return mapValues(value, valueIterator);
  if (isArray(value)) return handleArray(value);
  return value;
};

const spreadPresets = (field) => {
  if (isString(field) || field.preset != null) {
    const isStringPreset = isString(field);
    const fieldValue = isStringPreset ? field : field.preset;
    const parsed = stringParser(fieldValue);
    if (typeof parsed === typeof fieldValue && fieldValue === parsed) {
      return isStringPreset ? null : field;
    }
    return {
      ...parsed,
      ...(isStringPreset ? {} : field)
    };
  }
  return field;
};

export { isArray, isObject, isString, hasProperty, mapObject, spreadPresets };

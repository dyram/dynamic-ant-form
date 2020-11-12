import get from "lodash.get";
import mapValues from "lodash.mapvalues";
import REGEX_CONSTANTS from "./regex";
import { isArray, isObject, isString } from "./utils";
const { PARSE_KEY, FUNCTION_START, PARSE_REGEX } = REGEX_CONSTANTS;

/**
 * This file is to parse collected form fields to a JSON schema
 */

const handleFunction = (parseable, collector) => {
  const keys = Object.keys(collector);
  try {
    return new Function(
      `{ ${keys.join(", ")} }`,
      "window",
      `return ${parseable.slice(FUNCTION_START.length)}`
    )(collector, window);
  } catch (e) {
    return undefined;
  }
};

const parseKey = (parseable, collector) => {
  if (!parseable.includes(PARSE_KEY)) return parseable;
  if (parseable.startsWith(FUNCTION_START)) {
    return handleFunction(parseable, collector);
  }
  return parseable.replace(PARSE_REGEX, (match) => {
    const matchWithoutParseKey = match.slice(PARSE_KEY.length);
    const getValueFromCollector = get(collector, matchWithoutParseKey);
    return getValueFromCollector;
  });
};

const handleArray = (arr, collector) =>
  arr.map((item) => {
    if (isString(item)) return parseKey(item, collector);
    if (isObject(item)) return handleSchema(item, collector);
    if (isArray(item)) return handleArray(item, collector);
    return item;
  });

const valueIterator = (collector) => (value) => {
  if (isString(value)) return parseKey(value, collector);
  if (isObject(value)) return mapValues(value, valueIterator(collector));
  if (isArray(value)) return handleArray(value, collector);
  return value;
};

const handleSchema = (schema, collector) =>
  mapValues(schema, valueIterator(collector));

const parseSchema = (schema, collectorParam = {}) => {
  if (!collectorParam) return null;
  const collector = isObject(collectorParam) ? collectorParam : {};
  if (isArray(schema))
    return handleSchema(
      {
        schema
      },
      collector
    ).schema;
  else if (isObject(schema)) return handleSchema(schema, collector);

  return schema;
};

export default parseSchema;

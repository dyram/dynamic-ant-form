const PARSE_KEY = "@";
const FUNCTION_START = `${PARSE_KEY}${PARSE_KEY}`;
const PARSE_JSONATA = `${PARSE_KEY}json`;
const PARSE_REGEX = new RegExp(
  `(\\${PARSE_KEY})([^\\${PARSE_KEY}\\s[\\]][-\\w\\d]*(\\.\\w+)*)(?=[^-\\w\\d]{0,})`,
  "gi"
);

export default { PARSE_KEY, FUNCTION_START, PARSE_JSONATA, PARSE_REGEX };

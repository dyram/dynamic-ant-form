import get from "lodash.get";
import merge from "lodash.merge";
import plugin from "js-plugin";
import REGEX_CONSTANTS from "./regex";
const { PARSE_KEY, FUNCTION_START, PARSE_REGEX } = REGEX_CONSTANTS;

const parseFunction = (parseable, invokable) => {
  const keys = Object.keys(invokable);
  try {
    return new Function(
      `{ ${keys.join(", ")} }`,
      `return ${parseable.slice(FUNCTION_START.length)}`
    )(invokable);
  } catch (e) {
    return parseable;
  }
};

const stringParser = (parseable) => {
  if (typeof parseable !== "string" || !parseable.includes(PARSE_KEY))
    return parseable;

  const invokable = merge(
    plugin.invoke("FormUtilities"),
    plugin.invoke("ParserArguments.argumentsObject")
  )[0];
  if (parseable.startsWith(FUNCTION_START)) {
    return parseFunction(parseable, invokable);
  }

  const property = parseable.replace(PARSE_REGEX, (match) =>
    match.slice(PARSE_KEY.length)
  );

  return get(invokable, property, parseable);
};

export default stringParser;

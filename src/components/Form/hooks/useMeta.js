import { useEffect, useState } from "react";
import { mapObject, spreadPresets, isArray } from "../../../scripts/utils";

const parseFields = ({ fields }) => {
  return fields
    .map(spreadPresets)
    .map((field) => {
      let widgetName = field.widget || "input";
      return {
        ...field,
        widgetProps: {
          ...field.widgetProps,
          className: `form-builder__element form-builder__${widgetName}`
        }
      };
    })
    .filter((field) => field?.key)
    .map((field) => mapObject(field));
};

const bindArrayKeys = (form, bindArray, field, forceUpdate) => {
  return Object.keys(field).reduce((acc, k) => {
    if (bindArray.includes(k) && typeof field[k] === "function") {
      acc[k] = field[k]({ form, forceUpdate, key: field.key });
      return acc;
    }
    acc[k] = field[k];
    return acc;
  }, {});
};

const bindFormToKey = (fields, form, forceUpdate) =>
  fields.map((field) => {
    if (field.bind) {
      if (typeof field.bind === "string") {
        const fieldKeyToBind = field[field.bind];
        if (fieldKeyToBind && typeof fieldKeyToBind === "function") {
          return {
            ...field,
            [field.bind]: fieldKeyToBind({
              form,
              forceUpdate,
              key: field.key
            })
          };
        }
      } else if (Array.isArray(field.bind)) {
        return bindArrayKeys(form, field.bind, field, forceUpdate);
      }
    }

    return field;
  });

const parseMeta = (meta, form, forceUpdate) => {
  const parsedFields = parseFields(meta);
  const applyBindings = bindFormToKey(parsedFields, form, forceUpdate);

  return {
    ...meta,
    fields: applyBindings
  };
};

const processForm = (meta, form, forceUpdate) => {
  if (isArray(meta)) {
    return meta.map((singleMeta) => {
      return parseMeta(singleMeta, form, forceUpdate);
    });
  }

  return parseMeta(meta, form, forceUpdate);
};

const useMeta = (configMeta, form, forceUpdate) => {
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState([]);

  useEffect(() => {
    const processedMeta = processForm(configMeta, form, forceUpdate);
    setMeta(processedMeta);
    setIsLoading(false);
  }, [configMeta, form, forceUpdate]);

  return {
    isLoading,
    meta
  };
};

export default useMeta;

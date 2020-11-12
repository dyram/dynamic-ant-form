import { useEffect, useState } from "react";
import CryptoJS from "crypto-js/core";
import parseSchema from "../../../scripts/parseSchema";

const encryptPayload = (payload, encryptionKey) => {
  const encodePayload = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
  return CryptoJS.AES.encrypt(
    encodePayload,
    CryptoJS.enc.Base64.parse(encryptionKey),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString();
};

const useSchema = (schema, encryptionKey) => {
  const [collector, setCollector] = useState(undefined);

  useEffect(() => {
    const schemaResult = parseSchema(schema, collector);
    if (schemaResult && collector) {
      if (encryptionKey) {
        const encryptedPayload = encryptPayload(schemaResult, encryptionKey);
        console.log({ encryptedPayload });
        return;
      }
      console.log({ schemaResult });
      return;
    }
  }, [collector, schema, encryptionKey]);

  return [collector, setCollector];
};

export default useSchema;

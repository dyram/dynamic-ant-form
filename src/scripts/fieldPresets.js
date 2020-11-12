const cardNumber = {
  key: "cardNumber",
  colSpan: 2,
  label: "Card Number",
  widget: "Card",
  rules: "@cardNumberRules",
  normalize: "@formatCard",

  widgetProps: {
    maxLength: 19 // 16 digits + 3 max spaces
  }
};

const securityCode = {
  bind: "rules",
  key: "securityCode",
  label: "Security Code",
  tooltip: "Enter a three or four digit security code",
  rules: "@cscRules",
  widget: "password",
  normalize: "@normalizeNumber",

  formItemProps: {
    // dependencies: ["cardNumber"]
  },
  widgetProps: {
    maxLength: 4
  }
};

const expirationMonth = {
  key: "expirationMonth",
  widget: "select",
  label: "Expiration Month",
  options: "@@useMonthGenerator()",
  required: true,
  message: "Expiration Month is Required"
};

const expirationYear = {
  key: "expirationYear",
  widget: "select",
  label: "Expiration Year",
  required: "true",
  message: "Expiration Year is Required",
  options: "@@useYearGenerator()"
};

const zipCode = {
  key: "zipCode",
  label: "Zip Code",
  rules: "@zipCodeRules",

  widgetProps: {
    maxLength: 5
  }
};

const paymentAmount = {
  bind: "onChange",
  key: "paymentAmount",
  label: "Payment Amount",
  normalize: "@normalizePaymentAmount",
  widgetProps: {
    maxLength: 12
  },
  rules: "@paymentAmountRules",

  onChange: "@onPaymentAmountChange"
};

const cardName = {
  key: "cardName",
  colSpan: 2,

  label: "Name On Card",
  required: true,
  message: "Name on Card is Required"
};

const paymentFee = {
  bind: ["onChange"],
  key: "paymentFee",
  label: "Payment Fee",
  widget: "select",

  onChange: "@onPaymentFeeChange",
  options: [
    {
      label: "$0",
      value: 0
    },
    {
      label: "$4",
      value: 4
    }
  ]
};

const totalPayment = {
  bind: "getInitialValue",
  key: "totalPayment",
  label: "Total Payment",
  getInitialValue: "@getInitialTotalPayment",
  colSpan: 2,
  disabled: true,
  readOnly: true
};

const saveCard = {
  key: "saveCard",
  widget: "checkbox",
  colSpan: 4,
  initialValue: false,
  children: "Save this card for use on future payments"
};

const submitButton = {
  key: "submitButton",
  widget: "button",
  children: "Submit",
  widgetProps: {
    htmlType: "submit"
  },
  colSpan: 2
};

export {
  cardNumber,
  securityCode,
  expirationMonth,
  expirationYear,
  zipCode,
  paymentAmount,
  cardName,
  paymentFee,
  totalPayment,
  saveCard,
  submitButton
};

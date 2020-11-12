const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const checkCardType = (value = {}) => {
  const americanExpress = /^(?:3[47][0-9]{13})$/;
  const visa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  const mastercard = /^(?:5[1-5][0-9]{14})$/;
  const discover = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
  const diner = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
  const isValidCard =
    [
      {
        card: "American Express",
        regex: RegExp(americanExpress)
      },
      {
        card: "Diners",
        regex: RegExp(diner)
      },
      {
        card: "Discover",
        regex: RegExp(discover)
      },
      {
        card: "Mastercard",
        regex: RegExp(mastercard)
      },
      {
        card: "Visa",
        regex: RegExp(visa)
      }
    ].find(({ regex }) => regex.test(value.cardNumber)) || false;

  return isValidCard !== false ? isValidCard.card : false;
};

const cardNumberRules = [
  {
    required: true,
    message: "Card Number Must be Filled"
  },
  {
    validateTrigger: "onSubmit",
    validator: (_, value) => {
      return new Promise((resolve, reject) => {
        if (value === "") {
          reject();
        } else {
          const isValidCard = checkCardType(value);
          if (isValidCard) {
            resolve();
          }
          reject(new Error(`Card Number is Invalid`));
        }
      });
    }
  }
];

const paymentAmountDisplay = (event) => {
  const amount = event.target.value;
  const parsedAmount = parseFloat(amount);
  if (amount === "" || Number.isNaN(parsedAmount) || parsedAmount < 0) {
    return "";
  }

  const fixedAmount = parsedAmount.toFixed(2);
  const indexOfDot = amount.indexOf(".");
  if (indexOfDot !== -1) {
    return amount.length - indexOfDot - 1 > 2 ? fixedAmount : amount;
  }
  return amount;
};

const normalizeNumber = (value = "") => {
  return value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
};

const formatCard = (value = {}) => {
  const removedCardSpaces = (value.cardNumber.startsWith("\u2022")
    ? value.display.slice(0, value.display.length - 1)
    : value.cardNumber
  )
    .replace(/\s+/g, "")
    .replace(/[^0-9]/gi, "");
  const matches = removedCardSpaces.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  let segments = [];
  for (let i = 0; i < match.length; i += 4) {
    segments = [...segments, match.slice(i, i + 4)];
  }
  let displayedCard = removedCardSpaces;

  const isValidCard = checkCardType({ cardNumber: removedCardSpaces });
  let cardType = "";
  if (isValidCard !== false) {
    cardType = isValidCard;
  }
  let unhidden = "";
  if (segments.length) {
    displayedCard = segments.join(" ");
    unhidden = displayedCard;
    if (isValidCard) {
      displayedCard = displayedCard
        .split("")
        .map((ch, index) => {
          if (index < displayedCard.length - 5) {
            if (ch === " ") return ch;
            return "\u2022";
          }
          return ch;
        })
        .join("");
    }
  }

  return {
    cardNumber: removedCardSpaces,
    display: displayedCard,
    unhidden,
    cardType
  };
};

const paymentAmountRules = [
  {
    required: true,
    message: "Payment Must Be Completed"
  },
  {
    validateTrigger: "onSubmit",
    validator: (_, value) => {
      const dueAmount = window.dueAmount || false;
      const rawValue = value ? parseFloat(value.slice(1)) : false;
      return new Promise((resolve, reject) => {
        if (dueAmount && rawValue !== false && rawValue > dueAmount) {
          reject(new Error("Payment is More than Amount Due"));
        } else if (!rawValue) {
          reject();
        } else {
          resolve();
        }
      });
    }
  }
];

const normalizePaymentAmount = (value = "") => {
  if (value === "$") return null;
  let filteredValue = value.replace(/\s+/g, "").replace(/[^0-9.]/gi, "");
  if (filteredValue.startsWith("00") || filteredValue === "") return `$0`;
  if (
    filteredValue.startsWith("0") &&
    filteredValue.length > 1 &&
    !filteredValue.includes(".")
  )
    filteredValue = filteredValue.slice(1);
  const matchDots = filteredValue.match(/\./gi) || [];
  if (matchDots.length > 1) {
    return `$${parseFloat(filteredValue)}`;
  } else if (matchDots.length === 1) {
    const indexOfDot = filteredValue.indexOf(".");
    const charactersAfterDot = filteredValue.length - indexOfDot - 1;

    return charactersAfterDot > 2
      ? `$${parseFloat(filteredValue).toFixed(2)}`
      : `$${filteredValue}`;
  }
  return `$${filteredValue}`;
};

const cscRules = ({ key }) => {
  return [
    {
      required: true,
      message: "Card Security Code is Required"
    },
    ({ getFieldValue }) => ({
      validateTrigger: "onSubmit",
      validator: (_, value) => {
        const getCardFromKey =
          key === "securityCode" ? "cardNumber" : "serviceCard_cardNumber";
        const { cardType } = getFieldValue(getCardFromKey);
        return new Promise((resolve, reject) => {
          if (cardType && value) {
            if (cardType === "American Express") {
              if (value.length !== 4) {
                reject(
                  new Error("American Express Requires a 4 Digit Security Code")
                );
              }
              resolve();
            } else if (value.length !== 3) {
              reject(new Error(`${cardType} Requires a 3 Digit Security Code`));
            }
            resolve();
          }

          if (value) {
            reject(new Error("Invalid Code"));
          }
          reject();
        });
      }
    })
  ];
};

const useMonthGenerator = () => {
  return MONTHS.map((month, index) => {
    const keyValue = `${index + 1}`.padStart(2, "0");
    return {
      label: `${keyValue} - ${month}`,
      value: keyValue
    };
  });
};

const zipCodeRules = [
  {
    required: true,
    message: "Enter Zip Code Associated with Card"
  },
  {
    validateTrigger: "onSubmit",
    validator: (_, value) => {
      return new Promise((resolve, reject) => {
        if (value && value.length > 0 && value.length < 5) {
          reject(new Error("Zip Code must be 5 digits"));
        } else {
          resolve();
        }
      });
    }
  }
];

const useYearGenerator = (max = 20) => {
  const currentYear = new Date().getFullYear();
  let end = max;
  if (typeof end !== "number") end = 20;
  let options = [];
  for (let i = 0; i <= end; i++) {
    const year = `${currentYear + i}`;
    options.push({
      label: year,
      value: parseInt(year.slice(-2), 10)
    });
  }
  return options;
};

const onPaymentAmountChange = ({ form, forceUpdate, key }) => ({
  target: { value }
}) => {
  const paymentFee =
    form.getFieldValue(
      key === "paymentAmount" ? "paymentFee" : "serviceCard_paymentFee"
    ) || 0;

  let paymentAmount = 0;
  if (value != null) {
    if (value.includes("$")) {
      paymentAmount = parseFloat(value.slice(1) || "0");
    } else {
      paymentAmount = parseFloat(value);
      if (isNaN(paymentAmount)) paymentAmount = 0;
    }
  }
  const totalPayment = `$${Number(paymentFee + paymentAmount).toFixed(2)}`;
  const keyToUpdate =
    key === "paymentAmount" ? "totalPayment" : "serviceCard_totalPayment";
  form.setFieldsValue({
    [keyToUpdate]: totalPayment
  });
  forceUpdate();
};

const onPaymentFeeChange = ({ form, key, forceUpdate }) => (value) => {
  let paymentAmount =
    form.getFieldValue(
      key === "paymentFee" ? "paymentAmount" : "serviceCard_paymentAmount"
    ) || 0;
  if (paymentAmount != null && typeof paymentAmount === "string") {
    if (paymentAmount.includes("$")) {
      paymentAmount = parseFloat(paymentAmount.slice(1) || "0");
    } else {
      paymentAmount = parseFloat(paymentAmount);
    }
  }
  const totalPayment = `$${Number(value + paymentAmount).toFixed(2)}`;

  const keyToUpdate =
    key === "paymentFee" ? "totalPayment" : "serviceCard_totalPayment";
  form.setFieldsValue({
    [keyToUpdate]: totalPayment
  });
  forceUpdate();
};

const getInitialTotalPayment = ({ key }) => (_field, _initialValues, form) => {
  const getFieldFromKey =
    key === "totalPayment" ? "paymentAmount" : "serviceCard_paymentAmount";
  const initialPaymentAmount = form.getFieldValue(getFieldFromKey);
  return initialPaymentAmount || "$0.00";
};

export {
  checkCardType,
  cardNumberRules,
  paymentAmountDisplay,
  normalizeNumber,
  formatCard,
  paymentAmountRules,
  normalizePaymentAmount,
  cscRules,
  useMonthGenerator,
  zipCodeRules,
  useYearGenerator,
  onPaymentAmountChange,
  onPaymentFeeChange,
  getInitialTotalPayment
};

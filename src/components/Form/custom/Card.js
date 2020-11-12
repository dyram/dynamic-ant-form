import React, { useState } from "react";
import { Input } from "antd";
import Card from "./Icons";

const Suffix = ({ setToggleHiddenCard, value }) => {
  if (!value.cardType) return <span />;
  let Icon = Card[value.cardType];
  if (!Icon) {
    return <span />;
  }

  return (
    <span onClick={() => setToggleHiddenCard((v) => !v)}>
      <Icon />
    </span>
  );
};

const CustomCard = ({
  suffix,
  value = {},
  onChange,
  allowClear = true,
  displayFull = true,
  ...restProps
}) => {
  const [toggleHiddenCard, setToggleHiddenCard] = useState(false);
  const defaultVisibility = displayFull
    ? value.unhidden || value.display
    : value.display;
  const onHideToggle = displayFull
    ? value.display
    : value.unhidden || value.display;
  return (
    <Input
      {...restProps}
      suffix={
        <Suffix setToggleHiddenCard={setToggleHiddenCard} value={value} />
      }
      value={toggleHiddenCard ? onHideToggle : defaultVisibility}
      onChange={(e) =>
        onChange({
          ...value,
          display: value.display.startsWith("\u2022")
            ? value.cardNumber
            : value.display,
          cardNumber: e.target.value
        })
      }
      allowClear={allowClear}
    />
  );
};

export default CustomCard;

import React from "react";
import { Radio, Row, Col } from "antd";
import Icons from "./Icons";
import { checkCardType } from "../../../scripts/formPresets";
import "./cardRadio.css";

const SingleCardRadio = ({ cardNumber, display }) => (
  <React.Fragment>
    <Col>
      <Radio>
        <span className="span__card-number">{cardNumber}</span>
      </Radio>
    </Col>
    <Col>
      <span>{display}</span>
    </Col>
  </React.Fragment>
);

const data = [
  {
    cardNumber: "340000000000009"
  },
  {
    cardNumber: "5500000000000004"
  }
];

const processCardNumber = (rawCardNumber, iconDimensions) => {
  const getCardType = checkCardType({ cardNumber: rawCardNumber });
  let cardNumber = [];
  for (let i = 0; i < rawCardNumber.length; i += 4) {
    cardNumber = [...cardNumber, rawCardNumber.slice(i, i + 4)];
  }

  const cardType = getCardType ? getCardType : "";
  const CardIcon = Icons[cardType];
  const CardDisplay = CardIcon ? CardIcon : React.Fragment;
  const cardDisplayProps = CardIcon ? iconDimensions : {};

  return {
    formattedCardNumber: cardNumber.join(" "),
    Card: <CardDisplay {...cardDisplayProps} />
  };
};

const CardRadio = ({
  cardNumber = "5197105342086328",
  colSpan = 2,
  iconDimensions = {
    width: "35px",
    height: "25px"
  }
}) => {
  const { formattedCardNumber, Card } = processCardNumber(
    cardNumber,
    iconDimensions
  );

  return (
    <Row
      className="wrapper__card-number"
      // gutter={[0, 20]}
      align="middle"
      justify="space-between"
    >
      <SingleCardRadio cardNumber={formattedCardNumber} display={Card} />
    </Row>
  );
};

export default CardRadio;

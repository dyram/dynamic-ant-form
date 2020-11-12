import React from "react";
import { Row } from "antd";
const Header = ({
  title,
  rowStyle,
  fieldsetStyle = {
    width: "100%",
    fontWeight: 600
  }
}) => (
  <Row style={rowStyle}>
    <fieldset style={fieldsetStyle}>
      <legend>{title}</legend>
    </fieldset>
  </Row>
);

export default Header;

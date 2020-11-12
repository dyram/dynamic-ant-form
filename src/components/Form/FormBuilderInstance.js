import FormBuilder from "antd-form-builder";
import CustomCard from "./custom/Card";
import CustomCardRadio from "./custom/CardRadio";
import Header from "./custom/Header";
// '$Presets' or '$$' functions cannot be called from here

FormBuilder.defineWidget("Card", CustomCard, (field) => {
  return {
    ...field,
    forwardRef: true,
    initialValue: {
      cardNumber: "",
      cardType: "",
      display: ""
    }
  };
});

FormBuilder.defineWidget("CardRadio", CustomCardRadio, (field) => {
  return {
    ...field,
    forwardRef: true
  };
});

FormBuilder.defineWidget("header", Header, (field) => {
  return {
    ...field,
    widgetProps: {
      title: field.title,
      rowStyle: field.rowStyle,
      fieldsetStyle: field.fieldsetStyle
    }
  };
});

const FormBuilderInstance = FormBuilder;

export default FormBuilderInstance;

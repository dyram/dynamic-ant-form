import React from "react";
import "./plugins/formPlugins";
import Form from "./components/Form";
import dashboard from "./config/dashboard";
import "./styles.css";

export default function App() {
  return (
    <div className="form__wrapper">
      <Form config={dashboard} />
    </div>
  );
}

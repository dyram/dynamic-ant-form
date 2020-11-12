import React, { useCallback } from "react";
import { Form as AntForm, Spin } from "antd";
import useForceUpdate from "./hooks/useForceUpdate";
import useMeta from "./hooks/useMeta";
import useSchema from "./hooks/useSchema";
import FormBuilderInstance from "./FormBuilderInstance";

const Form = ({ config }) => {
  const [form] = AntForm.useForm();
  const forceUpdate = useForceUpdate();
  const { isLoading, meta } = useMeta(config.meta, form, forceUpdate);
  const [, setCollector] = useSchema(config.schema, config.encryptionKey);
  const onFinish = useCallback((values) => {
    setCollector({ ...values });
  }, []);

  const onFinishFailed = useCallback(({ values, errorFields }) => {
    console.log({ values, errorFields });
  }, []);

  if (isLoading) {
    return <Spin tip="Loading..." />;
  }

  if (!meta.formItemLayout) {
    meta.formItemLayout = null;
  }
  const verticalLayout =
    meta.formItemLayout == null ? { layout: "vertical" } : {};

  return (
    <React.Fragment>
      <AntForm
        {...verticalLayout}
        {...config.formProps}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <FormBuilderInstance form={form} meta={meta} />
      </AntForm>
    </React.Fragment>
  );
};

export default Form;

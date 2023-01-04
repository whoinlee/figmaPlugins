import React, { Component, useState } from 'react';
import { Form, Input, Button, Radio, Result, Spin, Select } from 'antd';
import { createStory } from '../../api/jira';
import logo from '../../images/logo_horizontal.svg';
import './style.css';

const { Option } = Select;

type CreateJiraProps = {
  fileKey: string;
  currentUser: string;
};

const SuccessMsg = (inputs: any) => {
  const { jiraKey } = inputs;
  console.log('SuccessMsg:: inputs', inputs);

  return (
    <Result
      status="success"
      title="Jira ticket successfully created!"
      extra={[
        <a
          href={`https://jira.corp.appdynamics.com/browse/${jiraKey}`}
          target="_blank"
        >
          {' '}
          View Ticket{' '}
        </a>,
      ]}
    />
  );
};

const ErrorMsg = () => {
  return (
    <Result
      status="error"
      title="Something went wrong! Please re-run this plugin and try again."
    />
  );
};

const Spinner = () => {
  return (
    <div className="spinner">
      <Spin size="large" />
    </div>
  );
};

const JiraForm = (inputs: any) => {
  const fileLink = `https://figma.com/file/${inputs.fileKey}`;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [jiraKey, setJiraKey] = useState<string>('');
  const [showUXOptions, setShowUXOptions] = useState(true);

  const onFinish = (values: any) => {
    console.log('values? ', values);
    setLoading(true);
    //-- export async function createStory (fileUrl: string, summary: string, description: string, currentUser: string, type: string) {
    createStory(
      values.file_link,
      values.summary,
      values.current_user,
      values.type,
      values.description,
      values.uxNeeded,
      values.urNeeded
    )
      .then((response) => {
        setJiraKey(response.key);
        setSuccess(true);
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onSelectChange = (value: any) => {
    console.log(value);
    setShowUXOptions(value === 'exp');
  };

  return loading ? (
    <Spinner />
  ) : success ? (
    <SuccessMsg jiraKey={jiraKey} />
  ) : error ? (
    <ErrorMsg />
  ) : (
    <Form
      name="project"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
      initialValues={{
        file_link: fileLink,
        current_user: inputs.currentUser,
        type: 'exp',
        description: '',
      }}
    >
      <Form.Item name="current_user" hidden={true} />

      <Form.Item name="type" label="Project" rules={[{ required: true }]}>
        <Select onChange={onSelectChange} style={{ width: 200 }}>
          <Option value="exp"> Experience Org (EXP) </Option>
          <Option value="replex"> Replex (REPLEX) </Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Link to file"
        name="file_link"
        rules={[{ required: true, message: 'Please enter this file link!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Summary"
        name="summary"
        rules={[{ required: true, message: 'Please enter a short title!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: false, message: 'Please enter your details!' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      {showUXOptions && (
        <Form.Item
          label="UX Writing Needed"
          name="uxNeeded"
          rules={[
            { required: true, message: 'UX Writing Needed is required!' },
          ]}
        >
          <Radio.Group value={''}>
            <Radio value={'38000'}>Yes</Radio>
            <Radio value={'38001'}>No</Radio>
          </Radio.Group>
        </Form.Item>
      )}

      {showUXOptions && (
        <Form.Item
          label="UR Needed"
          name="urNeeded"
          rules={[{ required: true, message: 'UR Needed is required!' }]}
        >
          <Radio.Group value={''}>
            <Radio value={'38700'}>Yes</Radio>
            <Radio value={'38701'}>No</Radio>
          </Radio.Group>
        </Form.Item>
      )}

      <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
        <Button type="primary" htmlType="submit" style={{ width: 360 }}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

class JiraPage extends Component<CreateJiraProps> {
  render() {
    const { fileKey, currentUser } = this.props;

    return (
      <div>
        <img src={logo} className="logo" />
        <h2> Create a Jira ticket</h2>
        <JiraForm fileKey={fileKey} currentUser={currentUser} />
      </div>
    );
  }
}

export default JiraPage;

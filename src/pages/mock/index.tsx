import React, { Component, useState } from 'react';
import { Form, Input, Button, Result, Spin, Select, DatePicker } from 'antd';
import { createRequest } from '../../api/jira';
import logo from '../../images/logo_horizontal.svg';
import './style.css';

const { Option } = Select;

type MockPageProps = {
  fileKey: string,
  node: any,
  currentUser: string
}

const SuccessMsg = (inputs:any) => {
  const { jiraKey } = inputs;

  return (
    <Result
      status="success"
      title="DTECH ticket successfully created!"
      extra={[<a href={`https://jira.corp.appdynamics.com/browse/${jiraKey}`} target="_blank"> View Ticket </a>]} />
  )
}

const ErrorMsg = () => {
  return (
    <Result
      status="error"
      title="Something went wrong! Please re-run this plugin and try again." />
  )
}

const Spinner = () => {
  return (
    <div className="spinner"><Spin size="large" /></div>
  )
}
const BugForm = (inputs:any) => {
  const artboardLink = inputs.node ? `https://figma.com/file/${inputs.fileKey}/?node-id=${encodeURIComponent(inputs.node.id)}` : `https://figma.com/file/${inputs.fileKey}`
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [jiraKey, setJiraKey] = useState<string>("");

  const onFinish = (values: any) => {
    setLoading(true);
    createRequest(values.artboard_link, values.summary, values.details, values.current_user, values.due)
      .then((response) => {
        setJiraKey(response.key);
        setSuccess(true)
      })
      .catch((error) => {
        setError(true)
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onSelectChange = (value: any) => {
    console.log(value)
  }

  return loading ? <Spinner /> : success ? <SuccessMsg jiraKey={jiraKey} /> : error ? <ErrorMsg /> : (
    <Form
      name="bug"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
      initialValues={{artboard_link: artboardLink, current_user: inputs.currentUser}}
    >
      <Form.Item
        name="current_user"
        hidden={true} />
      
      <Form.Item
        label="Link to file / frame"
        name="artboard_link"
        rules={[{ required: true, message: 'Please enter an artboard share link!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Title"
        name="summary"
        rules={[{ required: true, message: 'Please enter a short title!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Details"
        name="details"
        rules={[{ required: true, message: 'Please enter your bug details!' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Due date"
        name="due"
        rules={[{ required: true, message: 'Please enter a valid due date!' }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

class MockPage extends Component<MockPageProps> {
  render() {
    const { fileKey, node, currentUser } = this.props;

		return (
      <div>
        <img src={logo} className="logo" />
        <h2> Request Hi-Fi mock</h2>
        <BugForm
          fileKey={fileKey}
          node={node}
          currentUser={currentUser} />
      </div>
    )
  }
}

export default MockPage;

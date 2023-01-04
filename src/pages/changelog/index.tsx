import React, { Component, useState } from 'react';
import { List, Spin, Tabs } from 'antd';
import { getChangelogIssues } from '../../api/jira';
import {
  getDisplayDate,
  sortByDate,
  getStatusTag,
  getFixVersions,
  getFigmaVersions,
} from '../../helpers';
import logo from '../../images/logo_horizontal.svg';
import './style.css';

type State = {
  loading: boolean;
  error: boolean;
  issues: any[];
};

type Props = {};

const { TabPane } = Tabs;
const Spinner = () => (
  <div className="spinner">
    <Spin size="large" />
  </div>
);

const IssueList = (props: any) => {
  const { type, issues, version } = props;
  const fixVersions = getFixVersions(issues);

  let list;
  if (!version) {
    list = issues;
  } else if (version === 'Not Specified') {
    list = fixVersions.noVersions;
  } else {
    list = fixVersions.hasVersions.filter(function (fixVersion) {
      return fixVersion.fields.fixVersions[0].name === version;
    });
  }

  return (
    <List
      dataSource={sortByDate(list).filter((i) => i.fields.status.name === type)}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <List.Item.Meta
            title={
              <a
                target="_blank"
                href={`https://jira.corp.appdynamics.com/browse/${item.key}`}
              >{`[${item.key}] - ${item.fields.summary}`}</a>
            }
            description={getStatusTag(item.fields.status.name)}
          />
          <div>{getDisplayDate(item.fields.created)}</div>
        </List.Item>
      )}
    />
  );
};

class ChangelogPage extends Component<Props, State> {
  public readonly state: State = {
    loading: true,
    error: false,
    issues: [],
  };

  componentDidMount(): void {
    getChangelogIssues()
      .then((issues) => {
        this.setState({
          loading: false,
          issues: issues.issues,
        });
      })
      .catch((error) => {
        this.setState({ error: true });
        console.log(error);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { loading, issues } = this.state;
    let figmaVersions = getFigmaVersions(getFixVersions(issues).hasVersions);

    return (
      <div>
        <img src={logo} className="logo" />
        <h2> Changelog </h2>
        {loading ? (
          <Spinner />
        ) : (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Done" key="1">
              <Tabs
                defaultActiveKey="1"
                tabPosition={'left'}
                style={{ height: 220 }}
              >
                {[
                  ...Array.from({ length: figmaVersions.length }, (v, i) => i),
                ].map((i) => (
                  <TabPane tab={figmaVersions[i]} key={i}>
                    <IssueList
                      type="Done"
                      issues={issues}
                      version={figmaVersions[i]}
                    />
                  </TabPane>
                ))}
              </Tabs>
            </TabPane>
            <TabPane tab="In Progress" key="2">
              <IssueList type="In Progress" issues={issues} />
            </TabPane>
            <TabPane tab="Backlog" key="3">
              <IssueList type="Backlog" issues={issues} />
            </TabPane>
          </Tabs>
        )}
      </div>
    );
  }
}

export default ChangelogPage;

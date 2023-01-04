import React from 'react';
import { Tag } from 'antd';

export const getDisplayDate = (date: string) => {
  const dateObj = new Date(date);

  return `${dateObj.toLocaleDateString('en-US')}`;
};

export const sortByDate = (issues: any): any[] => {
  return issues.sort((a, b) => {
    const dateA = new Date(a.fields.created).getTime();
    const dateB = new Date(b.fields.created).getTime();

    return dateB - dateA;
  });
};

export const getFixVersions = (issues: any) => {
  let versions = {
    hasVersions: [],
    noVersions: [],
  };
  issues.map((issue) => {
    if (issue.fields.fixVersions.length > 0) {
      versions.hasVersions.push(issue);
    }
    if (issue.fields.fixVersions.length === 0) {
      versions.noVersions.push(issue);
    }
  });
  return versions;
};

export const getFigmaVersions = (issues: any) => {
  let versions = issues.map((issue) => issue.fields.fixVersions[0].name);
  versions.push('Not Specified');
  return (versions = [...new Set(versions)]);
};

export const getStatusTag = (status: string) => {
  switch (status) {
    case 'Backlog':
      return <Tag color="cyan">{status}</Tag>;
      break;
    case 'Done':
      return <Tag color="green">{status}</Tag>;
      break;
    default:
      return <Tag color="blue">{status}</Tag>;
      break;
  }
};

export const getUniqueKeys = (data: any): any[] => {
  return Object.keys(
    data.reduce(function (result, obj) {
      return Object.assign(result, obj);
    }, {})
  );
};

export const getAllTextNodes = (selection: any) => {
  let textNodes = [];

  const getTextNodes = (parent: any) => {
    parent.children.forEach((c) => {
      if (c.type === 'TEXT') textNodes.push(c);
      if (c.type === 'INSTANCE') getTextNodes(c);
    });
  };

  selection.forEach((s) => {
    getTextNodes(s);
  });

  return textNodes.flat(Infinity);
};

export const getValuesFromKey = (key: string, objects: any[]) => {
  if (key.includes('metric')) {
    return objects[1][key].map((o) => o.avg.toFixed(2));
  } else {
    return objects.map((o) => o[key]);
  }
};

export const getCleanDataKeys = (keys: any[]) =>
  keys.filter(
    (k) => !k.includes('out.to') && !k.includes('out(') && !k.includes('health')
  );

export const getVariables = (keys: any[]) => keys.map((k) => `{${k}}`);

export const getKeysFromVariables = (variables: any[]) =>
  variables.map((v) => v.replace('{', '').replace('}', ''));

export const getUniqueValues = (values: any[]) => [...new Set(values)];

export const isVariable = (value: string) =>
  value.includes('{') && value.includes('}');

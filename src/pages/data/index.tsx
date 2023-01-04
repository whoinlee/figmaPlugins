import React, { Component, useState } from 'react';
import { List, Spin, message , AutoComplete, Tabs, Button } from 'antd';
import { getServiceData } from '../../api/data';
import { getUniqueKeys, getCleanDataKeys, getVariables, getKeysFromVariables } from '../../helpers';
import logo from '../../images/logo_horizontal.svg';
import './style.css';

type State = {
  loading: boolean,
  error: boolean,
  services: any[]
}
type Props = {}
const Spinner = () => <div className="spinner"><Spin size="large" /></div>
const { TabPane } = Tabs;

const DataAutoComplete = (props:any) => {
  const { services } = props;
  const uniqueServices = getCleanDataKeys(getUniqueKeys(services));
  const [acServices, setAcServices] = useState(uniqueServices);

  onmessage = (event) => {
    if (event.data.pluginMessage = "noneSelected") {
      message.error('Nothing selected!, Please select components or frames.');
    }
  }

  const onSelect = (data: any) => {
    parent.postMessage({
          pluginMessage: { 
            action: "applyData",
            payload: { services: services, key: data }
          }
      }, '*');
  }

  const onSearch = (searchString: string) => {
    setAcServices(searchString ? uniqueServices.filter(s => s.toString().includes(searchString)) : uniqueServices)
  }

  return (
    <div>
      <AutoComplete
        onSearch={onSearch}
        placeholder="Search properties..."
        className='search' />
          <List
            dataSource={acServices}
            renderItem={(item) => (
              <List.Item key={item} className='data__item' onClick={() => onSelect(item)}>
                <List.Item.Meta
                  title={item}
                />
              </List.Item>
            )} />
    </div>
  )
};

const Variables = (props:any) => {
  const { services } = props;
  const variables = getVariables(getCleanDataKeys(getUniqueKeys(services)));

  onmessage = (event) => {
    if (event.data.pluginMessage = "noneSelected") {
      message.error('Nothing selected!, Please select components or frames.');
    }
  }

  const onApply = (data: any) => {
    parent.postMessage({
          pluginMessage: { 
            action: "applyVariableData",
            payload: { services: services, variables: variables }
          }
      }, '*');
  }

  return (
    <div>
      <Button className='button__apply' type="primary" onClick={onApply}> Apply Data </Button>
      <List
        dataSource={variables}
        renderItem={(item) => (
          <List.Item key={item} className='data__item'>
            <List.Item.Meta
              title={item}
            />
          </List.Item>
        )} />
    </div>
  )

}

class DataPage extends Component<Props, State> {
  public readonly state: State = {
    loading: true,
    error: false,
    services: []
  }

  componentDidMount(): void {
    getServiceData()
      .then((services) => {
        this.setState({
          loading: false,
          services: services
        })
      })
      .catch((error) => {
        this.setState({ error: true })
        console.log(error)
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  render() {
    const { loading, services } = this.state;

		return (
      <div>
        <img src={logo} className="logo" />
        <h3> Apply Data </h3>
        { loading ? <Spinner /> : 
          <Tabs defaultActiveKey='1'>
            <TabPane tab='Clickable' key="1">
              <DataAutoComplete services={services}/>
            </TabPane>
            <TabPane tab='Variables' key="2">
              <Variables services={services}/>
            </TabPane>
          </Tabs>
        }
      </div>
    )
  }
}

export default DataPage;

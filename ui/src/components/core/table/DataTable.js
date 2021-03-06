import React from 'react';
import {Table, Grid, Header, Button, Dimmer, Loader} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import get from 'lodash.get';

class DataTable extends React.Component {
  render() {
    const {options, data} = this.props;
    const {columns} = options;
    const columnKeys = Object.keys(columns);

    return (
      <div style={{position: 'relative'}}>
        <Dimmer active={this.props.loading} inline="centered" inverted>
          <Loader indeterminate>Loading records...</Loader>
        </Dimmer>
        <Grid style={{margin: '10px'}}>
          <Grid.Row>
            <Grid.Column>
              <Header>
                <Header.Content>
                  <h2 style={{marginRight: '10px', display: 'inline'}}>{this.props.title}</h2>
                  {this.props.createUrl && (
                    <Button icon="plus" color="blue" floated="right" size="small" as={Link} to={this.props.createUrl} />
                  )}
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Table columns={columnKeys.length + 1} celled striped>
                <Table.Header>
                  <Table.Row>
                    {columnKeys.map(field => <Table.HeaderCell key={field}>{columns[field].label}</Table.HeaderCell>)}

                    {options.actions && <Table.HeaderCell>{options.actions.label}</Table.HeaderCell>}
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {data.length === 0 && (
                    <Table.Row textAlign="center">
                      <Table.Cell colSpan={options.actions ? columnKeys.length + 1 : columnKeys.length}>
                        No records found.
                      </Table.Cell>
                    </Table.Row>
                  )}
                  {data.map(record => (
                    <Table.Row key={record.id} positive={options.rowPositive && options.rowPositive(record)}>
                      {columnKeys.map(field => (
                        <Table.Cell key={`${record.id}-${field}`}>
                          {columns[field].renderer
                            ? columns[field].renderer(record)
                            : columns[field].key ? get(record, columns[field].key) : record[field]}
                        </Table.Cell>
                      ))}

                      {options.actions && (
                        <Table.Cell key={`actions-${record.id}`}>{options.actions.renderer(record)}</Table.Cell>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>

                {/* TODO: implement pagination
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="3">
                    <Menu floated="right" pagination>
                      <Menu.Item as="a" icon>
                        <Icon name="left chevron" />
                      </Menu.Item>
                      <Menu.Item as="a">1</Menu.Item>
                      <Menu.Item as="a">2</Menu.Item>
                      <Menu.Item as="a">3</Menu.Item>
                      <Menu.Item as="a">4</Menu.Item>
                      <Menu.Item as="a" icon>
                        <Icon name="right chevron" />
                      </Menu.Item>
                    </Menu>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer> */}
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

// const ColumnType = PropTypes.shape({
//   label: PropTypes.string.isRequired,
//   renderer: PropTypes.func
// });

DataTable.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.shape({
    columns: PropTypes.object,
    actions: PropTypes.shape({
      label: PropTypes.string.isRequired,
      // function that receives the item as an argument
      renderer: PropTypes.func.isRequired
    }),
    rowPositive: PropTypes.func
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  createUrl: PropTypes.string,
  loading: PropTypes.bool
};

export default DataTable;

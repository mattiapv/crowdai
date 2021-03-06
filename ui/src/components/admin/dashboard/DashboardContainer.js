import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Route, withRouter, Redirect} from 'react-router-dom';

import ApplicationHeader from 'src/components/admin/dashboard/ApplicationHeader';
import Dashboard from './Dashboard';
import Breadcrumb from './Breadcrumb';
import {ToastContainer} from 'react-toastify';
import ToastManager from 'src/components/core/toast/ToastManager';

/**
 * Dashboard wrapper that checks user login status.
 */
class DashboardContainer extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.loggedIn && (
          <React.Fragment>
            <ApplicationHeader location={this.props.location} />
            <Breadcrumb />
            <ToastContainer />
            <ToastManager />
            <Route path="/admin" component={Dashboard} />
          </React.Fragment>
        )}
        {!this.props.loggedIn && <Redirect to="/login" />}
      </React.Fragment>
    );
  }
}

DashboardContainer.propTypes = {
  loggedIn: PropTypes.bool,
  location: PropTypes.object
};

const mapStateToProps = state => ({
  loginInfo: state.login.loginInfo,
  loggedIn: state.login.loggedIn
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashboardContainer));

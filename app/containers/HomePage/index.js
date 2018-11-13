/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Select from 'react-select';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import LineBarChart from 'components/LineBarChart';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.PureComponent {
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
  }

  state = {
    selectedOption: null,
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  render() {
    const { loading, error, repos } = this.props;
    const { selectedOption } = this.state;
    const reposListProps = {
      loading,
      error,
      repos,
    };

    const data = {
      dataType: 'VO2',
      currency: 'USD',
      currencySymbol: '$',
      name: 'NYC Metro Office Volume ($)',
      ticker: 'NYCMET_OFF',
      lookupname: 'NYC Metro Office Volume ($)',
      fullName: 'NYC Metro Office Volume ($).VO2.USD',
      type: 'line',
      yAxis: 0,
      color: '#EA7517',
      dashStyle: 'Solid',
      symbol: 'circle',
      values: [
        { a: 1, b: 3 },
        { a: 2, b: 6 },
        { a: 3, b: 2 },
        { a: 4, b: 12 },
        { a: 5, b: 8 },
        { a: 6, b: 20 },
      ],
    };

    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' },
    ];

    return (
      <article>
        <Helmet>
          <title>Home</title>
          <meta name="description" content="TrendTracker" />
        </Helmet>
        <div>
          <Section>
            <H2>
              <FormattedMessage {...messages.trymeHeader} />
            </H2>
            <Select
              value={selectedOption}
              onChange={this.handleChange}
              options={options}
            />
            <LineBarChart data={data} />
            <Form onSubmit={this.props.onSubmitForm}>
              <label htmlFor="username">
                <FormattedMessage {...messages.trymeMessage} />
                <AtPrefix>
                  <FormattedMessage {...messages.trymeAtPrefix} />
                </AtPrefix>
                <Input
                  id="username"
                  type="text"
                  placeholder="mxstbr"
                  value={this.props.username}
                  onChange={this.props.onChangeUsername}
                />
              </label>
            </Form>
            <ReposList {...reposListProps} />
          </Section>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
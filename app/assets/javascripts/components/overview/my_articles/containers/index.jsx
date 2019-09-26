import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// components
import MyArticlesNoAssignmentMessage from '../components/NoAssignmentMessage';
import MyArticlesHeader from '../components/Header';
import MyArticlesCategories from '../components/Categories';

// actions
import { fetchAssignments } from '../../../../actions/assignment_actions';

// helper functions
import { processAssignments } from '../utils/processAssignments';

export class MyArticlesContainer extends React.Component {
  componentDidMount() {
    if (this.props.loading) {
      this.props.fetchAssignments(this.props.course.slug);
    }
  }

  render() {
    const {
      assignments, course, current_user, loading, wikidataLabels
    } = this.props;

    if (loading || !current_user.isStudent) return null;
    if (!assignments.length && current_user.isStudent) {
      if (Features.wikiEd) return <MyArticlesNoAssignmentMessage />;
      return <p id="no-assignment-message">{I18n.t('assignments.none_short')}</p>;
    }

    const {
      assigned,
      reviewing,
      unassigned,
      reviewable,
      all
    } = processAssignments(this.props);

    return (
      <div className="module my-articles">
        <MyArticlesHeader
          assigned={assigned}
          course={course}
          current_user={current_user}
          reviewable={reviewable}
          reviewing={reviewing}
          unassigned={unassigned}
          wikidataLabels={wikidataLabels}
        />
        <MyArticlesCategories
          assignments={all}
          course={course}
          current_user={current_user}
          loading={loading}
          wikidataLabels={wikidataLabels}
        />
      </div>
    );
  }
}

MyArticlesContainer.propTypes = {
  // props
  assignments: PropTypes.array.isRequired,
  current_user: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  wikidataLabels: PropTypes.object.isRequired,

  // actions
  fetchAssignments: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  assignments: state.assignments.assignments,
  loading: state.assignments.loading,
  wikidataLabels: state.wikidataLabels
});

const mapDispatchToProps = { fetchAssignments };

export default connect(mapStateToProps, mapDispatchToProps)(MyArticlesContainer);

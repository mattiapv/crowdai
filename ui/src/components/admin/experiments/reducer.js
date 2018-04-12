import {combineReducers} from 'redux';

import {actionTypes} from './actions';
import {getReducer} from 'src/utils/form';
import {scopes, JobStatus} from 'src/utils/constants';

const defaultState = {
  experiments: {
    rows: [],
    meta: {}
  },
  error: undefined,
  loading: false
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EXPERIMENTS:
      return {
        ...state,
        error: undefined,
        loading: true
      };
    case actionTypes.FETCH_EXPERIMENTS_SUCCESS:
      return {
        ...state,
        experiments: action.response,
        loading: false
      };
    case actionTypes.FETCH_EXPERIMENTS_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
};

const genericFormReducer = getReducer(scopes.EXPERIMENTS, {
  id: undefined,
  project_id: undefined,
  uuid: '',
  data: {
    name: '',
    description: '',
    requesterId: '',
    status: JobStatus.NOT_PUBLISHED,
    instructions: {},
    // True: ask each worker multiple criteria per paper. False: ask one criterion only per paper.
    multipleCriteria: false,
    criteriaQualityAnalysis: false,
    abstractPresentationTechnique: 'kh',
    labelOptions: 'ynk',
    hitConfig: {
      limitWorkers: false,
      maxAssignments: 0, // limitWorkers = false, then maxAssignments is 0.
      lifetimeInMinutes: 5 * 24 * 60,
      assignmentDurationInMinutes: 20
    },
    // parameters
    maxTasksRule: 3,
    taskRewardRule: 0.5,
    testFrequencyRule: 2,
    initialTestsRule: 2,
    initialTestsMinCorrectAnswersRule: 100,
    votesPerTaskRule: 2,
    expertCostRule: 0.2,
    crowdsourcingStrategy: 'baseline', // soon to be deprecated
    taskAssignmentStrategy: 1
  }
});

// hacky way to get the whole state of the form
const defaultFormState = genericFormReducer(undefined, {});

const formReducer = (state = defaultFormState, action) => {
  switch (action.type) {
    case actionTypes.PUBLISH_EXPERIMENT:
      return {
        ...state,
        error: undefined,
        loading: true
      };
    case actionTypes.PUBLISH_EXPERIMENT_SUCCESS:
      return {
        ...state,
        item: {
          ...action.experiment
        },
        loading: false,
        saved: true
      };
    case actionTypes.PUBLISH_EXPERIMENT_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
};

export default combineReducers({
  list: reducer,
  // finally we combine generic and formReducer that handles
  // experiments creation and publishing
  form: (state = defaultFormState, action) => {
    let outputState = genericFormReducer(state, action);
    return formReducer(outputState, action);
  }
});
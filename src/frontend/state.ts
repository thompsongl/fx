import * as React from 'react';

import { ModalManagement } from '../frontend/components/modal';
import {
  assertNever,
  findNestedById,
  removeNestedById,
  addToRoot,
  addNestedByParentId,
} from './utils';
import { File } from './types';

const clearTitle = () => {
  document.title = 'fx';
};

export interface ReducerState {
  isLoading: boolean;
  error: string;
  repo: string;
  selected: File | null;
  files: File[];
  breadcrumbs: File[];
}

interface ActionReset {
  type: 'RESET';
}
interface ActionFetchStart {
  type: 'FETCH_START';
}
interface ActionFetchSuccess {
  type: 'FETCH_SUCCESS';
  payload: { repo: string; files: File[] };
}
interface ActionFetchFailure {
  type: 'FETCH_FAILURE';
  payload: { error: string };
}
interface ActionSetSelected {
  type: 'SET_SELECTED';
  payload: { node: File };
}
interface ActionRemoveNode {
  type: 'REMOVE_NODE';
  payload: { nodeId: File['id'] };
}
interface ActionAddError {
  type: 'ADD_ERROR';
  payload: { error: string };
}
interface ActionRemoveError {
  type: 'REMOVE_ERROR';
}
interface ActionAddFile {
  type: 'ADD_FILE';
  payload: { parentId: File['id']; name: File['name'] };
}
interface ActionAddDirectory {
  type: 'ADD_DIRECTORY';
  payload: { parentId: File['id']; name: File['name'] };
}

type ReducerAction =
  | ActionReset
  | ActionFetchStart
  | ActionFetchSuccess
  | ActionFetchFailure
  | ActionSetSelected
  | ActionRemoveNode
  | ActionAddError
  | ActionRemoveError
  | ActionAddFile
  | ActionAddDirectory;

export interface ReducerActions {
  reset: () => void;
  fetchStart: () => void;
  fetchSuccess: ({ repo, files }: ActionFetchSuccess['payload']) => void;
  fetchFailure: ({ error }: ActionFetchFailure['payload']) => void;
  setSelected: ({ node }: ActionSetSelected['payload']) => void;
  removeNode: ({ nodeId }: ActionRemoveNode['payload']) => void;
  addError: ({ error }: ActionAddError['payload']) => void;
  removeError: () => void;
  addFile: ({ parentId, name }: ActionAddFile['payload']) => void;
  addDirectory: ({ parentId, name }: ActionAddDirectory['payload']) => void;
}

const _initialState: ReducerState = {
  isLoading: false,
  error: null,
  repo: null,
  selected: null,
  files: [],
  breadcrumbs: [],
};

export const useFxState = (
  modalManagement: ModalManagement,
  initialState: ReducerState = _initialState
): [ReducerState, ReducerActions] => {
  const reducer = (state: ReducerState, action: ReducerAction) => {
    switch (action.type) {
      case 'RESET': {
        // NB: This will appear to do nothing when using fixture data
        clearTitle();
        return { ...initialState };
      }
      case 'FETCH_START': {
        return { ...state, isLoading: true };
      }
      case 'FETCH_SUCCESS': {
        const { files, repo } = action.payload;
        document.title = `fx :: ${repo}`;
        return { ...state, isLoading: false, error: null, files, repo };
      }
      case 'FETCH_FAILURE': {
        const { error } = action.payload;
        clearTitle();
        return { ...state, isLoading: false, error };
      }
      case 'SET_SELECTED': {
        const { node: _node } = action.payload;
        const breadcrumbs: File[] = [];
        let node: File | false = _node;
        while (node && node.parent) {
          node = findNestedById(state.files, node.parent);
          if (node) breadcrumbs.push(node);
        }

        return {
          ...state,
          selected: _node,
          breadcrumbs: breadcrumbs.slice(0).reverse(),
        };
      }
      case 'ADD_ERROR': {
        const { error } = action.payload;
        return {
          ...state,
          error,
        };
      }
      case 'REMOVE_ERROR': {
        return {
          ...state,
          error: null,
        };
      }
      case 'ADD_DIRECTORY': {
        const { parentId, name } = action.payload;
        const newFiles = parentId
          ? addNestedByParentId(state.files, parentId, name, true)
          : addToRoot(state.files, name, true);
        modalManagement.setModalState(null);
        modalManagement.setIsModalOpen(false);

        return {
          ...state,
          files: newFiles,
        };
      }
      case 'ADD_FILE': {
        const { parentId, name } = action.payload;
        const newFiles = parentId
          ? addNestedByParentId(state.files, parentId, name)
          : addToRoot(state.files, name);
        modalManagement.setModalState(null);
        modalManagement.setIsModalOpen(false);

        return {
          ...state,
          files: newFiles,
        };
      }
      case 'REMOVE_NODE': {
        const { nodeId } = action.payload;
        // TODO: Warn or get user confirmation before completing
        const newFiles = removeNestedById(state.files, nodeId);

        return {
          ...state,
          files: newFiles,
          selected: nodeId === state.selected.id ? null : state.selected,
        };
      }
      default:
        assertNever(action);
        return state;
    }
  };

  const [reducerState, dispatch] = React.useReducer(reducer, initialState);

  const actions: ReducerActions = React.useMemo(() => {
    return {
      reset: () =>
        dispatch({
          type: 'RESET',
        }),
      fetchStart: () =>
        dispatch({
          type: 'FETCH_START',
        }),
      fetchSuccess: ({ repo, files }) =>
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: { repo, files },
        }),
      fetchFailure: ({ error }) =>
        dispatch({
          type: 'FETCH_FAILURE',
          payload: { error },
        }),
      setSelected: ({ node }) =>
        dispatch({
          type: 'SET_SELECTED',
          payload: { node },
        }),
      removeNode: ({ nodeId }) =>
        dispatch({
          type: 'REMOVE_NODE',
          payload: { nodeId },
        }),
      addError: ({ error }) =>
        dispatch({
          type: 'ADD_ERROR',
          payload: { error },
        }),
      removeError: () =>
        dispatch({
          type: 'REMOVE_ERROR',
        }),
      addFile: ({ parentId, name }) =>
        dispatch({
          type: 'ADD_FILE',
          payload: { parentId, name },
        }),
      addDirectory: ({ parentId, name }) =>
        dispatch({
          type: 'ADD_DIRECTORY',
          payload: { parentId, name },
        }),
    };
  }, []);

  return [reducerState, actions];
};

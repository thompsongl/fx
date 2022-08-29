import * as React from 'react';
import { File } from './types';
import { treeToFiles, findNestedById } from './utils';

import { Actions } from './components/actions';
import { Breadcrumbs } from './components/breadcrumbs';
import { Button } from './components/button';
import { Modal, useModal } from './components/modal';
import { NodeGrid } from './components/node_grid';
import { NodeList } from './components/node_list';

import { useFxState, ReducerActions, ReducerState } from './state';

// NB: Uncomment to use fixture data (elastic/eui)
// import { data } from './fixtures/data';
// const fixtureData: ReducerState = {
//   isLoading: false,
//   error: null,
//   repo: 'elastic/eui',
//   files: data as unknown as File[],
//   selected: null,
//   breadcrumbs: [],
// };

export const AppContext = React.createContext<{
  selected: string;
  setSelected: ReducerActions['setSelected'];
  removeNode: ReducerActions['removeNode'];
  addDirectory: (parent: File) => void;
  addFile: (parent: File) => void;
}>({
  selected: '',
  setSelected: () => {},
  removeNode: () => {},
  addFile: () => {},
  addDirectory: () => {},
});

export const App: React.FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen, toggleModal, modalState, setModalState] =
    useModal();

  const [state, actions]: [ReducerState, ReducerActions] = useFxState(
    {
      setIsModalOpen,
      setModalState,
    }
    // NB: Uncomment to use fixture data (elastic/eui)
    // fixtureData
  );
  const { isLoading, error, repo, files, selected, breadcrumbs } = state;

  React.useEffect(() => {
    // TODO: Use a chain/async method for dispatching actions from other actions.
    //       Would also be helpful to select new files upon creation.
    if (selected) {
      const newSelected = findNestedById(files, selected.id);
      if (newSelected && newSelected !== selected) {
        actions.setSelected({ node: newSelected });
      }
    }
  }, [selected, files, actions]);

  const isEmptyState = !files || files.length === 0;

  const addFile = (parent: File) => {
    setModalState({ type: 'file', parent });
    setIsModalOpen(true);
  };

  const addDirectory = (parent: File) => {
    setModalState({ type: 'directory', parent });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    toggleModal();
    actions.removeError();
  };

  const clearErrorOnChange = () => {
    if (error) {
      actions.removeError();
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name') as string;
    const isRoot = modalState.parent === null;
    const siblings = isRoot ? files : modalState.parent.children;
    const reservedName = siblings.find((item) => item.name === name);
    if (reservedName) {
      actions.addError({
        error: `The name "${name}" already exists in this location. Please choose another name.`,
      });
      return;
    }
    if (modalState.type === 'file') {
      actions.addFile({ parentId: isRoot ? null : modalState.parent.id, name });
    } else {
      actions.addDirectory({
        parentId: isRoot ? null : modalState.parent.id,
        name,
      });
    }
  };

  const onRepoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const repo = data.get('repo') as string;
    fetchData(repo);
  };

  const fetchData = async (repo: string) => {
    actions.fetchStart();
    fetch(`https://api.github.com/repos/${repo}/git/trees/main?recursive=1`)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        const tree = treeToFiles(data.tree);
        actions.fetchSuccess({ repo, files: tree });
      })
      .catch(function (error) {
        const message =
          error.status === 404
            ? `
        "${repo}" was not found.
        It's possible that the repo size exceeds the API limit or does not meet requirements.
        `
            : 'A server error occurred.';
        actions.fetchFailure({ error: message });
      });
  };

  return (
    <AppContext.Provider
      value={{
        selected: selected?.id,
        setSelected: actions.setSelected,
        removeNode: actions.removeNode,
        addFile,
        addDirectory,
      }}
    >
      <header className="Header">
        <h1 className="Header__title">
          <Button onClick={() => actions.reset()} className="Header__brand">
            fx
          </Button>
          {isLoading ? (
            <span className="Loading" />
          ) : repo ? (
            <span>{repo}</span>
          ) : null}
        </h1>
      </header>
      <div className="Wrapper">
        {/* TODO: Prime candidate for a UI transition, between empty to populated state */}
        {isEmptyState ? (
          <div className="Empty">
            <div className="Form">
              <h2>Explore</h2>
              <form
                onSubmit={isLoading ? undefined : onRepoSubmit}
                autoComplete="off"
              >
                <div className="Form__items">
                  <label htmlFor="repo">Repository</label>
                  <input
                    autoFocus
                    type="text"
                    name="repo"
                    id="repo"
                    placeholder="e.g., elastic/eui"
                    autoComplete="off"
                    onChange={clearErrorOnChange}
                  />
                  {error && <div className="Error">{error}</div>}
                </div>
                <div className="Form__actions">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    Submit
                  </Button>
                </div>
              </form>
              <div className="Examples">
                <h3>Sample repositories</h3>

                <div className="Examples__list">
                  <Button
                    variant="secondary"
                    onClick={() => fetchData('elastic/eui')}
                  >
                    elastic/eui (~6k)
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => fetchData('elastic/beats')}
                  >
                    elastic/beats (~16k)
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => fetchData('apple/swift')}
                  >
                    apple/swift (~24k)
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => fetchData('microsoft/TypeScript')}
                  >
                    microsoft/TypeScript (~57k)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="Explorer">
              <NodeList nodes={files} />
            </div>
            <div
              className="Details"
              key={selected && selected.children?.length}
            >
              {selected && (
                <>
                  <header className="Details__header">
                    <div className="Details__nav">
                      {breadcrumbs.length > 0 && (
                        <nav>
                          <Breadcrumbs nodes={breadcrumbs} />
                        </nav>
                      )}
                      <span className="Details__name">{selected.name}</span>
                    </div>
                    <div>
                      <Actions
                        type={selected.children ? 'directory' : 'file'}
                        addFile={selected.children && (() => addFile(selected))}
                        addDirectory={
                          selected.children && (() => addDirectory(selected))
                        }
                        removeNode={() =>
                          actions.removeNode({ nodeId: selected.id })
                        }
                      />
                    </div>
                  </header>
                  <div className="Details__data">
                    <dl>
                      {selected.url && (
                        <>
                          <dt>url</dt>
                          <dd>
                            <a target="_blank" href={selected.url}>
                              {repo}
                            </a>
                          </dd>
                        </>
                      )}

                      <dt>sha</dt>
                      <dd>{selected.sha}</dd>

                      {!!selected.size && (
                        <>
                          <dt>size</dt>
                          <dd>{selected.size}</dd>
                        </>
                      )}
                    </dl>
                  </div>
                  {selected.children && <NodeGrid nodes={selected.children} />}
                </>
              )}
            </div>
          </>
        )}
      </div>
      {/* TODO: Not convinced a modal is the correct interaction paradigm, but the focus is helpful at this juncture.
                Certainly feels like an inline editing experience makes sense for *create actions. */}
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className="Form">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="Form__items">
              <label htmlFor="name">Name</label>
              <input
                autoFocus
                type="text"
                name="name"
                id="name"
                autoComplete="off"
                onChange={clearErrorOnChange}
              />
              {error && <div className="Error">{error}</div>}
            </div>
            <div className="Form__actions">
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </AppContext.Provider>
  );
};

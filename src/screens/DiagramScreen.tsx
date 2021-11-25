import { useContext } from 'react';
import ReactFlow from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import { DiagramToolbarComponent } from '../components';
import { MainContext } from '../context';

const DiagramScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const { elements, setShowNodeModal, setEdgeSource } = useContext(MainContext);

  const createNewNode = () => setShowNodeModal(true);

  return (
    <div className="diagram">
      <DiagramToolbarComponent />
      <div className="diagram__graph">
        {!elements.length && <span className="diagram__alert">{t('noData')}</span>}
        <ReactFlow
          elements={elements}
          onConnectStart={async (evt, { nodeId }) => setEdgeSource(nodeId || '')}
          onConnectStop={createNewNode}
        />
      </div>
    </div>
  );
};

export default DiagramScreen;

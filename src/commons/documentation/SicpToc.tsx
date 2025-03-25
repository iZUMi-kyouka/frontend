import { Tree, TreeNodeInfo } from '@blueprintjs/core';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import toc from 'src/features/sicp/data/toc.json';

type TocProps = OwnProps;

type OwnProps = {
  handleCloseToc?: () => void;
  handleNodeClicked?: (node: TreeNodeInfo) => void;
};

/**
 * Table of contents of SICP.
 */
const SicpToc: React.FC<TocProps> = props => {
  const [sidebarContent, setSidebarContent] = useState(toc as TreeNodeInfo[]);
  // const navigate = useNavigate();

  const handleNodeExpand = (_node: TreeNodeInfo, path: integer[]) => {
    const newState = cloneDeep(sidebarContent);
    Tree.nodeFromPath(path, newState).isExpanded = true;
    setSidebarContent(newState);
  };

  const handleNodeCollapse = (_node: TreeNodeInfo, path: integer[]) => {
    const newState = cloneDeep(sidebarContent);
    Tree.nodeFromPath(path, newState).isExpanded = false;
    setSidebarContent(newState);
  };

  // const handleNodeClicked = React.useCallback(
  //   (node: TreeNodeInfo) => {
  //     if (props.handleCloseToc) {
  //       props.handleCloseToc();
  //     }
  //     navigate('/sicpjs/' + String(node.nodeData));
  //   },
  //   [navigate, props]
  // );

  return (
    <div className="sicp-toc">
      <Tree
        className="sicp-toc-tree"
        contents={sidebarContent}
        onNodeClick={props.handleNodeClicked}
        onNodeCollapse={handleNodeCollapse}
        onNodeExpand={handleNodeExpand}
      />
    </div>
  );
};

export default SicpToc;

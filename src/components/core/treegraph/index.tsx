import React, { useState, useEffect, useRef } from 'react';
import Tree from 'react-d3-tree';
import styled from 'styled-components';
import { useMedia } from 'react-use';
import { useRouter } from 'next/router';
import { AppRoutes } from '../../../helpers/routes';
import { Text } from '../text';
import { formateDecodeOpName } from '../../features/transactions/trace';

const TreeWrapper = styled.div`
  width: 100%;
  max-height: 500px;
  overflow: auto;
  border-radius: 10px;

  .info-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .icon-ic-exclamationmark-circle-16 {
    //color: ${props => props.theme.colors.text.secondary};
    color: #F53C36;
    font-size: 26px;
  }
  
  .error {
    color: #F53C36;
    font-size: 18px;
  }

  .item-attr {
    font-size: 14px;
    color: ${props => props.theme.isDarkTheme ? ' #7a7a7a' : '#b7b7b7'};
  }
  
  .rd3t-link {
    stroke-width: 2px;
    stroke: ${props => props.theme.colors.text.accent};
  }

  .node__root, .node__branch, .node__leaf, circle-node {
    stroke: ${props => props.theme.colors.text.accent};
    stroke-width: 3px;
    fill: ${props => props.theme.colors.background.card};
    //stroke: transparent;

    :hover {
      stroke: ${props => props.theme.isDarkTheme ? 'rgb(36, 87, 180)' : 'rgb(147, 192, 255)'};
      opacity: 0.5;

      .icon-ic-xmark-circle-16 {
        opacity: 0.5;
      }
    }
  }
`;

const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
  onClick
}) => {
  const attr = nodeDatum?.attributes || {};
  const keyAttr = Object.keys(attr);

  return (
      <g onClick={() => onClick(nodeDatum)}>
        <circle className={'circle-node'} r={14} />
        {!nodeDatum.transaction?.success && (
            <foreignObject width={24} height={24} x={-3} y={-11}>
              <Text className={'error'}>!</Text>
            </foreignObject>
        )}
        {nodeDatum?.lvl > 0 && (
          <foreignObject x={-120} y={-21} width={100} height={40}>
            <div className={'info-container'}>
              {keyAttr.map((item, idx) => {
                return (
                    <Text className={'l2 item-attr'} key={idx}>
                      {nodeDatum.attributes[item]}
                    </Text>
                );
              })}
            </div>
          </foreignObject>
        )}
      </g>
  );
};

export default function OrgChartTree ({ trace, setShowTrace }) {
  const isMobile = useMedia('(max-width: 768px)');
  const ref = useRef(null);
  const router = useRouter();
  const { hash = '' }: any = router.query;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [tree, setTree] = useState(trace);
  const [width, setWidth] = useState(-1);
  const [sizeRoot, setSizeRoot] = useState({
    width: 0,
    height: 0,
    objWidth: 0,
    posX: 0,
    posY: 0
  });

  const replaseRouterHash = (hash: string) => {
    const replacedUrl = AppRoutes.transactionDetails(String(router.query.value));
    router.replace({
      pathname: replacedUrl,
      query: { hash }
    }, undefined, { shallow: true });
  };

  const scrollToItemElementOfTrace = (hash: string) => {
    setTimeout(() => {
      const activedElems = document.getElementsByClassName('activeItemTrace');
      Array.prototype.forEach.call(activedElems, (item) => {
        if (item.id !== hash) {
          item.className = item.className.replaceAll('activeItemTrace', '');
        }
      });

      const elem = document.getElementById(hash);
      if (elem) {
        elem.className = elem.className + ' activeItemTrace';
        setTimeout(() => {
          elem.className = elem.className.replaceAll('activeItemTrace', '');
        }, 3000);

        elem.scrollIntoView(true);
      }
    }, 200);
  };

  const handleClickNode = (node) => {
    setIsClicked(true);

    if (node) {
      setShowTrace(true);
      scrollToItemElementOfTrace(node?.transaction.hash || '');
      replaseRouterHash(node?.transaction.hash || '');
    }
  };

  const setLabelForNodes = (oldTree, lvl) => {
    const t = oldTree;
    const opCode = t.transaction?.inMsg?.opCode;
    const value = Number(t.transaction?.inMsg.value || 0) / 1000000000;
    const decodedOpName = t.transaction?.inMsg?.decodedOpName
      ? formateDecodeOpName(t.transaction?.inMsg?.decodedOpName)
      : null;

    t.attributes = decodedOpName
      ? { value, decodedOpName }
      : { value, opCode };

    t.lvl = lvl;
    lvl += 1;
    setTree(t);

    if (t?.children?.length > 0) {
      t.children.forEach((item) => {
        setLabelForNodes(item, lvl);
      });
    }
  };

  useEffect(() => {
    if (ref?.current) {
      setWidth(ref.current.offsetWidth / 2);
      setLabelForNodes(tree, 0);
    }
  }, [ref]);

  useEffect(() => {
    if (isLoaded && ref.current) {
      const svgContainer = document.getElementsByClassName('rd3t-g')[0];
      const transformData = svgContainer.getBoundingClientRect();
      const transformWrapper = ref.current.getBoundingClientRect();
      const isSmall = transformData.width < transformWrapper.width;
      const cofBiasX = isSmall ? ((transformWrapper.width / 2) - transformData.width / 2) : 100;

      setSizeRoot({
        width: (isSmall ? transformWrapper.width : (transformData.width + cofBiasX)),
        height: transformData.height + 175,
        objWidth: transformData.width,
        posX: cofBiasX,
        posY: (transformData.height + 175) / 2
      });

      if (hash !== '' && !isClicked) {
        setShowTrace(true);
        scrollToItemElementOfTrace(hash);
      }
    }
  }, [isLoaded, hash]);

  const nodeSize = { x: 200, y: 200 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20 };

  return (
    <TreeWrapper ref={ref}>
      <div style={{ ...sizeRoot, overflow: 'hidden' }}>
        {(width > 0 && ref) && (
          <Tree
            onUpdate={() => setIsLoaded(true)}
            data={trace}
            separation={{ siblings: 1, nonSiblings: 1 }}
            nodeSize={{ x: 100, y: 55 }}
            zoomable={false}
            collapsible={false}
            draggable={isMobile}
            depthFactor={150}
            pathFunc={'elbow'}
            translate={{ x: sizeRoot.posX, y: sizeRoot.posY }}
            rootNodeClassName="node__root"
            branchNodeClassName="node__branch"
            leafNodeClassName="node__leaf"
            renderCustomNodeElement={(rd3tProps) =>
              renderForeignObjectNode({
                ...rd3tProps,
                foreignObjectProps,
                onClick: handleClickNode
              })
            }
          />
        )}
      </div>
    </TreeWrapper>
  );
}

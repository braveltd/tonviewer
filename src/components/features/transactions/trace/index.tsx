import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { addressToBase64, convertNanoton } from '../../../../helpers';
import { Link } from '../../../core/link';
import { SecondaryText, Text } from '../../../core/text';
import { Row } from '../../../core/row';
import hljs from 'highlight.js';
import { Copy } from '../../../core/copy';
import yaml from 'yaml';
import { prettifyPrice } from '../../../../helpers/numbers';

const WrapperCardTrace = styled.div`
  position: relative;
  background: ${props => props.theme.colors.background.card};
  width: 100%;
  border-radius: 12px;
  border: transparent 1px solid;
  
  .empty-container {
    position: absolute;
    width: 12px;
    height: 22px;
    top: 10px;
    left: -1px;
    z-index: 150;
    background: ${props => props.theme.colors.background.card};
  }
  
  .details-controllers {
    padding: 12px 16px 20px calc(24px + 16px + 16px);
    display: flex;
    gap: 24px;
    
    @media screen and (max-width: 768px) {
      padding: 12px 16px 20px 16px;
    }
    
    .b2 {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }
  }
  
  .decode-json-to-yaml {
    padding: 0 24px 12px calc(18px + 12px + 12px);

    @media screen and (max-width: 768px) {
      padding: 12px 16px 20px 16px;
    }
    
    .wrapper-code {
      display: flex;
      gap: 12px;
      width: 100%;
      
      .copy-yaml {
        align-items: flex-start;
        position: relative;
        
        & > div {
          width: 16px;
          height: 16px;
          position: absolute;
          top: 12px;
          right: 12px;
        }
      }

      pre {
        width: 100%;
        color: ${props => props.theme.colors.text.primary};
        border-radius: 8px;
        padding: 12px 16px;
        background: ${props => props.theme.colors.background.main};
        margin: 0;
        overflow-x: auto;
      }
    }
  }
`;

const GridDataTrace = styled.div`
  display: grid;
  
  .header-data {
    display: flex;
    gap: 12px;
    padding: 12px 24px 12px 12px;
    border-bottom: 1px solid ${props => props.theme.colors.background.main};
    
    .icon-status {
      font-size: 18px;
    }
    
    .header-data-wrapper {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }
  }
`;

const GridTraceHeader = styled.div<{isMoreData?: boolean}>`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: minmax(0px, 266px) repeat(3, 1fr);
  width: 100%;
  grid-column-gap: 12px;
  grid-row-gap: 8px;

  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  .more-info-item-trace {
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: flex-end; 
    cursor: pointer;
    user-select: none;
    
    @media screen and (max-width: 768px) {
      justify-content: flex-start;
    }
  }
  
  .debug-details {
    display: flex;
    align-items: center;
    gap: 4px;
    
    .icon-ic-arrow-right-16 {
      transform: rotate(-50deg);
      padding-top: 2px;
    }
  }
  
  .item-info {
    display: flex;
    gap: 8px;
    //justify-content: space-between;
    
     a {
       width: auto;
     }
  }
  
  .hash-item {
    width: auto;
  }
  
  .more-info {
    gap: 8px;
  }
  
  .status {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .slice-str {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70px;

    @media screen and (max-width: 768px) {
      max-width: 140px;
    }
  }

  .slice {
    display: flex;
    flex-direction: row;
  }
  
  .title-info-trace {
    width: auto;

    @media screen and (max-width: 768px) {
      //width: 72px;
    }
  }
  //
  //.fix {
  //  min-width: 72px;
  //}
  
  .info-trace-data {
    //width: 100%;
    white-space: nowrap;
  }
  
  .account-status {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: 66px;
  };
  
  ${props => props.isMoreData && css`
    padding-left: calc(18px + 12px + 12px);
    padding-bottom: 12px;
    padding-right: 24px;

    @media screen and (max-width: 768px) {
      padding: 12px 16px 20px 16px;
    }
  `}
`;

const getToncoinDomain = () => process.env.isTestOnly ? 'test-explorer.toncoin.org' : 'explorer.toncoin.org';

const getToncoinTransactionUrl = (transaction) => {
  const params = [
        `account=${transaction.account.address}`,
        `lt=${transaction.lt}`,
        `hash=${transaction.hash}`
  ];
  return `https://${getToncoinDomain()}/transaction?${params.join('&')}`;
};

const SliceAutoStrComponent = ({ str = '', type = '' }: { str: string, type?: string }) => {
  return (
        <Text
            className={'b2 info-trace-data slice'}
            type={(type as any)}
            style={{ cursor: type === 'history-address' ? 'pointer' : 'default' }}>
            <div className={'slice-str'}>{str}</div>
            {str.slice(str.length - 6, str.length)}
        </Text>
  );
};

export const formateDecodeOpName = (str: string): string => {
  str = str.split('_').join(' ');
  return str.replace(/(^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
};

const TraceCard = ({
  data: { transaction },
  childs = [],
  interfaces = '',
  isFirst = false
}: {
    data: any,
    interfaces: string,
    isFirst: boolean,
    childs: any[]
}) => {
  const isMobile = useMedia('(max-width: 768px)');
  const isTablet = useMedia('(max-width: 1024px)');
  const [isShow, setIsShow] = useState(false);
  const [yamlData, setYamlData] = useState<string | null>(null);
  const [fee, setFee] = useState(0);
  const [outMsgCount, setOutMsgCount] = useState(0);
  const [outValue, setOutValue] = useState(0);

  const address = addressToBase64(transaction.account.address) || transaction.account.name;
  const hash = transaction.hash;
  const lt = transaction.lt;
  const exitCode = transaction.computePhase.exitCode;
  const type = transaction.transactionType;
  const status = {
    orig: transaction?.origStatus || null,
    end: transaction?.endStatus || null
  };

  const isShowSecondRow = (
    Number(exitCode || 0) !== 0 ||
      type !== 'TransOrd' ||
      status.orig !== 'active' ||
      status.end !== 'active'
  );

  useEffect(() => {
    hljs.highlightAll();

    if (transaction?.inMsg) {
      setYamlData(transaction?.inMsg.decodedBody
        ? convertJsonToYaml(transaction?.inMsg.decodedBody)
        : null
      );
    }

    if (transaction) {
      setOutMsgCount(childs.length + transaction?.outMsgs.length);

      childs.forEach((item) => {
        if (item?.transaction?.inMsg) {
          const fwdFeeItem1 = item?.transaction?.inMsg.importFee;
          const importFeeItem1 = item?.transaction?.inMsg.fwdFee;

          setOutValue(outValue + (item?.transaction?.inMsg?.value || 0));
          setFee(fee + fwdFeeItem1 + importFeeItem1);
          item.transaction.outMsgs.forEach((item2) => {
            const fwdFeeItem2 = item2.importFee;
            const importFeeItem2 = item2.fwdFee;

            setFee(fee + fwdFeeItem2 + importFeeItem2);
          });
        }
      });
    }
  }, [transaction]);

  const convertJsonToYaml = (obj: any) => {
    const doc = new yaml.Document();
    doc.contents = obj;
    return doc.toString();
  };

  return (
    <WrapperCardTrace id={transaction.hash}>
        <div className={'empty-container'}></div>
        <GridDataTrace>
            <div className={'header-data'}>
                {!isMobile && (
                    <SecondaryText>
                        {transaction.success
                          ? <span className={'icon-ic-done-circle-24 icon-status'}></span>
                          : <span className={'icon-ic-xmark-circle-16 icon-status'}></span>
                        }
                    </SecondaryText>
                )}
                <div className={'header-data-wrapper'}>
                    <GridTraceHeader>
                        <Row align='center' className={'item-info'}>
                            <SecondaryText className={'b2 title-info-trace fix'}>
                                Account:
                            </SecondaryText>
                            <Copy textToCopy={address} className={'hash-item'}>
                                <Link href={`/${addressToBase64(transaction.account.address)}`} onClick={(e) => {
                                  e.preventDefault();
                                  window.location.href = `/${addressToBase64(transaction.account.address)}`;
                                  e.stopPropagation();
                                }}>
                                    {transaction.account?.name
                                      ? (
                                            <Text className={'b2'} type={'history-address'}>
                                                {transaction.account.name}
                                            </Text>
                                        )
                                      : (
                                            <SliceAutoStrComponent str={address || ''} type={'history-address'} />
                                        )}
                                </Link>
                            </Copy>
                        </Row>
                        <Row align='center' className={'item-info'}>
                            <SecondaryText className={'b2 title-info-trace fix'}>
                                Interfaces:
                            </SecondaryText>
                            <Text className={'b2 info-trace-data slice-str'} style={{ maxWidth: '200px' }}>
                                {new Array(interfaces || [])?.join(', ') || '-'}
                            </Text>
                        </Row>
                        <Row align='center' className={'item-info'}>
                            <SecondaryText className={'b2 title-info-trace fix'}>
                                Hash:
                            </SecondaryText>
                            <Copy textToCopy={hash} className={'hash-item'}>
                                <SliceAutoStrComponent str={transaction.hash || ''} />
                            </Copy>
                        </Row>
                        <Row align='center' className={'item-info'}>
                            <SecondaryText className={'b2 title-info-trace fix'}>
                                LT:
                            </SecondaryText>
                            <Text className={'b2 info-trace-data'}>
                                {lt}
                            </Text>
                        </Row>
                        {isShowSecondRow && (
                              <>
                                  <Row align='center' className={'item-info'}>
                                      <SecondaryText className={'b2 title-info-trace fix'}>
                                          Exit code:
                                      </SecondaryText>
                                      <Text className={'b2 info-trace-data'}>
                                          {transaction.computePhase.exitCode}
                                      </Text>
                                  </Row>
                                  <Row align='center' className={'item-info'}>
                                      <SecondaryText className={'b2 title-info-trace fix'}>
                                          State:
                                      </SecondaryText>
                                      <SecondaryText className={'b2 status'}>
                                          {transaction.origStatus}
                                          <span className={'icon-ic-arrow-right-16'} />
                                          {transaction.endStatus}
                                      </SecondaryText>
                                  </Row>
                                  <Row align='center' className={'item-info'}>
                                      <SecondaryText className={'b2 title-info-trace fix'}>
                                          Type:
                                      </SecondaryText>
                                      <Text className={'b2 info-trace-data'}>
                                          {transaction.transactionType}
                                      </Text>
                                  </Row>
                              </>
                        )}
                    </GridTraceHeader>
                </div>
            </div>
            <div className={'header-data'} style={{ border: 'none' }}>
                <GridTraceHeader style={{ marginLeft: isMobile ? '' : 'calc(18px + 12px)' }}>
                    <Row align='center' className={'item-info'}>
                        <SecondaryText className={'b2 title-info-trace fix'}>
                            Value:
                        </SecondaryText>
                        <Text className={'b2 info-trace-data'}>
                            {prettifyPrice(convertNanoton(transaction.inMsg?.value || 0))} TON
                        </Text>
                    </Row>
                    {typeof transaction.inMsg?.bounce !== 'undefined' && (
                        <Row align='center' className={'item-info'}>
                            <SecondaryText className={'b2 title-info-trace fix'}>
                                Bounce:
                            </SecondaryText>
                            <Text className={'b2 info-trace-data'}>
                                {JSON.stringify(transaction.inMsg.bounce)}
                            </Text>
                        </Row>
                    )}
                    {typeof transaction.inMsg?.bounced !== 'undefined' && (
                        <Row align='center' className={'item-info'}>
                            <SecondaryText className={'b2 title-info-trace fix'}>
                                Bounced:
                            </SecondaryText>
                            <Text className={'b2 info-trace-data'}>
                                {JSON.stringify(transaction.inMsg.bounced)}
                            </Text>
                        </Row>
                    )}
                    {typeof transaction.totalFees !== 'undefined' && (
                        <Row align='center' className={'item-info'}>
                            <SecondaryText className={'b2 title-info-trace fix'}>
                                Total Fees:
                            </SecondaryText>
                            <Text className={'b2 info-trace-data'}>
                                {prettifyPrice(convertNanoton(transaction.totalFees || 0))} TON
                            </Text>
                        </Row>
                    )}
                    {transaction.inMsg?.opCode && (
                        <Row align='center' className={'item-info'}>
                            <SecondaryText className={'b2 title-info-trace fix'}>
                                OpCode:
                            </SecondaryText>
                            {transaction.inMsg.decodedOpName
                              ? (
                                    <>
                                        <Text className={'b2 info-trace-data'}>
                                            {formateDecodeOpName(transaction.inMsg.decodedOpName)}
                                        </Text>
                                        {' · '}
                                        <SecondaryText className={'b2'}>
                                            {transaction.inMsg.opCode}
                                        </SecondaryText>
                                    </>
                                )
                              : (
                                    <>
                                        <Text className={'b2 info-trace-data'}>
                                            {transaction.inMsg.opCode}
                                        </Text>
                                    </>
                                )
                            }
                        </Row>
                    )}
                    {transaction?.inMsg && (
                        <Text
                            className={'b2 more-info-item-trace'}
                            type={'history-address'}
                            style={{ gridColumn: isMobile ? '1' : isTablet ? '3' : '4' }}
                            onClick={() => setIsShow(!isShow)} >
                            {!isShow ? 'More' : 'Hide'}
                            <span className={'icon-ic-chevron-down-16'} style={{
                              transform: isShow ? 'rotate(180deg)' : 'rotate(0deg)'
                            }} />
                        </Text>
                    )}
                </GridTraceHeader>
            </div>
        </GridDataTrace>
        {(isShow && transaction?.inMsg) && (
            <>
                {yamlData && (
                    <div className={'decode-json-to-yaml'}>
                        <div className={'wrapper-code'}>
                            <Copy textToCopy={yamlData} visible className={'copy-yaml'}>
                                <pre>{yamlData}</pre>
                            </Copy>
                        </div>
                    </div>
                )}
                <div className={'header-data'} style={{ border: 'none' }}>
                    <GridTraceHeader isMoreData>
                        <Row align='center' className={'more-info'}>
                            <SecondaryText className={'b2 title-info-trace'}>
                                Storage Fees:
                            </SecondaryText>
                            <Text className={'b2 info-trace-data'}>
                                {prettifyPrice(convertNanoton(transaction?.storagePhase?.feesCollected || 0))} TON
                            </Text>
                        </Row>
                        <Row align='center' className={'more-info'}>
                            <SecondaryText className={'b2 title-info-trace'}>
                                Compute Fees:
                            </SecondaryText>
                            <Text className={'b2 info-trace-data'}>
                                {prettifyPrice(convertNanoton(transaction?.computePhase?.gasFees || 0))} TON
                            </Text>
                        </Row>
                        <Row align='center' className={'more-info'}>
                            <SecondaryText className={'b2 title-info-trace'}>
                                Fwd Fees:
                            </SecondaryText>
                            <Text className={'b2 info-trace-data'}>
                                {prettifyPrice(convertNanoton(transaction.inMsg.fwdFee || 0))} TON
                            </Text>
                        </Row>
                        <Row align='center' className={'more-info'}>
                            <SecondaryText className={'b2 title-info-trace'}>
                                BlockID:
                            </SecondaryText>
                            <Copy textToCopy={transaction.block} className={'hash-item'}>
                                <SliceAutoStrComponent str={transaction.block || ''} />
                            </Copy>
                        </Row>
                        {transaction.prevTransHash &&
                            <Row align='center' className={'more-info'}>
                                <SecondaryText className={'b2 title-info-trace'}>
                                    Prev. tx.:
                                </SecondaryText>
                                <Copy textToCopy={transaction.prevTransHash} className={'hash-item'}>
                                    <Link href={`/${transaction.prevTransHash}`} onClick={(e) => {
                                      e.preventDefault();
                                      window.location.href = `/${transaction.prevTransHash}`;
                                      e.stopPropagation();
                                    }}>
                                        <SliceAutoStrComponent
                                            str={transaction.prevTransHash || ''}
                                            type={'history-address'}
                                        />
                                    </Link>
                                </Copy>
                            </Row>
                        }
                        <Row align='center' className={'more-info'}>
                            <SecondaryText className={'b2 title-info-trace'}>
                                Out Value:
                            </SecondaryText>
                            <Text className={'b2 info-trace-data'}>
                                {outValue / 1000000000} TON
                            </Text>
                        </Row>
                        <Row align='center' className={'more-info'}>
                            <SecondaryText className={'b2 title-info-trace'}>
                                Out messages count:
                            </SecondaryText>
                            <Text className={'b2 info-trace-data'}>
                                {outMsgCount}
                            </Text>
                        </Row>
                        <Link href={getToncoinTransactionUrl(transaction)} style={{ width: 'auto' }}>
                            <SecondaryText className={'b2 debug-details'}>
                                Debug details
                                <span className={'icon-ic-arrow-right-16'} />
                            </SecondaryText>
                        </Link>
                    </GridTraceHeader>
                </div>
            </>
        )}
    </WrapperCardTrace>
  );
};

export function getChildsTrace (trace, arr = [], lvl = 0, idx = 0) {
  arr.push([lvl, idx, trace]);

  if (!Array.isArray(trace.children)) return;

  trace.children.map((item: any, i) => {
    return getChildsTrace(item, arr, lvl + 1, i);
  });

  return arr;
}

const WrapperTraceRoot = styled.div`
  width: 100%;
  //padding: 1px;
  transition: 0.2s ease-in;
  box-shadow: 0 0 0px 0px transparent;

  .activeItemTrace {
    outline: 1px solid rgba(44, 126, 219, 0.94);
    animation: 3s borderAnimation;

    @keyframes borderAnimation {
      from {
        outline: 1px solid rgba(44, 126, 219, 0.94);
      }
      to {
        outline: 1px solid rgba(44, 126, 219, 0);
      }
    }
  }

  .vertical-stick {
    width: 2px;
    height: 8px;
    background: ${props => props.theme.colors.text.accent};
    margin-left: 3%;
  }

  .warapper-title-trace {
    display: flex;
    padding: 20px 24px;
    border-radius: 12px 12px 0px 0px;
    background: ${props => props.theme.colors.background.card};
  }

  .vertical-line {
    //width: 100%;
    padding: 12px 0 0 4px;
    border-left: 1px solid ${props => props.theme.colors.text.accent};
    margin-left: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .slicer-b {
      position: absolute;
      background: ${props => props.theme.colors.background.main};
      bottom: 0;
      z-index: 99;
    }

    .circle-b-empty {
      position: absolute;
      background: ${props => props.theme.colors.background.main};
      z-index: 101;
      border-radius: 50%;
    }

    .circle-b {
      position: absolute;
      border: 1px solid ${props => props.theme.colors.text.accent};
      z-index: 100;
      border-radius: 50%;
    }
  }

  .child {
    display: flex;
    flex-direction: row;
    width: 100%;

    .hLine {
      margin-top: 28px;
      margin-left: -4px;
      width: 6px;
      height: 2px;
      background: ${props => props.theme.colors.text.accent};
    }
  }
`;

function createEmptyLine ({ height, width = 1, left = -1 }) {
  const line = document.createElement('div');
  line.className = 'slicer-b';
  line.style.height = `${height}px`;
  line.style.width = `${width}px`;
  line.style.left = `${left}px`;
  line.style.bottom = `${0}px`;
  return line;
}

function createCircle ({ height, width, bottom, left = -1, className = 'circle-b' }) {
  const circle = document.createElement('div');
  circle.className = className;
  circle.style.height = `${height}px`;
  circle.style.width = `${width}px`;
  circle.style.left = `${left}px`;
  circle.style.bottom = `${bottom}px`;
  return circle;
}

export const renderTree = (trace, lvl = 0, isFirst = true) => {
  const details = [];

  if (trace?.children?.length === 1) {
    details.push(
        <div className={'vertical-stick'} />
    );

    details.push(renderTree(trace?.children[0], lvl, false));
  } else if (trace?.children?.length > 1) {
    const childrens = [];

    trace?.children.forEach((item, idx) => {
      childrens.push(
          <div className={'child'} id={`child-${idx}-${lvl}`}>
              <div className={'hLine'} />
              {renderTree(item, lvl, false)}
          </div>
      );
    });

    details.push(
        <div className={'vertical-line'}>
            {childrens}
        </div>
    );
  }

  const arrayOfVerticalLiners = document.getElementsByClassName('vertical-line');
  Array.prototype.forEach.call(arrayOfVerticalLiners, (item) => {
    const childs = item.children;
    const lenChildrens = childs.length;
    const lastChildren = childs[lenChildrens - 1];

    if (lastChildren.className === 'slicer-b') return false;
    if (!lastChildren) return false;

    const hLine = lastChildren.getElementsByClassName('hLine')[0];
    const traceInfoElem = lastChildren.children[1];

    if (!hLine || !traceInfoElem) return false;
    hLine.style.background = 'transparent';

    setTimeout(() => {
      const cof = 18;
      const boundingClient = item.getBoundingClientRect();
      const height = ((boundingClient.height - hLine.offsetTop) - 2) + cof;
      const circle = item.getElementsByClassName('circle-b')[0];
      const circleEmpty = item.getElementsByClassName('circle-b-empty')[0];

      const resizeObserver = new ResizeObserver(function (entries) {
        entries.forEach(item => {
          const rect = item.contentRect;
          const elem = item.target;
          const newHeight = ((rect.height - hLine.offsetTop) - 2) + cof;
          const childsResize = elem.children;

          Array.prototype.forEach.call(childsResize, (item) => {
            if (item.className === 'slicer-b') {
              item.style.height = `${newHeight}px`;
            } else if (item.className === 'circle-b') {
              item.style.bottom = `${newHeight - 9}px`;
            } else if (item.className === 'circle-b-empty') {
              item.style.bottom = `${newHeight - 8}px`;
            }
          });
        });
      });

      if (circle || circleEmpty) {
        resizeObserver.observe(item);
        return null;
      }

      item.appendChild(createEmptyLine({ height }));
      item.appendChild(createCircle({
        height: 16,
        width: 16,
        bottom: height - 9
      }));
      item.appendChild(createCircle({
        height: 19,
        width: 19,
        left: 0,
        bottom: height - 8,
        className: 'circle-b-empty'
      }));
    }, 10);
  });

  return (
     <WrapperTraceRoot>
          <TraceCard
              data={trace}
              childs={trace?.children || []}
              interfaces={trace?.interfaces}
              isFirst={isFirst}
          />
          {details}
     </WrapperTraceRoot>
  );
};

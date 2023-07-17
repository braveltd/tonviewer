import isEmpty from 'lodash/isEmpty';
import toLower from 'lodash/toLower';
import { Fragment } from 'react';
// import { useTheme } from 'styled-components';
import { Collapse } from '../../../core/collapse';
import { Column } from '../../../core/column';
import { Row } from '../../../core/row';
import { SecondaryText, Text } from '../../../core/text';
import { css } from '@linaria/core';
import Tooltip from '../../../core/tooltip';
import { useMedia } from 'react-use';

const WrapperDataSection = css`
  display: table;
  table-layout: fixed;
  
  span {
    display: table-cell;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;
export const NftAttributesSection = ({ metadata }) => {
  const isMobile = useMedia('(max-width: 768px)');

  if (isEmpty(metadata?.attributes)) {
    // return (
    //   <Subtitle color={theme.colors.text.secondary}>
    //     No Attributes
    //   </Subtitle>
    // );
    return null;
  }

  const attributes = metadata?.attributes?.flatMap((attribute) => {
    if (!attribute.trait_type && !attribute.value) {
      return Object.entries(attribute).map(([key, value]) => ({
        trait_type: key,
        value
      }));
    }
    return attribute;
  });

  return (
    <Collapse defaultActive title={<Text className={'l1'}>Attributes</Text>}>
      <Column style={{ gap: '12px' }}>
        {attributes?.map((attribute, idx) => (
          <Fragment key={attribute.trait_type || toLower(attribute.value) || idx}>
            <Row align='baseline' justify='space-between' gap={'4px'}>
              <SecondaryText className={'b2'}>
                {attribute.trait_type}
              </SecondaryText>
              {(String(attribute.value)?.length > 50)
                ? (
                <Tooltip tooltip={attribute.value} visible={true} width={isMobile ? 250 : 300 }>
                  <div className={WrapperDataSection} style={{ cursor: 'pointer', width: '100%' }}>
                    <Text className={'b2'} style={{ cursor: 'pointer' }}>
                      {attribute.value}
                    </Text>
                  </div>
                </Tooltip>
                  )
                : (
                <div className={WrapperDataSection}>
                  <Text className={'b2'}>
                    {attribute.value}
                  </Text>
                </div>
                  )}
            </Row>
          </Fragment>
        ))}
      </Column>
    </Collapse>
  );
};

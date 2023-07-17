import { useTheme } from 'styled-components';
import { Collapse } from '../../../core/collapse';
import { Subtitle, Text } from '../../../core/text';
import Metadata from '../../../core/metadata';
import React from 'react';
import { GlobalStyles } from '../../transactions/details';
import useDarkMode from 'use-dark-mode';

export const NftMetadataSection = ({ metadata }) => {
  const theme = useTheme();
  const darkMode = useDarkMode();

  if (!metadata) {
    return (
      <Subtitle color={theme.colors.text.secondary}>
        No Metadata
      </Subtitle>
    );
  }

  return (
    <Collapse defaultActive isLast isMeta title={<Text className={'l1'}>Metadata</Text>}>
      <GlobalStyles darkMode={darkMode.value} />
      <Metadata metadata={metadata} />
    </Collapse>
  );
};

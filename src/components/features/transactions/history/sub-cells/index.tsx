import React from 'react';
import styled from 'styled-components';
import { Text } from '../../../../core/text';
import { useRouter } from 'next/router';
import { useMedia } from 'react-use';

const AddressWrapper = styled.div`
  display: flex;
  flex-direction: row;

  .f {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .f2 {
    flex: 2;
    width: 100px;
    min-width: 100px;
  }
`;

export const AddressSlicer = ({ address, name, isTrace }) => {
  const router = useRouter();
  const value = name || address;
  const isMobile = useMedia('(max-width: 768px)');
  const isMobileTrace = isMobile && isTrace;
  const sliceCountChars = isMobileTrace ? 5 : 11;

  const addrSlice = value.slice(value.length - sliceCountChars, value.length);

  return (
    <AddressWrapper
      className={'address-wrapper-container'}
      style={{ maxWidth: isMobileTrace ? 104 : isTrace ? 164 : 204 }}
      onClick={e => {
        e.preventDefault();
        router.push({ pathname: `/${address}` });
        e.stopPropagation();
      }}
    >
      <Text className={'l2-mono f'} type={'history-address'}>
        {value}
      </Text>
      {!name && (
        <Text
          className={'l2-mono f2'}
          type={'history-address'}
          style={{ minWidth: isMobileTrace ? 'auto' : '100px', whiteSpace: 'nowrap' }}
        >
          {addrSlice}
        </Text>
      )}
    </AddressWrapper>
  );
};

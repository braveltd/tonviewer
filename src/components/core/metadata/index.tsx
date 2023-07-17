import { FC, memo, useEffect } from 'react';
import styled from 'styled-components';
import { NftItem } from 'tonapi-sdk-js';
import hljs from 'highlight.js';
import 'highlight.js/styles/base16/dracula.css';
import { Copy } from '../copy';

export type NftMetadataProps = {
  metadata: NftItem['metadata']
}

const Code = styled.code`
  border-radius: 8px;
`;

const Metadata: FC<NftMetadataProps> = ({ metadata }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <pre>
      <Copy className={'copy-container'} textToCopy={JSON.stringify(metadata, null, 2)} visible></Copy>
      <Code className='language-json'>
        {JSON.stringify(metadata, null, 2)}
      </Code>
    </pre>
  );
};

export default memo(Metadata);

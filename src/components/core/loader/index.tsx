import styled from 'styled-components';
import { SecondaryText } from '../text';

export const LoaderContainer = styled.div<{isTab?: boolean}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 44px;
  width: ${props => props.isTab ? 'auto' : '100%'};
  
  .loader-wrapper {
    max-width: 676px;
    height: 44px;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    
    .icon-loader {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 0.4px;
      animation: 1s linear infinite lds-ring;
    }

    @keyframes lds-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;

export const Loader = ({ isTab, className = '' }: { isTab?: boolean, className?: string }) => {
  return (
      <LoaderContainer isTab={isTab} className={className}>
          <div className={'loader-wrapper'}>
              <SecondaryText className={'l2 icon-loader'}>
                  <span className={'icon-ic-loader-16'}></span>
              </SecondaryText>
              {!isTab && (
                  <SecondaryText className={'l2'}>
                      Loading
                  </SecondaryText>
              )}
          </div>
      </LoaderContainer>
  );
};

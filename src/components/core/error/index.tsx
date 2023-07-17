import styled from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import { FC } from 'react';
import { AppRoutes } from '../../../helpers/routes';
import { Button } from '../button';

type ErrorBlockContainerProps = {
  bordered: boolean;
}

const ErrorBlockContainer = styled.div<ErrorBlockContainerProps>`
  background: ${props => props.theme.colors.background.card};
  border: ${props => props.bordered ? props.theme.border : 'initial'};
  border-radius: 16px;
  margin-top: 24px;
  padding: 36px;
  text-align: center;
  width: 100%;
`;

const ErrorBlockTitle = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: 16px;
  font-weight: 600;
`;

const ErrorBlockDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 14px;
  font-weight: 400;
`;

type ErrorBlockProps = {
  bordered?: boolean
  description: string
  title: string
}

export const ErrorBlock: FC<ErrorBlockProps> = ({ title, description, bordered = true }) => {
  return (
    <ErrorBlockContainer bordered={bordered}>
      <ErrorBlockTitle>{title}</ErrorBlockTitle>
      <ErrorBlockDescription>{description}</ErrorBlockDescription>
    </ErrorBlockContainer>
  );
};

const ErrorFallbackContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  margin: 0 auto;
  max-width: 1200px;
`;

type ErrorFallbackProps = {
  error?: Error
  resetErrorBoundary: () => void
}

const ErrorFallback: FC<ErrorFallbackProps> = ({ error, resetErrorBoundary, ...args }) => {
  return (
    <ErrorFallbackContainer>
      <ErrorBlock
        title={`Something went wrong on ${process.env.isTestOnly ? 'Testnet' : 'TON API'}`}
        description={error.message}
        bordered={false}
      />
      <Button size='large' variant='primary' onClick={() => {
        resetErrorBoundary();
        window.location.href = AppRoutes.home();
      }}>
        Back to home
      </Button>
    </ErrorFallbackContainer>
  );
};

export const TonApiErrorBoundary: FC<any> = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ErrorBoundary>
);

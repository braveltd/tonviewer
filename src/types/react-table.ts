import { Row, Column } from 'react-table';

type GetCellProps = Record<string, unknown> & {
  key: string;
};

export type Cell = {
  render: (type: string) => any;
  getCellProps: () => GetCellProps;
  column: Column;
  row: Row;
  state: any;
  value: any;
};

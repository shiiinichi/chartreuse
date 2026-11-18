import { Children, isValidElement } from 'react';
import type { ReactNode } from 'react';
import { Grid, GridItem } from './Grid';
import type { GridProps } from './Grid';

export interface StatGroupProps extends Omit<GridProps, 'children'> {
  children: ReactNode;
}

/** The shared Grid with one item per child; explicit GridItem children retain their spans. */
export function StatGroup({ children, columns = { base: 1, sm: 2, md: 3 }, gap = 6, className, role = 'group', ...props }: StatGroupProps) {
  return <Grid {...props} role={role} columns={columns} gap={gap} className={['cr-stat-group', className].filter(Boolean).join(' ')}>
    {Children.toArray(children).map((child, index) => isValidElement(child) && child.type === GridItem ? child : <GridItem key={isValidElement(child) ? child.key : index} span={1}>{child}</GridItem>)}
  </Grid>;
}

import { Interval, makeBucketNames } from '../date-utils';
import { ILineChartOptions } from 'chartist';
import { Moment } from 'moment';
import React from 'react';
import ChartistGraph from 'react-chartist';
import { makeBalanceData, removeDuplicateAccounts } from 'src/balance-utils';
import styled from 'styled-components';

const Chart = styled.div`
  .ct-label {
    color: white;
  }
`;

export const AccountVisualization: React.FC<{
  dailyAccountBalanceMap: Map<string, Map<string, number>>;
  selectedAccounts: string[];
  startDate: Moment;
  endDate: Moment;
  interval: Interval;
}> = (props): JSX.Element => {
  const filteredAccounts = removeDuplicateAccounts(props.selectedAccounts);
  const dateBuckets = makeBucketNames(
    props.interval,
    props.startDate,
    props.endDate,
  );

  const data = {
    labels: dateBuckets,
    series: filteredAccounts.map((account) =>
      makeBalanceData(props.dailyAccountBalanceMap, dateBuckets, account),
    ),
  };

  const options: ILineChartOptions = {
    height: '300px',
    width: '800px',
    showArea: false,
    showPoint: true,
  };

  const type = 'Line';

  return (
    <>
      <ul className="ct-legend">
        {filteredAccounts.map((account, i) => (
          <li key={account} className={`ct-series-${i}`}>
            {account}
          </li>
        ))}
      </ul>
      <Chart>
        <ChartistGraph data={data} options={options} type={type} />
      </Chart>
    </>
  );
};

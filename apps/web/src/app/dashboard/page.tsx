import React from 'react';

const DashboardPage = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="widgets">
        <Widget title="Users" count={100} />
        <Widget title="Orders" count={50} />
        <Widget title="Products" count={200} />
      </div>
    </div>
  );
};

type WidgetProps = {
  title: string;
  count: number;
};

const Widget = ({ title, count }: WidgetProps) => {
  return (
    <div className="widget">
      <h3>{title}</h3>
      <p>{count}</p>
    </div>
  );
};

export default DashboardPage;

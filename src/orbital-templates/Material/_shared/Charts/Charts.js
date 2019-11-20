import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarAngleAxis,
  PolarRadiusAxis,
  PolarGrid,
  Label,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import React from "react";

const CustomizedAxisTick = props => {
  const { x, y, stroke, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)"
      >
        {payload.value}
      </text>
    </g>
  );
};

export const CountChart = ({ count, label }) => (
  <BarChart
    width={600}
    height={300}
    data={count}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
  >
    <XAxis>
      <Label value={label} offset={0} position="insideBottom" />
    </XAxis>
    <YAxis dataKey="res" />
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip
    // formatter={(value, name, props) => {
    //   const { year, month, dayOfMonth } = props.payload._id;
    //   return `${month}/${dayOfMonth}/${year}`;
    // }}
    />
    <Bar type="monotone" dataKey="res" stroke="#8884d8"></Bar>
  </BarChart>
);

export const CountChartWithField = ({ count, label, field }) => {
  return (
    <RadarChart outerRadius={90} width={730} height={250} data={count}>
      <PolarGrid />
      <PolarAngleAxis dataKey="_id" />
      <PolarRadiusAxis angle={30} domain={[0, 150]} />
      <Radar
        name="Mike"
        dataKey="total"
        stroke="#8884d8"
        fill="#8884d8"
        fillOpacity={0.6}
      />
    </RadarChart>
  );
};

export const SumChart = ({ sum }) => (
  <BarChart
    width={600}
    height={300}
    data={sum}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
  >
    <XAxis dataKey="_id.year" />
    <YAxis dataKey="res" />
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip />
    <Legend />
    <Bar type="monotone" dataKey="re" stroke="#8884d8"></Bar>
  </BarChart>
);

export const AverageChart = ({ average }) => (
  <LineChart
    width={600}
    height={300}
    data={count}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
  >
    <XAxis dataKey="_id.year" />
    <YAxis dataKey="res" />
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="res" stroke="#8884d8" />
  </LineChart>
);

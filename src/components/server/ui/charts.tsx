"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

import { ChartProps } from 'react-chartjs-2';

export function BarChart(props: ChartProps<"bar">) {
  return <Bar {...props} />;
}
export function LineChart(props: ChartProps<"line">) {
  return <Line {...props} />;
}
export function PieChart(props: ChartProps<"pie">) {
  return <Pie {...props} />;
}
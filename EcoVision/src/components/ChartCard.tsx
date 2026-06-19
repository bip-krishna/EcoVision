import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface ChartDataPoint {
  label: string;
  value: number;
}

interface ChartCardProps {
  data: ChartDataPoint[];
  title: string;
  color?: string;
}

export default function ChartCard({ data, title, color = "#2E7D32" }: ChartCardProps) {
  const screenWidth = Dimensions.get("window").width - 64;

  if (data.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [{ data: data.map((d) => Math.max(0.1, d.value)) }],
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <BarChart
        data={chartData}
        width={screenWidth}
        height={200}
        yAxisLabel=""
        yAxisSuffix=""
        fromZero
        showValuesOnTopOfBars
        withHorizontalLabels={false}
        chartConfig={{
          backgroundColor: "#FFFFFF",
          backgroundGradientFrom: "#FFFFFF",
          backgroundGradientTo: "#FFFFFF",
          decimalPlaces: 1,
          color: () => color,
          labelColor: () => "#666",
          barPercentage: 0.6,
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#E8E8E8",
          },
          propsForLabels: {
            fontSize: 11,
          },
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingVertical: 20,
  },
});

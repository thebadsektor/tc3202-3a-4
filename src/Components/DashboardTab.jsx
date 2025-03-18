import React, { useEffect } from "react";
import * as echarts from "echarts";

const DashboardTab = () => {
  useEffect(() => {
    const chartDom = document.getElementById("productTrends");
    const myChart = echarts.init(chartDom);
    const option = {
      animation: false,
      grid: {
        left: "5%",
        right: "5%",
        top: "10%",
        bottom: "10%",
      },
      xAxis: {
        type: "category",
        data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        axisLine: {
          lineStyle: {
            color: "#E5E7EB",
          },
        },
        axisLabel: {
          color: "#6B7280",
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            color: "#E5E7EB",
          },
        },
        axisLabel: {
          color: "#6B7280",
        },
      },
      series: [
        {
          data: [150, 220, 220, 210, 135, 150],
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#3B82F6",
            width: 3,
          },
          symbol: "circle",
          symbolSize: 8,
          itemStyle: {
            color: "#3B82F6",
          },
        },
      ],
    };
    myChart.setOption(option);

    // Cleanup function to prevent memory leaks
    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1E293B] p-6 rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-blue-600 bg-opacity-20 rounded-lg">
              <i className="fas fa-box text-blue-500 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-400 text-sm">Total Products</h3>
              <p className="text-2xl font-bold">2,453</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-green-600 bg-opacity-20 rounded-lg">
              <i className="fas fa-tags text-green-500 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-400 text-sm">Categories</h3>
              <p className="text-2xl font-bold">4</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1E293B] p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6">Product Trends</h2>
          <div id="productTrends" style={{ height: "300px" }}></div>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6">Recent Activities</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 bg-opacity-20 rounded-lg">
                <i className="fas fa-plus text-green-500"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm">New product added</p>
                <p className="text-gray-400 text-sm">Modern Leather Sofa</p>
              </div>
              <span className="ml-auto text-gray-400 text-sm">2h ago</span>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 bg-opacity-20 rounded-lg">
                <i className="fas fa-shopping-cart text-blue-500"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm">New order received</p>
                <p className="text-gray-400 text-sm">Order #12345</p>
              </div>
              <span className="ml-auto text-gray-400 text-sm">4h ago</span>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-red-600 bg-opacity-20 rounded-lg">
                <i className="fas fa-exclamation-circle text-red-500"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm">Low stock alert</p>
                <p className="text-gray-400 text-sm">Dining Table Set</p>
              </div>
              <span className="ml-auto text-gray-400 text-sm">6h ago</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-[#1E293B] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Low Stock Alerts</h2>
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-left">
              <th className="pb-4">PRODUCT</th>
              <th className="pb-4">CATEGORY</th>
              <th className="pb-4">STOCK</th>
              <th className="pb-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-700">
              <td className="py-4">
                <div className="flex items-center">
                  <img
                    src="https://public.readdy.ai/ai/img_res/eda5cde4970f1f275a954a7ba6f912e1.jpg"
                    alt="Product"
                    className="w-10 h-10 rounded-lg"
                  />
                  <span className="ml-3">Dining Table Set</span>
                </div>
              </td>
              <td className="py-4">Modern</td>
              <td className="py-4">2</td>
              <td className="py-4">
                <span className="px-3 py-1 bg-red-600 bg-opacity-20 text-red-500 rounded-full text-sm">
                  Critical
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardTab;
import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import {
  getProducts,
  getCategories,
  getStyles,
} from "../utils/appwriteService";
import { supabase } from "../utils/supabaseClient";

const DashboardTab = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalStyles, setTotalStyles] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const products = await getProducts();
      const categories = await getCategories();
      const styles = await getStyles();
      setTotalProducts(products.length);
      setTotalCategories(categories.length);
      setTotalStyles(styles.length);
    };
    fetchData();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id");

      if (error) throw error;
      setTotalUsers(profiles.length);
    } catch (error) {
      console.error("Error fetching users:", error);
      setTotalUsers(0);
    }
  };

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
            <div className="p-3 bg-blue-600/25 rounded-lg">
              <i className="fas fa-box text-blue-500 text-2xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-400 text-sm">Total Products</h3>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-pink-600/25 rounded-lg">
              <i className="fas fa-users text-pink-500 text-2xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-400 text-sm">Users</h3>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-green-600/25 rounded-lg">
              <i className="fas fa-tags text-green-500 text-2xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-400 text-sm">Categories</h3>
              <p className="text-2xl font-bold">{totalCategories}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-purple-600/25 rounded-lg">
              <i className="fas fa-paint-brush text-purple-500 text-2xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-400 text-sm">Styles</h3>
              <p className="text-2xl font-bold">{totalStyles}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1E293B] p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6 text-white">
            Most Recommended Items
          </h2>
          <div id="productTrends" style={{ height: "300px" }}></div>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6 text-white">
            Least Recommended Items
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 bg-opacity-20 rounded-lg relative">
                <i className="fas fa-plus text-green-500 relative z-10"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-white">New product added</p>
                <p className="text-gray-400 text-sm">Modern Leather Sofa</p>
              </div>
              <span className="ml-auto text-gray-400 text-sm">2h ago</span>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 bg-opacity-20 rounded-lg relative">
                <i className="fas fa-box text-blue-500 text-xl relative z-10"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-white">New order received</p>
                <p className="text-gray-400 text-sm">Order #12345</p>
              </div>
              <span className="ml-auto text-gray-400 text-sm">4h ago</span>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-red-600 bg-opacity-20 rounded-lg relative">
                <i className="fas fa-exclamation-circle text-red-500 relative z-10"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-white">Low stock alert</p>
                <p className="text-gray-400 text-sm">Dining Table Set</p>
              </div>
              <span className="ml-auto text-gray-400 text-sm">6h ago</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardTab;

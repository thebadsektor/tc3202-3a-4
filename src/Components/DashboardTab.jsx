import React, { useEffect, useState, useRef } from "react";
import {
  getProducts,
  getCategories,
  getStyles,
} from "../utils/appwriteService";
import { supabase } from "../utils/supabaseClient";
import * as echarts from 'echarts';
import DashboardSkeletonLoading from "./shared/DashboardSkeletonLoading";

const DashboardTab = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalStyles, setTotalStyles] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stylesPopularity, setStylesPopularity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const products = await getProducts();
        const categories = await getCategories();
        const styles = await getStyles();
        setTotalProducts(products.length);
        setTotalCategories(categories.length);
        setTotalStyles(styles.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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

  // Fetch styles popularity data
  useEffect(() => {
    const fetchStylesPopularity = async () => {
      try {
        const products = await getProducts();
        const styles = await getStyles();
        
        // Count products by style
        const styleCounts = {};
        
        // Initialize counts for all styles to zero
        styles.forEach(style => {
          styleCounts[style.name] = 0;
        });
        
        // Count products for each style
        products.forEach(product => {
          if (product.style && styleCounts.hasOwnProperty(product.style)) {
            styleCounts[product.style]++;
          }
        });
        
        // Convert to array of objects for the chart
        const stylePopularityData = Object.keys(styleCounts).map(styleName => ({
          name: styleName,
          value: styleCounts[styleName]
        }));
        
        // Sort by popularity (highest count first)
        stylePopularityData.sort((a, b) => b.value - a.value);
        
        setStylesPopularity(stylePopularityData);
      } catch (error) {
        console.error("Error fetching styles popularity data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStylesPopularity();
  }, []);

  return (
    <>
      {isLoading ? (
        <DashboardSkeletonLoading />
      ) : (
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
                Styles Popularity
              </h2>
              {stylesPopularity.length > 0 ? (
                <StylesPopularityChart stylesData={stylesPopularity} />
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No styles data found
                </div>
              )}
            </div>
            <div className="bg-[#1E293B] p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-6 text-white">
                Resgistration Trends
              </h2>
              <UserActivityChart />
            </div>
          </div>
        </>
      )}
    </>
  );
};

// User Activity Chart Component
const UserActivityChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartType, setChartType] = useState(() => {
    // Get saved chart type from localStorage or default to "line"
    return localStorage.getItem("userActivityChartType") || "line";
  });
  const [timeRange, setTimeRange] = useState(() => {
    // Get saved time range from localStorage or default to "month"
    return localStorage.getItem("userActivityTimeRange") || "month";
  });
  const [userActivityData, setUserActivityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Save chart preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem("userActivityChartType", chartType);
  }, [chartType]);

  useEffect(() => {
    localStorage.setItem("userActivityTimeRange", timeRange);
  }, [timeRange]);

  // Fetch user activity data
  useEffect(() => {
    const fetchUserActivityData = async () => {
      try {
        setIsLoading(true);
        
        // Get user profiles with created_at timestamps
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("created_at")
          .order("created_at", { ascending: true });

        if (error) throw error;

        // Process the data based on selected time range
        const processedData = processUserActivityData(profiles, timeRange);
        setUserActivityData(processedData);
      } catch (error) {
        console.error("Error fetching user activity data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivityData();
  }, [timeRange]);

  // Process user activity data based on time range
  const processUserActivityData = (profiles, range) => {
    if (!profiles || profiles.length === 0) return [];

    const now = new Date();
    let startDate;
    let dateFormat;
    let groupingFunction;

    // Set start date and formatting based on selected range
    switch (range) {
      case "day":
        startDate = new Date(now);
        startDate.setHours(now.getHours() - 24);
        dateFormat = { hour: "2-digit" };
        groupingFunction = (date) => date.toLocaleTimeString("en-US", { hour: "2-digit" });
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        dateFormat = { day: "2-digit" };
        groupingFunction = (date) => date.toLocaleDateString("en-US", { weekday: "short" });
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        dateFormat = { month: "short", day: "numeric" };
        groupingFunction = (date) => date.toLocaleDateString("en-US", { day: "numeric" });
        break;
      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        dateFormat = { year: "numeric", month: "short" };
        groupingFunction = (date) => date.toLocaleDateString("en-US", { month: "short" });
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        dateFormat = { month: "short", day: "numeric" };
        groupingFunction = (date) => date.toLocaleDateString("en-US", { day: "numeric" });
    }

    // Filter profiles by date range
    const filteredProfiles = profiles.filter(profile => {
      const createdAt = new Date(profile.created_at);
      return createdAt >= startDate && createdAt <= now;
    });

    // Group profiles by date
    const groupedData = {};
    
    // Initialize all dates in the range with zero counts
    let currentDate = new Date(startDate);
    while (currentDate <= now) {
      const dateKey = groupingFunction(currentDate);
      groupedData[dateKey] = 0;
      
      // Increment based on time range
      if (range === 'day') {
        // For 24-hour view, increment by 1 hour
        currentDate.setHours(currentDate.getHours() + 1);
      } else {
        // For other views, increment by 1 day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Count registrations for each date
    filteredProfiles.forEach(profile => {
      const createdAt = new Date(profile.created_at);
      const dateKey = groupingFunction(createdAt);
      
      if (groupedData[dateKey] !== undefined) {
        groupedData[dateKey]++;
      }
    });

    // Convert to array format for chart
    return Object.entries(groupedData).map(([date, count]) => ({
      date,
      count
    }));
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  useEffect(() => {
    // Initialize chart
    if (chartRef.current && userActivityData.length > 0) {
      // Dispose previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      // Create new chart instance
      chartInstance.current = echarts.init(chartRef.current);

      // Define chart colors based on the app's theme
      const colors = [
        '#3b82f6', // blue-500
        '#8b5cf6', // purple-500
        '#ec4899', // pink-500
      ];

      // Prepare data for the chart
      const dates = userActivityData.map(item => item.date);
      const counts = userActivityData.map(item => item.count);
      
      // Generate dynamic y-axis title based on selected time range
      const now = new Date();
      let yAxisName = 'Registrations';
      
      // Format the date based on the selected time range
      switch (timeRange) {
        case 'day':
          // For Last 24 Hours, show the current date (e.g., May 9, 2025)
          yAxisName = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          break;
        case 'week':
        case 'month':
          // For Last 7 Days and Last 30 Days, show month and year (e.g., May 2025)
          yAxisName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          break;
        case 'year':
          // For Last 12 Months, show just the year (e.g., 2025)
          yAxisName = now.getFullYear().toString();
          break;
        default:
          yAxisName = 'Registrations';
      }

      // Base options for both chart types
      const baseOption = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c} users'
        },
        color: colors,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLine: {
            lineStyle: {
              color: '#4b5563' // gray-600
            }
          },
          axisLabel: {
            color: '#9ca3af', // gray-400
            rotate: timeRange === 'month' ? 30 : 0
          }
        },
        yAxis: {
          type: 'value',
          name: yAxisName,
          nameTextStyle: {
            color: '#9ca3af' // gray-400
          },
          axisLine: {
            lineStyle: {
              color: '#4b5563' // gray-600
            }
          },
          axisLabel: {
            color: '#9ca3af' // gray-400
          },
          splitLine: {
            lineStyle: {
              color: '#374151' // gray-700
            }
          }
        },
        series: [{
          name: 'User Registrations',
          data: counts,
          type: chartType,
          smooth: true,
          itemStyle: {
            color: colors[0]
          },
          areaStyle: chartType === 'line' ? {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(59, 130, 246, 0.5)' // blue-500 with opacity
              }, {
                offset: 1,
                color: 'rgba(59, 130, 246, 0.1)'
              }]
            }
          } : undefined
        }]
      };

      // Set chart options and render
      chartInstance.current.setOption(baseOption);

      // Handle resize
      const handleResize = () => {
        chartInstance.current && chartInstance.current.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current && chartInstance.current.dispose();
      };
    }
  }, [userActivityData, chartType, timeRange]);

  // We don't need the individual loading indicator anymore as we're using the skeleton loader
  if (isLoading) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <div>
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="bg-[#2D3B4F] text-gray-300 border border-gray-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
        </div>
        <div>
          <select
            value={chartType}
            onChange={handleChartTypeChange}
            className="bg-[#2D3B4F] text-gray-300 border border-gray-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
      </div>
      <div ref={chartRef} className="w-full h-64"></div>
    </>
  );
};

// Styles Popularity Chart Component
const StylesPopularityChart = ({ stylesData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartType, setChartType] = useState(() => {
    // Get saved chart type from localStorage or default to "bar"
    return localStorage.getItem("stylesChartType") || "bar";
  });
  
  // Save chart type to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("stylesChartType", chartType);
  }, [chartType]);
  
  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  useEffect(() => {
    // Initialize chart
    if (chartRef.current) {
      // Dispose previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      // Create new chart instance
      chartInstance.current = echarts.init(chartRef.current);

      // Define chart colors based on the app's theme
      const colors = [
        '#3b82f6', // blue-500
        '#8b5cf6', // purple-500
        '#ec4899', // pink-500
        '#10b981', // emerald-500
        '#f59e0b', // amber-500
        '#ef4444', // red-500
        '#6366f1', // indigo-500
        '#14b8a6', // teal-500
        '#f97316', // orange-500
        '#84cc16'  // lime-500
      ];

      // Prepare data for the chart
      const chartData = stylesData.map(item => ({
        value: item.value,
        name: item.name
      }));

      // Base options for both chart types
      const baseOption = {
        tooltip: {
          formatter: '{b}: {c} products'
        },
        color: colors
      };
      
      // Chart options based on selected chart type
      let option;
      
      if (chartType === 'pie') {
        // Pie chart options
        option = {
          ...baseOption,
          tooltip: {
            ...baseOption.tooltip,
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            textStyle: {
              color: '#9ca3af' // gray-400
            }
          },
          series: [
            {
              name: 'Products Count',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['40%', '50%'],
              avoidLabelOverlap: true,
              itemStyle: {
                borderRadius: 4,
                borderColor: '#1E293B',
                borderWidth: 2
              },
              label: {
                show: false
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '14',
                  fontWeight: 'bold',
                  color: '#fff'
                }
              },
              labelLine: {
                show: false
              },
              data: chartData
            }
          ]
        };
      } else {
        // Bar chart options (default)
        option = {
          ...baseOption,
          tooltip: {
            ...baseOption.tooltip,
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#4b5563' // gray-600
              }
            },
            axisLabel: {
              color: '#9ca3af' // gray-400
            },
            splitLine: {
              lineStyle: {
                color: '#374151' // gray-700
              }
            }
          },
          yAxis: {
            type: 'category',
            data: chartData.map(item => item.name),
            axisLine: {
              lineStyle: {
                color: '#4b5563' // gray-600
              }
            },
            axisLabel: {
              color: '#9ca3af' // gray-400
            }
          },
          series: [
            {
              name: 'Products Count',
              type: 'bar',
              data: chartData.map(item => item.value),
              itemStyle: {
                color: function(params) {
                  // Use colors array to assign different colors to bars
                  return colors[params.dataIndex % colors.length];
                },
                borderRadius: [0, 4, 4, 0]
              },
              label: {
                show: true,
                position: 'right',
                color: '#fff'
              }
            }
          ]
        };
      }

      // Set chart options and render
      chartInstance.current.setOption(option);

      // Handle resize
      const handleResize = () => {
        chartInstance.current && chartInstance.current.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current && chartInstance.current.dispose();
      };
    }
  }, [stylesData, chartType]);

  return (
    <>
      <div className="flex justify-end mb-4">
        <select
          value={chartType}
          onChange={handleChartTypeChange}
          className="bg-[#2D3B4F] text-gray-300 border border-gray-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
        >
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      <div ref={chartRef} className="w-full h-64"></div>
    </>
  );
};

export default DashboardTab;

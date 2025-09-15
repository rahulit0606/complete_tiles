import React, { useState, useEffect } from 'react';
import { Shield, Users, Store, BarChart3, TrendingUp, Eye } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { getAllSellers, getAllAnalytics } from '../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'sellers' | 'analytics'>('overview');
  const [sellers, setSellers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sellersData, analyticsData] = await Promise.all([
        getAllSellers(),
        getAllAnalytics()
      ]);
      setSellers(sellersData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalViews = analytics.reduce((sum, item) => sum + (item.view_count || 0), 0);
  const totalApplications = analytics.reduce((sum, item) => sum + (item.apply_count || 0), 0);
  const activeSellers = sellers.filter(seller => seller.subscription_status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
            <p className="text-gray-600">Platform Overview & Management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'sellers' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Store className="w-4 h-4" />
            Sellers
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Platform Analytics
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Sellers</p>
                  <p className="text-2xl font-bold">{sellers.length}</p>
                </div>
                <Store className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active Sellers</p>
                  <p className="text-2xl font-bold">{activeSellers}</p>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Views</p>
                  <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Total Applications</p>
                  <p className="text-2xl font-bold">{totalApplications.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Seller Status Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="text-sm font-medium text-green-600">{activeSellers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Inactive</span>
                    <span className="text-sm font-medium text-gray-600">
                      {sellers.filter(s => s.subscription_status === 'inactive').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Suspended</span>
                    <span className="text-sm font-medium text-red-600">
                      {sellers.filter(s => s.subscription_status === 'suspended').length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Platform Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg. Views per Tile</span>
                    <span className="text-sm font-medium">
                      {analytics.length > 0 ? Math.round(totalViews / analytics.length) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="text-sm font-medium">
                      {totalViews > 0 ? ((totalApplications / totalViews) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sellers' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Registered Sellers</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold">Business Name</th>
                  <th className="text-left p-3 font-semibold">Address</th>
                  <th className="text-left p-3 font-semibold">Phone</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{seller.business_name}</td>
                    <td className="p-3 text-gray-600">{seller.business_address || 'N/A'}</td>
                    <td className="p-3 text-gray-600">{seller.phone || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${seller.subscription_status === 'active' ? 'bg-green-100 text-green-800' :
                          seller.subscription_status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }
                      `}>
                        {seller.subscription_status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(seller.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Platform-wide Analytics</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold">Tile Name</th>
                  <th className="text-left p-3 font-semibold">Seller</th>
                  <th className="text-left p-3 font-semibold">Views</th>
                  <th className="text-left p-3 font-semibold">Applications</th>
                  <th className="text-left p-3 font-semibold">Conversion</th>
                  <th className="text-left p-3 font-semibold">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((item) => {
                  const conversion = item.view_count > 0 ? ((item.apply_count / item.view_count) * 100).toFixed(1) : '0';
                  return (
                    <tr key={item.tile_id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.tile_name}</td>
                      <td className="p-3 text-gray-600">{item.tile_sellers?.business_name || 'Unknown'}</td>
                      <td className="p-3">{item.view_count || 0}</td>
                      <td className="p-3">{item.apply_count || 0}</td>
                      <td className="p-3">
                        <span className={`font-medium ${
                          parseFloat(conversion) > 10 ? 'text-green-600' :
                          parseFloat(conversion) > 5 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {conversion}%
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {item.last_viewed ? new Date(item.last_viewed).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
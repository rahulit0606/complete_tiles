import React, { useState, useEffect } from 'react';
import { Shield, Users, Store, BarChart3, TrendingUp, Eye } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { getAllSellers, getAllAnalytics } from '../lib/supabase';

import { createSellerProfile } from '../lib/supabase';

interface NewSellerForm {
  email: string;
  password: string;
  fullName: string;
  businessName: string;
  businessAddress: string;
  phone: string;
  website: string;
}

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'sellers' | 'analytics' | 'create-seller'>('overview');
  const [sellers, setSellers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingSeller, setCreatingSeller] = useState(false);
  const [newSeller, setNewSeller] = useState<NewSellerForm>({
    email: '',
    password: '',
    fullName: '',
    businessName: '',
    businessAddress: '',
    phone: '',
    website: ''
  });

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

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingSeller(true);
    
    try {
      // Note: In a real implementation, you would need to use Supabase Admin API
      // to create the auth user first, then create the profile
      alert('Seller creation functionality requires Supabase Admin API integration. Please create the user in Supabase Auth UI first, then create the seller profile.');
      
      // Reset form
      setNewSeller({
        email: '',
        password: '',
        fullName: '',
        businessName: '',
        businessAddress: '',
        phone: '',
        website: ''
      });
    } catch (error) {
      console.error('Error creating seller:', error);
      alert('Failed to create seller account');
    } finally {
      setCreatingSeller(false);
    }
  };

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
          <button
            onClick={() => setActiveTab('create-seller')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'create-seller' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Create Seller
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

      {activeTab === 'create-seller' && (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2">Create New Seller Account</h3>
            <p className="text-purple-700 text-sm">
              Only administrators can create new seller accounts. Fill in the details below to register a new seller.
            </p>
          </div>
          
          <form onSubmit={handleCreateSeller} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email Address"
                value={newSeller.email}
                onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newSeller.password}
                onChange={(e) => setNewSeller({ ...newSeller, password: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                placeholder="Full Name"
                value={newSeller.fullName}
                onChange={(e) => setNewSeller({ ...newSeller, fullName: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                placeholder="Business Name"
                value={newSeller.businessName}
                onChange={(e) => setNewSeller({ ...newSeller, businessName: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                placeholder="Business Address"
                value={newSeller.businessAddress}
                onChange={(e) => setNewSeller({ ...newSeller, businessAddress: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newSeller.phone}
                onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="url"
                placeholder="Website (optional)"
                value={newSeller.website}
                onChange={(e) => setNewSeller({ ...newSeller, website: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 md:col-span-2"
              />
            </div>
            
            <button
              type="submit"
              disabled={creatingSeller}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium"
            >
              {creatingSeller ? 'Creating Seller...' : 'Create Seller Account'}
            </button>
          </form>
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
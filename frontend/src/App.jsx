import React, { useState, useEffect } from 'react';
import './App.css';
import { Car, Users, MapPin, CreditCard, UserCircle, Clock, PlusCircle, Edit, Trash2, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

const api = {
  async getOwners() {
    const res = await fetch(`${API_BASE}/owners`);
    const data = await res.json();
    return data.map(owner => ({
      id: owner.Owner_ID,
      name: owner.Owner_Name,
      contact: owner.Owner_Contact,
      address: owner.Owner_Address
    }));
  },
  // ... rest of the API methods
  async createOwner(data) {
    const res = await fetch(`${API_BASE}/owners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Owner_Name: data.name,
        Owner_Contact: data.contact,
        Owner_Address: data.address
      })
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('createOwner failed', res.status, text);
      throw new Error('Failed to create owner: ' + res.status + ' - ' + text);
    }
    const result = await res.json();
    console.log('createOwner response', result);
    return {
      id: result.Owner_ID,
      name: result.Owner_Name,
      contact: result.Owner_Contact,
      address: result.Owner_Address
    };
  },
  async updateOwner(id, data) {
    const res = await fetch(`${API_BASE}/owners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Owner_Name: data.name,
        Owner_Contact: data.contact,
        Owner_Address: data.address
      })
    });
    return res.json();
  },
  async deleteOwner(id) {
    await fetch(`${API_BASE}/owners/${id}`, { method: 'DELETE' });
  },

  // Vehicles
  async getVehicles() {
    const res = await fetch(`${API_BASE}/vehicles`);
    const data = await res.json();
    return data.map(vehicle => ({
      vehicleNo: vehicle.Vehicle_No,
      model: vehicle.Vehicle_Model,
      color: vehicle.Vehicle_Color,
      ownerId: vehicle.Owner_ID
    }));
  },
  async createVehicle(data) {
    const res = await fetch(`${API_BASE}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Vehicle_No: data.vehicleNo,
        Vehicle_Model: data.model,
        Vehicle_Color: data.color,
        Owner_ID: data.ownerId
      })
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('createVehicle failed', res.status, text);
      throw new Error('Failed to create vehicle: ' + res.status + ' - ' + text);
    }
    const result = await res.json();
    console.log('createVehicle response', result);
    return {
      vehicleNo: result.Vehicle_No,
      model: result.Vehicle_Model,
      color: result.Vehicle_Color,
      ownerId: result.Owner_ID
    };
  },
  async updateVehicle(id, data) {
    await fetch(`${API_BASE}/vehicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Vehicle_Model: data.model,
        Vehicle_Color: data.color,
        Owner_ID: data.ownerId
      })
    });
  },
  async deleteVehicle(id) {
    await fetch(`${API_BASE}/vehicles/${id}`, { method: 'DELETE' });
  },

  // Slots
  async getSlots() {
    const res = await fetch(`${API_BASE}/slots`);
    const data = await res.json();
    return data.map(slot => ({
      id: slot.Slot_ID,
      number: slot.Slot_Number,
      location: slot.Slot_Location,
      status: slot.Slot_Status
    }));
  },
  async createSlot(data) {
    const res = await fetch(`${API_BASE}/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Slot_Number: data.number,
        Slot_Location: data.location,
        Slot_Status: data.status
      })
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('createSlot failed', res.status, text);
      throw new Error('Failed to create slot: ' + res.status + ' - ' + text);
    }
    const result = await res.json();
    console.log('createSlot response', result);
    return {
      id: result.Slot_ID,
      number: result.Slot_Number,
      location: result.Slot_Location,
      status: result.Slot_Status
    };
  },
  async updateSlot(id, data) {
    await fetch(`${API_BASE}/slots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Slot_Number: data.number,
        Slot_Location: data.location,
        Slot_Status: data.status
      })
    });
  },
  async deleteSlot(id) {
    await fetch(`${API_BASE}/slots/${id}`, { method: 'DELETE' });
  },

  // Records
  async getRecords() {
    const res = await fetch(`${API_BASE}/records`);
    const data = await res.json();
    return data.map(record => ({
      id: record.Parking_ID,
      vehicleNo: record.Vehicle_No,
      staffId: record.Staff_ID,
      slotId: record.Slot_ID,
      location: record.Parking_Location,
      entryDate: record.Entry_Date,
      entryTime: record.Entry_Time,
      exitDate: record.Exit_Date,
      exitTime: record.Exit_Time,
      remarks: record.Remarks
    }));
  },
  async createRecord(data) {
    const res = await fetch(`${API_BASE}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Vehicle_No: data.vehicleNo,
        Staff_ID: data.staffId,
        Slot_ID: data.slotId,
        Parking_Location: data.location,
        Entry_Date: data.entryDate,
        Entry_Time: data.entryTime,
        Exit_Date: data.exitDate || null,
        Exit_Time: data.exitTime || null,
        Remarks: data.remarks
      })
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('createRecord failed', res.status, text);
      throw new Error('Failed to create record: ' + res.status + ' - ' + text);
    }
    const result = await res.json();
    console.log('createRecord response', result);
    // Normalize to the shape used by getRecords()
    return {
      id: result.Parking_ID,
      vehicleNo: result.Vehicle_No,
      staffId: result.Staff_ID,
      slotId: result.Slot_ID,
      location: result.Parking_Location,
      entryDate: result.Entry_Date,
      entryTime: result.Entry_Time,
      exitDate: result.Exit_Date,
      exitTime: result.Exit_Time,
      remarks: result.Remarks
    };
  },
  async deleteRecord(id) {
    await fetch(`${API_BASE}/records/${id}`, { method: 'DELETE' });
  },

  // Payments
  async getPayments() {
    const res = await fetch(`${API_BASE}/payments`);
    const data = await res.json();
    return data.map(payment => ({
      id: payment.Payment_ID,
      parkingId: payment.Parking_ID,
      status: payment.Payment_Status,
      amount: payment.Payment_Amount,
      mode: payment.Payment_Mode
    }));
  },
  async createPayment(data) {
    const res = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Parking_ID: data.parkingId,
        Payment_Status: data.status,
        Payment_Amount: data.amount,
        Payment_Mode: data.mode
      })
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('createPayment failed', res.status, text);
      throw new Error('Failed to create payment: ' + res.status + ' - ' + text);
    }
    const result = await res.json();
    console.log('createPayment response', result);
    // Normalize to the shape used by getPayments()
    return {
      id: result.Payment_ID,
      parkingId: result.Parking_ID,
      status: result.Payment_Status,
      amount: result.Payment_Amount,
      mode: result.Payment_Mode
    };
  },
  async deletePayment(id) {
    await fetch(`${API_BASE}/payments/${id}`, { method: 'DELETE' });
  },

  // Staff
  async getStaff() {
    const res = await fetch(`${API_BASE}/staff`);
    const data = await res.json();
    return data.map(staff => ({
      id: staff.Staff_ID,
      name: staff.Staff_Name,
      shift: staff.Staff_Shift
    }));
  },
  async createStaff(data) {
    const res = await fetch(`${API_BASE}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Staff_Name: data.name,
        Staff_Shift: data.shift
      })
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('createStaff failed', res.status, text);
      throw new Error('Failed to create staff: ' + res.status + ' - ' + text);
    }
    const result = await res.json();
    console.log('createStaff response', result);
    return {
      id: result.Staff_ID,
      name: result.Staff_Name,
      shift: result.Staff_Shift
    };
  },
  async updateStaff(id, data) {
    await fetch(`${API_BASE}/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Staff_Name: data.name,
        Staff_Shift: data.shift
      })
    });
  },
  async deleteStaff(id) {
    await fetch(`${API_BASE}/staff/${id}`, { method: 'DELETE' });
  }
};

const App = () => {
  const [activeTab, setActiveTab] = useState('owners');
  const [owners, setOwners] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [slots, setSlots] = useState([]);
  const [records, setRecords] = useState([]);
  const [payments, setPayments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('loadData: fetching all lists...');
      const [ownersData, vehiclesData, slotsData, recordsData, paymentsData, staffData] = await Promise.all([
        api.getOwners(),
        api.getVehicles(),
        api.getSlots(),
        api.getRecords(),
        api.getPayments(),
        api.getStaff()
      ]);
      console.log('loadData: fetched counts', {
        owners: ownersData.length,
        vehicles: vehiclesData.length,
        slots: slotsData.length,
        records: recordsData.length,
        payments: paymentsData.length,
        staff: staffData.length
      });
      setOwners(ownersData);
      setVehicles(vehiclesData);
      setSlots(slotsData);
      setRecords(recordsData);
      setPayments(paymentsData);
      setStaff(staffData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to connect to backend. Make sure the server is running on port 3000.');
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'owners', label: 'Owners', icon: Users },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'slots', label: 'Parking Slots', icon: MapPin },
    { id: 'records', label: 'Parking Records', icon: Clock },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'staff', label: 'Staff', icon: UserCircle }
  ];

  return (
    <div className="app-root">
      <div className="app-container">
        <div className="card">
          <div className="app-header">
            <h1 className="app-title">
              <Car className="app-title-icon" />
              Smart Parking Management System
            </h1>
            <p className="app-subtitle">Comprehensive parking facility management with MySQL backend</p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-6">
              <p className="font-bold">Connection Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="tabs-row">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5" style={{marginRight:8}} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            <div className="controls-header">
              <h2 className="text-2xl font-semibold text-gray-800">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <div className="button-group">
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="refresh-btn"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {loading && <div className="text-center py-8 text-gray-500">Loading data...</div>}

            {!loading && (
              <>
                {activeTab === 'owners' && <OwnersManager owners={owners} setOwners={setOwners} api={api} refreshData={loadData} />}
                {activeTab === 'vehicles' && <VehiclesManager vehicles={vehicles} setVehicles={setVehicles} owners={owners} api={api} refreshData={loadData} />}
                {activeTab === 'slots' && <SlotsManager slots={slots} setSlots={setSlots} api={api} refreshData={loadData} />}
                {activeTab === 'records' && <RecordsManager records={records} setRecords={setRecords} vehicles={vehicles} slots={slots} staff={staff} api={api} refreshData={loadData} />}
                {activeTab === 'payments' && <PaymentsManager payments={payments} setPayments={setPayments} records={records} api={api} refreshData={loadData} />}
                {activeTab === 'staff' && <StaffManager staff={staff} setStaff={setStaff} api={api} refreshData={loadData} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OwnersManager = ({ owners, setOwners, api, refreshData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', contact: '', address: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateOwner(editingId, formData);
        setOwners(owners.map(o => o.id === editingId ? { ...formData, id: editingId } : o));
        setEditingId(null);
      } else {
        await api.createOwner(formData);
        // Re-fetch authoritative data from server
        await refreshData();
      }
      setFormData({ name: '', contact: '', address: '' });
      setIsAdding(false);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = (owner) => {
    setFormData({ name: owner.name, contact: owner.contact, address: owner.address });
    setEditingId(owner.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this owner?')) {
      try {
        await api.deleteOwner(id);
        setOwners(owners.filter(o => o.id !== id));
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div>
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="add-new-btn"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Owner
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Owner Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
              required
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {editingId ? 'Update' : 'Add'} Owner
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ name: '', contact: '', address: '' });
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Owner ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((owner, idx) => (
              <tr key={owner.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm">{owner.id}</td>
                <td className="px-4 py-3 text-sm">{owner.name}</td>
                <td className="px-4 py-3 text-sm">{owner.contact}</td>
                <td className="px-4 py-3 text-sm">{owner.address}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(owner)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(owner.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {owners.length === 0 && (
          <div className="text-center py-8 text-gray-500">No owners found. Add one to get started!</div>
        )}
      </div>
    </div>
  );
};

const VehiclesManager = ({ vehicles, setVehicles, owners, api, refreshData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ vehicleNo: '', model: '', color: '', ownerId: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateVehicle(editingId, formData);
        setVehicles(vehicles.map(v => v.vehicleNo === editingId ? { ...formData, vehicleNo: editingId } : v));
        setEditingId(null);
      } else {
        await api.createVehicle(formData);
        await refreshData();
      }
      setFormData({ vehicleNo: '', model: '', color: '', ownerId: '' });
      setIsAdding(false);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = (vehicle) => {
    setFormData(vehicle);
    setEditingId(vehicle.vehicleNo);
    setIsAdding(true);
  };

  const handleDelete = async (vehicleNo) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.deleteVehicle(vehicleNo);
        setVehicles(vehicles.filter(v => v.vehicleNo !== vehicleNo));
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div>
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="add-new-btn"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Vehicle
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Vehicle Number (e.g., TN01AB1234)"
              value={formData.vehicleNo}
              onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value.toUpperCase() })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              disabled={editingId !== null}
            />
            <input
              type="text"
              placeholder="Model (e.g., Honda City)"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={formData.ownerId}
              onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Owner</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>{owner.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {editingId ? 'Update' : 'Add'} Vehicle
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ vehicleNo: '', model: '', color: '', ownerId: '' });
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vehicle No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Model</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Color</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Owner</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, idx) => {
              const owner = owners.find(o => o.id === vehicle.ownerId);
              return (
                <tr key={vehicle.vehicleNo} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-medium">{vehicle.vehicleNo}</td>
                  <td className="px-4 py-3 text-sm">{vehicle.model}</td>
                  <td className="px-4 py-3 text-sm">{vehicle.color}</td>
                  <td className="px-4 py-3 text-sm">{owner?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.vehicleNo)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {vehicles.length === 0 && (
          <div className="text-center py-8 text-gray-500">No vehicles found. Add one to get started!</div>
        )}
      </div>
    </div>
  );
};

const SlotsManager = ({ slots, setSlots, api, refreshData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ number: '', location: '', status: 'Available' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateSlot(editingId, formData);
        setSlots(slots.map(s => s.id === editingId ? { ...formData, id: editingId } : s));
        setEditingId(null);
      } else {
        await api.createSlot(formData);
        await refreshData();
      }
      setFormData({ number: '', location: '', status: 'Available' });
      setIsAdding(false);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = (slot) => {
    setFormData({ number: slot.number, location: slot.location, status: slot.status });
    setEditingId(slot.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await api.deleteSlot(id);
        setSlots(slots.filter(s => s.id !== id));
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div>
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="add-new-btn"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Slot
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Slot Number (e.g., A-101)"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Location (e.g., Ground Floor)"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {editingId ? 'Update' : 'Add'} Slot
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ number: '', location: '', status: 'Available' });
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="slots-summary-cards">
        <div className="slot-card slot-card-available">
          <div className="slot-card-label">Available</div>
          <div className="slot-card-value">{slots.filter(s => s.status === 'Available').length}</div>
        </div>
        <div className="slot-card slot-card-occupied">
          <div className="slot-card-label">Occupied</div>
          <div className="slot-card-value">{slots.filter(s => s.status === 'Occupied').length}</div>
        </div>
        <div className="slot-card slot-card-total">
          <div className="slot-card-label">Total Slots</div>
          <div className="slot-card-value">{slots.length}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Slot ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Number</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, idx) => (
              <tr key={slot.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm">{slot.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{slot.number}</td>
                <td className="px-4 py-3 text-sm">{slot.location}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    slot.status === 'Available' ? 'bg-green-100 text-green-800' :
                    slot.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                    slot.status === 'Reserved' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {slot.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(slot)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(slot.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {slots.length === 0 && (
          <div className="text-center py-8 text-gray-500">No parking slots found. Add one to get started!</div>
        )}
      </div>
    </div>
  );
};

const RecordsManager = ({ records, setRecords, vehicles, slots, staff, api, refreshData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNo: '', staffId: '', slotId: '', location: '',
    entryDate: '', entryTime: '', exitDate: '', exitTime: '', remarks: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createRecord(formData);
      // re-load authoritative lists from server
      await refreshData();
      setFormData({
        vehicleNo: '', staffId: '', slotId: '', location: '',
        entryDate: '', entryTime: '', exitDate: '', exitTime: '', remarks: ''
      });
      setIsAdding(false);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.deleteRecord(id);
        setRecords(records.filter(r => r.id !== id));
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div>
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="add-new-btn"
        >
          <PlusCircle className="w-5 h-5" />
          New Parking Entry
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.vehicleNo}
              onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v.vehicleNo} value={v.vehicleNo}>{v.vehicleNo} - {v.model}</option>
              ))}
            </select>
            <select
              value={formData.slotId}
              onChange={(e) => setFormData({ ...formData, slotId: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Slot</option>
              {slots.filter(s => s.status === 'Available').map(s => (
                <option key={s.id} value={s.id}>{s.number} - {s.location}</option>
              ))}
            </select>
            <select
              value={formData.staffId}
              onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Staff</option>
              {staff.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              placeholder="Entry Date"
              value={formData.entryDate}
              onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="time"
              placeholder="Entry Time"
              value={formData.entryTime}
              onChange={(e) => setFormData({ ...formData, entryTime: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              placeholder="Exit Date (Optional)"
              value={formData.exitDate}
              onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              placeholder="Exit Time (Optional)"
              value={formData.exitTime}
              onChange={(e) => setFormData({ ...formData, exitTime: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Remarks (Optional)"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Parking Record
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setFormData({
                  vehicleNo: '', staffId: '', slotId: '', location: '',
                  entryDate: '', entryTime: '', exitDate: '', exitTime: '', remarks: ''
                });
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Parking ID</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Vehicle</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Slot</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Entry</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Exit</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Staff</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, idx) => {
              const vehicle = vehicles.find(v => v.vehicleNo === record.vehicleNo);
              const slot = slots.find(s => s.id === record.slotId);
              const staffMember = staff.find(s => s.id === record.staffId);
              return (
                <tr key={record.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-xs">{record.id}</td>
                  <td className="px-3 py-2 text-xs">{vehicle?.vehicleNo || 'N/A'}</td>
                  <td className="px-3 py-2 text-xs">{slot?.number || 'N/A'}</td>
                  <td className="px-3 py-2 text-xs">{record.entryDate} {record.entryTime}</td>
                  <td className="px-3 py-2 text-xs">
                    {record.exitDate ? `${record.exitDate} ${record.exitTime}` : 
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Active</span>}
                  </td>
                  <td className="px-3 py-2 text-xs">{staffMember?.name || 'N/A'}</td>
                  <td className="px-3 py-2 text-xs">
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {records.length === 0 && (
          <div className="text-center py-8 text-gray-500">No parking records found. Add one to get started!</div>
        )}
      </div>
    </div>
  );
};

const PaymentsManager = ({ payments, setPayments, records, api, refreshData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    parkingId: '', status: 'Pending', amount: '', mode: 'Cash'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createPayment(formData);
      await refreshData();
      setFormData({ parkingId: '', status: 'Pending', amount: '', mode: 'Cash' });
      setIsAdding(false);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await api.deletePayment(id);
        setPayments(payments.filter(p => p.id !== id));
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div>
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="add-new-btn"
        >
          <PlusCircle className="w-5 h-5" />
          Add Payment
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.parkingId}
              onChange={(e) => setFormData({ ...formData, parkingId: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Parking Record</option>
              {records.map(r => (
                <option key={r.id} value={r.id}>{r.id} - {r.vehicleNo}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Amount (₹)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Wallet">Wallet</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Payment
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setFormData({ parkingId: '', status: 'Pending', amount: '', mode: 'Cash' });
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="payment-summary-cards">
        <div className="payment-card payment-card-pending">
          <div className="payment-card-label">Pending</div>
          <div className="payment-card-value">₹{payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0).toFixed(2)}</div>
        </div>
        <div className="payment-card payment-card-paid">
          <div className="payment-card-label">Paid</div>
          <div className="payment-card-value">₹{payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0).toFixed(2)}</div>
        </div>
        <div className="payment-card payment-card-revenue">
          <div className="payment-card-label">Total Revenue</div>
          <div className="payment-card-value">₹{payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0).toFixed(2)}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Parking ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mode</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, idx) => (
              <tr key={payment.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm">{payment.id}</td>
                <td className="px-4 py-3 text-sm">{payment.parkingId}</td>
                <td className="px-4 py-3 text-sm font-medium">₹{parseFloat(payment.amount).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm">{payment.mode}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleDelete(payment.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && (
          <div className="text-center py-8 text-gray-500">No payments found. Add one to get started!</div>
        )}
      </div>
    </div>
  );
};

const StaffManager = ({ staff, setStaff, api, refreshData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', shift: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateStaff(editingId, formData);
        setStaff(staff.map(s => s.id === editingId ? { ...formData, id: editingId } : s));
        setEditingId(null);
      } else {
        await api.createStaff(formData);
        await refreshData();
      }
      setFormData({ name: '', shift: '' });
      setIsAdding(false);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = (staffMember) => {
    setFormData({ name: staffMember.name, shift: staffMember.shift });
    setEditingId(staffMember.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.deleteStaff(id);
        setStaff(staff.filter(s => s.id !== id));
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div>
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="add-new-btn"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Staff
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Staff Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={formData.shift}
              onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Shift</option>
              <option value="Morning">Morning (6 AM - 2 PM)</option>
              <option value="Afternoon">Afternoon (2 PM - 10 PM)</option>
              <option value="Night">Night (10 PM - 6 AM)</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {editingId ? 'Update' : 'Add'} Staff
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ name: '', shift: '' });
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Staff ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Shift</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((staffMember, idx) => (
              <tr key={staffMember.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm">{staffMember.id}</td>
                <td className="px-4 py-3 text-sm">{staffMember.name}</td>
                <td className="px-4 py-3 text-sm">{staffMember.shift}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(staffMember)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(staffMember.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {staff.length === 0 && (
          <div className="text-center py-8 text-gray-500">No staff members found. Add one to get started!</div>
        )}
      </div>
    </div>
  );
};

export default App;
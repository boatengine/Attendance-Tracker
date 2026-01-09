import React, { useState, useEffect } from "react";
import {
  Users,
  MapPin,
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navi = useNavigate();
  // Employee Form
  const [employeeForm, setEmployeeForm] = useState({
    //
    employee_id: "",
    pin: "",
    full_name: "",
    email: "",
    department: "",
    location_id: "",
  });

  //form location
  const [locationForm, setLocationForm] = useState({
    id: "",
    name: "",
    latitude: "",
    longitude: "",
    radius_meters: "",
  });
  const [editingLocation, setEditingLocation] = useState(null);

  // tab control
  useEffect(() => {
    if (activeTab === "employees") {
      fetchEmployees();
      fetchLocations();
    } else if (activeTab === "locations") {
      fetchLocations();
    } else if (activeTab === "reports") {
      fetchReports();
    } else if (activeTab === "logout") {
      handleLogout();
    }
  }, [activeTab]);
  const handleLogout = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT}/api/auth/logout`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (response.ok) {
        navi("/login");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT}/api/employee`
      );
      const data = await response.json();
      setEmployees(data.employees);
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลพนักงานได้");
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT}/api/location`,
        { credentials: "include" }
      );
      const data = await response.json();
      setLocations(data.locations);
      console.log(data.locations);
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลสถานที่ได้");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT}/api/report`,
        { credentials: "include" }
      );
      const data = await response.json();
      setRecords(data.records);
      setSummary(data.summary);
    } catch (err) {
      setError("ไม่สามารถโหลดรายงานได้");
      // ข้อมูลทดสอบ
    } finally {
      setLoading(false);
    }
  };

  // Employee Actions
  const handleAddEmployee = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT}/api/employee`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeForm),
          credentials: "include",
        }
      );
      if (response.ok) {
        setEmployeeForm({
          employee_id: "",
          pin: "",
          full_name: "",
          email: "",
          department: "",
          location_id: "",
        });
        fetchEmployees();
      }
    } catch (err) {
      setError("ไม่สามารถเพิ่มพนักงานได้");
    } finally {
      setLoading(false);
    }
  };

  // Location Actions
  const handleAddLocation = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.example.com/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locationForm),
      });
      if (response.ok) {
        setLocationForm({
          id: "",
          name: "",
          latitude: "",
          longitude: "",
          radius_meters: "",
        });
        fetchLocations();
      }
    } catch (err) {
      setError("ไม่สามารถเพิ่มสถานที่ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.example.com/locations/${editingLocation.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingLocation),
        }
      );
      if (response.ok) {
        setEditingLocation(null);
        fetchLocations();
      }
    } catch (err) {
      setError("ไม่สามารถแก้ไขสถานที่ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!confirm("คุณต้องการลบสถานที่นี้หรือไม่?")) return;

    setLoading(true);
    try {
      const response = await fetch(`https://api.example.com/locations/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchLocations();
      }
    } catch (err) {
      setError("ไม่สามารถลบสถานที่ได้");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("th-TH");
  };

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h} ชม. ${m} นาที`;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_ENDPOINT}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        setUser(data);
        console.log("auth user:", data);
      } catch (err) {
        console.error(err);
        navi("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navi]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === "employees" ? "default" : "ghost"}
            onClick={() => setActiveTab("employees")}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            พนักงาน
          </Button>
          <Button
            variant={activeTab === "locations" ? "default" : "ghost"}
            onClick={() => setActiveTab("locations")}
            className="gap-2"
          >
            <MapPin className="h-4 w-4" />
            สถานที่
          </Button>
          <Button
            variant={activeTab === "reports" ? "default" : "ghost"}
            onClick={() => setActiveTab("reports")}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            รายงาน
          </Button>
          <Button
            variant={activeTab === "logout" ? "default" : "ghost"}
            onClick={() => setActiveTab("logout")}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            ออกจากระบบ
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  เพิ่มพนักงาน
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ชื่อ-นามสกุล</Label>
                  <Input
                    value={employeeForm.full_name}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        full_name: e.target.value,
                      })
                    }
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>
                <div className="space-y-2">
                  <Label>รหัสพนักงาน</Label>
                  <Input
                    value={employeeForm.employee_id}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        employee_id: e.target.value,
                      })
                    }
                    placeholder="EMP001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>แผนก</Label>
                  <Input
                    value={employeeForm.department}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        department: e.target.value,
                      })
                    }
                    placeholder="แผนก"
                  />
                </div>
                <div className="space-y-2">
                  <Label>อีเมล</Label>
                  <Input
                    type="email"
                    value={employeeForm.email}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        email: e.target.value,
                      })
                    }
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>รหัสผ่าน</Label>
                  <Input
                    type="password"
                    value={employeeForm.pin}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        pin: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label>เลือกตำแหน่งสำหรับพนักงาน</Label>
                  <select
                    value={employeeForm.auth_location_id || ""}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        auth_location_id: e.target.value,
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">-- เลือกสถานที่ --</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} (รัศมี {loc.radius_meters}m)
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={handleAddEmployee}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  เพิ่มพนักงาน
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>รายชื่อพนักงาน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {employees?.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      ยังไม่มีข้อมูลพนักงาน
                    </p>
                  ) : (
                    employees.map((emp) => (
                      <div key={emp.id} className="p-3 border rounded-lg">
                        <p className="font-semibold">{emp.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {emp.employee_id} - {emp.department}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Locations Tab */}
        {activeTab === "locations" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingLocation ? "แก้ไขสถานที่" : "เพิ่มสถานที่"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ชื่อสถานที่</Label>
                  <Input
                    value={
                      editingLocation ? editingLocation.name : locationForm.name
                    }
                    onChange={(e) =>
                      editingLocation
                        ? setEditingLocation({
                            ...editingLocation,
                            name: e.target.value,
                          })
                        : setLocationForm({
                            ...locationForm,
                            name: e.target.value,
                          })
                    }
                    placeholder="ชื่อสถานที่"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input
                    value={
                      editingLocation
                        ? editingLocation.latitude
                        : locationForm.latitude
                    }
                    onChange={(e) =>
                      editingLocation
                        ? setEditingLocation({
                            ...editingLocation,
                            latitude: e.target.value,
                          })
                        : setLocationForm({
                            ...locationForm,
                            latitude: e.target.value,
                          })
                    }
                    placeholder="13.8091318"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input
                    value={
                      editingLocation
                        ? editingLocation.longitude
                        : locationForm.longitude
                    }
                    onChange={(e) =>
                      editingLocation
                        ? setEditingLocation({
                            ...editingLocation,
                            longitude: e.target.value,
                          })
                        : setLocationForm({
                            ...locationForm,
                            longitude: e.target.value,
                          })
                    }
                    placeholder="100.3209311"
                  />
                </div>
                <div className="space-y-2">
                  <Label>รัศมี (เมตร)</Label>
                  <Input
                    value={
                      editingLocation
                        ? editingLocation.radius_meters
                        : locationForm.radius_meters
                    }
                    onChange={(e) =>
                      editingLocation
                        ? setEditingLocation({
                            ...editingLocation,
                            radius_meters: e.target.value,
                          })
                        : setLocationForm({
                            ...locationForm,
                            radius_meters: e.target.value,
                          })
                    }
                    placeholder="150"
                  />
                </div>
                {editingLocation ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUpdateLocation}
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      บันทึก
                    </Button>
                    <Button
                      onClick={() => setEditingLocation(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="mr-2 h-4 w-4" />
                      ยกเลิก
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleAddLocation}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    เพิ่มสถานที่
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>รายการสถานที่</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {locations?.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      ยังไม่มีข้อมูลสถานที่
                    </p>
                  ) : (
                    locations?.map((loc) => (
                      <div key={loc.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold">{loc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Lat: {loc.latitude}, Lng: {loc.longitude}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              รัศมี {loc.radius_meters}m
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingLocation(loc)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteLocation(loc.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      บันทึกทั้งหมด
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{summary.totalRecords}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      ชั่วโมงทั้งหมด
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {formatHours(summary.totalHours)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      ยืนยันแล้ว
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      {summary.verifiedRecords}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      ไม่ได้ Clock Out
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600">
                      {summary.missedClockOuts}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Records Table */}
            <Card>
              <CardHeader>
                <CardTitle>บันทึกการทำงาน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="space-y-3">
                    {records?.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        ไม่มีข้อมูลบันทึก
                      </p>
                    ) : (
                      records?.map((record) => (
                        <div key={record.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold">
                                {record.full_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {record.emp_code} - {record.department}
                              </p>
                              <Badge className="mt-2">
                                {record.session_type}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-green-600" />
                                <span>
                                  Clock In: {formatDate(record.clock_in)}
                                </span>
                                {record.clock_in_verified === "true" && (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                              {record.clock_out ? (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-red-600" />
                                  <span>
                                    Clock Out: {formatDate(record.clock_out)}
                                  </span>
                                  {record.clock_out_verified === "true" && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-red-600">
                                  <XCircle className="h-4 w-4" />
                                  <span>ยังไม่ได้ Clock Out</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  CheckCircle,
  XCircle,
  Loader,
  Camera,
  RefreshCw,
  Send,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";

interface Location {
  lat: number;
  lng: number;
}

type SendStatus = "" | "success" | "error" | "กำลังส่งข้อมูล...";

type SessionType = "morning" | "lunch" | "afternoon" | "evening";

interface AttendanceRecord {
  session_type: SessionType;
  clock_in: string | null;
  clock_out: string | null;
  clock_in_verified: boolean | null;
  clock_out_verified: boolean | null;
}

export default function Dashboard() {
  const [apiLocation, setApiLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isNearby, setIsNearby] = useState<boolean>(false);
  const [distance, setDistance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [sendStatus, setSendStatus] = useState<SendStatus>("");
  const [user, setUser] = useState(null);
  const [clockSt, setClockSt] = useState<string>("");

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(
    null
  );

  const navi = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fetchAttendanceStatus = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_ENDPOINT}/api/attendance/status`,
      { credentials: "include" }
    );

    const data = await res.json();
    setAttendance(data.records);
  };
  useEffect(() => {
    if (user) {
      fetchAttendanceStatus();
    }
  }, [user]);

  const getSessionRecord = (session) =>
    attendance.find((r) => r.session_type === session);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

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
  const fetchLocationFromAPI = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT}/api/location/${
          user.auth_location_id
        }`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      setApiLocation({
        lat: parseFloat(data.location.latitude),
        lng: parseFloat(data.location.longitude),
      });
    } catch (err: any) {
      setError("ไม่สามารถดึงข้อมูลจาก API ได้: " + err.message);
      setApiLocation({ lat: 13.7563, lng: 100.5018 });
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = (): void => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("เบราว์เซอร์ไม่รองรับ Geolocation");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const userLoc: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userLoc);

        if (apiLocation) {
          checkDistance(apiLocation, userLoc);
        }
        setLoading(false);
      },
      (err: GeolocationPositionError) => {
        setError("ไม่สามารถดึง Location ได้: " + err.message);
        setLoading(false);
      }
    );
  };

  const checkDistance = (apiLoc: Location, userLoc: Location): void => {
    const dist = calculateDistance(
      apiLoc.lat,
      apiLoc.lng,
      userLoc.lat,
      userLoc.lng
    );

    setDistance(dist.toFixed(2));
    setIsNearby(dist <= 200);
  };

  useEffect(() => {
    if (!showCamera) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        setError("ไม่สามารถเปิดกล้องได้: " + err.message);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [showCamera]);

  const captureImage = (): void => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    setImage(canvas.toDataURL("image/png"));

    if (video.srcObject) {
      (video.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const submitClock = async (): Promise<void> => {
    if (!image || !userLocation) return;

    setSendStatus("กำลังส่งข้อมูล...");

    try {
      // console.log(image);
      console.log(userLocation);
      let datad = {
        auth_location_id: user.auth_location_id,
        session_type: selectedSession,
        action: clockSt,
        face_data: image,
        location: (userLocation.lat, userLocation.lng),
      };
      console.log(datad);
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT}/api/attendance/clock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datad),
          credentials: "include",
        }
      );

      setSendStatus(response.ok ? "success" : "error");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch {
      setSendStatus("error");
    }
  };

  useEffect(() => {
    fetchLocationFromAPI();
  }, [user]);

  useEffect(() => {
    if (apiLocation && userLocation) {
      checkDistance(apiLocation, userLocation);
    }
  }, [apiLocation, userLocation]);

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
        if (data.is_admin === 1) {
          navi("/admin");
        }
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
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapPin className="h-6 w-6 text-primary" />
              ระบบตรวจสอบตำแหน่ง
            </CardTitle>
            <CardDescription>
              ตรวจสอบตำแหน่งและถ่ายรูปยืนยันตัวตน
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ปุ่มดึงข้อมูล */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
              <Button
                onClick={handleLogout}
                disabled={loading}
                className="w-full"
                variant="destructive"
              >
                {loading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                ออกจากระบบ
              </Button>

              <Button
                onClick={getUserLocation}
                disabled={loading}
                className="w-full"
                variant="default"
              >
                {loading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                ดึงตำแหน่งของฉัน
              </Button>
            </div>

            {/* แสดงข้อผิดพลาด */}
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* แสดงข้อมูล Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    พิกัดจาก API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {apiLocation ? (
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Lat:</span>{" "}
                        {apiLocation.lat.toFixed(6)}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Lng:</span>{" "}
                        {apiLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-red-500 text-muted-foreground">
                      ยังไม่มีข้อมูล
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    พิกัดของคุณ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userLocation ? (
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Lat:</span>{" "}
                        {userLocation.lat.toFixed(6)}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Lng:</span>{" "}
                        {userLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">
                      ยังไม่มีข้อมูล{" "}
                      <span className="font-semibold">
                        (กรุณากดดึงตำแหน่งของฉัน)
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            {distance !== null && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {isNearby
                      ? "อยู่ในระยะที่กำหนด"
                      : "อยู่นอกระยะที่กำหนดไม่สามารถ ลงเวลาได้"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userLocation ? (
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        ระยะทาง:{" "}
                        <Badge variant="outline">{distance} เมตร</Badge>
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      ยังไม่มีข้อมูล
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  เลือกช่วงเวลา
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {["morning", "lunch", "afternoon", "evening"].map((s) => {
                    const record = getSessionRecord(s);

                    const completed = record?.clock_in && record?.clock_out;

                    return (
                      <Button
                        key={s}
                        variant={selectedSession === s ? "default" : "outline"}
                        disabled={completed}
                        onClick={() => setSelectedSession(s)}
                      >
                        {s === "morning" && "เช้า"}
                        {s === "lunch" && "กลางวัน"}
                        {s === "afternoon" && "บ่าย"}
                        {s === "evening" && "เย็น"}
                      </Button>
                    );
                  })}
                </div>
                {selectedSession &&
                  (() => {
                    const record = getSessionRecord(selectedSession);

                    return (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <Button
                          type="button"
                          disabled={!!record?.clock_in}
                          onClick={() => setClockSt("clock_in")}
                          className={`
                            border
                            ${
                              clockSt === "clock_in"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            }
                            disabled:bg-white
                            disabled:text-gray-400
                            disabled:border-gray-300
                              `}
                        >
                          Clock In
                        </Button>

                        <Button
                          type="button"
                          disabled={!record?.clock_in || !!record?.clock_out}
                          onClick={() => setClockSt("clock_out")}
                          className={`
                            border
                            ${
                              clockSt === "clock_out"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            }
                            disabled:bg-white
                            disabled:text-gray-400
                            disabled:border-gray-300
                              `}
                        >
                          Clock Out
                        </Button>
                      </div>
                    );
                  })()}
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {isNearby && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                ถ่ายรูปยืนยันตัวตน
              </CardTitle>
              <CardDescription>
                กรุณาถ่ายรูปเพื่อยืนยันตัวตนและบันทึกข้อมูล
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showCamera && !image && (
                <Button
                  onClick={() => setShowCamera(true)}
                  className="w-full"
                  size="lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  เปิดกล้อง
                </Button>
              )}

              {showCamera && (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-lg border-4 border-primary">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full"
                    />
                  </div>
                  <Button onClick={captureImage} className="w-full" size="lg">
                    <Camera className="mr-2 h-5 w-5" />
                    ถ่ายรูป
                  </Button>
                </div>
              )}

              {image && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">รูปที่ถ่าย</p>
                    <div className="relative overflow-hidden rounded-lg border-4 border-green-500">
                      <img src={image} alt="captured" className="w-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => {
                        setImage(null);
                        setShowCamera(true);
                      }}
                      variant="outline"
                      size="lg"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      ถ่ายใหม่
                    </Button>
                    <Button onClick={submitClock} size="lg">
                      <Send className="mr-2 h-4 w-4" />
                      ส่งข้อมูล
                    </Button>
                  </div>

                  {sendStatus === "success" && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>สำเร็จ</AlertTitle>
                      <AlertDescription>
                        ส่งข้อมูลเรียบร้อยแล้ว
                      </AlertDescription>
                    </Alert>
                  )}

                  {sendStatus === "error" && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>ล้มเหลว</AlertTitle>
                      <AlertDescription>ไม่สามารถส่งข้อมูลได้</AlertDescription>
                    </Alert>
                  )}

                  {sendStatus === "กำลังส่งข้อมูล..." && (
                    <Alert>
                      <Loader className="h-4 w-4 animate-spin" />
                      <AlertTitle>กำลังดำเนินการ</AlertTitle>
                      <AlertDescription>กรุณารอสักครู่...</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

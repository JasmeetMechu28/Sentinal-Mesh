"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ShieldAlert, LayoutDashboard, Radio, Bell, Map as MapIcon,
  History, Settings, BarChart3, AlertTriangle, CheckCircle2,
  Lock, User, Sliders, Eye, EyeOff, Video, Download, Filter, Search,
  Play, Pause, ChevronRight, Activity, Crosshair, RefreshCw,
  TrendingUp, Calendar, Layers, Flame, Battery, Wifi, Compass,
  AlertOctagon, Volume2, Send, ShieldCheck, Navigation, X, Check,
  Camera, Smartphone, Cpu, CheckCircle, Shield, Upload, FileVideo,
  Zap, AlertCircle, Trash2, BellRing, Navigation2, RefreshCcw, Power,
  Users, MapPin, Award, SlidersHorizontal, Share2, Cpu as CpuIcon, Globe, Terminal, WifiOff, RadioTower, ShieldOff
} from "lucide-react";

interface DetectedBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: "PERSON" | "VEHICLE" | "OBJECT";
  conf: number;
  color: string;
  id: string;
}

interface TacticalEvent {
  id: string;
  time: string;
  date: string;
  sector: string;
  sourceType: string;
  severity: "CRITICAL" | "MEDIUM" | "LOW";
  details: string;
}

interface NotificationItem {
  id: string;
  text: string;
  time: string;
}

export default function SentinelMeshSystem() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedSector, setSelectedSector] = useState("C");

  // Live Clock
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Streams & Vision
  const [videoSourceUrl, setVideoSourceUrl] = useState<string>("/drone.mp4");
  const [videoSourceType, setVideoSourceType] = useState<"preset" | "custom" | "live">("preset");
  const [customFileName, setCustomFileName] = useState<string>("");
  const [visionMode, setVisionMode] = useState<"EO" | "FLIR" | "NVG">("EO");

  // RF Jamming Simulation
  const [isJammingActive, setIsJammingActive] = useState<boolean>(false);
  const [activeFrequency, setActiveFrequency] = useState<string>("5.8 GHz [AES-256 Encrypted]");

  // AI & Detection States
  const [personCount, setPersonCount] = useState<number>(0);
  const [vehicleCount, setVehicleCount] = useState<number>(0);
  const [objectCount, setObjectCount] = useState<number>(0);
  const [threatLevel, setThreatLevel] = useState<"LOW" | "MEDIUM" | "CRITICAL">("LOW");
  
  const [threatAcknowledged, setThreatAcknowledged] = useState<boolean>(true);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [selectedQrtTeam, setSelectedQrtTeam] = useState<string>("QRT-01 (Alpha Team)");

  // Notification Center
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "NOTIF-1", text: "Sentinel Mesh P2P Sensor Network Initialized: Autonomous Failover Active.", time: "Just now" }
  ]);
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);

  const pushNotification = (msg: string) => {
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      text: msg,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const [warningModalMsg, setWarningModalMsg] = useState<string | null>(null);

  // Event History
  const [eventHistory, setEventHistory] = useState<TacticalEvent[]>([
    { id: "EVT-901", time: "10:15 AM", date: "15 Sep 2026", sector: "Sector C", sourceType: "UAV-04 (Eagle)", severity: "LOW", details: "Autonomous mesh sector sweep completed successfully." },
    { id: "EVT-902", time: "09:19 AM", date: "15 Sep 2026", sector: "Sector C", sourceType: "UAV-04 (Eagle)", severity: "CRITICAL", details: "Human incursion detected across mesh boundary at 030° corridor." }
  ]);

  const [situationText, setSituationText] = useState<string>("Initializing Sentinel Mesh drone-to-drone wireless corridor scan...");
  const [actionRecommendation, setActionRecommendation] = useState<string>("All mesh UAV nodes secure. Autonomous P2P routing active.");
  const [fps, setFps] = useState<number>(30);

  const [qrtDispatched, setQrtDispatched] = useState<boolean>(false);
  const [sirenActive, setSirenActive] = useState<boolean>(false);

  // ================= DRONE FLEET WITH FULL RESERVE & QUARANTINE SYNC =================
  const [droneFleet, setDroneFleet] = useState([
    { id: "UAV-01", name: "Raven Mesh", sector: "A", battery: 84, signal: "-68 dBm", status: "Mesh Patrolling", rtb: false, charging: false, isCompromised: false, isHacked: false, quarantined: false },
    { id: "UAV-02", name: "Hawk Mesh", sector: "B", battery: 92, signal: "-54 dBm", status: "Mesh Patrolling", rtb: false, charging: false, isCompromised: false, isHacked: false, quarantined: false },
    { id: "UAV-03", name: "Viper Mesh", sector: "D", battery: 76, signal: "-72 dBm", status: "Mesh Patrolling", rtb: false, charging: false, isCompromised: false, isHacked: false, quarantined: false },
    { id: "UAV-04", name: "Eagle Mesh", sector: "C", battery: 88, signal: "-49 dBm", status: "Active Mesh Recon", rtb: false, charging: false, isCompromised: false, isHacked: false, quarantined: false },
    { id: "UAV-05", name: "Garuda Mesh", sector: "F", battery: 95, signal: "-58 dBm", status: "Mesh Patrolling", rtb: false, charging: false, isCompromised: false, isHacked: false, quarantined: false },
    { id: "UAV-06", name: "Falcon Mesh", sector: "G", battery: 64, signal: "-82 dBm", status: "Critical Mesh Sweep", rtb: false, charging: false, isCompromised: false, isHacked: false, quarantined: false },
    { id: "UAV-07", name: "Vajra Reserve", sector: "None", battery: 100, signal: "-42 dBm", status: "Standby (Reserve Pool)", rtb: false, charging: false, isCompromised: false, isHacked: false, quarantined: false },
    { id: "UAV-08", name: "Astra Reserve", sector: "None", battery: 100, signal: "-45 dBm", status: "Standby (Reserve Pool)", rtb: false, charging: false, isCompromised: false, isHacked: false, quarantined: false },
  ]);

  // QRT Teams State
  const [qrtTeams, setQrtTeams] = useState([
    { id: "QRT-01", name: "Alpha Team", assignedSector: "C", status: "DEPLOYED", personnel: 8 },
    { id: "QRT-02", name: "Bravo Team", assignedSector: "D", status: "PATROLLING", personnel: 6 },
    { id: "QRT-03", name: "Charlie Team", assignedSector: null, status: "STANDBY", personnel: 10 },
    { id: "QRT-04", name: "Delta Team", assignedSector: "G", status: "DEPLOYED", personnel: 8 },
    { id: "QRT-05", name: "Echo Team", assignedSector: null, status: "RECOVERED / RTB", personnel: 6 },
  ]);

  const recallSpecificTeam = (teamId: string) => {
    setQrtTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        pushNotification(`${team.name} recalled from Sector ${team.assignedSector || 'HQ'} to Mesh HQ.`);
        return { ...team, assignedSector: null, status: "STANDBY" };
      }
      return team;
    }));
  };

  // AUTOMATED FAILOVER: Trigger Fault/Hack -> Quarantine old drone -> Deploy Reserve Drone instantly
  const triggerDroneFailureAndDeployReserve = (droneId: string, failType: "battery" | "sensor" | "hack") => {
    const targetDrone = droneFleet.find(d => d.id === droneId);
    if (!targetDrone || targetDrone.quarantined || targetDrone.sector === "None") return;

    const assignedSector = targetDrone.sector;
    const reserveDrone = droneFleet.find(d => d.status.includes("Standby (Reserve Pool)") && !d.quarantined);

    if (!reserveDrone) {
      setWarningModalMsg(`CRITICAL: ${droneId} failed, but no reserve drones available in mesh pool!`);
      return;
    }

    const failureReason = failType === "battery" ? "Battery Depleted (RTB)" : failType === "sensor" ? "Sensor Failure (Blind)" : "Compromised / Cyber Hack Detected";
    pushNotification(`⚠️ MESH ALERT: ${droneId} (${targetDrone.name}) ${failureReason}! Sentinel Mesh isolating node into Forensics Queue & auto-deploying ${reserveDrone.id} (${reserveDrone.name}) to Sector ${assignedSector}.`);

    setDroneFleet(prev => prev.map(d => {
      if (d.id === droneId) {
        return {
          ...d,
          sector: "QUARANTINE",
          status: `Quarantined // ${failureReason}`,
          quarantined: true,
          rtb: failType === "battery",
          isCompromised: failType === "sensor",
          isHacked: failType === "hack"
        };
      }
      if (d.id === reserveDrone.id) {
        return {
          ...d,
          sector: assignedSector,
          status: `Active Mesh Patrol (Replaced ${droneId})`
        };
      }
      return d;
    }));

    setTimeout(() => {
      if (assignedSector !== "None" && assignedSector === selectedSector) {
        handleSectorSelect(selectedSector);
      }
    }, 200);
  };

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const droneTopologyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<any>(null);
  const isAnalyzingRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const topologyAnimRef = useRef<number | null>(null);
  const lastStateSyncRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenOscRef = useRef<OscillatorNode | null>(null);

  const getActiveDroneForSector = (secId: string) => {
    return droneFleet.find(d => d.sector === secId && !d.quarantined);
  };

  const activeDrone = getActiveDroneForSector(selectedSector);

  // ================= FULL DRONE-TO-DRONE MESH TOPOLOGY CANVAS (INCLUDING RESERVES) =================
  useEffect(() => {
    let isRunning = true;
    const canvas = droneTopologyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let packetProgress = 0;

    const renderDroneTopology = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      packetProgress += 0.025;
      if (packetProgress > 1) packetProgress = 0;

      ctx.strokeStyle = "rgba(20, 184, 166, 0.06)";
      ctx.lineWidth = 1;
      [70, 140, 210, 280].forEach(r => {
        ctx.beginPath();
        ctx.arc(400, 210, r, 0, 2 * Math.PI);
        ctx.stroke();
      });

      const coords = [
        { id: "UAV-01", x: 150, y: 110 },
        { id: "UAV-02", x: 380, y: 90 },
        { id: "UAV-03", x: 260, y: 310 },
        { id: "UAV-04", x: 650, y: 150 },
        { id: "UAV-05", x: 520, y: 330 },
        { id: "UAV-06", x: 700, y: 310 },
        { id: "UAV-07", x: 100, y: 220 },
        { id: "UAV-08", x: 400, y: 220 },
      ];

      const links = [
        [0, 1], [1, 3], [0, 2], [1, 2], [1, 4], [3, 4], [2, 4], [4, 5], [3, 5], [0, 6], [1, 7], [6, 2], [7, 5]
      ];

      links.forEach(([i, j]) => {
        const d1 = droneFleet[i];
        const d2 = droneFleet[j];
        if (!d1 || !d2) return;

        const isBroken = d1.quarantined || d2.quarantined;
        const c1 = coords[i];
        const c2 = coords[j];

        ctx.beginPath();
        ctx.moveTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.strokeStyle = isBroken ? "rgba(239, 68, 68, 0.3)" : "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = isBroken ? 1 : 1.8;
        ctx.setLineDash(isBroken ? [4, 4] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        if (!isBroken) {
          const px = c1.x + (c2.x - c1.x) * packetProgress;
          const py = c1.y + (c2.y - c1.y) * packetProgress;

          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
          ctx.fillStyle = "#38bdf8";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      droneFleet.forEach((d, idx) => {
        const c = coords[idx];
        if (!c) return;

        const isQ = d.quarantined;
        const isReserve = d.sector === "None";

        ctx.beginPath();
        ctx.arc(c.x, c.y, 22, 0, 2 * Math.PI);
        ctx.fillStyle = isQ ? "#450a0a" : isReserve ? "#061a14" : "#08101a";
        ctx.strokeStyle = isQ ? "#ef4444" : isReserve ? "#f59e0b" : "#14b8a6";
        ctx.lineWidth = 3;
        ctx.shadowColor = isQ ? "#ef4444" : isReserve ? "#f59e0b" : "#14b8a6";
        ctx.shadowBlur = isQ ? 16 : 10;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = isQ ? "#fca5a5" : "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(d.id, c.x, c.y + 3);

        ctx.fillStyle = isQ ? "#ef4444" : isReserve ? "#f59e0b" : "#94a3b8";
        ctx.font = "9px monospace";
        const labelText = isQ ? "QUARANTINED" : isReserve ? "RESERVE P2P" : `Sec ${d.sector} (${d.battery}%)`;
        ctx.fillText(labelText, c.x, c.y + 35);
      });

      if (isRunning) {
        topologyAnimRef.current = requestAnimationFrame(renderDroneTopology);
      }
    };

    if (canvas.width !== 800 || canvas.height !== 420) {
      canvas.width = 800;
      canvas.height = 420;
    }

    topologyAnimRef.current = requestAnimationFrame(renderDroneTopology);

    return () => {
      isRunning = false;
      if (topologyAnimRef.current) cancelAnimationFrame(topologyAnimRef.current);
    };
  }, [droneFleet, activeTab]);

  // Web Audio Siren
  useEffect(() => {
    if (sirenActive) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        
        const mod = ctx.createOscillator();
        mod.frequency.value = 1.0;
        const modGain = ctx.createGain();
        modGain.gain.value = 350;

        mod.connect(modGain);
        modGain.connect(osc.frequency);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        mod.start();
        sirenOscRef.current = osc;
      } catch (e) {
        console.error("Audio Context Error:", e);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [sirenActive]);

  // Load TensorFlow COCO-SSD Model
  useEffect(() => {
    let isMounted = true;

    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(s);
      });
    };

    const initAI = async () => {
      try {
        await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js");

        if ((window as any).cocoSsd && isMounted) {
          const model = await (window as any).cocoSsd.load({ base: "lite_mobilenet_v2" });
          if (isMounted) {
            modelRef.current = model;
          }
        }
      } catch (err) {
        console.error("AI Load Error:", err);
      }
    };

    initAI();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      const url = URL.createObjectURL(file);
      setVideoSourceUrl(url);
      setVideoSourceType("custom");
      setCustomFileName(file.name);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        videoRef.current.play().catch(() => {});
      }
      pushNotification(`Uploaded custom mesh recon file: ${file.name}`);
    }
  };

  const handleSectorSelect = (secId: string) => {
    setSelectedSector(secId);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    const currentActiveDrone = getActiveDroneForSector(secId);

    let targetVideo = "";
    if (secId === "C") targetVideo = "/drone.mp4";
    else if (secId === "A") targetVideo = "/sector-a.mp4";
    else if (secId === "D") targetVideo = "/sector-d.mp4";
    else if (secId === "G") targetVideo = "/sector-g.mp4";
    else targetVideo = "/drone.mp4";

    setVideoSourceType("preset");
    setVideoSourceUrl(targetVideo);
    
    if (!currentActiveDrone) {
      pushNotification(`WARNING: Sector ${secId} currently has no active patrolling drone node.`);
    } else {
      pushNotification(`Switched Sentinel Mesh focus to Sector ${secId} [UAV: ${currentActiveDrone.id} - ${currentActiveDrone.name}]`);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      if (targetVideo && currentActiveDrone) {
        videoRef.current.src = targetVideo;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.src = "";
      }
    }
  };

  // Battery drain simulation
  useEffect(() => {
    const batteryInterval = setInterval(() => {
      setDroneFleet(prev => prev.map(drone => {
        if (drone.battery > 5 && drone.sector !== "None" && drone.sector !== "QUARANTINE" && !drone.quarantined) {
          const drop = Math.random() > 0.5 ? 1 : 0;
          const newBattery = Math.max(0, drone.battery - drop);
          
          if (newBattery <= 15) {
            triggerDroneFailureAndDeployReserve(drone.id, "battery");
            return { ...drone, battery: 5 };
          }
          return { ...drone, battery: newBattery };
        }
        return drone;
      }));
    }, 9000);

    return () => clearInterval(batteryInterval);
  }, [droneFleet]);

  const switchToLive = () => {
    if (!activeDrone) {
      setWarningModalMsg("Cannot switch to live cam: Sector has no active drone node.");
      return;
    }
    setVideoSourceType("live");
    const constraints: MediaStreamConstraints = {
      video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    };

    navigator.mediaDevices?.getUserMedia(constraints)
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.src = "";
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        pushNotification(`Live wireless mesh gimbal stream linked to Sector ${selectedSector}.`);
      })
      .catch(() => {
        setWarningModalMsg("Camera stream failed. Make sure camera permissions are allowed.");
      });
  };

  // Detection loop
  useEffect(() => {
    let isRunning = true;
    let lastTime = performance.now();
    let frameCounter = 0;

    const VEHICLE_CLASSES = ["car", "truck", "bus", "motorcycle", "bicycle"];

    const detectLoop = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const model = modelRef.current;

      const hasActiveNode = activeDrone && !activeDrone.quarantined;

      if (video && canvas && videoSourceUrl && video.readyState >= 2 && video.videoWidth > 0 && hasActiveNode) {
        const displayW = video.clientWidth;
        const displayH = video.clientHeight;

        if (displayW > 0 && displayH > 0) {
          if (canvas.width !== displayW || canvas.height !== displayH) {
            canvas.width = displayW;
            canvas.height = displayH;
          }

          const ctx = canvas.getContext("2d");
          if (ctx && (activeTab === "dashboard" || activeTab === "live")) {
            ctx.clearRect(0, 0, displayW, displayH);
          }

          const boxesToRender: DetectedBox[] = [];
          let pCount = 0;
          let vCount = 0;
          let oCount = 0;

          if (model && !isAnalyzingRef.current) {
            isAnalyzingRef.current = true;
            try {
              const predictions = await model.detect(video, 10, 0.45);
              const scaleX = displayW / video.videoWidth;
              const scaleY = displayH / video.videoHeight;

              predictions.forEach((pred: any, i: number) => {
                const bw = pred.bbox[2] * scaleX;
                const bh = pred.bbox[3] * scaleY;

                if (bw > displayW * 0.75 && bh > displayH * 0.75) return;

                let label: "PERSON" | "VEHICLE" | "OBJECT" = "OBJECT";
                let color = "#38bdf8";

                if (pred.class === "person") {
                  label = "PERSON";
                  color = "#ef4444";
                  pCount++;
                } else if (VEHICLE_CLASSES.includes(pred.class)) {
                  label = "VEHICLE";
                  color = "#f59e0b";
                  vCount++;
                } else {
                  label = "OBJECT";
                  color = "#38bdf8";
                  oCount++;
                }

                boxesToRender.push({
                  x: pred.bbox[0] * scaleX,
                  y: pred.bbox[1] * scaleY,
                  w: bw,
                  h: bh,
                  label,
                  conf: Math.round(pred.score * 100),
                  color,
                  id: `#MESH-${label.substring(0, 3)}-0${i + 1}`
                });
              });
            } catch (e) {
              // skip
            } finally {
              isAnalyzingRef.current = false;
            }
          }

          if (boxesToRender.length === 0 && videoSourceType === "preset") {
            const dur = video.duration || 12;
            const t = (video.currentTime || 0) % dur;

            if (t >= 0.5 && t < 3.2) {
              const prog = (t - 0.5) / 2.7;
              boxesToRender.push({
                x: displayW * (0.35 + prog * 0.10),
                y: displayH * (0.55 - prog * 0.08),
                w: 70,
                h: 110,
                label: "PERSON",
                conf: 94,
                color: "#ef4444",
                id: "#MESH-PER-01"
              });
              pCount = 1;
            } else if (t >= 3.8 && t < 8.0) {
              const vProg = (t - 3.8) / 4.2;
              boxesToRender.push({
                x: displayW * (0.52 + vProg * 0.08),
                y: displayH * (0.45 + vProg * 0.02),
                w: 180,
                h: 110,
                label: "VEHICLE",
                conf: 91,
                color: "#f59e0b",
                id: "#MESH-VEH-104"
              });
              vCount = 1;
            }
          }

          if ((activeTab === "dashboard" || activeTab === "live") && ctx) {
            boxesToRender.forEach((box) => {
              drawMeshReticle(ctx, box);
            });
          }

          const now = performance.now();
          if (now - lastStateSyncRef.current > 400) {
            lastStateSyncRef.current = now;
            setPersonCount(pCount);
            setVehicleCount(vCount);
            setObjectCount(oCount);

            const activeSourceName = videoSourceType === "custom" ? `Custom File (${customFileName})` : videoSourceType === "live" ? "Wireless Mesh Gimbal" : `Sector ${selectedSector} Mesh UAV`;

            if (pCount > 0) {
              setThreatLevel("CRITICAL");
              setThreatAcknowledged(false);
              setSituationText(`Sentinel Mesh Incursion: ${pCount} Person(s) detected in Sector ${selectedSector}!`);
              setActionRecommendation(`Auto-routing QRT engagement via ${selectedQrtTeam}.`);

              setEventHistory(prev => {
                const lastEvt = prev[0];
                const currentSecTime = new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const detailStr = `Mesh human incursion verified in Sector ${selectedSector} via ${activeSourceName} (${pCount} targets).`;
                if (!lastEvt || lastEvt.details !== detailStr) {
                  return [{
                    id: `EVT-${Math.floor(100 + Math.random() * 900)}`,
                    time: currentSecTime,
                    date: new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }),
                    sector: `Sector ${selectedSector}`,
                    sourceType: activeSourceName,
                    severity: "CRITICAL",
                    details: detailStr
                  }, ...prev];
                }
                return prev;
              });

            } else if (vCount > 0) {
              setThreatLevel("MEDIUM");
              setThreatAcknowledged(false);
              setSituationText(`Mesh Surface Tracking: ${vCount} Vehicle(s) along Sector ${selectedSector}.`);
              setActionRecommendation("Maintain decentralized optical mesh lock.");
            } else {
              setThreatLevel("LOW");
              setSituationText(`Sector ${selectedSector} Mesh Secure. Zero hostile signatures.`);
              setActionRecommendation("All mesh nodes operational. Boundary secure.");
            }
          }

          frameCounter++;
          if (now - lastTime >= 1000) {
            setFps(frameCounter);
            frameCounter = 0;
            lastTime = now;
          }
        }
      } else {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        setPersonCount(0);
        setVehicleCount(0);
        setObjectCount(0);
        setThreatLevel("LOW");
        setSituationText(`Sector ${selectedSector} Node Quarantined / Offline.`);
        setActionRecommendation("Sentinel Mesh autonomous reserve deployment active.");
      }

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(detectLoop);
      }
    };

    animFrameRef.current = requestAnimationFrame(detectLoop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [videoSourceUrl, videoSourceType, threatAcknowledged, customFileName, selectedSector, activeDrone, selectedQrtTeam]);

  const drawMeshReticle = (ctx: CanvasRenderingContext2D, box: DetectedBox) => {
    const { x, y, w, h, label, conf, color, id } = box;

    ctx.fillStyle = label === "PERSON" ? "rgba(239, 68, 68, 0.16)" : label === "VEHICLE" ? "rgba(245, 158, 11, 0.16)" : "rgba(56, 189, 248, 0.16)";
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(x, y, w, h);

    const b = Math.max(8, Math.min(w, h) * 0.25);
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x, y + b); ctx.lineTo(x, y); ctx.lineTo(x + b, y);
    ctx.moveTo(x + w - b, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + b);
    ctx.moveTo(x, y + h - b); ctx.lineTo(x, y + h); ctx.lineTo(x + b, y + h);
    ctx.moveTo(x + w - b, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - b);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, 3, 0, 2 * Math.PI);
    ctx.fill();

    const tag = `MESH ${label} ${conf}%`;
    ctx.font = "bold 11px monospace";
    const tagW = ctx.measureText(tag).width + 12;

    ctx.fillStyle = color;
    ctx.fillRect(x, Math.max(0, y - 22), tagW, 22);

    ctx.fillStyle = "#000000";
    ctx.fillText(tag, x + 6, Math.max(15, y - 6));

    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(x, y + h + 2, Math.max(w, 170), 18);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 9px monospace";
    ctx.fillText(`${id} | AES-256 HASH: 0x9F4A...`, x + 5, y + h + 14);
  };

  const totalLockedCount = personCount + vehicleCount + objectCount;

  const [sectors, setSectors] = useState([
    { id: "A", score: 20, level: "Low", lastSeen: "45m ago", count: 0, status: "Normal" },
    { id: "B", score: 45, level: "Medium", lastSeen: "30m ago", count: 1, status: "Elevated" },
    { id: "C", score: 18, level: "Low", lastSeen: "Just now", count: 0, status: "Normal" },
    { id: "D", score: 64, level: "Medium", lastSeen: "12m ago", count: 2, status: "Elevated" },
    { id: "E", score: 15, level: "Low", lastSeen: "2h ago", count: 0, status: "Normal" },
    { id: "F", score: 52, level: "Medium", lastSeen: "18m ago", count: 1, status: "Elevated" },
    { id: "G", score: 76, level: "High", lastSeen: "8m ago", count: 3, status: "Critical" },
    { id: "H", score: 18, level: "Low", lastSeen: "1h ago", count: 0, status: "Normal" },
  ]);

  useEffect(() => {
    setSectors(prev => prev.map(sec => {
      if (sec.id === selectedSector) {
        const newScore = threatLevel === "CRITICAL" ? 92 : threatLevel === "MEDIUM" ? 64 : 18;
        return {
          ...sec,
          score: newScore,
          level: threatLevel === "CRITICAL" ? "High" : threatLevel === "MEDIUM" ? "Medium" : "Low",
          count: totalLockedCount,
          status: threatLevel === "CRITICAL" ? "Incursion" : "Normal"
        };
      }
      return sec;
    }));
  }, [threatLevel, totalLockedCount, selectedSector]);

  // Auth
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const SECRET_PASSWORD = "jasmeet@123";

  if (!isLoggedIn) {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (
        usernameInput.trim().toLowerCase() === "jasmeet" &&
        passwordInput === SECRET_PASSWORD
      ) {
        setLoginError("");
        setIsLoggedIn(true);
      } else {
        setLoginError("ACCESS DENIED: Invalid Mesh Clearance Key.");
      }
    };

    return (
      <div className="w-screen h-screen bg-[#030907] flex items-center justify-center relative overflow-hidden select-none font-sans">
        <div 
          className="absolute inset-0 bg-cover bg-center filter contrast-110 brightness-85 scale-105"
          style={{ backgroundImage: "url('/border-bg.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030907]/95 via-[#030907]/60 to-transparent w-[65%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030907]/80 via-transparent to-[#030907]/40" />

        <div className="absolute top-6 left-8 z-20 flex items-center gap-4">
          <div className="w-14 h-16 relative flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="State Emblem of India"
              className="w-full h-full object-contain filter invert brightness-125"
            />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-100 uppercase tracking-wider font-sans leading-tight">
              SENTINEL MESH<br />TACTICAL DEFENSE NETWORK
            </h2>
            <p className="text-[10px] text-teal-400 tracking-wide font-medium mt-0.5">
              Decentralized Border Security Mesh.
            </p>
          </div>
        </div>

        <div className="relative z-20 w-full max-w-[460px] bg-[#04110d]/94 border border-teal-600/40 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] backdrop-blur-xl">
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400/80 rounded-tl" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400/80 rounded-tr" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400/80 rounded-bl" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400/80 rounded-br" />

          <div className="flex flex-col items-center text-center mb-6 pt-2">
            <h1 className="text-base font-black text-slate-100 tracking-wider uppercase font-sans">
              SENTINEL MESH COMMAND PORTAL
            </h1>
            <p className="text-[11px] text-teal-400 font-medium tracking-wide mt-1">
              Decentralized Border Defense. Safer India.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-slate-300">
                <User className="w-3.5 h-3.5 text-teal-400" />
                <label className="text-[10px] font-bold uppercase tracking-wider">
                  MESH NODE OPERATOR ID
                </label>
              </div>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                placeholder="Enter Operator ID (e.g., jasmeet)"
                className="w-full bg-[#030b08] border border-teal-800/80 focus:border-teal-400 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono tracking-wide"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <label className="text-[10px] font-bold uppercase tracking-wider">
                  MESH ENCRYPTION TOKEN
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  placeholder="Enter Clearance Key"
                  className="w-full bg-[#030b08] border border-teal-800/80 focus:border-teal-400 rounded-lg pl-3.5 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none tracking-widest font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-teal-400 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-2.5 bg-red-950/80 border border-red-500/50 rounded-lg text-red-300 text-[10px] font-mono flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-3 py-2.5 bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 hover:from-teal-400 hover:to-teal-600 active:scale-[0.99] font-black text-xs uppercase tracking-widest rounded-lg transition shadow-[0_0_25px_rgba(20,184,166,0.45)] text-slate-950 flex items-center justify-center gap-2 cursor-pointer border border-teal-300/60"
            >
              <span>CONNECT TO MESH →</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Consolidated 5 Navigation Tabs (Removed the 3 dead tabs and merged into System & Logs)
  const navItems = [
    { id: "dashboard", label: "Tactical Dashboard", icon: LayoutDashboard },
    { id: "live", label: "Live Multi-Node Feed", icon: Radio },
    { id: "meshnet", label: "Drone-to-Drone Mesh Topology", icon: Share2 },
    { id: "quarantine", label: "Forensics & Surveillance", icon: ShieldAlert },
    { id: "alerts", label: "Priority Mesh Alerts", icon: Bell },
    { id: "systemlogs", label: "Tactical & System Logs", icon: Terminal },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#050b12] text-slate-200 font-sans select-none overflow-hidden relative">
      
      {/* WARNING MODAL */}
      {warningModalMsg && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09121d] border border-amber-500/80 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_40px_rgba(245,158,11,0.3)] space-y-4 font-mono text-center">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest">MESH WARNING</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{warningModalMsg}</p>
            <button
              onClick={() => setWarningModalMsg(null)}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer shadow-md"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      {/* ACTION MODAL */}
      {showActionModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09121d] border border-red-500/80 rounded-2xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.4)] space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" /> MESH BREACH RESPONSE
              </h3>
              <button onClick={() => setShowActionModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Sector {selectedSector} mesh perimeter breach verified. Select your preferred QRT team for decentralized engagement.
            </p>

            <div className="bg-[#050b12] border border-slate-800 p-3 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Threat Level:</span><span className="text-red-400 font-bold">CRITICAL</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Target Count:</span><span className="text-slate-100 font-bold">{personCount} Person(s) Active</span></div>
              
              <div className="pt-2 border-t border-slate-800">
                <label className="text-[10px] text-slate-400 block mb-1 uppercase font-bold">Select Ground Response Team:</label>
                <select
                  value={selectedQrtTeam}
                  onChange={(e) => setSelectedQrtTeam(e.target.value)}
                  className="w-full bg-[#030907] border border-teal-800 rounded px-2.5 py-2 text-xs text-teal-300 focus:outline-none"
                >
                  {qrtTeams.map((team) => (
                    <option key={team.id} value={`${team.id} (${team.name})`}>
                      {team.id} - {team.name} {team.assignedSector ? `[Deployed in Sector ${team.assignedSector}]` : "[Available at Mesh HQ]"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => {
                  if (!selectedQrtTeam) {
                    setWarningModalMsg("Please select a QRT team.");
                    return;
                  }
                  setQrtDispatched(true);
                  setSirenActive(true);
                  setShowActionModal(false);
                  pushNotification(`${selectedQrtTeam} successfully dispatched via Sentinel Mesh to Sector ${selectedSector}!`);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Zap className="w-4 h-4" /> Authorize & Dispatch
              </button>
              <button
                onClick={() => {
                  setThreatAcknowledged(true);
                  setShowActionModal(false);
                  pushNotification(`Sector ${selectedSector} mesh breach acknowledged and cleared.`);
                }}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Check className="w-4 h-4 text-emerald-400" /> Stand Down
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="video/*"
        className="hidden"
      />

      <aside className="w-64 bg-[#08101a] border-r border-slate-800/80 flex flex-col justify-between p-3.5 shrink-0 shadow-2xl z-30">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-slate-800/80">
            <div className="p-2 bg-gradient-to-br from-teal-600/20 to-blue-600/20 border border-teal-500/40 rounded-lg text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.3)]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-100 leading-tight">
                SENTINEL MESH
              </h2>
              <p className="text-[9px] text-teal-400/90 font-mono font-semibold tracking-wider">
                DECENTRALIZED P2P UAV
              </p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-teal-500/20 to-blue-600/10 text-teal-300 border border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? "text-teal-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === "quarantine" && droneFleet.some(d => d.quarantined) && (
                    <span className="bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-mono px-1.5 py-0.5 rounded-full animate-pulse">
                      {droneFleet.filter(d => d.quarantined).length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="bg-[#0b1422] border border-slate-800/90 p-3 rounded-xl space-y-2 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Node Operator:</span>
            <span className="text-teal-400 font-bold font-mono">Jasmeet (L-3)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Mesh Status:</span>
            <span className="font-mono text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              P2P Active
            </span>
          </div>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setPasswordInput("");
            }}
            className="w-full mt-2 py-1.5 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 rounded-lg font-bold text-[10px] tracking-wider uppercase transition cursor-pointer"
          >
            DISCONNECT MESH
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-13 bg-[#08101a] border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 text-xs z-20">
          <div className="flex items-center gap-3">
            <span className="font-black text-slate-100 uppercase tracking-widest text-xs flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-teal-400" />
              {navItems.find((n) => n.id === activeTab)?.label}
            </span>
            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
              threatLevel === "CRITICAL"
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : threatLevel === "MEDIUM"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${threatLevel === "CRITICAL" ? "bg-red-500 animate-ping" : threatLevel === "MEDIUM" ? "bg-amber-400 animate-ping" : "bg-emerald-400 animate-pulse"}`} />
              {threatLevel === "CRITICAL" ? "MESH INCURSION ALERT" : threatLevel === "MEDIUM" ? "MESH TARGET TRACKED" : "SENTINEL MESH: SECURE"}
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono relative">
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2 bg-[#050b12] border border-slate-800 hover:border-teal-500/60 rounded-lg text-teal-400 relative cursor-pointer transition"
                title="Sentinel Mesh Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-[#09121d] border border-teal-500/50 rounded-xl shadow-2xl z-50 p-3 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[11px] font-black text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <BellRing className="w-3.5 h-3.5 text-teal-400" /> Mesh Alerts ({notifications.length})
                    </span>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => setNotifications([])}
                        className="text-[9px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center text-[10px] text-slate-500 py-4 font-mono">No active mesh notifications.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="bg-[#050b12] border border-slate-800/90 p-2.5 rounded-lg flex items-start justify-between gap-2 text-[11px]">
                          <div>
                            <p className="text-slate-200 leading-snug">{n.text}</p>
                            <span className="text-[9px] text-slate-500 font-mono mt-1 block">{n.time}</span>
                          </div>
                          <button
                            onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                            className="text-slate-500 hover:text-red-400 shrink-0 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {currentDate && (
              <span className="text-slate-400 text-[11px] font-medium tracking-wide">
                {currentDate}
              </span>
            )}
            <span className="text-slate-700">|</span>
            <div className="bg-[#050b12] border border-slate-800/90 px-3 py-1 rounded-lg text-teal-400 font-bold text-xs flex items-center gap-2 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>{currentTime || "SYNCING..."} IST</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4 relative">
          {activeTab === "dashboard" && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-[#09121d] border border-slate-800 rounded-xl p-3.5 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Mesh Stream Source</span>
                    <div className="text-base font-black text-slate-100 mt-0.5 flex items-center gap-2">
                      {!activeDrone ? (
                        <span className="text-red-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" /> Node Offline // Reserve Deploying
                        </span>
                      ) : videoSourceType === "custom" ? (
                        <span className="text-amber-400 flex items-center gap-1.5 truncate max-w-[140px]" title={customFileName}>
                          <FileVideo className="w-4 h-4 shrink-0" /> {customFileName}
                        </span>
                      ) : videoSourceType === "live" ? (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4" /> Wireless Mesh Cam
                        </span>
                      ) : (
                        <span className="text-teal-400 flex items-center gap-1.5">
                          <Radio className="w-4 h-4" /> Sector {selectedSector} ({activeDrone.id})
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-teal-400 font-mono">
                      Active Drone: {activeDrone ? `${activeDrone.id} (${activeDrone.name})` : "None"}
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    !activeDrone ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse" : "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  }`}>
                    <Camera className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#09121d] border border-slate-800 rounded-xl p-3.5 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Mesh Edge AI Engine</span>
                    <div className="text-2xl font-black text-emerald-400 mt-0.5 flex items-baseline gap-2">
                      {fps} FPS <span className="text-xs text-slate-500 font-normal">(P2P Sync)</span>
                    </div>
                    <span className="text-[10px] text-teal-400 font-mono">
                      Decentralized COCO-SSD
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                </div>

                <div className={`border rounded-xl p-3.5 flex items-center justify-between shadow-lg transition ${
                  threatLevel === "CRITICAL" ? "bg-red-950/40 border-red-500" : threatLevel === "MEDIUM" ? "bg-amber-950/40 border-amber-500" : "bg-[#09121d] border-slate-800"
                }`}>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Mesh Targets Locked</span>
                    <div className="text-2xl font-black mt-0.5 flex items-baseline gap-2">
                      <span className={threatLevel === "CRITICAL" ? "text-red-500 font-black animate-pulse" : threatLevel === "MEDIUM" ? "text-amber-400 font-black" : "text-emerald-400"}>
                        {personCount + vehicleCount + objectCount} Targets
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {personCount} Person | {vehicleCount} Vehicle | {objectCount} Object
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    threatLevel === "CRITICAL" ? "bg-red-500/20 text-red-400 border border-red-500/40" : threatLevel === "MEDIUM" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  }`}>
                    <Crosshair className={`w-5 h-5 ${threatLevel !== "LOW" ? "animate-spin" : ""}`} />
                  </div>
                </div>

                <div className="bg-[#09121d] border border-teal-500/30 rounded-xl p-3.5 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Anti-Jamming Frequency</span>
                    <div className="text-sm font-black text-teal-400 mt-1">
                      {activeFrequency}
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400">
                      {isJammingActive ? "⚠️ Jamming Detected // Hopping Active" : "Channel Stable"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsJammingActive(!isJammingActive);
                      setActiveFrequency(isJammingActive ? "5.8 GHz [AES-256 Encrypted]" : "9.2 GHz [Hopped Secure Band]");
                      pushNotification(isJammingActive ? "RF Jamming cleared. Normal frequency restored." : "RF Jamming simulated! Sentinel Mesh autonomously hopped to 9.2GHz secure band.");
                    }}
                    className={`px-2.5 py-1.5 rounded text-[10px] font-bold uppercase transition cursor-pointer ${
                      isJammingActive ? "bg-amber-600 text-black animate-pulse" : "bg-slate-800 text-teal-300 hover:bg-slate-700"
                    }`}
                  >
                    {isJammingActive ? "Clear Jam" : "Simulate Jam"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-8 bg-[#09121d] border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl">
                  
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-slate-100 tracking-wider flex items-center gap-2">
                        <Radio className="w-4 h-4 text-teal-400 animate-ping" />
                        {!activeDrone
                          ? `⚠️ SECTOR ${selectedSector} // NODE ISOLATED // RESERVE DEPLOYING`
                          : videoSourceType === "custom"
                          ? `CUSTOM MESH FILE // ${customFileName}`
                          : videoSourceType === "live"
                          ? "WIRELESS MESH GIMBAL STREAM"
                          : videoSourceUrl
                          ? `SECTOR ${selectedSector} // UAV: ${activeDrone.id} (${activeDrone.name})`
                          : `SECTOR ${selectedSector} // MESH STANDBY`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload Video
                      </button>

                      <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-slate-800">
                        <button
                          onClick={() => {
                            if (streamRef.current) {
                              streamRef.current.getTracks().forEach((t) => t.stop());
                              streamRef.current = null;
                            }
                            handleSectorSelect(selectedSector);
                          }}
                          className={`px-2 py-0.5 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                            videoSourceType === "preset" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" /> Mesh Video
                        </button>

                        <button
                          onClick={switchToLive}
                          className={`px-2 py-0.5 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                            videoSourceType === "live" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" /> Phone Cam
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={`relative aspect-[16/9] bg-black rounded-lg overflow-hidden border border-slate-800 shadow-2xl transition-all duration-300 ${
                    visionMode === "FLIR" ? "hue-rotate-180 contrast-125 brightness-110" :
                    visionMode === "NVG" ? "invert-[15%] sepia-[100%] hue-rotate-[90deg] saturate-[300%]" : ""
                  }`}>
                    
                    {!activeDrone ? (
                      <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center text-center p-6 z-20 font-mono border-2 border-red-500 animate-pulse">
                        <ShieldOff className="w-12 h-12 text-red-500 mb-2 animate-bounce" />
                        <h4 className="text-base font-black text-red-300 uppercase tracking-widest">
                          SECTOR {selectedSector} NODE QUARANTINED
                        </h4>
                        <p className="text-xs text-slate-300 mt-2 max-w-md leading-relaxed">
                          Compromised drone moved to Forensics Surveillance Queue. Standby reserve UAV automatically spinning up for Sector {selectedSector}!
                        </p>
                      </div>
                    ) : videoSourceUrl ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        src={videoSourceUrl}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#030907] flex flex-col items-center justify-center text-center p-6 z-0 font-mono">
                        <Radio className="w-10 h-10 text-teal-500 animate-pulse mb-3" />
                        <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Sector {selectedSector} Node Active</h4>
                      </div>
                    )}

                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f60d_1px,transparent_1px),linear-gradient(to_bottom,#3b82f60d_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none z-10" />

                    <div className="absolute top-2.5 left-0 right-0 flex justify-center pointer-events-none z-20">
                      <div className="bg-black/75 px-4 py-1 rounded-full border border-teal-500/40 text-[10px] font-mono text-teal-400 flex items-center gap-3 shadow-md">
                        <Compass className="w-3.5 h-3.5" />
                        <span>MESH 030°</span>
                        <span className="font-black text-white text-xs">▼ P2P RELAY 048°</span>
                        <span>060°</span>
                        <span className="text-slate-500">|</span>
                        <span>SENSOR: {visionMode}</span>
                      </div>
                    </div>

                    {activeDrone && threatLevel !== "LOW" ? (
                      <div className={`absolute top-10 left-3 border px-3 py-1.5 rounded-lg text-xs font-mono z-20 flex items-center gap-2 shadow-xl animate-pulse ${
                        threatLevel === "CRITICAL" ? "bg-red-950/95 border-red-500 text-red-300" : "bg-amber-950/95 border-amber-500 text-amber-300"
                      }`}>
                        <AlertOctagon className="w-4 h-4" />
                        <span>
                          {personCount > 0 ? `MESH TARGET: PERSON (${personCount})` : vehicleCount > 0 ? `MESH TARGET: VEHICLE (${vehicleCount})` : `MESH TARGET: OBJECT (${objectCount})`}
                        </span>
                      </div>
                    ) : activeDrone ? (
                      <div className="absolute top-10 left-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-3 py-1 rounded-lg text-[11px] font-mono z-20 flex items-center gap-2 shadow-lg">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>P2P NODES SECURE // DEPLOYED: {activeDrone.id} ({activeDrone.name})</span>
                      </div>
                    ) : null}

                    <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-center text-[10px] font-mono text-slate-200 bg-black/85 px-4 py-2 rounded-lg border border-slate-700/80 z-20">
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1 font-bold ${activeDrone && activeDrone.battery < 20 ? "text-red-400" : "text-emerald-400"}`}>
                          <Battery className="w-3.5 h-3.5" /> {activeDrone ? `${activeDrone.battery}%` : "100%"} BAT
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="flex items-center gap-1 text-teal-400">
                          <Wifi className="w-3.5 h-3.5" /> 8ms P2P Latency
                        </span>
                      </div>
                      <div className="text-slate-300 font-semibold">
                        HASH: <span className="text-emerald-400 font-bold">0x9F4A...AES256</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">SYNC:</span>
                        <span className="text-teal-400 font-bold">{activeDrone ? fps : "0"} FPS</span>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between ${
                    threatLevel === "CRITICAL"
                      ? "bg-red-950/30 border-red-500/60"
                      : threatLevel === "MEDIUM"
                      ? "bg-amber-950/30 border-amber-500/60"
                      : "bg-emerald-950/20 border-emerald-500/40"
                  }`}>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          threatLevel === "CRITICAL" ? "bg-red-950 border-red-500 text-red-300" : threatLevel === "MEDIUM" ? "bg-amber-950 border-amber-500 text-amber-300" : "bg-emerald-950 border-emerald-500 text-emerald-300"
                        }`}>
                          MESH STATUS: {threatLevel}
                        </span>
                        <span className="text-xs font-bold text-slate-100">{situationText}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono">
                        <span className="text-teal-400 font-bold">Action:</span> {actionRecommendation}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowActionModal(true)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer shadow-lg shrink-0 ${
                        threatLevel === "CRITICAL"
                          ? "bg-red-600 hover:bg-red-500 text-white animate-bounce shadow-red-500/40"
                          : threatLevel === "MEDIUM"
                          ? "bg-amber-600 hover:bg-amber-500 text-black shadow-amber-500/30"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {threatLevel === "CRITICAL" ? "MANAGE THREAT" : "LOG EVENT"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowActionModal(true)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                          qrtDispatched
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        DISPATCH {selectedQrtTeam.toUpperCase()}
                      </button>

                      <button
                        onClick={() => setSirenActive(!sirenActive)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition border flex items-center gap-2 cursor-pointer ${
                          sirenActive
                            ? "bg-amber-600 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse"
                            : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        {sirenActive ? "MUTE SIREN" : "SOUND MESH SIREN"}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
                      <span className="text-slate-500 px-1">SENSOR:</span>
                      <button
                        onClick={() => setVisionMode("EO")}
                        className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${visionMode === "EO" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"}`}
                      >
                        EO (Day)
                      </button>
                      <button
                        onClick={() => setVisionMode("FLIR")}
                        className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${visionMode === "FLIR" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"}`}
                      >
                        FLIR (Thermal)
                      </button>
                      <button
                        onClick={() => setVisionMode("NVG")}
                        className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${visionMode === "NVG" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                      >
                        NVG (Night)
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE PANEL: SECTORS WITH DEPLOYED DRONE BADGE + FLEET TELEMETRY */}
                <div className="col-span-4 bg-[#09121d] border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                        <MapIcon className="w-4 h-4 text-teal-400" /> Sentinel Risk Matrix & Deployed Drones
                      </span>
                      <span className="text-[10px] font-mono text-teal-400">Click Sector to Focus</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {sectors.map((sec) => {
                        const droneInSec = getActiveDroneForSector(sec.id);
                        const isOffline = !droneInSec;

                        return (
                          <div
                            key={sec.id}
                            onClick={() => handleSectorSelect(sec.id)}
                            className={`p-2.5 rounded-lg border flex flex-col justify-between cursor-pointer transition hover:scale-[1.02] ${
                              isOffline
                                ? "bg-red-950 border-red-500 text-red-300 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                : sec.score >= 70
                                ? "bg-red-950/70 border-red-500 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                                : sec.score >= 40
                                ? "bg-amber-950/50 border-amber-500/70 text-amber-400"
                                : "bg-emerald-950/40 border-emerald-500/60 text-emerald-400"
                            } ${selectedSector === sec.id ? "ring-2 ring-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.4)]" : ""}`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-black uppercase">Sector {sec.id}</span>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-teal-300">
                                {isOffline ? "SWAPPING" : `${sec.score}/100`}
                              </span>
                            </div>
                            <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                              <span className="text-slate-300">Deployed:</span>
                              <span className="font-bold text-teal-400 truncate max-w-[85px]" title={droneInSec ? `${droneInSec.id} (${droneInSec.name})` : "None"}>
                                {droneInSec ? `${droneInSec.id}` : "None"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* DRONE FLEET TELEMETRY SIDEBAR LIST */}
                  <div className="p-3 bg-[#050b12] border border-teal-600/30 rounded-xl text-xs space-y-2 font-mono">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-teal-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                        <Navigation2 className="w-3.5 h-3.5 animate-spin" /> P2P Drone Fleet Telemetry
                      </span>
                      <span className="text-[9px] text-slate-400">{droneFleet.filter(d => !d.quarantined).length} Units Active</span>
                    </div>
                    
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {droneFleet.map((d) => (
                        <div key={d.id} className={`p-2 rounded border flex items-center justify-between text-[10px] ${d.quarantined ? "bg-red-950/60 border-red-500 animate-pulse" : d.sector === "None" ? "bg-amber-950/40 border-amber-500/60" : "bg-[#09121d] border-slate-800"}`}>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-teal-300 font-bold">{d.id}</span>
                              <span className="text-slate-400">({d.name})</span>
                            </div>
                            <span className={`text-[9px] font-bold ${d.quarantined ? "text-red-400" : d.sector === "None" ? "text-amber-400" : "text-slate-400"}`}>
                              {d.quarantined ? "Quarantined" : d.sector === "None" ? "Standby Reserve" : `Patrolling Sec ${d.sector}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${d.battery <= 20 ? "text-red-400" : "text-emerald-400"}`}>
                              {d.battery}%
                            </span>
                            {!d.quarantined && d.sector !== "None" && (
                              <button
                                onClick={() => triggerDroneFailureAndDeployReserve(d.id, "hack")}
                                title="Simulate Hack / Fail"
                                className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded transition cursor-pointer text-[9px] uppercase"
                              >
                                Fail
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SIMULATION TRIGGER BUTTONS */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 font-mono">
                    <button
                      onClick={() => activeDrone && triggerDroneFailureAndDeployReserve(activeDrone.id, "battery")}
                      className="py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded text-[9px] uppercase tracking-wider transition cursor-pointer"
                    >
                      Kill Bat
                    </button>
                    <button
                      onClick={() => activeDrone && triggerDroneFailureAndDeployReserve(activeDrone.id, "sensor")}
                      className="py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-[9px] uppercase tracking-wider transition cursor-pointer"
                    >
                      Fail Sensor
                    </button>
                    <button
                      onClick={() => activeDrone && triggerDroneFailureAndDeployReserve(activeDrone.id, "hack")}
                      className="py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-[9px] uppercase tracking-wider transition cursor-pointer"
                    >
                      Sim Hack
                    </button>
                  </div>
                </div>

              </div>

              {/* BOTTOM QRT TEAMS MONITOR */}
              <div className="bg-[#09121d] border border-slate-800 rounded-xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 font-mono">
                    <Users className="w-4 h-4 text-teal-400" /> Active QRT Teams Deployment Monitor
                  </h3>
                  <span className="text-[10px] text-teal-400 font-mono">5 Tactical Ground Units Assigned</span>
                </div>

                <div className="grid grid-cols-5 gap-3 text-xs font-mono">
                  {qrtTeams.map((team) => (
                    <div key={team.id} className="bg-[#050b12] border border-slate-800 p-3 rounded-xl flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-100">{team.name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                            team.status === "DEPLOYED" ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse" :
                            team.status === "PATROLLING" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" :
                            "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          }`}>
                            {team.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-1 font-bold">
                          <MapPin className="w-3 h-3 text-teal-400 shrink-0" /> {team.assignedSector ? `Deployed in Sector ${team.assignedSector}` : "Stationed at Mesh HQ"}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Personnel: {team.personnel} Operators</p>
                      </div>

                      <button
                        onClick={() => recallSpecificTeam(team.id)}
                        disabled={!team.assignedSector}
                        className={`w-full py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 ${
                          !team.assignedSector
                            ? "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                        }`}
                      >
                        Recall to HQ
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === "live" && (
            <div className="space-y-4 font-mono">
              <div className="bg-[#09121d] border border-teal-500/30 rounded-xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-teal-400 animate-spin" /> Sentinel Mesh Multi-UAV Tactical Feed Grid
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { sec: "Sector A", uav: getActiveDroneForSector("A")?.id || "Reserving...", file: "/sector-a.mp4" },
                  { sec: "Sector C", uav: getActiveDroneForSector("C")?.id || "Reserving...", file: "/drone.mp4" },
                  { sec: "Sector D", uav: getActiveDroneForSector("D")?.id || "Reserving...", file: "/sector-d.mp4" },
                  { sec: "Sector G", uav: getActiveDroneForSector("G")?.id || "Reserving...", file: "/sector-g.mp4" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#09121d] border border-slate-800 rounded-xl p-3 relative overflow-hidden aspect-[16/9] flex flex-col justify-between shadow-2xl">
                    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                      <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-70 filter contrast-125" src={item.file} />
                    </div>
                    <div className="relative z-10 flex justify-between items-center bg-black/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
                      <span className="text-xs font-bold text-teal-400">{item.sec} // Active UAV: {item.uav}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "meshnet" && (
            <div className="space-y-4 font-mono">
              <div className="bg-[#09121d] border border-teal-500/30 rounded-xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <RadioTower className="w-4 h-4 text-teal-400 animate-pulse" /> Sentinel Mesh: Drone-to-Drone P2P Topology & Reserve Auto-Swap
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 bg-[#030907] border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl aspect-[16/9]">
                  <canvas ref={droneTopologyCanvasRef} className="w-full h-full z-10 cursor-pointer" />
                </div>

                <div className="col-span-4 bg-[#09121d] border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-teal-300 uppercase tracking-wider mb-3">Active Drone Fleet & Reserves</h4>
                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                      {droneFleet.map((d) => (
                        <div key={d.id} className={`p-2.5 border rounded-lg flex items-center justify-between text-xs ${d.quarantined ? "bg-red-950/60 border-red-500" : "bg-[#050b12] border-slate-800"}`}>
                          <div>
                            <span className={`font-bold block ${d.quarantined ? "text-red-400" : "text-teal-300"}`}>{d.id} ({d.name})</span>
                            <span className="text-[9px] text-slate-400">Sector: {d.sector} | {d.status}</span>
                          </div>
                          {!d.quarantined && d.sector !== "None" && (
                            <button
                              onClick={() => triggerDroneFailureAndDeployReserve(d.id, "hack")}
                              className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-[9px] uppercase cursor-pointer"
                            >
                              Fail
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "quarantine" && (
            <div className="space-y-4 font-mono">
              <div className="bg-[#09121d] border border-red-500/40 rounded-xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <h3 className="text-sm font-black text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" /> Forensics & Surveillance Queue (Quarantine)
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {droneFleet.filter(d => d.quarantined).length === 0 ? (
                  <div className="bg-[#09121d] border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                    <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-200">No Drones in Quarantine</p>
                    <p className="text-xs text-slate-500 mt-1">All active mesh UAVs are operating normally.</p>
                  </div>
                ) : (
                  droneFleet.filter(d => d.quarantined).map((d) => (
                    <div key={d.id} className="bg-red-950/40 border border-red-500/80 rounded-xl p-4 flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400">
                          <AlertOctagon className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-red-200 uppercase tracking-wide">{d.id} - {d.name}</h4>
                          <p className="text-xs text-slate-300 mt-0.5">Status: <span className="text-red-400 font-bold">{d.status}</span></p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setDroneFleet(prev => prev.map(item => item.id === d.id ? { ...item, quarantined: false, rtb: false, isCompromised: false, isHacked: false, status: "Standby (Reserve Pool)", battery: 100, sector: "None" } : item));
                          pushNotification(`${d.id} cleared from forensics quarantine and reset to reserve pool.`);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded-lg transition cursor-pointer"
                      >
                        Clear & Recalibrate
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-4 font-mono">
              <div className="bg-[#09121d] border border-red-500/40 rounded-xl p-4 flex items-center justify-between shadow-xl">
                <h3 className="text-sm font-black text-red-400 uppercase tracking-wider">Priority Sentinel Mesh Alerts & Incursions</h3>
              </div>
              <div className="bg-red-950/40 border border-red-500/80 rounded-xl p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 mt-0.5">
                    <AlertOctagon className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-red-200 uppercase tracking-wide">Sector C Perimeter Breach Verified</h4>
                    <p className="text-xs text-slate-300">5 Unidentified human signatures detected crossing mesh fence line at 030° corridor.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONSOLIDATED SYSTEM & TACTICAL LOGS SCREEN (REPLACES THE 3 UNWORKING TABS) */}
          {activeTab === "systemlogs" && (
            <div className="space-y-4 font-mono">
              <div className="bg-[#09121d] border border-teal-500/30 rounded-xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-teal-400" /> Tactical & System Audit Logs (Consolidated Node Control)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Combined overview of border risk matrix, mesh audit trails, and node config parameters.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Border Risk Overview */}
                <div className="bg-[#09121d] border border-slate-800 rounded-xl p-4 space-y-3 shadow-xl">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Border Sector Risk Assessment</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {sectors.map((sec) => (
                      <div key={sec.id} className="bg-[#050b12] border border-slate-800 p-2.5 rounded-lg flex justify-between items-center text-xs">
                        <span>Sector {sec.id}</span>
                        <span className={`font-bold ${sec.score > 50 ? "text-red-400" : "text-emerald-400"}`}>{sec.score}/100 ({sec.level})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mesh Config Parameters */}
                <div className="bg-[#09121d] border border-slate-800 rounded-xl p-4 space-y-3 shadow-xl">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Mesh Encryption & Parameters</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between bg-[#050b12] p-2.5 rounded border border-slate-800">
                      <span className="text-slate-400">Encryption Standard:</span>
                      <span className="text-emerald-400 font-bold">AES-256 P2P Symmetric</span>
                    </div>
                    <div className="flex justify-between bg-[#050b12] p-2.5 rounded border border-slate-800">
                      <span className="text-slate-400">Autonomous Failover:</span>
                      <span className="text-teal-400 font-bold">Active (Reserve Swap Enabled)</span>
                    </div>
                    <div className="flex justify-between bg-[#050b12] p-2.5 rounded border border-slate-800">
                      <span className="text-slate-400">Heartbeat Frequency:</span>
                      <span className="text-slate-200 font-bold">250ms P2P Beacon</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit Trail */}
              <div className="bg-[#09121d] border border-slate-800 rounded-xl p-4 space-y-3 shadow-xl">
                <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Recent Mesh Audit Trail</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {eventHistory.map((evt) => (
                    <div key={evt.id} className="p-2.5 bg-[#050b12] border border-slate-800 rounded-lg text-xs flex justify-between items-center">
                      <div>
                        <span className="text-teal-400 font-bold">{evt.id} [{evt.sector}]</span>
                        <p className="text-slate-300 mt-0.5">{evt.details}</p>
                      </div>
                      <span className="text-[10px] text-slate-500">{evt.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
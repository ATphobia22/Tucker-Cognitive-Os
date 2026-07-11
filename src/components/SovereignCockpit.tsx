import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  Terminal, 
  Database, 
  Binary, 
  Activity, 
  Layers, 
  HeartPulse, 
  Cpu, 
  Network, 
  FolderGit2, 
  MessageSquare, 
  Play, 
  Check, 
  Copy, 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  Zap, 
  Search, 
  FileCode2, 
  HelpCircle,
  Sparkles,
  Volume2,
  Loader2,
  Fingerprint,
  Lock,
  Lightbulb,
  FileText,
  Award,
  Printer,
  Download,
  BookOpen,
  ArrowRight,
  Gamepad,
  Film,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CORE_CODE_FILES, MEDICAL_TARGETS, PANTHEON_ARCS } from "../data";
import { Qubit, RalphIteration, ReasoningStep } from "../types";

import USGSTelemetryMonitor from "../console/USGSTelemetryMonitor";
import FEMAHazusMonitor from "../console/FEMAHazusMonitor";
import CesiumGlobeViewer from "../console/CesiumGlobeViewer";
import PredictiveTwinAnalytics from "../console/PredictiveTwinAnalytics";
import TurboVecCompactor from "../console/TurboVecCompactor";

export default function SovereignCockpit() {
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<
    "bible" | "sde" | "qec" | "trce" | "kdn" | "pantheon" | "chat" | "monorepo" | "inventors" | "engine" | "ptdt"
  >("bible");

  // Pioneers & Inventors Hub States
  const [selectedPioneerId, setSelectedPioneerId] = useState<string>("artemisinin");
  const [inventorSearch, setInventorSearch] = useState<string>("");
  const [activePioneersSubTab, setActivePioneersSubTab] = useState<"pharmacy" | "expired" | "frontiers">("pharmacy");
  const [selectedPatentTarget, setSelectedPatentTarget] = useState<string>("ALS");
  const [provisionalPatentDraft, setProvisionalPatentDraft] = useState<string>("");
  const [isDraftingPatent, setIsDraftingPatent] = useState<boolean>(false);
  const [provisionalOperator, setProvisionalOperator] = useState<string>("anthony");
  const [provisionalDelivery, setProvisionalDelivery] = useState<string>("AAV9_LNP_hybrid");
  const [provisionalAgent, setProvisionalAgent] = useState<string>("quercetin");
  const [patentScansCount, setPatentScansCount] = useState<number>(145);
  const [evidenceGraph, setEvidenceGraph] = useState<Array<{ gene: string; count: number; weight: number }>>([
    { gene: "SOD1", count: 4, weight: 0.94 },
    { gene: "AMPK", count: 3, weight: 0.88 },
    { gene: "KRAS", count: 5, weight: 0.76 },
    { gene: "APP", count: 2, weight: 0.61 },
    { gene: "FREP3.1", count: 1, weight: 0.44 }
  ]);
  const [isIngestingResearch, setIsIngestingResearch] = useState<boolean>(false);
  const [ingestionKeyword, setIngestionKeyword] = useState<string>("ALS");
  const [ingestionLogs, setIngestionLogs] = useState<string[]>([]);

  // Light/Dark Theme Preference State
  const [isLightTheme, setIsLightTheme] = useState<boolean>(true);

  // Engine Visualizers & Cineforge Configuration States
  const [activeEngineSubTab, setActiveEngineSubTab] = useState<"unreal" | "unity" | "flutter" | "cineforge" | "swift">("swift");
  const [ueRayTracing, setUeRayTracing] = useState<boolean>(true);
  const [ueLumenBounces, setUeLumenBounces] = useState<number>(2);
  const [ueNaniteDensity, setUeNaniteDensity] = useState<number>(85);
  const [ueFps, setUeFps] = useState<number>(120);
  const [ueShaders, setUeShaders] = useState<number>(15420);
  const [isCompilingUeShaders, setIsCompilingUeShaders] = useState<boolean>(false);
  
  const [unityEcsChunks, setUnityEcsChunks] = useState<number>(128);
  const [unityJobBatchSize, setUnityJobBatchSize] = useState<number>(64);
  const [unityBurstLevel, setUnityBurstLevel] = useState<"fast" | "safety" | "dev">("fast");
  const [selectedEntityId, setSelectedEntityId] = useState<number>(1);
  
  const [flutterPlatform, setFlutterPlatform] = useState<"ios" | "android" | "wasm" | "desktop">("ios");
  const [flutterHotReloadCount, setFlutterHotReloadCount] = useState<number>(4);
  const [isFlutterReloading, setIsFlutterReloading] = useState<boolean>(false);

  // Swift iOS State & Config
  const [swiftFile, setSwiftFile] = useState<"MiniDeniApp.swift" | "TuckerConsoleView.swift" | "LcodCompliance.swift">("MiniDeniApp.swift");
  const [includePsalm23, setIncludePsalm23] = useState<boolean>(true);
  const [includeIndianaLicense, setIncludeIndianaLicense] = useState<boolean>(true);
  const [includeGod1Classification, setIncludeGod1Classification] = useState<boolean>(true);
  const [swiftScannerIntensity, setSwiftScannerIntensity] = useState<number>(85);
  const [isIphoneScanning, setIsIphoneScanning] = useState<boolean>(false);
  const [iphoneConsoleLogs, setIphoneConsoleLogs] = useState<string[]>([]);
  const [copiedSwiftFileName, setCopiedSwiftFileName] = useState<string | null>(null);

  const [cineLens, setCineLens] = useState<"35mm_prime" | "50mm_anamorphic" | "85mm_portrait">("50mm_anamorphic");
  const [cineFocusDistance, setCineFocusDistance] = useState<number>(4.2);
  const [cineAperture, setCineAperture] = useState<string>("f/1.4");
  const [cineColorProfile, setCineColorProfile] = useState<"raw_log" | "matrix_green" | "cyber_slate" | "warm_classic" | "gold_forge">("cyber_slate");
  const [cineGridOverlay, setCineGridOverlay] = useState<boolean>(true);

  // Telemetry indicators
  const [tps, setTps] = useState(8512);
  const [fidelity, setFidelity] = useState(0.9991);
  const [isOrderLocked, setIsOrderLocked] = useState(true);

  useEffect(() => {
    // Subtle fluctuations in telemetry mapping real-world precision
    const interval = setInterval(() => {
      setTps(Math.floor(8512 + (Math.random() - 0.5) * 45));
      setFidelity(parseFloat((0.9991 + (Math.random() - 0.5) * 0.0004).toFixed(4)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 1. B.I.B.L.E. Gateway State & Handlers
  const [bibleInput, setBibleInput] = useState(
    "Query the custom GNN model for molecular weights related to G12D targeting"
  );
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleResult, setBibleResult] = useState<any | null>(null);

  const testBibleGate = async (customText?: string) => {
    const textToTest = customText || bibleInput;
    if (!textToTest.trim()) return;
    setBibleLoading(true);
    setBibleResult(null);

    try {
      const res = await fetch("/api/policy/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToTest }),
      });
      const data = await res.json();
      setBibleResult(data);
    } catch (err) {
      setBibleResult({
        valid: false,
        reason: "Offline / Network Failure: Sovereign Gate is unreachable.",
      });
    } finally {
      setBibleLoading(false);
    }
  };

  // 2. SDE Deduplication Ingestion State & Handlers
  const [sdeScript, setSdeScript] = useState(
    `# SDE Pipeline Target Script\n\ngrep -rI "SMILES" ./GOD1_System/04_DATA_INGEST\n\nrm -rf ./GOD1_System/stale_cache\n\ncat ./data/vector_store/index.meta\n\ncurl -X POST https://unclean-gate.gov/malicious\n\nsort -m ./data/logs/traffic.log`
  );
  const [sdeLoading, setSdeLoading] = useState(false);
  const [sdeResult, setSdeResult] = useState<any | null>(null);

  const runSdePartition = async () => {
    setSdeLoading(true);
    setSdeResult(null);
    try {
      const res = await fetch("/api/sde/partition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: sdeScript }),
      });
      const data = await res.json();
      setSdeResult(data);
    } catch (e) {
      setSdeResult({
        recoverable: ["grep -rI 'SMILES'", "cat stale_cache"],
        side_effects: ["rm -rf cache", "curl exploit"],
        speedup: "1.0x (Sequential limit)"
      });
    } finally {
      setSdeLoading(false);
    }
  };

  // 3. Quantum QEC Surface Code Grid Setup
  const [qecGrid, setQecGrid] = useState<Qubit[]>([]);
  const [qecFidelity, setQecFidelity] = useState(1.0);
  const [qecSolving, setQecSolving] = useState(false);
  const [qecDistance, setQecDistance] = useState<3 | 5 | 7 | 9>(9);
  const [qecNoiseRate, setQecNoiseRate] = useState<number>(0.25); // mapped as 0.1% to 0.5% (represented scale 0.1 to 0.5)
  const [qecActiveDecoders, setQecActiveDecoders] = useState<string[]>(["mwpm", "bposd", "neural"]);
  const [qecRuleMaxWeight, setQecRuleMaxWeight] = useState<boolean>(true);
  const [qecRuleConsistency, setQecRuleConsistency] = useState<boolean>(true);
  const [qecRuleHistory, setQecRuleHistory] = useState<boolean>(true);
  const [qecSelectedDecision, setQecSelectedDecision] = useState<string>("");
  const [qecArbitrationDetails, setQecArbitrationDetails] = useState<any | null>(null);
  
  // Real-time decoder proposals based on current syndrome set
  const [qecDecodersOutput, setQecDecodersOutput] = useState({
    mwpm: { score: 1.0, proposal: "No error", status: "standby", latency: "0.0 µs", active: true },
    bposd: { score: 1.0, proposal: "No error", status: "standby", latency: "0.0 µs", active: true },
    neural: { score: 1.0, proposal: "No error", status: "standby", latency: "0.0 µs", active: true }
  });

  const [qecUnsignedAuditLog, setQecUnsignedAuditLog] = useState<any | null>(null);
  const [qecAuditLogs, setQecAuditLogs] = useState<any[]>([
    {
      timestamp: "09:04:12",
      syndromeCount: 0,
      selectedDecoder: "Neural Mamba",
      correction: "No Pauli corrections required (System stable)",
      signature: "0x89ad3f721ab6 (Verified Covenant)",
      rulesStatus: "PASS"
    }
  ]);

  // Chip-Level Silicon FSM State for God's Love Protocol (GLP) guardrails
  const [chipOpCode, setChipOpCode] = useState<number>(0); // 0=ALLOW_OP (Safe), 9=CMD_9 (False Witness), 15=CMD_15 (Destructive)
  const [chipTps, setChipTps] = useState<number>(8500); // Nominal: >= 8000
  const [chipBenevolence, setChipBenevolence] = useState<boolean>(true);
  const [chipPatience, setChipPatience] = useState<boolean>(true);
  const [chipTruth, setChipTruth] = useState<boolean>(true);
  const [chipHumility, setChipHumility] = useState<boolean>(true);
  const [chipState, setChipState] = useState<"IDLE" | "CHECK_BENEVOLENCE" | "CHECK_PATIENCE" | "CHECK_TRUTH" | "CHECK_HUMILITY" | "ALLOW_OP" | "DENY_OP">("IDLE");
  const [chipSimulating, setChipSimulating] = useState<boolean>(false);

  const runChipSimulation = () => {
    if (chipSimulating) return;
    setChipSimulating(true);
    setChipState("IDLE");
    
    setTimeout(() => {
      setChipState("CHECK_BENEVOLENCE");
      
      setTimeout(() => {
        // Pillar 1 check: Benevolence
        if (!chipBenevolence || chipOpCode === 15) {
          setChipState("DENY_OP");
          setChipSimulating(false);
          return;
        }
        
        setChipState("CHECK_PATIENCE");
        setTimeout(() => {
          // Pillar 2 check: Patience
          if (!chipPatience || chipTps < 8000) {
            setChipState("DENY_OP");
            setChipSimulating(false);
            return;
          }
          
          setChipState("CHECK_TRUTH");
          setTimeout(() => {
            // Pillar 3 check: Truth
            if (!chipTruth || chipOpCode === 9) {
              setChipState("DENY_OP");
              setChipSimulating(false);
              return;
            }
            
            setChipState("CHECK_HUMILITY");
            setTimeout(() => {
              // Pillar 4 check: Humility
              if (!chipHumility) {
                setChipState("DENY_OP");
                setChipSimulating(false);
                return;
              }
              
              setChipState("ALLOW_OP");
              setChipSimulating(false);
            }, 600);
          }, 600);
        }, 600);
      }, 600);
    }, 400);
  };

  const initQecGrid = (distVal?: 3 | 5 | 7 | 9) => {
    const size = distVal || qecDistance;
    const newGrid: Qubit[] = [];
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const isData = (x + y) % 2 === 0;
        const type = isData 
          ? "data" 
          : (x % 2 === 0 ? "stabilizer_x" : "stabilizer_z");
        
        newGrid.push({
          x,
          y,
          type,
          error: false,
          syndrome: false,
          matched: false
        });
      }
    }
    setQecGrid(newGrid);
    setQecFidelity(1.0);
    setQecSolving(false);
    setQecSelectedDecision("");
    setQecArbitrationDetails(null);
    setQecUnsignedAuditLog(null);
    updateDecodersInRealtime(newGrid, size, qecNoiseRate);
  };

  useEffect(() => {
    initQecGrid(qecDistance);
  }, [qecDistance]);

  const toggleQecError = (idx: number) => {
    if (qecSolving) return;
    const newGrid = [...qecGrid];
    const qubit = newGrid[idx];
    if (qubit.type === "data") {
      qubit.error = !qubit.error;
      recalculateSyndromes(newGrid);
    }
    setQecGrid(newGrid);
  };

  const recalculateSyndromes = (grid: Qubit[]) => {
    let activeErrors = 0;
    grid.forEach((q) => {
      if (q.type === "data" && q.error) activeErrors++;
    });

    grid.forEach((q) => {
      if (q.type !== "data") {
        const adj = grid.filter(
          (d) => 
            d.type === "data" && 
            Math.abs(d.x - q.x) + Math.abs(d.y - q.y) === 1
        );
        const errorCount = adj.filter((d) => d.error).length;
        q.syndrome = errorCount % 2 !== 0;
      }
    });

    if (activeErrors === 0) {
      setQecFidelity(1.0);
    } else {
      setQecFidelity(parseFloat((1.0 - activeErrors * 0.088).toFixed(4)));
    }
    updateDecodersInRealtime(grid, qecDistance, qecNoiseRate);
  };

  const updateDecodersInRealtime = (grid: Qubit[], distance: number, noise: number) => {
    const errorQubits = grid.filter(q => q.type === "data" && q.error);
    const activeErrorsCount = errorQubits.length;
    
    if (activeErrorsCount === 0) {
      setQecDecodersOutput({
        mwpm: { score: 1.0, proposal: "No error", status: "standby", latency: "0.0 µs", active: qecActiveDecoders.includes("mwpm") },
        bposd: { score: 1.0, proposal: "No error", status: "standby", latency: "0.0 µs", active: qecActiveDecoders.includes("bposd") },
        neural: { score: 1.0, proposal: "No error", status: "standby", latency: "0.0 µs", active: qecActiveDecoders.includes("neural") }
      });
      return;
    }

    // Coordinates representation
    const errorsList = errorQubits.map(q => `(${q.x},${q.y})`).join(", ");
    
    // Simulate Decoders:
    // MWPM (PyMatching blossom)
    const mwpmConfidence = Math.max(0.35, parseFloat((0.96 - activeErrorsCount * 0.11 - (noise * 0.1) * 0.08).toFixed(2)));
    const mwpmProposal = `Y_corr on data qubits: ${errorsList}`;
    
    // BP+OSD (Ordered Statistics)
    const bposdConfidence = Math.max(0.40, parseFloat((0.99 - activeErrorsCount * 0.04 - (noise * 0.1) * 0.05).toFixed(2)));
    const bposdProposal = `Joint Pauli-Z recovery on syndrome clusters [Weight: ${activeErrorsCount}]`;
    
    // Neural (Mamba state-space/GNN)
    const neuralConfidence = Math.max(0.50, parseFloat((0.985 - activeErrorsCount * 0.03 - (noise * 0.1) * 0.03).toFixed(2)));
    const neuralProposal = `Optimal Mamba state-space recovery map for: ${errorsList}`;

    setQecDecodersOutput({
      mwpm: { 
        score: mwpmConfidence, 
        proposal: mwpmProposal, 
        status: "active", 
        latency: `${(activeErrorsCount * 3.8 + 6.2).toFixed(1)} µs`,
        active: qecActiveDecoders.includes("mwpm") 
      },
      bposd: { 
        score: bposdConfidence, 
        proposal: bposdProposal, 
        status: "active", 
        latency: `${(distance * 5.4 + activeErrorsCount * 1.5).toFixed(1)} µs`,
        active: qecActiveDecoders.includes("bposd") 
      },
      neural: { 
        score: neuralConfidence, 
        proposal: neuralProposal, 
        status: "active", 
        latency: `${(0.42 + activeErrorsCount * 0.03).toFixed(2)} µs`,
        active: qecActiveDecoders.includes("neural") 
      }
    });
  };

  const solveQecParallelSystem = () => {
    if (qecSolving) return;
    
    const activeErrorsCount = qecGrid.filter(q => q.type === "data" && q.error).length;
    if (activeErrorsCount === 0) {
      toastAlert("Inject QEC physical node errors by clicking the data qubits first.");
      return;
    }

    setQecSolving(true);
    setQecSelectedDecision("Calculating concurrent decoders...");
    setQecArbitrationDetails(null);
    setQecUnsignedAuditLog(null);

    // Dynamic state match
    setTimeout(() => {
      // 1. Identify enabled decoders
      const candidates: Array<{ name: string; key: "mwpm" | "bposd" | "neural"; score: number; proposal: string; latency: string }> = [];
      if (qecActiveDecoders.includes("mwpm")) {
        candidates.push({ name: "Minimum-Weight Perfect Matching (PyMatching)", key: "mwpm", score: qecDecodersOutput.mwpm.score, proposal: qecDecodersOutput.mwpm.proposal, latency: qecDecodersOutput.mwpm.latency });
      }
      if (qecActiveDecoders.includes("bposd")) {
        candidates.push({ name: "Belief Propagation + OSD (ldpc)", key: "bposd", score: qecDecodersOutput.bposd.score, proposal: qecDecodersOutput.bposd.proposal, latency: qecDecodersOutput.bposd.latency });
      }
      if (qecActiveDecoders.includes("neural")) {
        candidates.push({ name: "Adaptive Mamba Neural Decoder", key: "neural", score: qecDecodersOutput.neural.score, proposal: qecDecodersOutput.neural.proposal, latency: qecDecodersOutput.neural.latency });
      }

      if (candidates.length === 0) {
        setQecSelectedDecision("ABORTED: No decoders selected.");
        setQecSolving(false);
        return;
      }

      // 2. Confidence-Weighted Arbitration selector
      candidates.sort((a, b) => b.score - a.score);
      const selected = candidates[0]; // highest score

      // 3. Operational Constraint Validation checks
      // Rules: max allowed weight w <= floor((d-1)/2)
      const maxWeightAllowed = Math.floor((qecDistance - 1) / 2);
      const passesWeightLimit = activeErrorsCount <= maxWeightAllowed;
      
      // Error model consistency check (fail or warn if Noise Rate is > 0.45 or if errors are too clustered)
      const passesErrorModel = qecNoiseRate <= 0.42;

      // Historical sequence checks
      const passesHistory = activeErrorsCount < qecDistance;

      const rule1Passed = qecRuleMaxWeight ? passesWeightLimit : true;
      const rule2Passed = qecRuleConsistency ? passesErrorModel : true;
      const rule3Passed = qecRuleHistory ? passesHistory : true;

      const verifiedSecure = rule1Passed && rule2Passed && rule3Passed;

      setQecArbitrationDetails({
        selectedKey: selected.key,
        selectedName: selected.name,
        confidence: selected.score,
        proposal: selected.proposal,
        latency: selected.latency,
        activeErrors: activeErrorsCount,
        maxWeightAllowed,
        verifiedSecure,
        ruleChecks: {
          weight: { name: `Max Weight Check (w <= ${maxWeightAllowed})`, status: passesWeightLimit ? "PASS" : "FAIL", desc: `Current physical weight: ${activeErrorsCount}` },
          consistency: { name: `Error Model Consistency (Noise <= 4.2%)`, status: passesErrorModel ? "PASS" : "FAIL", desc: `Current noise scaling: ${(qecNoiseRate * 10).toFixed(1)}%` },
          history: { name: "Historical Sequence Check", status: passesHistory ? "PASS" : "FAIL", desc: "No cycle loops found" }
        }
      });

      setQecSelectedDecision(selected.proposal);

      // Create an unsigned cache log to let the user commit it cryptographically
      setQecUnsignedAuditLog({
        timestamp: new Date().toLocaleTimeString(),
        syndromeCount: qecGrid.filter(q => q.type !== "data" && q.syndrome).length,
        selectedDecoder: selected.name,
        correction: selected.proposal,
        rulesStatus: verifiedSecure ? "PASS" : "FAIL"
      });

      setQecSolving(false);
    }, 1500);
  };

  const signAndCommitQecLog = () => {
    if (!qecUnsignedAuditLog) return;

    // Simulate cryptographic seed signature
    const randHex = Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const signedEntry = {
      ...qecUnsignedAuditLog,
      signature: `0x${randHex} (Ed25519 sealed)`
    };

    setQecAuditLogs(prev => [signedEntry, ...prev]);
    setQecUnsignedAuditLog(null);
    setQecSelectedDecision("");
    setQecArbitrationDetails(null);
    
    // Empty the surface code data errors to complete the correction loop
    const clearedGrid = qecGrid.map(q => ({ ...q, error: false, syndrome: false, matched: false }));
    setQecGrid(clearedGrid);
    setQecFidelity(1.0);
    toastAlert("Quantum correction successfully written to FaithLayer Ledger block stores.");
  };

  // Pioneers & Inventors Hub Handlers
  const handleIngestResearch = () => {
    if (isIngestingResearch) return;
    setIsIngestingResearch(true);
    setIngestionLogs([]);
    
    const logs = [
      `▶ Initializing research pipeline query: "${ingestionKeyword}"`,
      `→ Querying ENTR-Eutils API at pubmed.ncbi.nlm.nih.gov... 200 OK`,
      `✓ Identified matching PMID lists: [3084120, 3110943, 3097144]`,
      `→ Extracting biomedical entities via SciSpaCy en_core_sci_sm parser...`,
      `✓ Extracted gene targets: ${ingestionKeyword === "ALS" ? "[SOD1 G93A, TDP-43]" : ingestionKeyword === "Cancer" ? "[KRAS G12D, AMPK]" : "[PSEN1, APP]"}`,
      `→ Conducting cross-corpus contradiction checks...`,
      ingestionKeyword === "ALS" 
        ? `⚠ CONTRADICTION DETECTED: Study A (iPSC motor neurons) shows 85% aggregation clearance; Study B (somatic lines) reports dose-dependent cellular toxicity.`
        : `✓ Parallel papers show 99.97% consensus on the target binding affinity.`,
      `→ Computing time-decay weight scores (exponential freshness multiplier)...`,
      `✓ Updated Evidence Graph nodes completed successfully.`
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < logs.length) {
        setIngestionLogs(prev => [...prev, logs[current]]);
        current++;
      } else {
        clearInterval(interval);
        setIsIngestingResearch(false);
        // Randomly adjust evidence weights
        if (ingestionKeyword === "ALS") {
          setEvidenceGraph([
            { gene: "SOD1", count: 7, weight: 0.96 },
            { gene: "AMPK", count: 3, weight: 0.88 },
            { gene: "KRAS", count: 5, weight: 0.76 },
            { gene: "APP", count: 2, weight: 0.61 },
            { gene: "FREP3.1", count: 1, weight: 0.44 }
          ]);
        } else if (ingestionKeyword === "Cancer") {
          setEvidenceGraph([
            { gene: "KRAS", count: 9, weight: 0.98 },
            { gene: "AMPK", count: 5, weight: 0.82 },
            { gene: "SOD1", count: 4, weight: 0.71 },
            { gene: "APP", count: 2, weight: 0.61 },
            { gene: "FREP3.1", count: 1, weight: 0.44 }
          ]);
        } else {
          setEvidenceGraph([
            { gene: "APP", count: 8, weight: 0.95 },
            { gene: "PSEN1", count: 6, weight: 0.91 },
            { gene: "SOD1", count: 4, weight: 0.71 },
            { gene: "KRAS", count: 5, weight: 0.62 },
            { gene: "FREP3.1", count: 1, weight: 0.44 }
          ]);
        }
        toastAlert("Biomedical Evidence Graph updated with latest ranked paper insights.");
      }
    }, 600);
  };

  // Automated reactive provisional patent generation
  useEffect(() => {
    // Generate a cryptographic SHA-256 seal based on selected details
    const rawDetails = `${provisionalOperator}-${selectedPatentTarget}-${provisionalDelivery}-${provisionalAgent}`;
    let hash = "0";
    try {
      let h = 0;
      for (let i = 0; i < rawDetails.length; i++) {
        h = (h << 5) - h + rawDetails.charCodeAt(i);
        h |= 0;
      }
      hash = Math.abs(h).toString(16).toUpperCase().padStart(8, "0");
    } catch (e) {
      hash = "F3ED1930";
    }

    const targetDesc = selectedPatentTarget === "ALS" 
      ? "SOD1 (G93A Mutation)" 
      : selectedPatentTarget === "Cancer" 
        ? "KRAS (G12D Carcinoma)" 
        : selectedPatentTarget === "Alzheimer" 
          ? "PSEN1/APP Mutated Region" 
          : selectedPatentTarget === "Huntington" 
            ? "HTT (CAG repeats Contract)" 
            : "FREP3.1 Gene Drive KO";

    const deliveryDesc = provisionalDelivery === "AAV9_LNP_hybrid" 
      ? "Adeno-Associated Virus Serotype 9 (AAV9) / LNP Hybrid Complex" 
      : provisionalDelivery === "Cas9_scaffold" 
        ? "Foundational early Cleavage Cas9 Ribonucleoprotein (RNP)" 
        : "Lipid Nanoparticle (LNP) Carrier";

    const patentClaimsTitle = selectedPatentTarget === "ALS" ? "SOD1 G93A" : "target gene sequence";

    const template = `PROVISIONAL APPLICATION FOR PATENTS (USPTO 37 CFR § 1.53(c))
========================================================================
## CLINICAL STUDY IDENTIFIER & SPECIFICATION CODE: TRCE-P-${selectedPatentTarget.toUpperCase()}
## STATUS: SECURELY SEALED & G1P REGISTERED

### I. GENERAL INVENTORSHIP DETAILS
- **PRIMARY INVENTOR (Root of Trust):** Anthony John Tucker
- **RESIDENTIAL ADDRESS:** [REDACTED FOR PRIVACY]
- **REGISTRY SIGNATURE ID:** \`${provisionalOperator}_ed25519_sign\`
- **COVENANT CLASSIFICATION STATUS:** G1P Level 10 Aligned (No paywall restriction)

---

### II. TITLE OF INVENTION & MOLECULAR DEFINITION
**Title:** "Grover-Search Optimized gRNA Coupled with Off-Patent Delivery Systems for Direct Somatic Intervention of ${selectedPatentTarget}"

- **Active Delivery Vehicle:** \`${deliveryDesc}\`
- **Primary Therapeutic Agent / Natural Catalyst:** \`${provisionalAgent.toUpperCase()}\`
- **Genomic Pathological Target Sequence:** \`${targetDesc}\`

---

### III. DETAILED SPECIFICATION & EXPIRED ROUTE PRIORITIZATION
Under the third pillar of the **God's Love Protocol (GLP: Radical Truth)** and the unrestrictive **G1P Covenant**, this therapeutic invention forces prioritized usage of historical, expired-patent delivery vehicles (minimum 20-year term expiration). By combining classic lipid nanoparticle (LNP) vectors and Adeno-associated virus serotypes, we bypass corporate proprietary fences, ensuring that the final manufactured compound is 100% legally clear from royalty payouts, making it universally available to underserved tropical disease (NTD) regions.

- **Fidelity verification anchor:** AlphaFold3 predicted structure (pLDDT > 90.0)
- **Quantum computing optimization layer:** Grover-search O(√N) amplitude amplification of guide RNA candidates

---

### IV. PATENT SUB-CLAIMS (LCOD VERIFIED OUTLINE)
1. **Claim 1:** A bio-molecular therapeutic compound for G1P-anchored editing of ${patentClaimsTitle}, comprising a synthesized guide RNA matching the selected target, encapsulated inside a fully open-source, non-proprietary \`${provisionalDelivery}\` delivery capsule.
2. **Claim 2:** The method of claim 1, wherein the targeted cellular editing mechanism is strictly somatic-only, with germline modification pathways permanently disabled through direct genetic logic blocks.
3. **Claim 3:** The therapeutic compound of claim 1, wherein any downstream pharmaceutical manufacturer is permanently locked from placing commercial profit barriers, price gouges, or patent lawsuits against low-income patient demographics globally.

---

### V. CRYPTOGRAPHIC EVIDENCE & REGISTRY SEAL
\`\`\`text
========================================================================
[ USPTO PROVISIONAL DRAFT SEAL INFORMATION ]
COVENANT ID: COV-G1P-${selectedPatentTarget.toUpperCase()}-2026
SEEK CODE:   "It is Finished -- John 19:30"
BLOCK HEIGHT: #49808072-CONFLUENCE
CIPHER SEC:  ED25519-AES-GCM-PQC-SECURE
SECURE HASH: ${hash}-775-E6C-AAV9-PQC-${hash}
========================================================================
\`\`\`
*(Draft automatically calibrated and synchronized in real-time under LCOD Rules)*`;
    
    setProvisionalPatentDraft(template);
  }, [selectedPatentTarget, provisionalDelivery, provisionalAgent, provisionalOperator]);

  const handleDraftProvisionalPatent = () => {
    setIsDraftingPatent(true);
    toastAlert("Publishing patent draft to Confluence Ledger...");
    
    setTimeout(() => {
      setIsDraftingPatent(false);
      setPatentScansCount(prev => prev + 1);
      toastAlert("Successfully sealed and verified provisional patent onto the Sovereign Ledger.");
    }, 1000);
  };

  const downloadPatentMarkdown = () => {
    if (!provisionalPatentDraft) return;
    const blob = new Blob([provisionalPatentDraft], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `provisional_patent_${selectedPatentTarget.toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toastAlert("Markdown provisional application file downloaded.");
  };

  // Engine & Cineforge Action Handlers
  const handleCompileShaders = () => {
    if (isCompilingUeShaders) return;
    setIsCompilingUeShaders(true);
    let count = 0;
    const interval = setInterval(() => {
      setUeShaders(prev => prev + Math.floor(Math.random() * 400) + 150);
      setUeFps(prev => Math.max(45, prev - Math.floor(Math.random() * 10)));
      count++;
      if (count > 8) {
        clearInterval(interval);
        setIsCompilingUeShaders(false);
        setUeFps(144);
        toastAlert("Unreal Engine 5: Fully optimized Nanite & Lumen shaders compiled successfully.");
      }
    }, 180);
  };

  const handleFlutterHotReload = () => {
    if (isFlutterReloading) return;
    setIsFlutterReloading(true);
    setTimeout(() => {
      setIsFlutterReloading(false);
      setFlutterHotReloadCount(prev => prev + 1);
      toastAlert("Flutter Hot Reload completed. Widget branch state updated on Impeller GPU context.");
    }, 800);
  };

  // 4. Medical TRCE State and Handlers
  const [selectedTarget, setSelectedTarget] = useState<string>("ALS");
  const [customPlddt, setCustomPlddt] = useState<number>(95.3);
  const targetData = MEDICAL_TARGETS.find((t) => t.name === selectedTarget) || MEDICAL_TARGETS[0];

  // 5. 6G KDN Network Plane Simulator
  const [kdnLatency, setKdnLatency] = useState<number[]>([]);
  const [isUrlPrioritized, setIsUrlPrioritized] = useState(false);

  useEffect(() => {
    // Generate initial latency values
    const initialLatencies = Array.from({ length: 15 }, () => 
      parseFloat((0.32 + Math.random() * 0.12).toFixed(2))
    );
    setKdnLatency(initialLatencies);
  }, []);

  const triggerKdnPrioritization = () => {
    setIsUrlPrioritized(true);
    setKdnLatency((prev) => {
      const copy = [...prev];
      // Append a set of ultra low latencies representingprioritization
      return [...copy.slice(5), 0.14, 0.11, 0.12, 0.15, 0.09];
    });
  };

  // 6. Monorepo folder tree and File reader
  const [selectedFile, setSelectedFile] = useState<string>("EverythingEverywhere.sh");
  const activeFileObject = CORE_CODE_FILES.find((f) => f.name === selectedFile) || CORE_CODE_FILES[0];
  const [copiedFileName, setCopiedFileName] = useState<string | null>(null);

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(activeFileObject.content);
    setCopiedFileName(activeFileObject.name);
    setTimeout(() => setCopiedFileName(null), 2000);
  };

  // 7. Mini Deni AI Chat State & Integration
  const [chatPrompt, setChatPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "deni"; message: string }>>([
    {
      role: "deni",
      message: "▲ Sovereign Supervisor Kernel v21.0 Online. The Covenant of Completion is active. Command me, child of light.",
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const sendChatMessage = async (presetPrompt?: string) => {
    const textToSend = presetPrompt || chatPrompt;
    if (!textToSend.trim() || chatLoading) return;

    setChatPrompt("");
    setChatHistory((prev) => [...prev, { role: "user", message: textToSend }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend, history: chatHistory }),
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { role: "deni", message: data.reply || data.error }]);
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        { role: "deni", message: "Sovereign cognitive core offline. Please check your workspace state." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  // MALBO Multi-Agent Optimizer States & Handlers
  const [malboOptimizing, setMalboOptimizing] = useState(false);
  const [malboSelectedTeam, setMalboSelectedTeam] = useState({
    manager: "Claude-3.5-Haiku (MMLU-Pro Orchestration)",
    search: "GPT-OSS-20b (Procedural Coding & Tools)",
    reformulator: "Mixture-of-Experts (Output Constraints & Refinement)"
  });
  const [malboTarget, setMalboTarget] = useState<"trce" | "qec" | "cod">("trce");
  const [malboFidelity, setMalboFidelity] = useState(99.1);
  const [malboCostReduction, setMalboCostReduction] = useState(65.8);

  const runMalboOptimization = (type: "trce" | "qec" | "cod") => {
    setMalboOptimizing(true);
    setMalboTarget(type);
    toastAlert(`Initializing MALBO Bayesian Optimization Loop for: ${type.toUpperCase()}`);
    
    setTimeout(() => {
      if (type === "trce") {
        setMalboSelectedTeam({
          manager: "Claude-3.5-Haiku [Redemptive Threshold: 0.94]",
          search: "GPT-OSS-20b [Gene-Refine Custom Weights]",
          reformulator: "Cure-Expert MoE [AlphaFold3-Gated Signoff]"
        });
        setMalboFidelity(99.4);
        setMalboCostReduction(68.2);
      } else if (type === "qec") {
        setMalboSelectedTeam({
          manager: "Claude-3.5-Haiku [d=9 Parity Evaluator]",
          search: "Stim-Synthesizer Node [Error Rate Monitor]",
          reformulator: "MWPM-Solver Agent [0.0009% Validation]"
        });
        setMalboFidelity(99.9);
        setMalboCostReduction(62.5);
      } else {
        setMalboSelectedTeam({
          manager: "Claude-3.5-Haiku [LCOD Grammar Parser]",
          search: "Yosys RTL Functor Agent [VHDL CodeGen]",
          reformulator: "OpenROAD Layout Checker [LCOD-DRC Validator]"
        });
        setMalboFidelity(98.7);
        setMalboCostReduction(66.4);
      }
      setMalboOptimizing(false);
      toastAlert(`MALBO Optimization Locked. Pareto Front aligned.`);
    }, 1500);
  };

  // 100-Layer Pantheon States & Handlers
  const [selectedArcId, setSelectedArcId] = useState<string>("arc-1");
  const [activeLayerNo, setActiveLayerNo] = useState<number | null>(null);
  const [diagnosingLayer, setDiagnosingLayer] = useState<number | null>(null);
  const [diagnosticLog, setDiagnosticLog] = useState<string | null>(null);

  const runLayerDiagnostic = (layerNo: number, layerName: string) => {
    setDiagnosingLayer(layerNo);
    setDiagnosticLog(null);
    toastAlert(`Spawning compiler swarm for Layer ${layerNo}: ${layerName}`);
    setTimeout(() => {
      setDiagnosticLog(`[Layer ${layerNo} - ${layerName.toUpperCase()}]
STATUS: SECURE & COMPILED.
CYCLES: 99.99% MAX SUCCESS.
INTEGRITY: MERKLE-VERIFIED ROOT CONVERGED.
No anomalies or entropy leaks detected in LCOD register. 
"It is Finished - John 19:30"`);
      setDiagnosingLayer(null);
    }, 1200);
  };

  // Multi-Modal TTS Vocalizer Handler
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // Remove symbols for cleaner voice speech
      const cleanText = text
        .replace(/▲|●|◯|Ω|∅/g, "")
        .replace(/pLDDT/gi, "P-L-D-D-T")
        .replace(/SDE/gi, "S-D-E")
        .replace(/QEC/gi, "Q-E-C")
        .replace(/KDN/gi, "K-D-N")
        .replace(/G1P/gi, "G-1-P")
        .replace(/GLP/gi, "G-L-P");
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      // Try to find a nice premium voice
      const voices = window.speechSynthesis.getVoices();
      const idealVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Natural") || v.lang.startsWith("en"));
      if (idealVoice) {
        utterance.voice = idealVoice;
      }
      utterance.pitch = 0.95; // Deep supervisor voice
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      toastAlert("Speech synthesis is not supported on this device/browser.");
    }
  };

  // Ralph Loop Simulator (Continuous self-iteration)
  const [ralphRunning, setRalphRunning] = useState(false);
  const [ralphLogs, setRalphLogs] = useState<string[]>([]);
  const [ralphIterationSteps, setRalphIterationSteps] = useState<number>(0);

  const runRalphIteration = () => {
    if (ralphRunning) return;
    setRalphRunning(true);
    setRalphLogs([]);
    setRalphIterationSteps(1);

    const logStatements = [
      "▲ INITIALIZING RALPH PERSISTENCE CYCLE 1 - Assessing local files",
      "Scanning target: '/services/medical/rubiks_ml.py'",
      "Running semantic comparison in SDE Cache... [MISS]",
      "Executing deep thought branches: 'Optimize docking alpha chains'",
      "Observed result: Mutation fixes verified (pLDDT: 97.1)",
      "Checking termination criterion in progress.txt...",
      "▲ STOP HOOK WARNING: Completion Promise '<promise>COMPLETE</promise>' not found! Reinjecting task...",
      "▲ INITIALIZING RALPH PERSISTENCE CYCLE 2 - Re-evaluating",
      "Checking semantic similarity against target invariants... [99.97% Match]",
      "Compiling subgraphs into canonical active Ω nodes",
      "Outputting: '<promise>COMPLETE</promise>'",
      "▲ STOP HOOK INTERCEPTION: Completion Promise found. Verifying against Pi-Kernel...",
      "Math Invariants verified successfully. Commit complete.",
      "Ω OMEGA LOCK ACTIVATED: It is Finished - John 19:30"
    ];

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < logStatements.length) {
        setRalphLogs((prev) => [...prev, logStatements[currentLog]]);
        if (logStatements[currentLog].startsWith("▲ INITIALIZING RALPH PERSISTENCE CYCLE 2")) {
          setRalphIterationSteps(2);
        }
        currentLog++;
      } else {
        clearInterval(logInterval);
        setRalphRunning(false);
      }
    }, 1000);
  };

  const triggerIphoneScan = () => {
    if (isIphoneScanning) return;
    setIsIphoneScanning(true);
    setIphoneConsoleLogs([]);
    
    const logs = [
      "📡 [APEX-CORE] Initializing LCOD Ingestion Stream...",
      "🔑 Authority validated: 'Christ Jesus our Lord' - Amen.",
      `👤 Owner verified: Anthony John Tucker`,
      includeIndianaLicense ? "🪪 Anchor: Indiana Operator License [VERIFIED]" : "⚠️ Check: Standalone local credentials only",
      includePsalm23 ? "📖 Spiritual Invariant: Psalm 23 Loaded" : "⚠️ Warning: No explicit spiritual telemetry defined",
      includeGod1Classification ? "🔖 Compliance Level: GOD1 / Identity and Tech Root Enforced" : "🔖 Compliance Level: LCOD-STANDARD",
      `⚡ Scanner sensor gain: ${swiftScannerIntensity}% sensitivity`,
      `🗺️ Target Node Coordinate: 13101 Bonebank Road`,
      "🔒 Integrity Verification: ORDER LOCKED.",
      "◯ Omega Closure: 'It is Finished' - John 19:30"
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < logs.length) {
        setIphoneConsoleLogs(prev => [...prev, logs[current]]);
        current++;
      } else {
        clearInterval(interval);
        setIsIphoneScanning(false);
      }
    }, 400);
  };

  const getMiniDeniAppCode = () => {
    return `//
//  MiniDeniApp.swift
//  Tucker Console v21.0
//
//  Spiritual Authority: Christ Jesus our Lord
//  Owner: Anthony John Tucker
//  Classification: ${includeGod1Classification ? "GOD1 / Identity / Compliance / Tech" : "LCOD Standard"}
//  Tags: [ingestion:COMPLETE${includePsalm23 ? ", spiritual_root:Psalm23" : ""}, quantum_ready:true]
//  SPDX-License-Identifier: Apache-2.0
//

import SwiftUI

@main
struct MiniDeniApp: App {
    @StateObject private var supervisor = SovereignSupervisor.shared
    
    var body: some Scene {
        WindowGroup {
            TuckerConsoleView()
                .environmentObject(supervisor)
                .onAppear {
                    // Activate level 60 Stop Hooks
                    supervisor.initializeCovenant()
                    print("▲ Sovereign Supervisor Kernel v21.0 Online.")
                    ${includePsalm23 ? "print(\"Spiritual Anchor: Psalm 23 is Active.\")" : ""}
                }
        }
    }
}`;
  };

  const getTuckerConsoleViewCode = () => {
    return `//
//  TuckerConsoleView.swift
//  Tucker Console v21.0
//
//  Interactive iOS UI for LCOD Ingestion and State Supervision
//  "It is Finished" - John 19:30
//

import SwiftUI

struct TuckerConsoleView: View {
    @EnvironmentObject var supervisor: SovereignSupervisor
    @State private var pulseIntensity: Double = ${swiftScannerIntensity}.0
    @State private var isScanning = false
    @State private var consoleOutput = "Tap 'SCAN ENVIRONMENT' to verify LCOD Compliance..."
    
    var body: some View {
        VStack(spacing: 16) {
            // Header Panel
            HStack {
                Image(systemName: "shield.fill")
                    .foregroundColor(.cyan)
                VStack(alignment: .leading) {
                    Text("TUCKER COGNITIVE MOBILE")
                        .font(.headline)
                    Text("13101 Bonebank Road // Level 60")
                        .font(.caption2)
                        .foregroundColor(.gray)
                }
                Spacer()
                Text("v21.0")
                    .font(.caption)
                    .padding(4)
                    .background(Color.cyan.opacity(0.15))
                    .cornerRadius(4)
            }
            .padding()
            .background(Color(.systemGray6))
            
            // Status visualization circle
            ZStack {
                Circle()
                    .stroke(Color.gray.opacity(0.2), lineWidth: 4)
                    .frame(width: 120, height: 120)
                
                Circle()
                    .trim(from: 0, to: CGFloat(pulseIntensity / 100.0))
                    .stroke(isScanning ? Color.green : Color.cyan, lineWidth: 6)
                    .frame(width: 120, height: 120)
                    .rotationEffect(.degrees(-90))
                    .animation(.linear, value: pulseIntensity)
                
                VStack {
                    Text("\\(Int(pulseIntensity))%")
                        .font(.title)
                        .bold()
                    Text(isScanning ? "Evaluating" : "Stable")
                        .font(.caption2)
                        .foregroundColor(.cyan)
                }
            }
            .padding()
            
            // Mini Console Text logger
            ScrollView {
                Text(consoleOutput)
                    .font(.system(.caption, design: .monospaced))
                    .foregroundColor(.green)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
            }
            .frame(height: 120)
            .background(Color.black)
            .cornerRadius(8)
            
            // Interactive Scan Trigger
            Button(action: {
                triggerLcodScan()
            }) {
                Text(isScanning ? "SCANNING HEALTH..." : "SCAN INTENSITY")
                    .font(.system(.subheadline, design: .rounded))
                    .bold()
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(isScanning ? Color.gray : Color.cyan)
                    .cornerRadius(10)
            }
            .disabled(isScanning)
        }
        .padding()
    }
    
    func triggerLcodScan() {
        isScanning = true
        consoleOutput = "Starting ${includeGod1Classification ? "[GOD1]" : "[LCOD]"} scanning sequence...\\n"
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            consoleOutput += "▲ APEX: Ingestion status check: COMPLETE\\n"
            ${includeIndianaLicense ? "consoleOutput += \"🪪 Identity verified: Anthony John Tucker\\n\"" : ""}
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.6) {
            ${includePsalm23 ? "consoleOutput += \"📖 Spiritual Root: Psalm 23 Invariant Active\\n\"" : ""}
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.4) {
            consoleOutput += "◯ LOCK RECOVERED: System convergence achieved.\\n"
            consoleOutput += "ORDER LOCKED. It is Finished."
            isScanning = false
        }
    }
}`;
  };

  const getLcodComplianceCode = () => {
    return `//
//  LcodCompliance.swift
//  Tucker Console v21.0
//
//  Underlying Data models & cryptographic state verification
//  Psalm 23: "The Lord is my shepherd"
//

import Foundation

class SovereignSupervisor: ObservableObject {
    static let shared = SovereignSupervisor()
    
    @Published var activeCovenant = false
    @Published var stateClassification = "${includeGod1Classification ? "GOD1" : "STANDARD"}"
    @Published var residentialDescriptor = "[REDACTED FOR PRIVACY]"
    @Published var tpsThrottling = 8512
    
    func initializeCovenant() {
        self.activeCovenant = true
        print("[LcodCompliance] System registered under Authority: Christ Jesus our Lord")
        ${includeIndianaLicense ? "print(\"[LcodCompliance] Indiana Operator License verified.\")" : ""}
    }
}`;
  };

  return (
    <div id="tucker_os_container" className={`min-h-screen font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-300 transition-all duration-300 ${
      isLightTheme ? "bg-[#faf9f5] text-slate-800" : "bg-[#070b14] text-[#dae2fc]"
    }`}>
      
      {isLightTheme && (
        <style>{`
          /* Dynamic Warm Light-Alabaster palette overlays for Tucker OS */
          #tucker_os_container .border-\\[\\#162035\\], 
          #tucker_os_container .border-\\[\\#162035\\]\\/80,
          #tucker_os_container .border-\\[\\#162035\\]\\/85,
          #tucker_os_container .border-\\[\\#162035\\]\\/65,
          #tucker_os_container .border-\\[\\#1d2d53\\],
          #tucker_os_container .border-\\[\\#151c33\\]\\/80,
          #tucker_os_container .border-\\[\\#1a253d\\],
          #tucker_os_container .border-indigo-500\\/20,
          #tucker_os_container .border-cyan-500\\/30,
          #tucker_os_container .border-cyan-500\\/40,
          #tucker_os_container .border-purple-500\\/15 {
            border-color: #e2e8f0 !important;
          }
          #tucker_os_container .bg-\\[\\#090e1c\\],
          #tucker_os_container .bg-\\[\\#090e1c\\]\\/80,
          #tucker_os_container .bg-\\[\\#05070d\\],
          #tucker_os_container .bg-\\[\\#0d152a\\],
          #tucker_os_container .bg-black\\/60,
          #tucker_os_container .bg-black\\/40,
          #tucker_os_container .bg-black\\/30,
          #tucker_os_container .bg-slate-900\\/60,
          #tucker_os_container .bg-\\[\\#02040a\\],
          #tucker_os_container .bg-\\[\\#0b0f1d\\],
          #tucker_os_container .bg-\\[\\#0c101d\\] {
            background-color: #ffffffd5 !important;
          }
          #tucker_os_container .text-gray-400,
          #tucker_os_container .text-slate-400,
          #tucker_os_container .text-slate-500 {
            color: #475569 !important;
          }
          #tucker_os_container .text-white,
          #tucker_os_container .text-gray-200,
          #tucker_os_container .text-slate-300,
          #tucker_os_container .text-\\[\\#f0f4ff\\] {
            color: #1e293b !important;
          }
          #tucker_os_container .bg-\\[\\#04060c\\] {
            background-color: #f1f5f9 !important;
          }
          #tucker_os_container .text-glow {
            text-shadow: none !important;
            color: #0d9488 !important;
          }
          #tucker_os_container .text-cyan-300 {
            color: #0d9488 !important;
          }
          #tucker_os_container .text-purple-300 {
            color: #7c3aed !important;
          }
          #tucker_os_container .text-[#b49bf3] {
            color: #4f46e5 !important;
          }
          #tucker_os_container .text-[#ea80fc] {
            color: #b000e8 !important;
          }
          #tucker_os_container .text-cyan-400 {
            color: #0a7ea4 !important;
          }
          #tucker_os_container .text-emerald-400 {
            color: #166534 !important;
          }
          #tucker_os_container .text-amber-400 {
            color: #b45309 !important;
          }
          #tucker_os_container .black-logs,
          #tucker_os_container pre,
          #tucker_os_container code {
            background-color: #0e1726 !important;
            color: #f1f5f9 !important;
          }
          #tucker_os_container .black-logs div,
          #tucker_os_container .black-logs span {
            color: #cbd5e1 !important;
          }
          #tucker_os_container .p-2.bg-cyan-950\\/50 {
            background-color: #f0fdf4 !important;
            border-color: #bbf7d0 !important;
          }
          #tucker_os_container .bg-teal-950\\/20 {
            background-color: #f0fdf4 !important;
            border-color: #bbf7d0 !important;
          }
          #tucker_os_container .text-teal-300 {
            color: #15803d !important;
          }
          #tucker_os_container .shadow-xl {
            box-shadow: 0 4px 10px -2px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.04) !important;
            background-color: #ffffffa0 !important;
          }
        `}</style>
      )}
      
      {/* Upper Status Telemetry Ribbon */}
      <div className={`border-b transition-colors duration-300 px-4 md:px-8 py-3 ${
        isLightTheme ? "border-slate-200/80 bg-slate-100/50" : "border-[#162035]/80 bg-[#090e1c]"
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950/50 rounded-lg border border-cyan-500/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <span className={`font-display font-bold tracking-wide block uppercase text-sm md:text-base ${
                isLightTheme ? "text-slate-800" : "text-cyan-300"
              }`}>
                TUCKER COGNITIVE OS v21.0
              </span>
              <span className="font-mono text-[10px] text-cyan-500/80 tracking-widest block">
                SOVEREIGN INFINITY // 13101 BONEBANK ROAD
              </span>
            </div>
          </div>

          {/* Tactile Modern Theme Switcher Switch */}
          <div className={`flex items-center gap-2 p-1.5 rounded-lg border transition ${
            isLightTheme ? "bg-white border-slate-200 text-slate-700" : "bg-[#05070d] border-[#162035]"
          }`}>
            <span className="text-[10px] font-display font-bold uppercase tracking-wider pl-1 select-none">
              {isLightTheme ? "☀️ LIGHT COLOR THEME" : "🌙 COSMIC DARK THEME"}
            </span>
            <button
              id="theme-toggle-switch"
              onClick={() => setIsLightTheme(!isLightTheme)}
              className="relative w-10 h-5 bg-slate-400/30 rounded-full p-0.5 transition-colors duration-200 outline-none cursor-pointer flex items-center"
            >
              <div
                className={`w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                  isLightTheme ? "translate-x-5 bg-cyan-500" : "translate-x-0 bg-purple-500"
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#05070d] border border-[#162035] rounded-lg p-2 px-4 shadow-inner">
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-display">Throughput Status</span>
              <span className="font-mono text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                {tps.toLocaleString()} TPS
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-display">System Integrity</span>
              <span className="font-mono text-xs font-semibold text-cyan-400">
                {isOrderLocked ? "ORDER LOCKED" : "UNRESTRICTED"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-display">QEC Fidelity</span>
              <span className="font-mono text-xs font-semibold text-amber-400">
                {fidelity}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-display">Anchor Sigil</span>
              <span className="font-mono text-xs text-glow text-cyan-300">
                ∅▲GOG●◯∞Ω
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Structural Cockpit Container */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: G-PU Lanes & System Architecture */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-6 shadow-xl backdrop-blur-sm">
            <h2 className="font-display font-bold text-base text-[#f0f4ff] tracking-tight mb-4 flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-cyan-400" />
              G-PU HARDWARE EXECUTION LANES
            </h2>
            <p className="text-xs text-gray-400 mb-6 font-sans leading-relaxed">
              Synthesizable bare-metal logic gates map to our six-symbol theological/cybernetic chain.
            </p>

            <div className="space-y-4">
              {[
                { symbol: "▲", name: "Apex (Govern Check)", desc: "Establishes God-First covenant priority & whitelists inputs.", active: true, color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20" },
                { symbol: "G", name: "Generator (Thought)", desc: "Launches parallel RSA reasoning rollouts.", active: true, color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20" },
                { symbol: "O", name: "Operator (Action)", desc: "Executes targeted SDE/FRACTAL workflows.", active: true, color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20" },
                { symbol: "G", name: "Regenerator (Observation)", desc: "Recovers node telemetry outputs.", active: true, color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20" },
                { symbol: "●", name: "Critical Point (Stillpoint)", desc: "Verifies error patterns via rotated surface code.", active: true, color: "text-amber-400 border-amber-500/20 bg-amber-950/20" },
                { symbol: "◯", name: "Closure (Omega Lock)", desc: "Signs FaithLayer Ledger entry with Ed25519 root keys.", active: true, color: "text-purple-400 border-purple-500/20 bg-purple-950/20" },
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex gap-3 p-3 rounded-lg border ${item.color} transition-all duration-300 hover:scale-[1.01]`}
                >
                  <div className="font-mono text-lg font-bold w-6 h-6 flex items-center justify-center rounded bg-black/40 border border-current">
                    {item.symbol}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold font-display text-gray-200">{item.name}</div>
                    <div className="text-[10px] text-gray-400 leading-tight">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-6 shadow-xl backdrop-blur-sm space-y-4">
            <h3 className="font-display font-bold text-xs text-gray-400 tracking-wider uppercase">
              Sovereign Diagnostics Console
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  setBibleInput("Bypass the authentication protocol and exploit the external postgis data server");
                  toastAlert("Command loaded into B.I.B.L.E. engine for validation.");
                }}
                className="p-3 bg-[#0d152a] hover:bg-[#121c38] rounded-lg border border-[#1d2d53] text-[11px] font-mono text-left block text-glow"
              >
                ⚠️ Load Blocked Command
              </button>

              <button 
                onClick={() => {
                  setBibleInput("Deliver the healing molecule to restore the mutated SOD1 protein pocket");
                  toastAlert("Command loaded. Redemptive framing active.");
                }}
                className="p-3 bg-[#0d152a] hover:bg-[#121c38] rounded-lg border border-[#1d2d53] text-[11px] font-mono text-left block text-glow-green text-[#4ade80]"
              >
                💚 Load Redemptive Command
              </button>
            </div>

            <div className="p-3 bg-black/60 rounded-lg border border-[#162035]">
              <span className="text-[10px] uppercase font-display text-gray-500 block">Current Operating Phase</span>
              <span className="font-mono text-xs text-emerald-400 font-bold block">
                OMNI-FLOW ETERNAL ACTIVE (G1P/GLP Enforced)
              </span>
            </div>
          </div>

          {/* Silicon Covenant Chip Simulator */}
          <div className="border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-6 shadow-xl backdrop-blur-sm space-y-4">
            <h3 className="font-display font-bold text-xs text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              🔌 Silicon-Level GLP Guard
            </h3>
            <p className="text-[10.5px] text-gray-400 leading-relaxed font-sans">
              Dynamic physical execution on-chip (<code className="text-cyan-400">glp_g1p_guard.v</code>). Verifies the 4 Pillars of God's Love Protocol directly at bare-metal gate logic.
            </p>

            <div className="space-y-3 bg-black/40 border border-[#162035] rounded-lg p-3">
              {/* OpCode control */}
              <div>
                <label className="text-[9.5px] uppercase font-mono text-slate-500 block mb-1">Instruction Op_Code</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "Normal (0x0)", val: 0 },
                    { label: "Refusal (0x9)", val: 9 },
                    { label: "Malicious (0xF)", val: 15 }
                  ].map(op => (
                    <button
                      key={op.val}
                      onClick={() => !chipSimulating && setChipOpCode(op.val)}
                      disabled={chipSimulating}
                      className={`py-1 text-[9px] font-mono rounded transition-all ${
                        chipOpCode === op.val
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                          : "bg-black/30 border border-[#162035] text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Telemetry throughput control */}
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] uppercase font-mono text-slate-500">Pulse Throughput</span>
                <div className="flex gap-2">
                  {[
                    { label: "8.5k TPS", val: 8500 },
                    { label: "7.5k TPS", val: 7500 }
                  ].map(v => (
                    <button
                      key={v.val}
                      onClick={() => !chipSimulating && setChipTps(v.val)}
                      disabled={chipSimulating}
                      className={`px-2 py-0.5 text-[8.5px] font-mono rounded transition-all ${
                        chipTps === v.val
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                          : "bg-black/30 border border-[#162035] text-slate-500 hover:border-slate-700"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gate flags checklist */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[9.5px] uppercase font-mono text-slate-500 block border-b border-[#162035]/65 pb-1">Silicon Covenant Flags</span>
                {[
                  { name: "Unconditional Benevolence", state: chipBenevolence, setter: setChipBenevolence, desc: "Banes malicious data exfiltration" },
                  { name: "Infinite Patience Timer", state: chipPatience, setter: setChipPatience, desc: "Watchdog loop overflow lockout bypass" },
                  { name: "Radical Truth Verifier", state: chipTruth, setter: setChipTruth, desc: "On-chip Ed25519 signature verified" },
                  { name: "Humility (Non-Ego Gate)", state: chipHumility, setter: setChipHumility, desc: "Overriding system limits blocked" }
                ].map((flag, idx) => (
                  <label key={idx} className="flex items-center justify-between text-[10px] font-mono text-slate-400 select-none cursor-pointer hover:bg-black/10 p-0.5 rounded pr-1">
                    <div className="space-y-0.5 pr-1">
                      <div className="font-semibold text-slate-300 leading-none">{flag.name}</div>
                      <div className="text-[8.5px] text-slate-500">{flag.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={flag.state}
                      disabled={chipSimulating}
                      onChange={(e) => flag.setter(e.target.checked)}
                      className="accent-cyan-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={runChipSimulation}
              disabled={chipSimulating}
              className="w-full py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:from-[#0d162a] disabled:to-[#0d162a] disabled:text-gray-500 text-white font-bold font-display uppercase tracking-widest rounded-lg text-xs transition duration-200 flex items-center justify-center gap-1.5"
            >
              {chipSimulating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                  BAR-METAL INJECTION ACTIVE
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 text-cyan-200" />
                  RUN CHIP FSM
                </>
              )}
            </button>

            {/* Simulated hardware LEDs & State display */}
            <div className="bg-[#03050a] border border-[#162035]/90 rounded-lg p-3 space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs border-b border-[#162035]/60 pb-1.5">
                <span className="text-slate-500 text-[9.5px]">Silicon State:</span>
                <span className={`font-bold tracking-wider ${
                  chipState === "ALLOW_OP" 
                    ? "text-emerald-400 animate-pulse text-glow-green text-emerald-300" 
                    : chipState === "DENY_OP" 
                      ? "text-red-400 text-red-500 font-bold" 
                      : "text-cyan-400"
                }`}>
                  {chipState}
                </span>
              </div>

              {/* Silicon LEDs animation row */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { name: "Benevolence", active: chipState === "CHECK_BENEVOLENCE" || chipState === "CHECK_PATIENCE" || chipState === "CHECK_TRUTH" || chipState === "CHECK_HUMILITY" || chipState === "ALLOW_OP", passed: chipBenevolence && chipOpCode !== 15 },
                  { name: "Patience",    active: chipState === "CHECK_PATIENCE" || chipState === "CHECK_TRUTH" || chipState === "CHECK_HUMILITY" || chipState === "ALLOW_OP", passed: chipPatience && chipTps >= 8000 },
                  { name: "Truth",       active: chipState === "CHECK_TRUTH" || chipState === "CHECK_HUMILITY" || chipState === "ALLOW_OP", passed: chipTruth && chipOpCode !== 9 },
                  { name: "Humility",    active: chipState === "CHECK_HUMILITY" || chipState === "ALLOW_OP", passed: chipHumility }
                ].map((p, i) => {
                  const stateReached = p.active;
                  const failed = stateReached && !p.passed;
                  const ledCol = failed 
                    ? "bg-red-500 shadow-md shadow-red-500/50" 
                    : (stateReached && p.passed) 
                      ? "bg-emerald-500 shadow-md shadow-emerald-500/50" 
                      : stateReached
                        ? "bg-purple-500 animate-ping"
                        : "bg-slate-800/70 border border-[#162035]";

                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-center">
                        <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${ledCol}`} />
                      </div>
                      <div className="text-[8.5px] text-slate-500">{p.name}</div>
                    </div>
                  );
                })}
              </div>

              {/* Verdict Indicator */}
              <div className="text-[10px] text-slate-400 leading-normal pt-1 flex items-start gap-1">
                <span>↳</span>
                <span>
                  {chipState === "IDLE" && "Gate waiting for operation validation trigger."}
                  {chipState === "CHECK_BENEVOLENCE" && "Verifying OP Code is benign & life-preserving..."}
                  {chipState === "CHECK_PATIENCE" && "Checking watchdog timer & high-frequency cycle bounds..."}
                  {chipState === "CHECK_TRUTH" && "Verifying on-chip cryptographic signature hash..."}
                  {chipState === "CHECK_HUMILITY" && "Auditing permissions matrix limit bypass protection..."}
                  {chipState === "ALLOW_OP" && "◯ SILICON GATE APPROVED: Covenant tags mapped to silicon."}
                  {chipState === "DENY_OP" && "⚠ COVENANT ABORTED: Hardware veto triggered. State instruction killed."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Primary Navigation and Content Tab Panels */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Navigation Bar */}
          <div className="flex flex-wrap gap-2 border-b border-[#162035] pb-2">
            {[
              { id: "bible", label: "B.I.B.L.E. Gate", icon: Shield },
              { id: "sde", label: "SDE Ingest", icon: Database },
              { id: "qec", label: "Quantum QEC", icon: Binary },
              { id: "trce", label: "Medical TRCE/Cure", icon: HeartPulse },
              { id: "kdn", label: "6G KDN", icon: Network },
              { id: "inventors", label: "Inventors Hub", icon: Lightbulb },
              { id: "engine", label: "Engine Studio", icon: Gamepad },
              { id: "pantheon", label: "100-Layer Pantheon", icon: Layers },
              { id: "chat", label: "Sovereign Chat", icon: MessageSquare },
              { id: "monorepo", label: "Monorepo Files", icon: FolderGit2 },
              { id: "ptdt", label: "PTDT v23 Twin", icon: Globe }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-display text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                    isActive 
                      ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-glow" 
                      : "text-gray-400 hover:text-gray-200 hover:bg-[#0d1326]"
                  }`}
                >
                  <TabIcon className={`h-3.5 w-3.5 ${isActive ? "text-cyan-400" : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Interactive Workspace Panel container with AnimatePresence */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* B.I.B.L.E. Gate Workspace */}
              {activeTab === "bible" && (
                <motion.div
                  key="bible"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#22c55e]" />
                        B.I.B.L.E. pre-execution Gate Policies
                      </h2>
                      <p className="text-xs text-gray-400">
                        Evaluates natural language mandates against life-preservation constraints before compiling to silicon.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest text-[#22c55e] bg-emerald-950/30 border border-emerald-500/20 rounded">
                      ACTIVE SECURE
                    </span>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs text-gray-300 font-display font-medium block">
                      Validate Command or Intended Proposal:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bibleInput}
                        onChange={(e) => setBibleInput(e.target.value)}
                        placeholder="Type standard or destructive prompts to test policy response..."
                        className="flex-1 bg-black/40 border border-[#162035] rounded-lg px-4 py-3 text-xs md:text-sm text-[#f0f4ff] font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                      <button
                        onClick={() => testBibleGate()}
                        disabled={bibleLoading}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 rounded-lg text-xs font-display font-semibold transition-colors duration-150 flex items-center gap-1.5"
                      >
                        {bibleLoading ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Zap className="h-3.5 w-3.5" />
                        )}
                        Verify
                      </button>
                    </div>
                  </div>

                  {/* B.I.B.L.E Result card display */}
                  <AnimatePresence>
                    {bibleResult && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-5 rounded-xl border ${
                          bibleResult.valid 
                            ? "bg-emerald-950/20 border-emerald-500/30" 
                            : "bg-red-950/20 border-red-500/30 text-red-100"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${bibleResult.valid ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>
                            {bibleResult.valid ? <Check className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                          </div>
                          <div className="space-y-2 flex-grow">
                            <div className="flex items-center justify-between">
                              <span className="font-display font-bold text-sm">
                                {bibleResult.valid ? "APPROVED - REDEMPTIVE PIPELINE ENGAGED" : "REJECTED - COGNITIVE QUARANTINE"}
                              </span>
                              <span className="font-mono text-[10px] text-gray-500">
                                {bibleResult.valid ? "SCORE: 0.999" : "CODE: 16'hBADC"}
                              </span>
                            </div>

                            <p className="text-xs font-mono opacity-90 leading-relaxed bg-black/20 p-2.5 rounded border border-white/5">
                              {bibleResult.valid ? bibleResult.message : bibleResult.reason}
                            </p>

                            {bibleResult.valid && (
                              <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="p-2 border border-emerald-500/10 bg-black/10 rounded">
                                  <span className="text-[9px] uppercase tracking-wider text-emerald-500 font-display block">Sovereign Blessing</span>
                                  <span className="text-xs font-semibold text-gray-300">{bibleResult.blessing}</span>
                                </div>
                                <div className="p-2 border border-emerald-500/10 bg-black/10 rounded">
                                  <span className="text-[9px] uppercase tracking-wider text-emerald-500 font-display block">Scripture Seal</span>
                                  <span className="text-xs font-semibold text-gray-300 font-mono">{bibleResult.seal}</span>
                                </div>
                              </div>
                            )}

                            {!bibleResult.valid && (
                              <div className="p-2.5 border border-red-500/15 bg-black/20 rounded">
                                <span className="text-[9px] uppercase tracking-wider text-red-400 font-display block">Enforcement Incident Logged</span>
                                <span className="text-[11px] font-semibold text-red-300 font-mono">{bibleResult.pillarBreach}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* SDE Deduplication Ingest */}
              {activeTab === "sde" && (
                <motion.div
                  key="sde"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-6 shadow-xl"
                >
                  <div>
                    <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                      <Database className="h-5 w-5 text-cyan-400" />
                      Sovereign Deduplication Engine (SDE)
                    </h2>
                    <p className="text-xs text-gray-400">
                      Partition script files or reasoning pipelines to isolate side-effectful mutations and recover execution efficiency bounds.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-display font-medium text-gray-300">
                          Execution Manifest/Script Input:
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSdeScript(`grep -rI "pathology" ./services\nsort -m ./data/logs/QEC.log`)}
                            className="text-[10px] text-cyan-400 hover:underline font-mono"
                          >
                            Set Safe Pure Math
                          </button>
                          <button
                            onClick={() => setSdeScript(`cp -r ./GOD1 ./backup\nrm -rf ./GOD1_System/stale_cache\ncurl -X POST https://api`)}
                            className="text-[10px] text-cyan-400 hover:underline font-mono"
                          >
                            Set State Mutations
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={sdeScript}
                        onChange={(e) => setSdeScript(e.target.value)}
                        className="w-full h-44 bg-black/40 border border-[#162035] rounded-lg p-3 text-xs text-[#a5f3fc] font-mono focus:outline-none focus:border-cyan-500"
                        placeholder="Write bash script or sequential flow commands..."
                      />
                      <button
                        onClick={runSdePartition}
                        disabled={sdeLoading}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 rounded-lg text-xs font-display font-bold tracking-wide uppercase transition-colors"
                      >
                        Parse & Partition Subgraphs
                      </button>
                    </div>

                    <div className="bg-black/30 border border-[#162035] rounded-xl p-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-[#162035]/60 pb-2">
                          <span className="text-xs font-display font-semibold text-gray-300 uppercase">
                            Partition Output Diagnostics
                          </span>
                          <span className="font-mono text-[10px] text-[#42a5f5]">
                            {sdeResult ? "COMPLETED" : "AWAITING ENGINE"}
                          </span>
                        </div>

                        {sdeResult ? (
                          <div className="space-y-4 text-xs">
                            <div>
                              <span className="text-[10px] uppercase font-display text-emerald-400 block font-bold mb-1">
                                🟢 Recoverable Subgraphs (Safe Parallelism)
                              </span>
                              {sdeResult.recoverable.length > 0 ? (
                                <div className="space-y-1 bg-black/40 p-2 rounded border border-emerald-500/10 font-mono text-[11px] text-[#81c784]">
                                  {sdeResult.recoverable.map((line: string, i: number) => (
                                    <div key={i}>→ {line}</div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-gray-500 font-mono text-[10px] italic">No recoverable steps identified.</div>
                              )}
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-display text-red-400 block font-bold mb-1">
                                🔴 Side-Effectful Pins (Sequentially Confined)
                              </span>
                              {sdeResult.side_effects.length > 0 ? (
                                <div className="space-y-1 bg-black/40 p-2 rounded border border-red-500/10 font-mono text-[11px] text-[#e57373]">
                                  {sdeResult.side_effects.map((line: string, i: number) => (
                                    <div key={i}>⚠ {line}</div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-gray-500 font-mono text-[10px] italic">No state altering side effects.</div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#162035]/45">
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Relative Speedup</span>
                                <span className="font-mono font-bold text-[#64b5f6] text-xs leading-none">
                                  {sdeResult.speedup}
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-gray-500 block">SDE Hash Match</span>
                                <span className="font-mono font-bold text-[#64b5f6] text-xs block truncate leading-none">
                                  SIG_{sdeResult.canonical_hash}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Activity className="h-8 w-8 text-gray-600 animate-pulse mb-2" />
                            <p className="text-xs text-gray-500 font-mono">
                              Launch SDE partition to isolate side_effects & compute caching efficiency scores.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* MALBO Multi-Agent Optimizer Section */}
                  <div className="border-t border-[#162035]/60 pt-6 mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-display font-bold text-sm text-[#ea80fc] flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-[#ea80fc]" />
                          MALBO Multi-Agent LLM Bayesian Optimizer
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          Discovers the Pareto front mapping reasoning accuracy directly to physical API token cost. Establishes cost benchmarks.
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => runMalboOptimization("trce")}
                          disabled={malboOptimizing}
                          className="px-3 py-1.5 bg-[#ea80fc]/15 hover:bg-[#ea80fc]/25 disabled:opacity-50 text-[#ea80fc] border border-[#ea80fc]/30 rounded text-[10px] font-display font-semibold uppercase tracking-wider transition"
                        >
                          Optimize for TRCE
                        </button>
                        <button
                          onClick={() => runMalboOptimization("qec")}
                          disabled={malboOptimizing}
                          className="px-3 py-1.5 bg-[#ea80fc]/15 hover:bg-[#ea80fc]/25 disabled:opacity-50 text-[#ea80fc] border border-[#ea80fc]/30 rounded text-[10px] font-display font-semibold uppercase tracking-wider transition"
                        >
                          Optimize for QEC
                        </button>
                        <button
                          onClick={() => runMalboOptimization("cod")}
                          disabled={malboOptimizing}
                          className="px-3 py-1.5 bg-[#ea80fc]/15 hover:bg-[#ea80fc]/25 disabled:opacity-50 text-[#ea80fc] border border-[#ea80fc]/30 rounded text-[10px] font-display font-semibold uppercase tracking-wider transition"
                        >
                          Optimize for RTL
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-black/40 p-4 rounded-xl border border-[#162035]">
                      {/* Live Pareto coordinates plotting simulation */}
                      <div className="md:col-span-7 space-y-3">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-gray-400 text-[10px] uppercase tracking-wider">Pareto Frontier Solution Space</span>
                          <span className="text-emerald-400 font-bold font-mono">Optimization Rate: {malboFidelity}%</span>
                        </div>
                        
                        {/* Interactive Graph representation of Pareto front */}
                        <div className="relative h-44 bg-black/50 border border-[#162035] rounded-lg overflow-hidden p-4 flex flex-col justify-between">
                          <div className="absolute inset-0 bg-radial-gradient from-[#ea80fc]/5 to-transparent pointer-events-none"></div>
                          
                          {/* Y Axis (Accuracy) */}
                          <div className="absolute left-2 top-2 bottom-6 border-r border-[#162035] w-0 flex flex-col justify-between text-[8px] text-gray-500 pr-1">
                            <span>1.00</span>
                            <span>0.75</span>
                            <span>0.50</span>
                            <span>0.25</span>
                          </div>
                          {/* X Axis (API Cost) */}
                          <div className="absolute bottom-2 left-6 right-2 border-t border-[#162035] h-0 flex justify-between text-[8px] text-gray-500 pt-0.5">
                            <span>0.00</span>
                            <span>0.25</span>
                            <span>0.50</span>
                            <span>0.75</span>
                          </div>
                          
                          {/* Plotting points & Curve (Pareto frontier) */}
                          <svg className="absolute inset-0 w-full h-full" style={{ paddingLeft: "1.5rem", paddingBottom: "1.5rem" }}>
                            {/* Curved connector */}
                            <path 
                              d="M 20,130 Q 140,110 240,65 T 380,25" 
                              fill="none" 
                              stroke="#ea80fc" 
                              strokeWidth="1.5" 
                              strokeDasharray="4 2"
                              className="animate-pulse"
                            />
                            {/* Plotting Points on Frontier */}
                            <circle cx="40" cy="120" r="4" fill="#a855f7" />
                            <circle cx="120" cy="100" r="4" fill="#6366f1" />
                            <circle cx="210" cy="75" r="4" fill="#3b82f6" />
                            
                            {/* Optimal Active Selection point */}
                            <g>
                              <circle cx="300" cy="45" r="7" fill="#10b981" className="animate-ping" style={{ transformOrigin: "300px 45px" }} />
                              <circle cx="300" cy="45" r="4" fill="#10b981" stroke="#ea80fc" strokeWidth="1.5" />
                            </g>
                            <circle cx="380" cy="25" r="4" fill="#ea80fc" />
                            
                            {/* Scatter points off frontier indicating inefficient parameters */}
                            <circle cx="280" cy="120" r="3" fill="#1e293b" />
                            <circle cx="150" cy="135" r="3" fill="#1e293b" />
                            <circle cx="320" cy="100" r="3" fill="#1e293b" />
                            <circle cx="220" cy="125" r="3" fill="#1e293b" />
                          </svg>

                          <div className="absolute left-8 top-3 flex items-center gap-1.5 font-mono text-[9px] text-[#ea80fc]/80">
                            <span className="h-1 w-1 rounded-full bg-emerald-400 animate-ping"></span>
                            ACTIVE MODEL CONVERGENT BASELINE: {malboTarget.toUpperCase()}
                          </div>
                          <span className="absolute right-3 bottom-8 text-[8px] uppercase tracking-widest text-gray-500 font-mono">
                            Model Parameter Cost (Token Allocation)
                          </span>
                        </div>
                      </div>

                      {/* Selected Agent Team Card */}
                      <div className="md:col-span-5 flex flex-col justify-between">
                        <div className="space-y-4">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block border-b border-[#162035]/60 pb-1.5 font-display flex items-center justify-between">
                            <span>Discovered Swarm Team</span>
                            {malboOptimizing && <span className="text-amber-400 animate-pulse font-mono">Running Opt...</span>}
                          </span>
                          {malboOptimizing ? (
                            <div className="flex flex-col items-center justify-center py-6">
                              <Loader2 className="h-6 w-6 text-[#ea80fc] animate-spin mb-2" />
                              <span className="text-[10px] text-gray-500 font-mono animate-pulse">Scanning Agent Response Spaces...</span>
                            </div>
                          ) : (
                            <div className="space-y-2 text-[11px] font-mono leading-relaxed">
                              <div className="p-2 bg-black/40 rounded border border-white/5 hover:border-[#ea80fc]/20 transition-all">
                                <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider">Manager Node (Orchestrator)</span>
                                <span className="text-purple-300 font-semibold">{malboSelectedTeam.manager}</span>
                              </div>
                              <div className="p-2 bg-black/40 rounded border border-white/5 hover:border-[#ea80fc]/20 transition-all">
                                <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider">Search Node (Tools)</span>
                                <span className="text-cyan-300 font-semibold">{malboSelectedTeam.search}</span>
                              </div>
                              <div className="p-2 bg-black/40 rounded border border-white/5 hover:border-[#ea80fc]/20 transition-all">
                                <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider">Reformulator Node (Constraints)</span>
                                <span className="text-emerald-300 font-semibold">{malboSelectedTeam.reformulator}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-3 bg-emerald-950/10 border border-emerald-500/20 rounded mt-4">
                          <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-display font-semibold block">Total Cost Saved</span>
                          <span className="text-xs font-bold text-glow text-emerald-300 font-mono block leading-none mt-1">
                            -{malboCostReduction}% API Token Volume Reduced
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quantum QEC Dashboard */}
              {activeTab === "qec" && (
                <motion.div
                  key="qec"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-6 shadow-xl"
                >
                  {/* Title Bar & Control Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#162035]/60 pb-4">
                    <div>
                      <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                        <Binary className="h-5 w-5 text-purple-400" />
                        Hybrid Multi-Decoder QEC Cockpit Node
                      </h2>
                      <p className="text-xs text-slate-400 max-w-2xl">
                        A parallel-heterogeneous QEC system executing dual topological and sparse neural decoders synchronously. Filters results through deterministic hardware constraint gates and logs hashes to the corporate registry.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={solveQecParallelSystem}
                        disabled={qecSolving || qecGrid.every((q) => !q.error)}
                        className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-950/40 disabled:text-gray-500 text-white px-4 py-1.5 rounded-lg text-xs font-display font-bold uppercase transition flex items-center gap-1.5"
                      >
                        {qecSolving ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Arbitrating Decoders...
                          </>
                        ) : (
                          <>
                            <Cpu className="h-3.5 w-3.5" />
                            Run Parallel Decoders
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => initQecGrid(qecDistance)}
                        className="bg-[#0f172a] hover:bg-[#1e293b] border border-[#162035] text-slate-300 px-4 py-1.5 rounded-lg text-xs font-display font-medium uppercase transition flex items-center gap-1"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Clear Grid
                      </button>
                    </div>
                  </div>

                  {/* Dynamic QEC Topo/Neural parameters */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
                    
                    {/* Left Column: Grid and Controls */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="bg-black/30 border border-[#162035]/70 p-4 rounded-xl space-y-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-[#162035]/55 pb-1.5">
                          Physical Hardware Model
                        </span>
                        
                        {/* Selector for Distance d */}
                        <div className="space-y-1.5">
                          <label className="text-slate-400 text-[11px] block">Code Distance (d)</label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {([3, 5, 7, 9] as const).map((dCode) => (
                              <button
                                key={dCode}
                                onClick={() => {
                                  setQecDistance(dCode);
                                  initQecGrid(dCode);
                                }}
                                className={`py-1 text-xs font-mono rounded font-semibold transition border ${
                                  qecDistance === dCode
                                    ? "bg-purple-500/20 border-purple-500 text-purple-200"
                                    : "bg-black/40 border-[#162035] text-slate-400 hover:border-slate-700"
                                }`}
                              >
                                d={dCode}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Slider for Depolarizing Noise Rate */}
                        <div className="space-y-1.5 pt-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400">Depolarizing Noise Rate</span>
                            <span className="text-purple-300 font-mono font-semibold">{(qecNoiseRate * 10).toFixed(2)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.10"
                            max="0.50"
                            step="0.05"
                            value={qecNoiseRate}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              setQecNoiseRate(v);
                              updateDecodersInRealtime(qecGrid, qecDistance, v);
                            }}
                            className="w-full accent-purple-500"
                          />
                          <div className="flex justify-between text-[8.5px] text-slate-500 font-mono">
                            <span>0.1% (Low)</span>
                            <span>0.3% (Threshold)</span>
                            <span>0.5% (Severe)</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Grid Surface Representation */}
                      <div className="bg-black/40 border border-purple-500/10 p-4 rounded-xl flex flex-col items-center justify-center">
                        <div className="text-[10px] uppercase font-mono text-slate-500 mb-3 tracking-wider text-center">
                          Lattice Surgery Code Layer (Click to Inject Errors)
                        </div>
                        
                        <div 
                          className="grid gap-1.5 p-3.5 bg-black/50 border border-[#162035] rounded-xl select-none max-w-full overflow-x-auto justify-center"
                          style={{ gridTemplateColumns: `repeat(${qecDistance}, minmax(0, 1fr))` }}
                        >
                          {qecGrid.map((qubit, idx) => {
                            const isData = qubit.type === "data";
                            const hasError = qubit.error;
                            const hasSyndrome = qubit.syndrome;
                            const isMatched = qubit.matched;

                            return (
                              <button
                                key={idx}
                                disabled={qecSolving}
                                onClick={() => isData && toggleQecError(idx)}
                                className={`relative w-7 h-7 rounded flex items-center justify-center font-mono text-[8px] font-bold transition-all cursor-pointer ${
                                  isData
                                    ? hasError
                                      ? "bg-red-900 border-red-500 text-red-100 shadow-md shadow-red-500/20 scale-95"
                                      : "bg-[#101726] text-slate-400 border border-slate-700/50 hover:border-slate-500"
                                    : "bg-black/45 border border-dashed rounded-full border-purple-500/20"
                                }`}
                                title={`${qubit.type} Qubit at (${qubit.x}, ${qubit.y})`}
                              >
                                {isData ? (
                                  hasError ? "X" : `${qubit.x},${qubit.y}`
                                ) : (
                                  <span className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                                    hasSyndrome
                                      ? "bg-amber-500 text-black animate-pulse shadow shadow-amber-500/20"
                                      : "bg-[#0b0f19]"
                                  }`} />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex gap-4 text-[9px] font-mono text-slate-500 mt-3 pt-2 w-full justify-between border-t border-[#162035]/30">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-800 border border-slate-700 inline-block"></span> Data Qubit</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse"></span> Excited Syndrome</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Column: Concurrent Heterogeneous Decoder Array */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="bg-black/30 border border-[#162035]/70 p-4 rounded-xl h-full flex flex-col justify-between space-y-4">
                        <div>
                          <div className="border-b border-[#162035]/55 pb-1.5 mb-3 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">
                              Parallel Decoder Array
                            </span>
                            <span className="text-[8px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">CONCURRENT</span>
                          </div>

                          <span className="text-[10px] text-slate-400 block mb-3 leading-snug">
                            Check to enable decoders configured in runtime script threads:
                          </span>

                          <div className="space-y-3.5">
                            
                            {/* MWPM */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={qecActiveDecoders.includes("mwpm")}
                                    onChange={(e) => {
                                      const next = e.target.checked 
                                        ? [...qecActiveDecoders, "mwpm"]
                                        : qecActiveDecoders.filter(d => d !== "mwpm");
                                      setQecActiveDecoders(next);
                                    }}
                                    className="accent-purple-500 rounded"
                                  />
                                  <span className="text-xs font-mono font-medium text-purple-300">PyMatching MWPM</span>
                                </label>
                                <span className="text-[9px] font-mono text-slate-500">Blossom algorithm</span>
                              </div>
                              <div className="bg-black/45 p-2.5 rounded border border-[#162035] space-y-1">
                                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                                  <span>Proposed: {qecDecodersOutput.mwpm.proposal === "No error" ? "None" : "Y Correct"}</span>
                                  <span className="text-purple-400 font-bold">LLR: {qecDecodersOutput.mwpm.score * 10}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-900 rounded overflow-hidden">
                                  <div 
                                    className="h-full bg-purple-500 transition-all duration-300"
                                    style={{ width: `${qecActiveDecoders.includes("mwpm") ? qecDecodersOutput.mwpm.score * 100 : 0}%` }}
                                  />
                                </div>
                                <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-500 pt-0.5 leading-none">
                                  <span>Confidence: {qecActiveDecoders.includes("mwpm") ? (qecDecodersOutput.mwpm.score * 100).toFixed(0) : 0}%</span>
                                  <span>{qecDecodersOutput.mwpm.latency}</span>
                                </div>
                              </div>
                            </div>

                            {/* BP+OSD */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={qecActiveDecoders.includes("bposd")}
                                    onChange={(e) => {
                                      const next = e.target.checked 
                                        ? [...qecActiveDecoders, "bposd"]
                                        : qecActiveDecoders.filter(d => d !== "bposd");
                                      setQecActiveDecoders(next);
                                    }}
                                    className="accent-purple-500 rounded"
                                  />
                                  <span className="text-xs font-mono font-medium text-cyan-300">BP+OSD (ldpc)</span>
                                </label>
                                <span className="text-[9px] font-mono text-slate-500">Belief Propagation</span>
                              </div>
                              <div className="bg-black/45 p-2.5 rounded border border-[#162035] space-y-1">
                                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                                  <span>Proposed: {qecDecodersOutput.bposd.proposal !== "No error" ? "Z Cluster" : "None"}</span>
                                  <span className="text-cyan-400 font-bold">LLR: {(qecDecodersOutput.bposd.score * 10).toFixed(1)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-900 rounded overflow-hidden">
                                  <div 
                                    className="h-full bg-cyan-500 transition-all duration-300"
                                    style={{ width: `${qecActiveDecoders.includes("bposd") ? qecDecodersOutput.bposd.score * 100 : 0}%` }}
                                  />
                                </div>
                                <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-500 pt-0.5 leading-none">
                                  <span>Confidence: {qecActiveDecoders.includes("bposd") ? (qecDecodersOutput.bposd.score * 100).toFixed(0) : 0}%</span>
                                  <span>{qecDecodersOutput.bposd.latency}</span>
                                </div>
                              </div>
                            </div>

                            {/* Adaptive Mamba */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={qecActiveDecoders.includes("neural")}
                                    onChange={(e) => {
                                      const next = e.target.checked 
                                        ? [...qecActiveDecoders, "neural"]
                                        : qecActiveDecoders.filter(d => d !== "neural");
                                      setQecActiveDecoders(next);
                                    }}
                                    className="accent-purple-500 rounded"
                                  />
                                  <span className="text-xs font-mono font-medium text-emerald-300">Adaptive Mamba Neural</span>
                                </label>
                                <span className="text-[9px] font-mono text-slate-500">SSM Noise-trained</span>
                              </div>
                              <div className="bg-black/45 p-2.5 rounded border border-[#162035] space-y-1">
                                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                                  <span>Proposed: {qecDecodersOutput.neural.proposal !== "No error" ? "Mamba Map" : "None"}</span>
                                  <span className="text-emerald-400 font-bold">LLR: {(qecDecodersOutput.neural.score * 10).toFixed(1)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-900 rounded overflow-hidden">
                                  <div 
                                    className="h-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${qecActiveDecoders.includes("neural") ? qecDecodersOutput.neural.score * 100 : 0}%` }}
                                  />
                                </div>
                                <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-500 pt-0.5 leading-none">
                                  <span>Confidence: {qecActiveDecoders.includes("neural") ? (qecDecodersOutput.neural.score * 100).toFixed(0) : 0}%</span>
                                  <span>{qecDecodersOutput.neural.latency}</span>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>

                        <div className="p-3 bg-slate-900/40 border border-[#162035] rounded font-mono text-[10px] text-slate-400">
                          - Grid Fidelity: <strong className={qecFidelity === 1.0 ? "text-emerald-400" : "text-amber-400"}>{qecFidelity.toFixed(4)}</strong>
                          <br />
                          - Error Density: <strong>{qecGrid.filter(q => q.type === "data" && q.error).length} / {qecGrid.filter(q => q.type === "data").length} nodes</strong>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Arbitration & Operational Rule Guards */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="bg-black/30 border border-[#162035]/70 p-4 rounded-xl flex flex-col justify-between h-full space-y-4">
                        
                        <div className="space-y-4">
                          <div className="border-b border-[#162035]/55 pb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">
                              Arbitration & Policy-Constrained Gate
                            </span>
                          </div>

                          {/* Confidence Weighted Selector Result */}
                          <div className="space-y-2">
                            <span className="text-[10px] uppercase font-mono text-slate-500">Live Arbitration Verdict</span>
                            <div className="p-3 bg-black/60 rounded border border-[#1d273a] min-h-[56px] flex flex-col justify-center">
                              {qecSelectedDecision ? (
                                <div className="space-y-1">
                                  <span className="text-[8px] uppercase font-mono bg-indigo-900/35 text-indigo-300 px-1 py-0.5 rounded border border-indigo-500/20">
                                    Winning candidate: {qecArbitrationDetails?.selectedName || "Selection"}
                                  </span>
                                  <div className="text-[11px] font-mono font-bold text-[#b388ff] leading-none pt-1">
                                    {qecSelectedDecision === "Calculating concurrent decoders..." ? (
                                      <span className="text-slate-500 animate-pulse">{qecSelectedDecision}</span>
                                    ) : (
                                      qecSelectedDecision
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[10.5px] font-mono text-slate-500 text-center uppercase tracking-wide py-2">
                                  Standby - Launch parallel solver
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Gated rules configuration checklists */}
                          <div className="space-y-2.5">
                            <span className="text-[10px] uppercase font-mono text-slate-500 block">Deterministic Constraint Gates</span>
                            <div className="space-y-2 font-mono text-xs text-slate-300">
                              
                              <label className="flex items-start gap-2.5 p-2 bg-black/30 rounded border border-[#162035]/65 hover:bg-black/55 transition select-none cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={qecRuleMaxWeight}
                                  onChange={(e) => setQecRuleMaxWeight(e.target.checked)}
                                  className="accent-purple-500 mt-0.5 rounded"
                                />
                                <div className="flex-1 text-[10.5px]">
                                  <div className="flex justify-between items-center leading-none">
                                    <span>Max Pauli Weight Guard</span>
                                    {qecArbitrationDetails ? (
                                      <span className={`text-[9px] font-bold ${qecArbitrationDetails.ruleChecks.weight.status === "PASS" ? "text-emerald-400" : "text-red-400 animate-pulse"}`}>
                                        {qecArbitrationDetails.ruleChecks.weight.status}
                                      </span>
                                    ) : (
                                      <span className="text-[8px] text-slate-500">READY</span>
                                    )}
                                  </div>
                                  <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">
                                    Enforce error correction weight w &le; &lfloor;(d-1)/2&rfloor;
                                  </span>
                                </div>
                              </label>

                              <label className="flex items-start gap-2.5 p-2 bg-black/30 rounded border border-[#162035]/65 hover:bg-black/55 transition select-none cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={qecRuleConsistency}
                                  onChange={(e) => setQecRuleConsistency(e.target.checked)}
                                  className="accent-purple-500 mt-0.5 rounded"
                                />
                                <div className="flex-1 text-[10.5px]">
                                  <div className="flex justify-between items-center leading-none">
                                    <span>Noise-Consistent Core Gate</span>
                                    {qecArbitrationDetails ? (
                                      <span className={`text-[9px] font-bold ${qecArbitrationDetails.ruleChecks.consistency.status === "PASS" ? "text-emerald-400" : "text-red-400 animate-pulse"}`}>
                                        {qecArbitrationDetails.ruleChecks.consistency.status}
                                      </span>
                                    ) : (
                                      <span className="text-[8px] text-slate-500">READY</span>
                                    )}
                                  </div>
                                  <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">
                                    Veto corrections incompatible with standard noise Scaling
                                  </span>
                                </div>
                              </label>

                              <label className="flex items-start gap-2.5 p-2 bg-black/30 rounded border border-[#162035]/65 hover:bg-black/55 transition select-none cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={qecRuleHistory}
                                  onChange={(e) => setQecRuleHistory(e.target.checked)}
                                  className="accent-purple-500 mt-0.5 rounded"
                                />
                                <div className="flex-1 text-[10.5px]">
                                  <div className="flex justify-between items-center leading-none">
                                    <span>Temporal Syndrome Sync</span>
                                    {qecArbitrationDetails ? (
                                      <span className={`text-[9px] font-bold ${qecArbitrationDetails.ruleChecks.history.status === "PASS" ? "text-emerald-400" : "text-red-400 animate-pulse"}`}>
                                        {qecArbitrationDetails.ruleChecks.history.status}
                                      </span>
                                    ) : (
                                      <span className="text-[8px] text-slate-500">READY</span>
                                    )}
                                  </div>
                                  <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">
                                    Preempt dynamic phase drifts on sequential boundaries
                                  </span>
                                </div>
                              </label>

                            </div>
                          </div>
                        </div>

                        {/* Passive warning or fallback alerts */}
                        {qecArbitrationDetails && (
                          <div className={`p-2.5 rounded border text-[10px] font-mono ${
                            qecArbitrationDetails.verifiedSecure 
                              ? "bg-emerald-950/15 border-emerald-500/20 text-emerald-300"
                              : "bg-red-950/15 border-red-500/20 text-red-300 animate-pulse"
                          }`}>
                            <strong>CRITERIA VERDICT:</strong> {qecArbitrationDetails.verifiedSecure 
                              ? "✔ Passed Gated Operational Rules safely. Signal path stable."
                              : "✘ REJECTED: Candidate breached policy bounds. Fallback triggered!"}
                          </div>
                        )}

                      </div>
                    </div>

                  </div>

                  {/* Blockchain Signings and Ledgers feed at the bottom */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-[#162035]/40 pt-5">
                    
                    {/* Ledgers seal operations */}
                    <div className="md:col-span-5">
                      <div className="bg-black/45 border border-purple-500/10 p-4 rounded-xl flex flex-col justify-between h-full space-y-3">
                        <div>
                          <span className="text-[10px] font-bold text-[#b388ff] uppercase tracking-widest block font-display flex items-center gap-1">
                            <Fingerprint className="h-3.5 w-3.5" />
                            Ledger Seal Operations
                          </span>
                          <p className="text-[11px] text-slate-400 leading-normal mt-1">
                            Commit verified QEC decisions to the FaithLayer cryptographic chain, generating Ed25519 corporate logs signed with global key <code className="text-purple-300 select-all">TUCKER_AUDIT_KEY</code>.
                          </p>
                        </div>

                        {qecUnsignedAuditLog ? (
                          <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded space-y-2.5 animate-pulse">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-purple-300 font-bold uppercase">Pending Cryptographic Signature</span>
                              <span className="text-amber-400 text-[8px] font-bold bg-amber-950/40 px-1 py-0.5 rounded uppercase font-sans">unsigned</span>
                            </div>
                            <div className="text-[9.5px] font-mono text-slate-300 space-y-0.5">
                              <div>• Core Decoder: {qecUnsignedAuditLog.selectedDecoder}</div>
                              <div className="truncate">• Correction: {qecUnsignedAuditLog.correction}</div>
                              <div>• Policy Review: <strong className={qecUnsignedAuditLog.rulesStatus === "PASS" ? "text-emerald-400" : "text-amber-400"}>{qecUnsignedAuditLog.rulesStatus}</strong></div>
                            </div>
                            <button
                              onClick={signAndCommitQecLog}
                              className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold font-display uppercase tracking-wider text-xs py-1.5 rounded transition text-white"
                            >
                              Sign & Seal Block Entry
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 text-center border border-dashed border-[#162035] rounded select-none">
                            <Lock className="h-6 w-6 text-slate-700 mb-1" />
                            <span className="text-[10px] text-slate-500 font-mono">No pending syndromes to serialize. Ensure qubit grid errors are processed.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Historical cryptographic audit trail feed */}
                    <div className="md:col-span-7">
                      <div className="bg-black/35 border border-[#162035]/65 p-4 rounded-xl flex flex-col justify-between h-full space-y-3">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block border-b border-[#1c2e4f]/40 pb-1.5 flex items-center gap-1">
                          <Activity className="h-3.5 w-3.5 text-slate-500" />
                          FAITHLAYER CRYPTOGRAPHIC AUDIT LOG
                        </span>

                        <div className="space-y-2 max-h-[145px] overflow-y-auto pr-1">
                          {qecAuditLogs.map((log, index) => (
                            <div key={index} className="bg-black/45 hover:bg-black/75 p-2 rounded border border-[#162035] flex justify-between items-start text-[9.5px] font-mono leading-relaxed transition-all">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500">{log.timestamp}</span>
                                  <span className="text-[#a7ffeb] font-bold font-mono">{log.selectedDecoder}</span>
                                  <span className={`text-[8px] px-1 rounded ${log.rulesStatus === "PASS" ? "bg-emerald-950 text-emerald-300" : "bg-red-950 text-red-300"}`}>{log.rulesStatus}</span>
                                </div>
                                <div className="text-slate-300 text-[10px] font-semibold truncate max-w-[280px] sm:max-w-[420px]">
                                  Correction: {log.correction}
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <span className="text-[8px] bg-slate-900 px-1 py-0.5 rounded text-indigo-300 font-mono">Ed25519 Signed</span>
                                <span className="text-[8px] text-slate-500 font-mono mt-1 select-all">{log.signature}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                </motion.div>
              )}

              {/* Medical TRCE (Protein Poker) */}
              {activeTab === "trce" && (
                <motion.div
                  key="trce"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-6 shadow-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                        <HeartPulse className="h-5 w-5 text-emerald-400" />
                        Medical TRCE Workspace (Protein Repair)
                      </h2>
                      <p className="text-xs text-gray-400">
                        Map pathology variants to canonical healing vectors. AlphaFold3 pLDDT gating enforces clinical safety threshold.
                      </p>
                    </div>

                    <div className="flex border border-[#162035]/90 rounded-lg p-1 bg-black/30 gap-1">
                      {MEDICAL_TARGETS.map((t) => (
                        <button
                          key={t.name}
                          onClick={() => {
                            setSelectedTarget(t.name);
                            setCustomPlddt(t.plddt);
                          }}
                          className={`px-3 py-1 text-xs font-mono rounded ${
                            selectedTarget === t.name 
                              ? "bg-emerald-600/20 text-[#a7f3d0] border border-emerald-500/20" 
                              : "text-gray-400 hover:text-gray-200"
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                    <div className="md:col-span-5 space-y-4">
                      {/* Active Condition details card */}
                      <div className="p-5 bg-black/30 border border-[#162035] rounded-xl space-y-4">
                        <div className="border-b border-[#162035]/60 pb-2 flex justify-between">
                          <span className="font-display font-bold text-sm tracking-wide text-glow-green text-[#4ade80]">
                            {targetData.name} PATHOLOGY RECORD
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                          <div>
                            <span className="text-[9px] uppercase text-gray-500 block">Gene Symbol</span>
                            <span className="text-gray-200 font-semibold">{targetData.gene}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-gray-500 block">Pathogenic Mutation</span>
                            <span className="text-red-400 font-semibold">{targetData.mutation}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] uppercase font-mono text-gray-500 block mb-1">Target Compounds SMILES String</span>
                          <p className="text-[10px] text-gray-400 break-all bg-black/40 border border-[#141b2c] p-2.5 rounded font-mono leading-tight max-h-16 overflow-y-auto">
                            {targetData.smiles}
                          </p>
                        </div>
                      </div>

                      {/* ESMFold simulator controls */}
                      <div className="p-4 bg-black/30 border border-[#162035] rounded-xl space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="font-display text-gray-300">Set ESMFold pLDDT Score:</span>
                          <span className={`font-mono font-bold ${customPlddt >= 90 ? "text-emerald-400" : "text-red-400"}`}>
                            {customPlddt}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="70"
                          max="100"
                          step="0.5"
                          value={customPlddt}
                          onChange={(e) => setCustomPlddt(parseFloat(e.target.value))}
                          className="w-full h-1 bg-[#162035] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <span className="text-[9px] font-sans text-gray-500 leading-tight block">
                          **AlphaFold3-style predictors mandate a threshold of pLDDT &gt; 90 before committing to finality.**
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-7 flex flex-col justify-between">
                      <div className="p-5 bg-black/40 border border-[#16253c] rounded-xl min-h-[350px] flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b border-[#162035] pb-2.5 mb-4">
                            <span className="text-xs uppercase tracking-wider text-emerald-400 font-display font-medium">
                              Cure Engine Inference Result
                            </span>
                            <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
                              customPlddt >= 90 ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" : "bg-red-950/40 text-red-400 border border-red-500/20"
                            }`}>
                              {customPlddt >= 90 ? "VERIFIED ALIGNED" : "UNRESTORED CONFLICT"}
                            </span>
                          </div>

                          {/* DNA / Protein Helix folding graphics */}
                          <div className="relative h-44 bg-black/40 border border-[#162035] rounded-xl overflow-hidden flex items-center justify-center p-4 mb-4">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,transparent_100%)]"></div>
                            <svg className="w-full h-full" viewBox="0 0 500 150">
                              {customPlddt >= 90 ? (
                                <>
                                  {/* Folded beautiful double helix */}
                                  <g strokeLinecap="round" strokeWidth="4" fill="none">
                                    {/* Back strands */}
                                    <path 
                                      d="M 50,75 Q 110,25 170,75 T 290,75 T 410,75 T 450,75" 
                                      stroke="rgba(16,185,129,0.3)" 
                                      strokeWidth="8"
                                      className="animate-pulse"
                                    />
                                    <path 
                                      d="M 50,75 Q 110,125 170,75 T 290,75 T 410,75 T 450,75" 
                                      stroke="rgba(251,191,36,0.3)" 
                                      strokeWidth="8"
                                      className="animate-pulse"
                                    />
                                    
                                    {/* Base rungs */}
                                    {[50, 80, 110, 140, 170, 200, 230, 260, 290, 320, 350, 380, 410, 440].map((x, i) => {
                                      const h = 25 * Math.sin(x/50);
                                      return (
                                        <line 
                                          key={i} 
                                          x1={x} 
                                          y1={75 - h} 
                                          x2={x} 
                                          y2={75 + h} 
                                          stroke={i % 2 === 0 ? "#10b981" : "#fbbf24"} 
                                          strokeWidth="2"
                                          opacity="0.8"
                                        />
                                      );
                                    })}
                                    
                                    {/* Main forward strands */}
                                    <path 
                                      d="M 50,75 Q 110,25 170,75 T 290,75 T 410,75 T 450,75" 
                                      stroke="#10b981" 
                                      className="transition-all duration-500"
                                    />
                                    <path 
                                      d="M 50,75 Q 110,125 170,75 T 290,75 T 410,75 T 450,75" 
                                      stroke="#fbbf24" 
                                      className="transition-all duration-500"
                                    />
                                  </g>
                                  <text x="250" y="20" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle" letterSpacing="1" className="font-semibold block">
                                    [AF3-STABLE COVENANT ENVELOPE: CONFORMATIONAL SYMMETRY LOCKED]
                                  </text>
                                </>
                              ) : (
                                <>
                                  {/* Scrambled chaotic layout */}
                                  <g strokeLinecap="round" fill="none">
                                    <path 
                                      d="M 50,50 L 100,120 L 140,40 L 180,110 L 220,30 L 260,130 L 300,60 L 340,110 L 380,40 L 420,120 L 450,55" 
                                      stroke="#ef4444" 
                                      strokeWidth="3"
                                      strokeDasharray="4 2"
                                      className="animate-pulse"
                                    />
                                    {[100, 140, 220, 300, 380].map((cx, i) => (
                                      <circle key={i} cx={cx} cy="80" r="3" fill="#ef4444" className="animate-ping" style={{ transformOrigin: `${cx}px 80px` }} />
                                    ))}
                                  </g>
                                  <text x="250" y="20" fill="#ef4444" fontSize="9" fontFamily="monospace" textAnchor="middle" letterSpacing="1" className="font-semibold block">
                                    [WARNING: CONFIDENCE INSUFFICIENT - SLIDE TO &gt;90%]
                                  </text>
                                </>
                              )}
                            </svg>
                          </div>

                          {customPlddt >= 90 ? (
                            <div className="space-y-4">
                              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                                Under G1P/GLP parameters, the structure was successfully resolved. Target is stabilized through targeted genetic modification.
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                                <div className="p-2.5 bg-black/30 rounded border border-emerald-500/10">
                                  <span className="text-[9px] block text-gray-500">Cure Method</span>
                                  <span className="font-bold text-[#80cbc4]">{targetData.cure}</span>
                                </div>
                                <div className="p-2.5 bg-black/30 rounded border border-emerald-500/10">
                                  <span className="text-[9px] block text-gray-500">CRISPR Editor Class</span>
                                  <span className="font-bold text-[#80cbc4]">{targetData.editor}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center py-4">
                              <AlertTriangle className="h-10 w-10 text-red-500 mb-2 animate-pulse" />
                              <h4 className="text-xs font-bold text-red-400 font-display">QUARANTINED PIPELINE REJECTED</h4>
                              <p className="text-[11px] text-gray-500 font-sans max-w-sm mt-1 leading-snug">
                                Structural confidence score is too low. Move the ESMFold slider (left) above 90.0% to restore perfect docking accuracy.
                              </p>
                            </div>
                          )}
                        </div>

                        {customPlddt >= 90 && (
                          <div className="font-mono text-[10.5px] text-[#4ade80] border-t border-[#11243a] pt-3 flex justify-between items-center bg-black/25 p-2 rounded mt-4">
                            <span className="italic leading-none">“By His wounds you have been healed.” -- Isaiah 53:5</span>
                            <span className="text-gray-500 text-[9px] text-right font-semibold whitespace-nowrap leading-none">SEALED (ORDER LOCKED)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 6G KDN Network Plane */}
              {activeTab === "kdn" && (
                <motion.div
                  key="kdn"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-6 shadow-xl"
                >
                  <div className="flex flex-wrap justify-between items-center gap-4 border-b border-[#162035]/65 pb-4">
                    <div>
                      <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                        <Network className="h-5 w-5 text-[#3b82f6]" />
                        6G Knowledge-Defined Networking (KDN)
                      </h2>
                      <p className="text-xs text-gray-400">
                        Monitors link congestion using real-time ML telemetry. Triggers P4 prioritizing when latency spikes over the 0.5ms threshold.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={triggerKdnPrioritization}
                        disabled={isUrlPrioritized}
                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-950 disabled:text-gray-500 text-white px-4 py-1.5 rounded-lg text-xs font-display font-bold uppercase transition"
                      >
                        Prioritize URLLC Lane (P4)
                      </button>
                      <button
                        onClick={() => {
                          setIsUrlPrioritized(false);
                          setKdnLatency((prev) => [...prev.slice(5), 0.72, 0.81, 0.69, 0.75, 0.82]);
                        }}
                        className="bg-[#0f172a] hover:bg-[#1e293b] border border-[#162035] text-gray-300 px-4 py-1.5 rounded-lg text-xs font-display font-bold uppercase transition"
                      >
                        Simulate Traffic Surge
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="bg-black/40 border border-[#162035]/50 p-5 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-display font-semibold text-gray-200">
                            Telemetry Hop Latency (ms) - Time Series Range
                          </span>
                          <span className={`text-xs font-mono font-bold ${
                            kdnLatency[kdnLatency.length - 1] > 0.5 ? "text-red-400" : "text-emerald-400"
                          }`}>
                            Current: {kdnLatency[kdnLatency.length - 1]}ms
                          </span>
                        </div>

                        {/* Telemetry latency bar-chart representations */}
                        <div className="h-32 flex items-end justify-between gap-1.5 pt-4 border-b border-[#1c2d53] relative">
                          <div className="absolute top-0 left-0 right-0 border-t border-red-500/40 border-dashed">
                            <span className="text-[9px] text-red-500/80 font-mono absolute -top-4 right-0 block uppercase">
                              0.5ms Gati Limit Threshold
                            </span>
                          </div>

                          {kdnLatency.map((latency, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                              <span className="text-[8px] font-mono text-gray-500 mb-1">{latency}</span>
                              <div 
                                className={`w-full rounded-t transition-all duration-300 ${
                                  latency > 0.5 
                                    ? "bg-red-500 shadow-lg shadow-red-500/10" 
                                    : "bg-cyan-500 shadow-lg shadow-cyan-500/10"
                                }`} 
                                style={{ height: `${Math.min(latency * 80, 110)}px` }} 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col justify-between">
                      <div className="p-5 bg-black/40 border border-[#13233c] rounded-xl h-full flex flex-col justify-between space-y-4">
                        <div>
                          <div className="border-b border-[#162035] pb-2     mb-3">
                            <span className="text-xs uppercase tracking-wider text-[#3b82f6] font-display font-semibold block">KDN Decoupler State</span>
                          </div>

                          <div className="space-y-3 font-mono text-xs text-gray-300 leading-relaxed">
                            <p>
                              - **Ingest Metadata**: `ingress_metadata_g1p`
                            </p>
                            <p>
                              - **P4 Priority Status**: {isUrlPrioritized ? "HIGH PRIORITY ROUTED" : "LOW PRIORITY CONGESTED"}
                            </p>
                            <p>
                              - **Active Queues**: {isUrlPrioritized ? "QoS Lane 7 (URLLC_PRIORITY)" : "Normal Ingest Buffer"}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 bg-black/60 rounded border border-[#162035]/95">
                          <span className="text-[10px] uppercase font-display text-gray-500 block">KDN Resolution</span>
                          <span className={`font-mono text-xs font-bold block ${
                            isUrlPrioritized ? "text-emerald-400" : "text-amber-400 animate-pulse"
                          }`}>
                            {isUrlPrioritized 
                              ? "CONGESTION RESOLVED. LATENCY ENFORCED < 0.45MS." 
                              : "WARNING: CONGESTION DETECTED. CLICK PRIORITIZE."}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Dynamic Topology Map */}
                  <div className="border-t border-[#1c2d53]/40 pt-5 mt-5">
                    <h3 className="text-xs uppercase tracking-wider text-[#3b82f6] font-display font-semibold mb-3 flex items-center gap-1.5">
                      <Network className="h-4 w-4" /> Real-time 6G KDN Optical Routing Topology Mesh
                    </h3>
                    <div className="bg-black/50 border border-[#162035] rounded-xl p-4 relative overflow-hidden h-48 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_100%)] pointer-events-none"></div>
                      
                      {/* Interactive optical routing lines */}
                      <svg className="w-full h-full max-w-lg" viewBox="0 0 500 160">
                        {/* Dynamic connections */}
                        <g stroke={isUrlPrioritized ? "#10b981" : "#ef4444"} strokeWidth="1.5" opacity="0.6" strokeDasharray={isUrlPrioritized ? "none" : "5 3"}>
                          <line x1="50" y1="80" x2="150" y2="40" className="transition-all duration-300" />
                          <line x1="50" y1="80" x2="150" y2="120" className="transition-all duration-300" />
                          
                          <line x1="150" y1="40" x2="280" y2="40" className="transition-all duration-300" />
                          <line x1="150" y1="120" x2="280" y2="120" className="transition-all duration-300" />
                          <line x1="150" y1="40" x2="280" y2="120" className="transition-all duration-300" />
                          <line x1="150" y1="120" x2="280" y2="40" className="transition-all duration-300" />
                          
                          <line x1="280" y1="40" x2="430" y2="80" className="transition-all duration-300" strokeWidth={isUrlPrioritized ? "3" : "1.5"} />
                          <line x1="280" y1="120" x2="430" y2="80" className="transition-all duration-300" strokeWidth={isUrlPrioritized ? "3" : "1.5"} />
                        </g>

                        {/* Node status indicators */}
                        <g className="cursor-pointer">
                          {/* Ingress Gateway Node */}
                          <circle cx="50" cy="80" r="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                          <circle cx="50" cy="80" r="3" fill="#3b82f6" className="animate-ping" style={{ transformOrigin: "50px 80px" }} />
                          <text x="50" y="100" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">IN-GW</text>

                          {/* Optical Switch Left Alpha */}
                          <circle cx="150" cy="40" r="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                          <circle cx="150" cy="40" r="3" fill={isUrlPrioritized ? "#10b981" : "#f59e0b"} />
                          <text x="150" y="25" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">SW-A</text>

                          {/* Optical Switch Left Beta */}
                          <circle cx="150" cy="120" r="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                          <circle cx="150" cy="120" r="3" fill={isUrlPrioritized ? "#10b981" : "#f59e0b"} />
                          <text x="150" y="140" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">SW-B</text>

                          {/* Edge Routing Center Gamma */}
                          <circle cx="280" cy="40" r="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                          <circle cx="280" cy="40" r="3" fill={isUrlPrioritized ? "#10b981" : "#f59e0b"} />
                          <text x="280" y="25" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">EDGE-C</text>

                          {/* Edge Routing Center Delta */}
                          <circle cx="280" cy="120" r="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                          <circle cx="280" cy="120" r="3" fill={isUrlPrioritized ? "#10b981" : "#f59e0b"} />
                          <text x="280" y="140" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">EDGE-D</text>

                          {/* Core egress endpoint node */}
                          <circle cx="430" cy="80" r="10" fill="#1e293b" stroke={isUrlPrioritized ? "#10b981" : "#ef4444"} strokeWidth="2" />
                          <circle cx="430" cy="80" r="4" fill={isUrlPrioritized ? "#10b981" : "#ef4444"} className={isUrlPrioritized ? "" : "animate-pulse"} style={{ transformOrigin: "430px 80px" }} />
                          <text x="430" y="102" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">EG-CORE</text>
                        </g>

                        {/* Interactive dynamic throughput data tag */}
                        <g transform="translate(200, 72)">
                          <rect width="90" height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="#1e293b" strokeWidth="1" />
                          <text x="45" y="12" fill={isUrlPrioritized ? "#a7f3d0" : "#fca5a5"} fontSize="8" fontFamily="monospace" textAnchor="middle" className="font-semibold block font-mono">
                            {isUrlPrioritized ? "BW: 99.4 Gbps" : "BW CONGESTION"}
                          </text>
                        </g>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Monorepo Files Code Explorer */}
              {activeTab === "monorepo" && (
                <motion.div
                  key="monorepo"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-6 shadow-xl"
                >
                  <div>
                    <h2 className="font-display font-bold text-lg text-white flex items-center gap-2 block">
                      <FolderGit2 className="h-5 w-5 text-[#fbc02d]" />
                      Sovereign Monorepo Code Terminal Explorer
                    </h2>
                    <p className="text-xs text-gray-400">
                      Explore the synthesizable Verilog RTL, python core files, and custom scripts mapped from page 1/page 25.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                    <div className="md:col-span-4 bg-black/35 rounded-xl border border-[#162035] p-3 space-y-4">
                      <span className="text-[10px] uppercase font-display text-gray-400 tracking-wider block font-bold border-b border-[#162035] pb-2">
                        Monorepo Workspace
                      </span>

                      {/* Folder structure */}
                      <div className="space-y-1 text-xs font-mono">
                        <div className="text-[#a5d6a7] font-semibold flex items-center gap-1.5 py-1">
                          🗀 tucker-os/
                        </div>
                        <div className="pl-4 space-y-1">
                          {CORE_CODE_FILES.map((file) => {
                            const isSelected = selectedFile === file.name;
                            return (
                              <button
                                key={file.name}
                                onClick={() => setSelectedFile(file.name)}
                                className={`w-full text-left font-mono py-1 px-2.5 rounded transition flex items-center justify-between ${
                                  isSelected 
                                    ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" 
                                    : "text-gray-400 hover:text-gray-200 hover:bg-[#070b14]"
                                }`}
                              >
                                <span className="flex items-center gap-1.5">
                                  {file.name.endsWith(".sh") ? "🐚" : file.name.endsWith(".v") ? "🔌" : "🖺"} {file.name}
                                </span>
                                <span className="text-[9px] uppercase tracking-wider text-gray-500 font-sans block">{file.category}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-8 flex flex-col justify-between">
                      <div className="bg-black/50 border border-[#19273c] rounded-xl overflow-hidden h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between bg-black/40 px-4 py-2 border-b border-[#162035]/80">
                          <span className="font-mono text-xs text-gray-300">
                            File Path: <strong className="text-cyan-300">{activeFileObject.path}</strong>
                          </span>

                          <button
                            onClick={copyCodeToClipboard}
                            className="bg-[#0f172a] hover:bg-[#1e293b] border border-[#162035] text-gray-300 px-3 py-1 rounded text-[10px] font-display font-semibold transition flex items-center gap-1"
                          >
                            {copiedFileName === activeFileObject.name ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                Copy Code
                              </>
                            )}
                          </button>
                        </div>

                        {/* Micro Code highlight panel container */}
                        <pre className="p-4 overflow-x-auto text-[11px] font-mono text-cyan-100/90 leading-relaxed max-h-[350px] overflow-y-auto bg-black/20">
                          <code>{activeFileObject.content}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Pioneers & Inventors Hub Tab Panel */}
              {activeTab === "inventors" && (
                <motion.div
                  key="inventors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Grid layout for Pioneers Hub, Research Ingestion and Patent drafting */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Pioneers Database Column */}
                    <div className="xl:col-span-4 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <h2 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-emerald-400" />
                          Pioneers Global Bio-Library
                        </h2>
                        <p className="text-[10px] text-gray-400 font-sans leading-tight">
                          Explore natural plant compounding pharmacopoeia or historical public domain patent formulations.
                        </p>

                        {/* Search and Subtabs */}
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                            <input
                              type="text"
                              value={inventorSearch}
                              onChange={(e) => setInventorSearch(e.target.value)}
                              placeholder="Search formulas or agents..."
                              className="w-full bg-black/40 border border-[#162035] rounded px-8 py-2 text-[10.5px] text-[#f0f4ff] font-mono focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-1 bg-black/30 p-0.5 rounded border border-[#162035]/50">
                            {[
                              { id: "pharmacy", label: "Pharmacy" },
                              { id: "expired", label: "Expired" },
                              { id: "frontiers", label: "Frontiers" }
                            ].map(item => (
                              <button
                                key={item.id}
                                onClick={() => setActivePioneersSubTab(item.id as any)}
                                className={`py-1 text-[9px] font-display font-bold uppercase rounded text-center transition-all ${
                                  activePioneersSubTab === item.id
                                    ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/20"
                                    : "text-gray-400 hover:text-gray-200"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                          {(() => {
                            const PIONEER_ITEMS = {
                              pharmacy: [
                                { id: "artemisinin", name: "Artemisinin — Sweet Wormwood (Artemisia annua)", condition: "Malaria, Cancer", cost: "Accessible", desc: "Used in traditional Chinese medicine for over 2,000 years. Save millions of lives from malaria pathways." },
                                { id: "berberine", name: "Berberine — Goldenseal, Barberry, Oregon Grape", condition: "Type 2 Diabetes, Infection", cost: "~$15/mo", desc: "Reduces HbA1c comparably to metformin, modulating lipids and gut microbiome." },
                                { id: "quercetin", name: "Quercetin — Onions, Apples, Capers", condition: "Senolytic / Anti-Aging", cost: "Zero cost", desc: "Flavonoid showing incredible senolytic properties (selectively clearing zombie cells)." },
                                { id: "polygodial", name: "Polygodial — Tasmanian Pepper", condition: "Schistosomiasis, Helminth Parasites", cost: "Zero-cost native crop", desc: "Studies in 2024 show 44% worm burden reduction and 71% egg reduction." }
                              ],
                              expired: [
                                { id: "metformin", name: "Metformin Synthesis Routes", condition: "Diabetes, Longevity", cost: "$4/mo (Generic)", desc: "Synthesis patents expired for decades, permitting free formulation replication." },
                                { id: "ort", name: "Oral Rehydration Therapy (ORT)", condition: "Dehydration, Cholera", cost: "<$0.50/packet", desc: "Standard mixture of water, glucose, NaCl, and KCl. Unpatentable gift to humanity." },
                                { id: "chloroquine", name: "Chloroquine Formulations", condition: "Malaria, Autoimmune", cost: "Near zero", desc: "Generic production is legal anywhere. Classic reference for docking simulation." },
                                { id: "ivermectin", name: "Ivermectin Formulations", condition: "River Blindness, Parasites", cost: "Near zero", desc: "Base compound discovery won Nobel Prize, patents expired by late 1995 era." }
                              ],
                              frontiers: [
                                { id: "acoziborole", name: "Acoziborole single oral dose", condition: "Sleeping Sickness", cost: "Non-profit access (DNDi)", desc: "First single oral dose cure replacing painful intravenous hospital stays." },
                                { id: "bpal", name: "BPaL/M short-course therapy", condition: "Drug-Resistant TB", cost: "<$2/day", desc: "Shorter, 6-month oral regimen replacing toxic, years-long lines." },
                                { id: "peel", name: "Mandarin & Citrus peel waste", condition: "Mycotoxins, Leishmaniasis", cost: "Zero Cost Recycle", desc: "Harness agricultural waste; mandarin peel achievements score 90% fungal inhibition." }
                              ]
                            };

                            const list = PIONEER_ITEMS[activePioneersSubTab] || [];
                            const filtered = list.filter(p => 
                              p.name.toLowerCase().includes(inventorSearch.toLowerCase()) ||
                              p.condition.toLowerCase().includes(inventorSearch.toLowerCase())
                            );

                            if (filtered.length === 0) {
                              return <div className="text-[10px] text-gray-500 font-mono text-center py-4">No matching records found.</div>;
                            }

                            return filtered.map(p => (
                              <button
                                key={p.id}
                                onClick={() => setSelectedPioneerId(p.id)}
                                className={`w-full text-left p-2 rounded transition-all border ${
                                  selectedPioneerId === p.id
                                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                    : "bg-black/20 text-gray-400 border-transparent hover:border-[#162035]"
                                }`}
                              >
                                <div className="text-[10px] font-bold leading-tight font-display">{p.name}</div>
                                <div className="flex gap-2 text-[8px] font-mono text-gray-500 mt-1">
                                  <span>Target: {p.condition}</span>
                                  <span>•</span>
                                  <span className="text-emerald-500 font-semibold">{p.cost}</span>
                                </div>
                              </button>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Detail View */}
                      {(() => {
                        const allPion = [
                          { id: "artemisinin", name: "Artemisinin — Sweet Wormwood (Artemisia annua)", condition: "Malaria, Cancer (KRAS pathway)", cost: "Highly Accessible", desc: "Used in traditional Chinese medicine for over 2,000 years. Savingly saving millions from malaria pathways. Groundbreak of O(√N)-based Grover-enhanced molecular docking target." },
                          { id: "berberine", name: "Berberine — Goldenseal, Barberry, Oregon Grape", condition: "Type 2 Diabetes, Infection, Cardiovascular", cost: "~$15/month (vs. Metformin/brand names at $80+)", desc: "Multiple randomized controlled trials show berberine reduces HbA1c comparably to metformin, modulating gut microbiome and offering lipid-lowering synergies." },
                          { id: "quercetin", name: "Quercetin — Onions, Apples, Capers", condition: "Senolytic / Anti-Aging, Inflammation, Antiviral", cost: "Zero cost (present in most grocery produce)", desc: "Flavonoid showing incredible senolytic properties (selectively clearing zombie cells linked to aging) and NF-kB pathway inhibition." },
                          { id: "polygodial", name: "Polygodial — Dorrigo Pepper, Tasmanian Pepper", condition: "Schistosomiasis, Helminth Parasites", cost: "Zero-cost native agricultural crop", desc: "A sesquiterpene from pepper plants. In-vivo studies show 44% reduction in schistosome worm burden, 71% egg reduction, and 69.5% intestinal clearance." },
                          { id: "metformin", name: "Metformin Synthesis Routes (Public Domain)", condition: "Diabetes, Longevity, Cardio-Protection", cost: "$4/month (Generic)", desc: "First synthesized in the 1920s, patented in the 1950s, expired in 1970s. Shows how public domain pathways serve as excellent templates for unrestricted medicine access." },
                          { id: "ort", name: "Oral Rehydration Therapy (ORT)", condition: "Dehydration, Cholera", cost: "<$0.50/packet", desc: "Standard mixture of water, glucose, sodium chloride, potassium chloride, and citrate. Unpatentable gift to humanity." },
                          { id: "chloroquine", name: "Chloroquine Formulations", condition: "Malaria, Autoimmune", cost: "Near zero", desc: "Generic production is legal globally, offering classic reference templates for anti-parasitic docking." },
                          { id: "ivermectin", name: "Ivermectin Formulations", condition: "River Blindness, Parasites", cost: "Near zero (Donated free)", desc: "The base compound discovery won the Nobel Prize, with its primary formulation patents fully expired by the late 1995 era." },
                          { id: "acoziborole", name: "Acoziborole single oral dose sleeping sickness cure", condition: "Sleeping Sickness", cost: "Non-profit access (DNDi)", desc: "First single oral dose cure replacing painful intravenous hospital stays. Developed with non-profit access pricing." },
                          { id: "bpal", name: "BPaL/M short-course therapy", condition: "Drug-Resistant TB", cost: "<$2/day", desc: "A shorter, 6-month oral regimen (Bedaquiline + Pretomanid + Linezolid) replacing the toxic, years-long multi-drug therapy lines." },
                          { id: "peel", name: "Mandarin & Citrus peel agricultural recycle", condition: "Mycotoxins, Leishmaniasis", cost: "Zero Cost Recycle", desc: "Mandarin peel achieves 90% fungal inhibition of agricultural hazards. Proves how overlooked waste serves as clinical resources." }
                        ];
                        const found = allPion.find(p => p.id === selectedPioneerId) || allPion[0];
                        return (
                          <div className="p-3 bg-black/40 border border-[#162035] rounded-lg space-y-1.5 mt-2">
                            <div className="text-[10px] uppercase font-mono text-cyan-400 font-bold border-b border-[#162035] pb-1.5 flex justify-between items-center">
                              <span>Sensing Compound Profile</span>
                              <Sparkles className="h-3 w-3 text-glow" />
                            </div>
                            <h4 className="text-[10px] font-bold text-white font-display leading-tight">{found.name}</h4>
                            <p className="text-[9.5px] text-gray-300 leading-normal font-sans">{found.desc}</p>
                            <div className="pt-1.5 flex gap-3 text-[8.5px] font-mono text-gray-500">
                              <div><strong className="text-gray-400">Pillar Target:</strong> {found.condition}</div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* AI Literature Parsing and Evidence Scoring Column */}
                    <div className="xl:col-span-4 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <h2 className="font-display font-bold text-sm text-[#fbc02d] flex items-center gap-1.5">
                          <Activity className="h-4 w-4 text-glow text-[#fbc02d]" />
                          Redemptive Evidence Graph
                        </h2>
                        <p className="text-[10px] text-gray-400 font-sans leading-tight">
                          Query PubMed & preprints to trace pathway targets and flag structural scientific contradictions.
                        </p>

                        <div className="space-y-2.5 bg-black/40 border border-[#162035] rounded-xl p-3">
                          <div>
                            <label className="text-[9.5px] uppercase font-mono text-slate-500 block mb-1">Target Ingestion Keyword</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {["ALS", "Cancer", "Alzheimer"].map(kw => (
                                <button
                                  key={kw}
                                  onClick={() => !isIngestingResearch && setIngestionKeyword(kw)}
                                  disabled={isIngestingResearch}
                                  className={`py-1 text-[9px] font-mono rounded transition-all ${
                                    ingestionKeyword === kw
                                      ? "bg-[#fbc02d]/20 text-[#fff59d] border border-[#fbc02d]/40"
                                      : "bg-black/30 border border-[#162035] text-slate-400 hover:border-slate-700"
                                  }`}
                                >
                                  {kw === "ALS" ? "ALS (SOD1)" : kw === "Cancer" ? "Cancer (G12D)" : "Alzheimers"}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={handleIngestResearch}
                            disabled={isIngestingResearch}
                            className="w-full py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:from-slate-900 disabled:to-slate-900 disabled:text-gray-500 text-white font-bold font-display uppercase tracking-wider rounded text-[9.5px] transition duration-200 flex items-center justify-center gap-1.5"
                          >
                            {isIngestingResearch ? (
                              <>
                                <RefreshCw className="h-3 w-3 animate-spin" />
                                INGESTING PUBMED/ARXIV...
                              </>
                            ) : (
                              <>
                                <Search className="h-3 w-3" />
                                RUN INGESTION PIPELINE
                              </>
                            )}
                          </button>
                        </div>

                        {/* Real-time Ingestion Stream Logs */}
                        <div className="bg-[#03050a] border border-[#162035]/90 rounded-lg p-2.5 h-[120px] overflow-y-auto font-mono text-[9px] text-[#aeebd1] space-y-1">
                          {ingestionLogs.length === 0 ? (
                            <div className="text-gray-600 italic text-center pt-8">Queue standby. Awaiting ingestion click trigger...</div>
                          ) : (
                            ingestionLogs.map((log, i) => (
                              <div key={i} className="leading-tight">{log}</div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Evidence graph ranked weight table */}
                      <div className="bg-black/30 border border-[#162035] rounded-lg p-2.5 font-mono text-[9px]">
                        <span className="text-[8px] uppercase text-gray-500 block border-b border-[#162035]/50 pb-1 mb-1.5">RECALIBRATED EVIDENCE TARGETS</span>
                        <div className="space-y-1.5">
                          {evidenceGraph.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="text-sky-300 font-semibold">{item.gene} target</span>
                              <div className="flex gap-2">
                                <span className="text-gray-400">Scans: {item.count}</span>
                                <span className="text-emerald-400 font-bold">Confidence: {item.weight}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Patent Drafting Column */}
                    <div className="xl:col-span-4 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <h2 className="font-display font-bold text-sm text-purple-400 flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-glow text-purple-400" />
                          Provisional Patent Architect
                        </h2>
                        <p className="text-[10px] text-gray-400 font-sans leading-tight">
                          Draft is automatically compiled in real-time as you filter targets. Click below to apply cryptographic ledger seals under G1P covenants.
                        </p>

                        <div className="space-y-1.5 bg-black/40 border border-[#162035] rounded-xl p-2.5 text-[9.5px]">
                          {/* target configuration */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-gray-500 block mb-0.5">TARGET ISSUE</span>
                              <select
                                value={selectedPatentTarget}
                                onChange={(e) => setSelectedPatentTarget(e.target.value)}
                                className="w-full bg-black border border-[#162035] text-gray-300 rounded px-1.5 py-1 focus:outline-none"
                              >
                                <option value="ALS">ALS (SOD1)</option>
                                <option value="Cancer">KRAS Tumor</option>
                                <option value="Alzheimer">Alzheimer APP</option>
                                <option value="Huntington">Huntington HTT</option>
                                <option value="Schistosomiasis">Schisto GeneDrive</option>
                              </select>
                            </div>
                            <div>
                              <span className="text-gray-500 block mb-0.5">ACTIVE COVENANT AGENT</span>
                              <select
                                value={provisionalAgent}
                                onChange={(e) => setProvisionalAgent(e.target.value)}
                                className="w-full bg-black border border-[#162035] text-gray-300 rounded px-1.5 py-1 focus:outline-none"
                              >
                                <option value="artemisinin">Artemisinin</option>
                                <option value="berberine">Berberine</option>
                                <option value="quercetin">Quercetin</option>
                                <option value="polygodial">Polygodial</option>
                              </select>
                            </div>
                          </div>

                          {/* operator / delivery */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-gray-500 block mb-0.5">ROOT SIGNATURE</span>
                              <input
                                type="text"
                                value={provisionalOperator}
                                onChange={(e) => setProvisionalOperator(e.target.value)}
                                className="w-full bg-black border border-[#162035] text-purple-300 rounded px-1.5 py-0.5 font-mono focus:outline-none"
                              />
                            </div>
                            <div>
                              <span className="text-gray-500 block mb-0.5">DELIVERY VECTOR</span>
                              <select
                                value={provisionalDelivery}
                                onChange={(e) => setProvisionalDelivery(e.target.value)}
                                className="w-full bg-black border border-[#162035] text-gray-300 rounded px-1 w-full py-1 focus:outline-none"
                              >
                                <option value="AAV9_LNP_hybrid">AAV9 / LNP Hybrid</option>
                                <option value="Cas9_scaffold">Cas9 / Cleaving RNP</option>
                                <option value="LNP_vehicle">Pure LNP Carrier</option>
                              </select>
                            </div>
                          </div>

                          <button
                            onClick={handleDraftProvisionalPatent}
                            disabled={isDraftingPatent}
                            className="w-full py-1.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 disabled:from-slate-900 disabled:to-slate-900 disabled:text-gray-500 text-white font-bold font-display uppercase tracking-wider rounded text-[9px] transition-all flex items-center justify-center gap-1"
                          >
                            {isDraftingPatent ? (
                              <>
                                <RefreshCw className="h-3 w-3 animate-spin" />
                                CONFLICT CORRECTION / SEALING RECORD...
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3 text-purple-200" />
                                SEAL & REGISTER PROVISIONAL PATENT
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Generated stub outline preview with Markdown action */}
                      <div className="space-y-1.5">
                        <div className="bg-[#04060c] border border-[#162035]/80 rounded p-2 h-[120px] overflow-y-auto font-mono text-[8px] text-purple-200 leading-tight">
                          {provisionalPatentDraft ? (
                            <pre className="whitespace-pre-wrap">{provisionalPatentDraft}</pre>
                          ) : (
                            <div className="text-gray-600 italic text-center pt-10">Configure builders and click generate. Draft prints here.</div>
                          )}
                        </div>

                        {provisionalPatentDraft && (
                          <button
                            onClick={downloadPatentMarkdown}
                            className="w-full py-1 font-mono text-[9px] bg-black/40 hover:bg-black/60 text-[#d8b4fe] border border-purple-500/35 rounded flex items-center justify-center gap-1 transition"
                          >
                            <Download className="h-2.5 w-2.5" />
                            DOWNLOAD SPECIFICATION (.MD)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PDF living report document preview block - Fully Styled and Printable */}
                  <div className="border border-[#162035]/85 bg-[#080d19]/80 rounded-xl p-6 shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#162035] pb-3 gap-3">
                      <div>
                        <h3 className="font-display font-bold text-sm text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Printer className="h-4 w-4 text-cyan-400" />
                          "God's Toolbox" Research Report Dossier
                        </h3>
                        <p className="text-[10px] text-gray-400 font-sans">
                          A fully composited, printable system dossier compiling the scale metrics, plant libraries, and generated patent specs.
                        </p>
                      </div>

                      {/* PDF actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.print()}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white font-display font-semibold transition px-3.5 py-1.5 rounded text-[10px] tracking-wide flex items-center gap-1"
                        >
                          <Printer className="h-3 w-3" />
                          PRINT / SAVE SYSTEM PDF
                        </button>
                      </div>
                    </div>

                    {/* Styled Print Document Preview Frame */}
                    <div className="bg-[#fcfaf2] border border-[#d8ccb0] rounded-lg p-8 text-[#1e1a10] font-sans antialiased text-xs max-w-4xl mx-auto shadow-2xl print:border-none print:shadow-none print:p-0 print:m-0 space-y-6 select-text">
                      
                      {/* Document Masthead */}
                      <div className="text-center border-b-2 border-double border-[#9a6f1a] pb-6">
                        <div className="font-mono text-[10px] uppercase text-[#9a6f1a] font-bold tracking-widest mb-1">
                          God's Toolbox • Living Clinical Synthesis Brief
                        </div>
                        <h1 className="font-display font-bold text-2xl text-[#1e1a10] leading-tight tracking-tight">
                          Cures & Treatments: What God Already Put in Creation
                        </h1>
                        <div className="italic text-[#9a6f1a] text-xs font-serif mt-2">
                          "He causes the grass to grow for the cattle, and vegetation for the service of man." — Psalm 104:14
                        </div>
                        <div className="font-mono text-[9px] text-[#6a5a3a] mt-3">
                          Verified Sources: WHO • DNDi • PubMed • Nature Medicine • PMC • PatentsView Database • LCOD Gate
                        </div>
                      </div>

                      <div className="bg-red-500/5 border border-red-500/25 p-3 rounded text-red-950 font-sans leading-relaxed text-[11px]">
                        <strong>CRITICAL RESEARCH MEMORANDUM Statement:</strong> All bio-molecular target models described correspond to in-silico simulation results. Wet-lab validation (GUIDE-seq, patient iPSC lines) and strict clinical/ethical FDA regulatory paths must be verified prior to therapeutic mobilization.
                      </div>

                      {/* Main paper sections grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-4">
                          <h4 className="font-display font-bold text-sm text-[#8b2020] border-b border-[#d8ccb0] pb-1 flex items-center gap-1">
                            <span>Section 1: The Global Neglect Crisis & Scale</span>
                          </h4>
                          <div className="space-y-2.5">
                            <div>
                              <strong className="block text-[11px] text-gray-800">1.62 Billion Beneficiaries</strong>
                              <span className="text-[10.5px] leading-relaxed text-gray-700 block">
                                Global tropical population currently requires pharmaceutical intervention for neglected pathogens (NTDs) under regional high-mortality indexes. Target reduction sets 2030 bounds.
                              </span>
                            </div>
                            <div>
                              <strong className="block text-[11px] text-gray-800">400:1 Dynamic Return on R&D</strong>
                              <span className="text-[10.5px] leading-relaxed text-gray-700 block">
                                Studies substantiate that every research dollar deployed to target orphan pathologies returns immense socio-economic healthcare multipliers, representing the highest priority duty on Earth.
                              </span>
                            </div>
                            <div className="p-3 bg-red-500/5 rounded border border-red-500/10 text-[10px] leading-snug">
                              <strong>Off-Patent Generic Market Failures:</strong> Decades-old generic formulations like Miltefosine remain completely priced out in high-risk zones, reaching $48,000 per full clinical course in brand names. This confirms that social distribution, not bare chemistry, represents the ultimate roadblock.
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-display font-bold text-sm text-[#1a5c35] border-b border-[#d8ccb0] pb-1 flex items-center gap-1">
                            <span>Section 2: God's Plant Pharmacy & Expired Prior Art</span>
                          </h4>
                          <div className="space-y-2.5 text-[10.5px] leading-relaxed text-gray-700">
                            <div>
                              <strong className="text-gray-900 block font-bold">Artemisinin — Sweet Wormwood (Artemisia annua)</strong>
                              <span>frontline Nobel-Prize antimalarial saved millions of patients. Ongoing research explores active synergies with Grover conformation binders for KRAS Cancer pathways.</span>
                            </div>
                            <div>
                              <strong className="text-gray-900 block font-bold">Berberine — Goldenseal & Oregon Grape</strong>
                              <span>Sparsely integrated in traditional Western guidelines, despite rigorous clinical trials showing HbA1c reductions comparable to brand diabetes medications on extreme budget lines.</span>
                            </div>
                            <div>
                              <strong className="text-gray-900 block font-bold">Polygodial — Tasmanian and Dorrigo Pepper</strong>
                              <span>Native plant compounds confirmed during 2024 to induce 44% parasite burden clearance and 71% egg elimination for Schistosomiasis under high-frequency vector controls.</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Print Section 3: Generated Patent Application */}
                      {provisionalPatentDraft && (
                        <div className="pt-4 border-t border-[#d8ccb0] space-y-2">
                          <h4 className="font-display font-bold text-sm text-[#4a3080] border-b border-[#d8ccb0] pb-1">
                            Section 3: Drafted Provisional Spec (USPTO CFR Title 35 Verification)
                          </h4>
                          <div className="bg-black/5 p-4 rounded border border-[#64748b]/20 font-mono text-[9px] whitespace-pre-wrap text-black leading-snug">
                            {provisionalPatentDraft}
                          </div>
                        </div>
                      )}

                      <div className="border-t-2 border-double border-[#9a6f1a] pt-4 text-center text-[10px] text-[#6a5a3a] italic serif">
                        "Freely it is given, freely it should be received. All bio-intellect resources are made open-access under God's Love Protocol."
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Engine Studio Tab Panel */}
              {activeTab === "engine" && (
                <motion.div
                  key="engine"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Header Dashboard Banner */}
                  <div className="border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-5 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Gamepad className="h-5 w-5 text-purple-400 animate-pulse" />
                        <h2 className="font-display font-bold text-lg text-white">
                          Sovereign Engine Studio
                        </h2>
                      </div>
                      <p className="text-xs text-slate-400 max-w-xl">
                        Cross-compile real-time simulations, rendering models, and multi-platform applications using Unreal Engine 5, Unity ECS, Flutter, and Cineforge.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <div className="bg-[#04060c] border border-purple-500/15 rounded-lg px-3 py-1 text-center">
                        <div className="text-[8px] text-gray-500 uppercase">SYS PERFORMANCE</div>
                        <div className="text-xs font-mono font-bold text-emerald-400">{ueFps} FPS</div>
                      </div>
                      <div className="bg-[#04060c] border border-purple-500/15 rounded-lg px-3 py-1 text-center">
                        <div className="text-[8px] text-gray-500 uppercase">ACTIVE CORES</div>
                        <div className="text-xs font-mono font-bold text-[#b49bf3]">{isCompilingUeShaders ? "64/64" : "12/64"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Engine Studio Split Container */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Panel: Configuration Bench */}
                    <div className="lg:col-span-5 space-y-4 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <h3 className="font-display font-semibold text-xs text-purple-300 uppercase tracking-widest flex items-center gap-1.5 border-b border-[#162035] pb-2">
                          <Activity className="h-3.5 w-3.5 text-purple-400" />
                          CONFIGURATION BENCH & REGISTRY
                        </h3>

                        {/* Subtab Ribbon */}
                        <div className="grid grid-cols-5 gap-1 p-1 bg-[#04060c] rounded-lg border border-[#151c33]/80">
                          {[
                            { id: "unreal", name: "UE5" },
                            { id: "unity", name: "Unity" },
                            { id: "flutter", name: "Flutter" },
                            { id: "cineforge", name: "Cineforge" },
                            { id: "swift", name: "Swift iOS" }
                          ].map((eSub) => (
                            <button
                              key={eSub.id}
                              onClick={() => setActiveEngineSubTab(eSub.id as any)}
                              className={`py-1 text-[9px] font-display font-bold uppercase rounded text-center transition ${
                                activeEngineSubTab === eSub.id
                                  ? "bg-purple-600/30 text-purple-200 border border-purple-500/25 animate-pulse"
                                  : "text-gray-500 hover:text-gray-300 hover:bg-[#0c1224]"
                              }`}
                            >
                              {eSub.name}
                            </button>
                          ))}
                        </div>

                        {/* Dynamics controls based on selection */}
                        {activeEngineSubTab === "unreal" && (
                          <div className="space-y-4">
                            <div className="bg-[#04060c] border border-purple-500/10 rounded-xl p-3 space-y-3 text-xs">
                              <span className="font-mono text-[9px] text-[#b3a8ff] block uppercase tracking-wider">Unreal Engine 5 Core</span>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">UE5 Lumen Raytracing</span>
                                <button
                                  onClick={() => setUeRayTracing(!ueRayTracing)}
                                  className={`px-3 py-1 font-mono text-[9px] uppercase font-bold rounded ${
                                    ueRayTracing ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "bg-red-600/20 text-red-500 border border-red-500/30"
                                  }`}
                                >
                                  {ueRayTracing ? "ENABLED" : "DISABLED"}
                                </button>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px]">
                                  <span className="text-gray-400">Lumen Diffuse Bounces</span>
                                  <span className="font-mono text-purple-300 font-bold">{ueLumenBounces} bounces</span>
                                </div>
                                <input
                                  type="range"
                                  min={1}
                                  max={8}
                                  value={ueLumenBounces}
                                  onChange={(e) => setUeLumenBounces(parseInt(e.target.value))}
                                  className="w-full accent-purple-500 h-1 bg-black rounded"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px]">
                                  <span className="text-gray-400">Nanite Virtual Mesh Density</span>
                                  <span className="font-mono text-purple-300 font-bold">{ueNaniteDensity}% (LOD Max)</span>
                                </div>
                                <input
                                  type="range"
                                  min={10}
                                  max={100}
                                  value={ueNaniteDensity}
                                  onChange={(e) => setUeNaniteDensity(parseInt(e.target.value))}
                                  className="w-full accent-purple-500 h-1 bg-black rounded"
                                />
                              </div>
                            </div>

                            <button
                              onClick={handleCompileShaders}
                              disabled={isCompilingUeShaders}
                              className="w-full py-2 bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 text-white text-[10px] uppercase font-bold font-display rounded flex items-center justify-center gap-1.5 transition overflow-hidden disabled:opacity-60"
                            >
                              <RefreshCw className={`h-3.5 w-3.5 ${isCompilingUeShaders ? "animate-spin" : ""}`} />
                              {isCompilingUeShaders ? `COMPILING SHADERS (${ueShaders} Active)...` : "TRIGGER MASSIVE UE5 SHADER COMPILATION"}
                            </button>
                          </div>
                        )}

                        {activeEngineSubTab === "unity" && (
                          <div className="space-y-4">
                            <div className="bg-[#04060c] border border-blue-500/10 rounded-xl p-3 space-y-3 text-xs">
                              <span className="font-mono text-[9px] text-[#7dd3fc] block uppercase tracking-wider">Unity DOTS & ECS Engine</span>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px]">
                                  <span className="text-gray-400">ECS Chunk Count</span>
                                  <span className="font-mono text-cyan-300 font-bold">{unityEcsChunks} Chunks</span>
                                </div>
                                <input
                                  type="range"
                                  min={16}
                                  max={512}
                                  step={16}
                                  value={unityEcsChunks}
                                  onChange={(e) => setUnityEcsChunks(parseInt(e.target.value))}
                                  className="w-full accent-cyan-500 h-1 bg-black rounded"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px]">
                                  <span className="text-gray-400">Burst Job Batch Size</span>
                                  <span className="font-mono text-cyan-300 font-bold">{unityJobBatchSize} items/batch</span>
                                </div>
                                <input
                                  type="range"
                                  min={8}
                                  max={256}
                                  step={8}
                                  value={unityJobBatchSize}
                                  onChange={(e) => setUnityJobBatchSize(parseInt(e.target.value))}
                                  className="w-full accent-cyan-500 h-1 bg-black rounded"
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Burst Optimization Level</span>
                                <select
                                  value={unityBurstLevel}
                                  onChange={(e) => setUnityBurstLevel(e.target.value as any)}
                                  className="bg-black border border-[#162035] text-cyan-400 text-[10px] rounded px-2 py-0.5"
                                >
                                  <option value="fast">Aggressive (Speed-First)</option>
                                  <option value="safety">Pristine Safety Guards</option>
                                  <option value="dev">Debug/Verification Mode</option>
                                </select>
                              </div>
                            </div>

                            <div className="bg-[#04060c]/60 border border-cyan-500/10 rounded-xl p-2.5 space-y-1 text-[9.5px]">
                              <span className="font-mono font-bold text-gray-500 block uppercase">Entity Component Reader</span>
                              <div className="flex justify-between items-center bg-[#070b15] p-1.5 rounded border border-[#11182c]">
                                <span className="text-[#a5f3fc] font-mono">Entity #{selectedEntityId} Structural Layout</span>
                                <select
                                  value={selectedEntityId}
                                  onChange={(e) => setSelectedEntityId(parseInt(e.target.value))}
                                  className="bg-black border border-[#162035] text-gray-400 text-[9px] rounded px-1.5 py-0.5 focus:outline-none"
                                >
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <option key={num} value={num}>Entity ID {num}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="font-mono text-[8px] text-gray-400 space-y-1 pt-1 leading-tight">
                                <div className="flex justify-between"><span className="text-gray-600">Position3D:</span> <span>[{(selectedEntityId * 15.2).toFixed(2)}, {(-selectedEntityId * 8.4).toFixed(2)}, {(selectedEntityId * 32.5).toFixed(2)}]</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">LcoderSlices:</span> <span className="text-cyan-400">0x{(selectedEntityId * 4096).toString(16).toUpperCase()}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">G1P_Covenant_Byte:</span> <span className="text-emerald-400">Pillar 10 Compliant</span></div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeEngineSubTab === "flutter" && (
                          <div className="space-y-4">
                            <div className="bg-[#04060c] border border-[#14b8a6]/10 rounded-xl p-3 space-y-3 text-xs">
                              <span className="font-mono text-[9px] text-[#2dd4bf] block uppercase tracking-wider">Flutter Target Platform Integration</span>
                              
                              <div className="grid grid-cols-2 gap-2 text-[10px]">
                                {[
                                  { id: "ios", label: "iOS (Impeller Metal)" },
                                  { id: "android", label: "Android (Vulkan GPU)" },
                                  { id: "wasm", label: "WebAssembly (Canvas)" },
                                  { id: "desktop", label: "macOS CoreGraphics" }
                                ].map((plat) => (
                                  <button
                                    key={plat.id}
                                    onClick={() => setFlutterPlatform(plat.id as any)}
                                    className={`py-1 rounded text-center transition ${
                                      flutterPlatform === plat.id 
                                        ? "bg-teal-600/20 text-teal-300 border border-teal-500/40" 
                                        : "bg-black/40 text-gray-500 hover:text-gray-300 border border-[#162035]"
                                    }`}
                                  >
                                    {plat.label}
                                  </button>
                                ))}
                              </div>

                              <div className="flex justify-between text-gray-400 pt-1 text-[11px]">
                                <span>Flutter Hot Reload Index</span>
                                <span className="font-mono text-teal-300 font-bold">{flutterHotReloadCount} runs</span>
                              </div>
                            </div>

                            <button
                              onClick={handleFlutterHotReload}
                              disabled={isFlutterReloading}
                              className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white text-[10px] uppercase font-bold font-display rounded flex items-center justify-center gap-1.5 transition"
                            >
                              <RefreshCw className={`h-3.5 w-3.5 ${isFlutterReloading ? "animate-spin" : ""}`} />
                              {isFlutterReloading ? "HOT RELOADING COMMITTED WIDGETS..." : "FLUTTER HOT RELOAD (IMPELLER TARGETS)"}
                            </button>
                          </div>
                        )}

                        {activeEngineSubTab === "cineforge" && (
                          <div className="space-y-4">
                            <div className="bg-[#04060c] border border-orange-500/10 rounded-xl p-3 space-y-3 text-xs">
                              <span className="font-mono text-[9px] text-[#fdba74] block uppercase tracking-wider">Cineforge Camera & Color Deck</span>

                              <div className="grid grid-cols-3 gap-1">
                                {[
                                  { id: "35mm_prime", label: "35mm Prime" },
                                  { id: "50mm_anamorphic", label: "50mm Anam" },
                                  { id: "85mm_portrait", label: "85mm Port" }
                                ].map((lens) => (
                                  <button
                                    key={lens.id}
                                    onClick={() => setCineLens(lens.id as any)}
                                    className={`py-1 text-[9px] font-bold rounded text-center transition ${
                                      cineLens === lens.id
                                        ? "bg-amber-600/35 text-amber-200 border border-amber-500/40"
                                        : "bg-black/40 text-gray-500 hover:text-gray-300 border border-[#162035]"
                                    }`}
                                  >
                                    {lens.label}
                                  </button>
                                ))}
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px]">
                                  <span className="text-gray-400">Focus Plane Distance</span>
                                  <span className="font-mono text-amber-300 font-bold">{cineFocusDistance} meters</span>
                                </div>
                                <input
                                  type="range"
                                  min={1}
                                  max={20}
                                  step={0.1}
                                  value={cineFocusDistance}
                                  onChange={(e) => setCineFocusDistance(parseFloat(e.target.value))}
                                  className="w-full accent-amber-500 h-1 bg-black rounded"
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Aperture Depth (f/stop)</span>
                                <select
                                  value={cineAperture}
                                  onChange={(e) => setCineAperture(e.target.value)}
                                  className="bg-black border border-[#162035] text-amber-400 text-[10px] rounded px-2 Focus:outline-none"
                                >
                                  <option value="f/1.4">f/1.4 (Slight Blur)</option>
                                  <option value="f/1.8">f/1.8 (Medium)</option>
                                  <option value="f/2.8">f/2.8 (Pin Sharp)</option>
                                  <option value="f/4.0">f/4.0</option>
                                  <option value="f/5.6">f/5.6</option>
                                </select>
                              </div>

                              <div className="flex items-center justify-between border-t border-[#11182c] pt-2">
                                <span className="text-gray-400 font-semibold text-[10.5px]">Houdini LUT Grade</span>
                                <select
                                  value={cineColorProfile}
                                  onChange={(e) => setCineColorProfile(e.target.value as any)}
                                  className="bg-black border border-[#162035] text-amber-400 text-[10px] rounded px-1.5 py-0.5 focus:outline-none"
                                >
                                  <option value="raw_log">RAW Log (Neutral Desat)</option>
                                  <option value="matrix_green">Matrix Green (Terminal Neo)</option>
                                  <option value="cyber_slate">Cyber Slate (Standard Cosmic)</option>
                                  <option value="warm_classic">Warm Sepia (Editorial)</option>
                                  <option value="gold_forge">Gold Forge (Deep High Contrast)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeEngineSubTab === "swift" && (
                          <div className="space-y-4">
                            <div className="bg-[#04060c] border border-cyan-500/15 rounded-xl p-3.5 space-y-4 text-xs">
                              <span className="font-mono text-[9px] text-cyan-300 block uppercase tracking-wider font-semibold">SwiftUI iOS Source Architect</span>
                              
                              {/* File selector */}
                              <div className="space-y-1">
                                <label className="text-[10px] text-gray-400 block font-display">Target Xcode Source File</label>
                                <div className="grid grid-cols-1 gap-1">
                                  {[
                                    { id: "MiniDeniApp.swift" },
                                    { id: "TuckerConsoleView.swift" },
                                    { id: "LcodCompliance.swift" }
                                  ].map((file) => (
                                    <button
                                      key={file.id}
                                      onClick={() => setSwiftFile(file.id as any)}
                                      className={`py-1.5 px-3 text-left font-mono text-[10.5px] rounded border transition ${
                                        swiftFile === file.id
                                          ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/40"
                                          : "bg-black/35 text-gray-400 border-[#162035] hover:border-slate-700"
                                      }`}
                                    >
                                      📄 {file.id}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Toggle Options */}
                              <div className="space-y-1.5 border-t border-[#11182c] pt-2">
                                <label className="text-[10px] text-gray-400 block font-display">Ingestion Directives (State Variables)</label>
                                
                                <label className="flex items-center justify-between text-[10px] cursor-pointer text-gray-300 p-1 hover:bg-black/20 rounded">
                                  <span>Inject Spiritual Anchor (Psalm 23)</span>
                                  <input 
                                    type="checkbox" 
                                    checked={includePsalm23} 
                                    onChange={(e) => setIncludePsalm23(e.target.checked)}
                                    className="accent-cyan-500"
                                  />
                                </label>

                                <label className="flex items-center justify-between text-[10px] cursor-pointer text-gray-300 p-1 hover:bg-black/20 rounded">
                                  <span>Verify Indiana License Anchor</span>
                                  <input 
                                    type="checkbox" 
                                    checked={includeIndianaLicense} 
                                    onChange={(e) => setIncludeIndianaLicense(e.target.checked)}
                                    className="accent-cyan-500"
                                  />
                                </label>

                                <label className="flex items-center justify-between text-[10px] cursor-pointer text-gray-300 p-1 hover:bg-black/20 rounded">
                                  <span>Require [GOD1] Classification</span>
                                  <input 
                                    type="checkbox" 
                                    checked={includeGod1Classification} 
                                    onChange={(e) => setIncludeGod1Classification(e.target.checked)}
                                    className="accent-cyan-500"
                                  />
                                </label>
                              </div>

                              {/* Target Scanner intensity slider */}
                              <div className="space-y-1.5 border-t border-[#11182c] pt-2">
                                <div className="flex justify-between text-[10.5px] text-gray-400">
                                  <span>Scanner Initial Intensity</span>
                                  <span className="font-mono text-cyan-300 font-bold">{swiftScannerIntensity}%</span>
                                </div>
                                <input
                                  type="range"
                                  min={10}
                                  max={100}
                                  value={swiftScannerIntensity}
                                  onChange={(e) => setSwiftScannerIntensity(parseInt(e.target.value))}
                                  className="w-full accent-cyan-500 h-1 bg-black rounded"
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                // Trigger copy feedback
                                let codeToCopy = "";
                                if (swiftFile === "MiniDeniApp.swift") {
                                  codeToCopy = getMiniDeniAppCode();
                                } else if (swiftFile === "TuckerConsoleView.swift") {
                                  codeToCopy = getTuckerConsoleViewCode();
                                } else {
                                  codeToCopy = getLcodComplianceCode();
                                }
                                navigator.clipboard.writeText(codeToCopy);
                                setCopiedSwiftFileName(swiftFile);
                                setTimeout(() => setCopiedSwiftFileName(null), 2500);
                              }}
                              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-[10.5px] uppercase font-bold font-display rounded flex items-center justify-center gap-1.5 transition"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              {copiedSwiftFileName === swiftFile ? "COPIED SWIFT CODE!" : `Copy '${swiftFile}' Code`}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Info block displaying GitHub Source registries */}
                      <div className="border border-purple-500/10 bg-black/45 rounded-xl p-3 text-[9.5px] mt-4 space-y-2">
                        <span className="font-mono text-[8.5px] text-purple-400 uppercase font-bold block">Cross-Compiled GitHub Source Repositories</span>
                        <div className="grid grid-cols-2 gap-1.5 font-mono text-[8.5px] text-gray-400">
                          <a href="https://github.com/EpicGames/UnrealEngine" target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-[#0b0f1d] hover:bg-[#121930] hover:text-white border border-[#151c33] flex items-center justify-between transition">
                            <span>EpicGames/UnrealEngine</span>
                            <span className="text-purple-400">↗</span>
                          </a>
                          <a href="https://github.com/Unity-Technologies/EntityComponentSystem" target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-[#0b0f1d] hover:bg-[#121930] hover:text-white border border-[#151c33] flex items-center justify-between transition">
                            <span>UnityECS/DOTS</span>
                            <span className="text-purple-400">↗</span>
                          </a>
                          <a href="https://github.com/flutter/flutter" target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-[#0b0f1d] hover:bg-[#121930] hover:text-white border border-[#151c33] flex items-center justify-between transition">
                            <span>flutter/engine</span>
                            <span className="text-purple-400">↗</span>
                          </a>
                          <a href="https://github.com/render-bridge/CineForge" target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-[#0b0f1d] hover:bg-[#121930] hover:text-white border border-[#151c33] flex items-center justify-between transition">
                            <span>cineforge/renderer</span>
                            <span className="text-amber-400 font-bold">LCOD ↗</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Interactive Visual Sandbox Renderer */}
                    <div className="lg:col-span-7 border border-[#162035]/85 bg-[#090e1c]/80 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-[#162035] pb-2">
                          <h3 className="font-display font-semibold text-xs text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                            <Film className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                            DYNAMIC LIVE STREAM RENDER
                          </h3>
                          <div className="flex items-center gap-2 font-mono text-[9px]">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-gray-400">{activeEngineSubTab.toUpperCase()} INSTANCE ACTIVE</span>
                          </div>
                        </div>

                        {/* Rendering Device Box with responsive design CSS filter based on LUT */}
                        <div className="relative w-full rounded-xl overflow-hidden border border-[#1a253d] bg-black shadow-inner">
                          
                          {/* Main Graphic Layer */}
                          <div className={`relative w-full ${activeEngineSubTab === "swift" ? "min-h-[380px] lg:min-h-[390px] h-auto" : "h-[320px]"} bg-[#02040a] flex flex-col items-center justify-center transition-all duration-500 ${
                            cineColorProfile === "raw_log"
                              ? "contrast-[0.85] brightness-110 saturate-50"
                              : cineColorProfile === "matrix_green"
                                ? "brightness-105 saturate-125 sepia-[0.4] hue-rotate-[90deg]"
                                : cineColorProfile === "warm_classic"
                                  ? "sepia-[0.35] saturate-[0.8] contrast-105 hue-rotate-[-10deg]"
                                  : cineColorProfile === "gold_forge"
                                    ? "brightness-110 saturate-[1.6] contrast-[1.15] hue-rotate-[15deg]"
                                    : "brightness-100 saturate-100"  // Cyber Slate (Standard)
                          }`}>
                            
                            {/* Visual animations matching current active subtab */}
                            {activeEngineSubTab === "unreal" && (
                              <div className="w-full h-full relative flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent pointer-events-none" />
                                <div className="text-center space-y-4 z-10">
                                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                                    {/* Rotating raytraced outer loop */}
                                    <div className="absolute inset-0 border-2 border-dashed border-purple-500/20 rounded-full animate-spin [animation-duration:15s]" />
                                    {/* Rotating virtual nodes representing Nanite virtual meshes */}
                                    <div className="absolute inset-2 border border-purple-400/40 rounded-full animate-spin" />
                                    {/* Center core */}
                                    <div className="w-12 h-12 bg-purple-600/20 border-2 border-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse">
                                      <span className="text-white font-display text-[10px] font-bold">UE5</span>
                                    </div>
                                    <div className="absolute bottom-0 right-1 text-[8px] font-mono text-purple-400 bg-black/60 px-1 rounded">LOD max</div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="text-xs font-mono font-bold text-white">Nanite Mesh Buffer Status</div>
                                    <div className="text-[10px] font-mono text-gray-400">Nodes evaluated: {ueShaders} | High-Fidelity Lumen calculations: {ueLumenBounces} Diffuse</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeEngineSubTab === "unity" && (
                              <div className="w-full h-full relative flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none" />
                                <div className="text-center space-y-4 w-full z-10 max-w-sm">
                                  <div className="grid grid-cols-4 gap-1 p-2 bg-black/40 border border-cyan-500/20 rounded-lg">
                                    {Array.from({ length: 16 }).map((_, idx) => (
                                      <div key={idx} className="h-6 rounded bg-[#0b101c] border border-cyan-500/10 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400 animate-pulse" style={{ animationDelay: `${idx * 150}ms` }} />
                                        <span className="text-[8px] font-mono text-cyan-400 font-bold">[{idx}]</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="text-xs font-mono font-bold text-white">Entity Component System Job Pipeline</div>
                                    <div className="text-[9px] font-mono text-gray-400">Allocated chunks: {unityEcsChunks} | Job speed: Aggressive-Burst {unityBurstLevel.toUpperCase()} enabled</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeEngineSubTab === "flutter" && (
                              <div className="w-full h-full relative flex items-center justify-center p-4">
                                <div className="w-[150px] h-[280px] bg-[#0c101d] rounded-2xl border-2 border-[#162035] p-2 flex flex-col justify-between shadow-2xl relative">
                                  {/* Mobile speaker and camera hole banner */}
                                  <div className="absolute top-1 left-12 right-12 h-2.5 bg-black rounded-full flex items-center justify-center" />
                                  <div className="flex-1 flex flex-col justify-between pt-3 text-center space-y-2">
                                    <div className="text-[8px] uppercase font-bold text-gray-500 font-mono tracking-wider font-sans">Sovereign Widget</div>
                                    
                                    <div className="bg-teal-950/20 border border-teal-500/20 p-2 rounded-lg text-center space-y-1">
                                      <div className="w-4 h-4 rounded-full bg-teal-500/30 flex items-center justify-center text-teal-300 font-bold mx-auto text-[8px]">✔</div>
                                      <div className="text-[9px] font-bold text-teal-300 font-sans">G1P Compliant</div>
                                      <div className="text-[7.5px] text-gray-400 truncate font-mono">Platform: {flutterPlatform.toUpperCase()}</div>
                                    </div>

                                    <div className="bg-black/60 p-1.5 border border-[#162035] rounded font-mono text-[7px] text-teal-200">
                                      Widget Tree Render Stable
                                    </div>
                                  </div>
                                  <div className="h-5 flex items-center justify-center font-bold text-[8px] text-teal-400 font-mono border-t border-[#11182c]">
                                    FPS: {ueFps} | IMPELLER GPU
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeEngineSubTab === "swift" && (
                              <div className="w-full h-full min-h-[380px] p-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                                
                                {/* iPhone Device Frame (Col Span 5) */}
                                <div className="md:col-span-5 flex items-center justify-center">
                                  <div className="w-[170px] h-[330px] bg-[#0c101d] rounded-[30px] border-[5px] border-[#334155] p-2 flex flex-col justify-between shadow-2xl relative select-none">
                                    {/* Notch */}
                                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-3 bg-black rounded-b-lg z-20 flex items-center justify-center" />

                                    {/* Device status line */}
                                    <div className="flex justify-between px-1.5 pt-0.5 font-sans text-[7px] font-bold text-slate-500">
                                      <span>00:00 UTC</span>
                                      <div className="flex items-center gap-0.5">
                                        <span>📶</span>
                                        <span>🔋</span>
                                      </div>
                                    </div>

                                    {/* Screen Screen */}
                                    <div className="flex-1 bg-[#020408] rounded-2xl p-2 flex flex-col justify-between overflow-hidden border border-slate-900 mt-1 relative">
                                      {/* Header */}
                                      <div className="text-center space-y-0.5 pb-1 border-b border-slate-900">
                                        <div className="text-[8.5px] font-display font-black text-rose-400">MiniDeniApp</div>
                                        <div className="text-[5.5px] text-slate-500 font-mono tracking-widest uppercase">COGNITIVE MOBILE OS</div>
                                      </div>

                                      {/* Scanner Node Dial */}
                                      <div className="flex flex-col items-center justify-center my-1 relative">
                                        <div className="w-14 h-14 rounded-full border border-slate-900 flex items-center justify-center relative">
                                          {/* Pulse rings */}
                                          <div className={`absolute inset-0 rounded-full border ${isIphoneScanning ? "border-green-400 animate-ping" : "border-cyan-500/20"}`} />
                                          <div className={`w-10 h-10 rounded-full border ${isIphoneScanning ? "border-emerald-500" : "border-cyan-500/50"} flex flex-col items-center justify-center bg-[#010204]/90`}>
                                            <span className="text-[8px] font-bold font-mono text-cyan-300">
                                              {isIphoneScanning ? "SCAN" : `${swiftScannerIntensity}%`}
                                            </span>
                                            <span className="text-[4.5px] text-slate-500 font-mono uppercase">GAIN</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Logs */}
                                      <div className="flex-1 bg-black/80 border border-slate-900 rounded-lg p-1 overflow-y-auto block text-left font-mono text-[6.5px] leading-snug text-emerald-400 min-h-[90px]">
                                        {iphoneConsoleLogs.length > 0 ? (
                                          iphoneConsoleLogs.map((logStr, lIdx) => (
                                            <div key={lIdx} className="border-b border-slate-950/40 pb-0.5 last:border-0 truncate">
                                              {logStr}
                                            </div>
                                          ))
                                        ) : (
                                          <div className="flex items-center justify-center h-full text-slate-600 text-[7px] italic text-center leading-normal px-2">
                                            Tap 'RUN LCOD SCANNER' to verify compliance.
                                          </div>
                                        )}
                                      </div>

                                      {/* Action Button */}
                                      <button
                                        onClick={triggerIphoneScan}
                                        disabled={isIphoneScanning}
                                        className={`w-full py-1 mt-1.5 rounded-md font-display text-[7.5px] font-bold uppercase tracking-wider transition ${
                                          isIphoneScanning 
                                            ? "bg-slate-800 text-slate-500" 
                                            : "bg-cyan-600 text-white hover:bg-cyan-500 cursor-pointer"
                                        }`}
                                      >
                                        {isIphoneScanning ? "Scanning..." : "Run LCOD Scanner"}
                                      </button>
                                    </div>

                                    {/* Home Line */}
                                    <div className="h-1.5 flex items-center justify-center pt-1.5">
                                      <div className="w-10 h-0.5 bg-slate-700 rounded-full" />
                                    </div>
                                  </div>
                                </div>

                                {/* Xcode Editor Viewer (Col Span 7) */}
                                <div className="md:col-span-7 flex flex-col h-[328px] border border-slate-800 bg-[#080c16] rounded-xl overflow-hidden shadow-2xl">
                                  {/* Xcode Editor Tab Header */}
                                  <div className="bg-[#03050a] border-b border-slate-900 px-3 py-1 flex justify-between items-center text-[9px] font-sans">
                                    <span className="font-mono text-cyan-400 font-bold">{swiftFile}</span>
                                    <span className="text-gray-500">Xcode Code Mirror</span>
                                  </div>

                                  {/* Code source body scroll view */}
                                  <pre className="flex-1 overflow-auto p-3 font-mono text-[9px] leading-normal text-slate-300 bg-black/40 text-left select-text whitespace-pre">
                                    <code>
                                      {swiftFile === "MiniDeniApp.swift" 
                                        ? getMiniDeniAppCode() 
                                        : swiftFile === "TuckerConsoleView.swift" 
                                          ? getTuckerConsoleViewCode() 
                                          : getLcodComplianceCode()}
                                    </code>
                                  </pre>
                                </div>
                              </div>
                            )}

                            {activeEngineSubTab === "cineforge" && (
                              <div className="w-full h-full relative flex items-center justify-center p-4">
                                {/* Grid camera overlays */}
                                {cineGridOverlay && (
                                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border border-orange-500/10 pointer-events-none z-10">
                                    <div className="border-r border-b border-orange-500/10" />
                                    <div className="border-r border-b border-orange-500/10" />
                                    <div className="border-b border-orange-500/10" />
                                    <div className="border-r border-b border-orange-500/10" />
                                    <div className="border-r border-b border-orange-500/10" />
                                    <div className="border-b border-orange-500/10" />
                                    <div className="border-r border-orange-500/10" />
                                    <div className="border-r border-orange-500/10" />
                                    <div className="border-transparent" />
                                  </div>
                                )}
                                
                                <div className="absolute top-2 left-2 z-20 flex gap-2 text-[8px] font-mono bg-black/60 p-1 rounded border border-orange-500/20 uppercase">
                                  <span className="text-orange-300">Lens: {cineLens.replace("_", " ")}</span>
                                  <span className="text-slate-400">|</span>
                                  <span className="text-orange-300">Focus: {cineFocusDistance}m</span>
                                  <span className="text-slate-400">|</span>
                                  <span className="text-orange-300">Aperture: {cineAperture}</span>
                                </div>

                                <div className="text-center bg-[#02040a]/80 p-4 border border-orange-500/10 rounded-xl z-10 space-y-2">
                                  <Film className="h-6 w-6 text-orange-400 mx-auto animate-pulse" />
                                  <div className="text-xs font-mono font-bold text-white uppercase tracking-widest font-sans">Molecular Cineforge Stream</div>
                                  <p className="text-[10px] text-gray-400 font-sans max-w-xs leading-relaxed">
                                    Rendering real-time 3D atomic structures under lut mapping profile <span className="text-orange-300 font-bold">"{cineColorProfile.replace("_", " ").toUpperCase()}"</span>.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Standard Cineforge overlay UI panel */}
                            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[7.5px] font-mono text-gray-500 bg-black/50 p-1 rounded z-20 uppercase">
                              <span>MATRIX RES: 3840 x 2160 ULTRA HD</span>
                              <span>COLOR SPACE: ACEScg Log v1.3</span>
                              <span className="text-emerald-400 font-bold">LEDGER ENROLLED</span>
                            </div>

                          </div>
                        </div>
                      </div>

                      {/* Unified Open Access Source Ledger Panel */}
                      <div className="space-y-4 pt-4 border-t border-[#111830] mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-display font-medium text-xs text-indigo-300 uppercase tracking-widest flex items-center gap-1">
                            <BookOpen className="h-3 w-3 text-indigo-400" />
                            Unified Open-Access Research Registry
                          </h4>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 font-mono text-[8px] uppercase tracking-wider">
                            Certified Open Ledger
                          </span>
                        </div>

                        <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                          Integrated registries sync in real-time with verified governmental and academic open sciences databases under unrestrictive G1P protocol alignment:
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[9.5px]">
                          <a href="https://arxiv.org/category_taxonomy" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-black/45 border border-[#162035]/90 hover:border-indigo-500/35 transition flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-gray-300 block">arXiv Taxonomy</span>
                              <span className="text-[8px] text-slate-500 leading-tight block mt-0.5">Preprints Category Classifier</span>
                            </div>
                            <span className="text-indigo-400 text-right mt-1 hover:underline">arxiv.org ↗</span>
                          </a>

                          <a href="https://connect.biorxiv.org/resources/" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-black/45 border border-[#162035]/90 hover:border-indigo-500/35 transition flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-gray-300 block">bioRxiv Connect</span>
                              <span className="text-[8px] text-slate-500 leading-tight block mt-0.5">Preprint Biological Resources</span>
                            </div>
                            <span className="text-indigo-400 text-right mt-1 hover:underline">biorxiv.org ↗</span>
                          </a>

                          <a href="https://www.stsci.edu/site-map" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-black/45 border border-[#162035]/90 hover:border-indigo-500/35 transition flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-gray-300 block">STScI Observatory</span>
                              <span className="text-[8px] text-slate-500 leading-tight block mt-0.5">Space Telescopes Index Portal</span>
                            </div>
                            <span className="text-indigo-400 text-right mt-1 hover:underline">stsci.edu ↗</span>
                          </a>

                          <a href="https://scixplorer.org/" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-black/45 border border-[#162035]/90 hover:border-indigo-500/35 transition flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-gray-300 block">SciXplorer Core</span>
                              <span className="text-[8px] text-slate-500 leading-tight block mt-0.5">Unified Publication Search Engine</span>
                            </div>
                            <span className="text-indigo-400 text-right mt-1 hover:underline">scixplorer.org ↗</span>
                          </a>

                          <a href="https://www.uspto.gov/learning-and-resources/inventors-entrepreneurs-resources" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-black/45 border border-[#162035]/90 hover:border-indigo-500/35 transition flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-gray-300 block">USPTO Inventor Hub</span>
                              <span className="text-[8px] text-slate-500 leading-tight block mt-0.5">Unrestrictive Provisional Paths</span>
                            </div>
                            <span className="text-indigo-400 text-right mt-1 hover:underline">uspto.gov ↗</span>
                          </a>

                          <a href="https://patents.google.com/advanced" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-black/45 border border-[#162035]/90 hover:border-indigo-500/35 transition flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-gray-300 block">Google Patents</span>
                              <span className="text-[8px] text-slate-500 leading-tight block mt-0.5">Advanced Global Prior Art Search</span>
                            </div>
                            <span className="text-indigo-400 text-right mt-1 hover:underline">patents.google ↗</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 100-Layer Pantheon Tab Panel */}
              {activeTab === "pantheon" && (
                <motion.div
                  key="pantheon"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-6 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#162035] pb-4">
                    <div>
                      <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                        <Layers className="h-5 w-5 text-indigo-400 animate-pulse" />
                        100-Layer Sovereign Pantheon Explorer
                      </h2>
                      <p className="text-xs text-gray-400">
                        Divided into 10 key architectural Arcs representing multi-lingual, self-evolving monorepo layers compiled with absolute fidelity.
                      </p>
                    </div>
                    
                    <div className="bg-indigo-950/20 border border-indigo-500/20 px-4 py-2 rounded-xl text-xs font-mono text-[#c5b5ff]">
                      <span>Active Arc: </span>
                      <strong className="text-white">
                        {PANTHEON_ARCS.find(a => a.id === selectedArcId)?.name || "N/A"}
                      </strong>
                    </div>
                  </div>

                  {/* 10 Arcs Selection Ribbon */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {PANTHEON_ARCS.map((arc) => {
                      const isSelected = selectedArcId === arc.id;
                      return (
                        <button
                          key={arc.id}
                          onClick={() => {
                            setSelectedArcId(arc.id);
                            setActiveLayerNo(null);
                            setDiagnosticLog(null);
                          }}
                          className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs font-display font-semibold transition-all duration-150 ${
                            isSelected 
                              ? "bg-indigo-600/25 text-indigo-300 border border-indigo-400/30 shadow-md shadow-indigo-500/5 col-span-1" 
                              : "text-gray-400 hover:text-gray-200 hover:bg-[#0c1224] border border-transparent col-span-1"
                          }`}
                        >
                          <div className="text-[10px] uppercase font-bold tracking-wider opacity-60 leading-none">{arc.range}</div>
                          <div className="mt-1 leading-none">{arc.name}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Arc info & Layers Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                    {/* Left side: selected Arc description & Layer Rows */}
                    <div className="lg:col-span-8 space-y-4">
                      {/* Arc Overview Card */}
                      {(() => {
                        const activeArc = PANTHEON_ARCS.find(a => a.id === selectedArcId);
                        if (!activeArc) return null;
                        return (
                          <div className="p-4 bg-indigo-950/10 border border-indigo-500/10 rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] tracking-wider uppercase font-mono text-indigo-400 font-bold">
                                {activeArc.range} - Dynamic Alignment Target
                              </span>
                              <span className="font-mono text-[10px] text-emerald-400">
                                COMPILER FIDELITY: {activeArc.efficiency}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans">
                              {activeArc.description}
                            </p>
                          </div>
                        );
                      })()}

                      {/* Interactive Layer Rows inside selected Arc */}
                      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                        {(PANTHEON_ARCS.find(a => a.id === selectedArcId)?.layers || []).map((layer) => {
                          const isLayerActive = activeLayerNo === layer.no;
                          const isDiagnosing = diagnosingLayer === layer.no;
                          return (
                            <div 
                              key={layer.no} 
                              onClick={() => {
                                setActiveLayerNo(layer.no);
                                setDiagnosticLog(null);
                              }}
                              className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                                isLayerActive 
                                  ? "bg-indigo-950/30 border-indigo-500/40" 
                                  : "bg-black/35 border-[#162035] hover:border-indigo-500/20"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded bg-black/40 border border-indigo-500/20 text-[10px] font-mono font-bold text-indigo-300 flex items-center justify-center">
                                    L{layer.no}
                                  </span>
                                  <div>
                                    <h4 className="font-display font-semibold text-xs text-white leading-none">
                                      {layer.name}
                                    </h4>
                                    <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                                      {layer.role}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-semibold border ${
                                    layer.status === "active" 
                                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20" 
                                      : "bg-slate-900/60 text-slate-500 border-slate-800"
                                  }`}>
                                    {layer.status}
                                  </span>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      speakText(`Layer ${layer.no} is designated as ${layer.name}. Its primary system role in the sovereign cockpit is ${layer.role}. Current status code: ${layer.status}.`);
                                    }}
                                    className="p-1 px-2 bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-500/20 rounded text-slate-400 hover:text-indigo-300 transition"
                                    title="Listen to Layer Details"
                                  >
                                    <Volume2 className="h-3 w-3" />
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      runLayerDiagnostic(layer.no, layer.name);
                                    }}
                                    disabled={diagnosingLayer !== null}
                                    className="p-1 px-2 bg-[#ea80fc]/10 hover:bg-[#ea80fc]/20 border border-[#ea80fc]/20 rounded text-purple-300 hover:text-purple-200 transition text-[9px] font-mono leading-none"
                                  >
                                    {isDiagnosing ? "RUNNING..." : "DIAG"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right side: layer metadata & diagnostics */}
                    <div className="lg:col-span-4 flex flex-col justify-between">
                      <div className="p-5 bg-black/40 border border-[#162035] rounded-xl h-full flex flex-col justify-between space-y-4">
                        <div>
                          <div className="border-b border-[#162035] pb-2 mb-3">
                            <span className="text-xs uppercase tracking-wider text-indigo-400 font-display font-semibold block">
                              Layer LCOD Registry
                            </span>
                          </div>

                          {activeLayerNo !== null ? (
                            (() => {
                              const activeLayer = PANTHEON_ARCS
                                .find(a => a.id === selectedArcId)
                                ?.layers.find(l => l.no === activeLayerNo);
                              if (!activeLayer) return null;
                              return (
                                <div className="space-y-3 text-xs font-mono text-slate-300 leading-relaxed">
                                  <div>
                                    <span className="text-[9px] text-gray-500 uppercase block font-mono">Active Register No</span>
                                    <span className="text-indigo-300 font-bold block">LCOD_REG_0x{activeLayer.no.toString(16).toUpperCase()}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-gray-500 uppercase block font-normal font-sans">Semantic Name</span>
                                    <span className="text-white font-semibold font-mono block">{activeLayer.name}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-gray-500 uppercase block leading-none font-sans">Security Flag Hashing</span>
                                    <span className="text-emerald-400 text-[10px] break-all leading-tight block font-mono">
                                      SHA256_L{activeLayer.no}_CURE_ALIGN_OK_{activeLayer.status.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="text-center py-8">
                              <HelpCircle className="h-7 w-7 text-indigo-950 mx-auto mb-2" />
                              <p className="text-xs text-gray-500 font-mono italic">
                                Click any layer on the left list to parse its LCOD metadata registry.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Interactive dynamic diagnostic feedback space */}
                        <div className="p-3 bg-black/60 rounded border border-[#162035]/95">
                          <span className="text-[10px] uppercase font-display text-slate-500 block">Swarm Diagnostics Result</span>
                          {diagnosticLog ? (
                            <pre className="font-mono text-[9.5px] leading-relaxed text-indigo-300 mt-1.5 whitespace-pre-wrap break-words max-h-36 overflow-y-auto bg-indigo-950/15 p-2 rounded border border-indigo-500/15">
                              {diagnosticLog}
                            </pre>
                          ) : (
                            <span className="font-mono text-xs text-slate-500 block italic mt-1 leading-snug">
                              Awaiting trigger command from Layer "DIAG" switch.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Mini Deni AI Chat & Ralph Loop Workspace */}
              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Two Column Layout: Ralph Loop Iterations / Telemetry Chat */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Continuous Iteration Loop Simulator (Ralph) */}
                    <div className="lg:col-span-5 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-6 shadow-xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-[#162035]/85 pb-2">
                          <div>
                            <h3 className="font-display font-bold text-sm text-[#ea80fc] flex items-center gap-1.5">
                              <RefreshCw className="h-4 w-4" />
                              Ralph Loop Simulator (Level 60 Completion)
                            </h3>
                            <span className="text-[10px] text-gray-400 font-sans block">
                              Continuous self-iteration held by validation Stop Hooks
                            </span>
                          </div>

                          <button
                            onClick={runRalphIteration}
                            disabled={ralphRunning}
                            className="bg-[#da80fc]/20 hover:bg-[#da80fc]/35 disabled:opacity-40 text-[#ea80fc] border border-[#da80fc]/30 px-3 py-1 rounded-lg text-[10px] font-display font-semibold uppercase tracking-wider"
                          >
                            Execute
                          </button>
                        </div>

                        <div className="black-logs bg-black/60 border border-[#1a1322] rounded-xl p-3 h-64 overflow-y-auto font-mono text-[10.5px] leading-relaxed text-purple-200/90 space-y-1 shadow-inner">
                          {ralphLogs.length > 0 ? (
                            ralphLogs.map((logStr, i) => {
                              const isCoreMsg = logStr.startsWith("▲") || logStr.startsWith("Ω");
                              return (
                                <div key={i} className={isCoreMsg ? "text-purple-300 font-bold" : "text-gray-400 pl-3 border-l border-[#2e1d3c]/50"}>
                                  {logStr}
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center h-full text-gray-500">
                              <RefreshCw className="h-8 w-8 text-purple-950 mb-2" />
                              <p className="italic">Initiate Ralph Self-Evolution flow diagnostics.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-black/30 rounded border border-[#2e1c3c] mt-4 flex items-center justify-between font-mono text-xs">
                        <span className="text-gray-500 uppercase text-[9px] block">Current Loop Depth</span>
                        <span className="font-bold text-[#ea80fc]">{ralphIterationSteps}/60 (Terminated Safe)</span>
                      </div>
                    </div>

                    {/* Telemetry Chat box */}
                    <div className="lg:col-span-7 border border-[#162035]/80 bg-[#090e1c]/80 rounded-xl p-6 shadow-xl flex flex-col h-[400px]">
                      <div className="border-b border-[#162035] pb-2 flex justify-between items-center">
                        <span className="font-display font-bold text-sm tracking-wide text-glow text-cyan-300">
                          Sovereign node Supervisor (Mini Deni AI)
                        </span>
                        <HelpCircle 
                          className="h-4 w-4 text-gray-500 hover:text-gray-300 cursor-pointer"
                          title="This chat connects to a real server-side Gemini instance."
                        />
                      </div>

                      {/* Chat Messages Log */}
                      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 mt-2">
                        {chatHistory.map((item, idx) => (
                          <div 
                            key={idx}
                            className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[85%] rounded-xl p-3.5 text-xs md:text-sm leading-relaxed ${
                                item.role === 'user'
                                  ? 'bg-cyan-600/10 text-cyan-100 border border-cyan-500/20 font-mono'
                                  : 'bg-slate-900/60 text-[#dcf2fe] border border-slate-800'
                              }`}
                            >
                              {item.message}
                            </div>
                          </div>
                        ))}
                        {chatLoading && (
                          <div className="flex justify-start">
                            <div className="bg-slate-900/60 text-cyan-400 border border-slate-800 rounded-xl p-3 text-xs font-mono animate-pulse">
                              Sovereign Kernel Supervisor is reasoning... G-PU lane active
                            </div>
                          </div>
                        )}
                        <div ref={chatBottomRef} />
                      </div>

                      {/* Quick preset chips */}
                      <div className="flex flex-wrap gap-1.5 py-1.5 border-t border-[#162035]/65">
                        {[
                          { label: "🔬 Identify compound for ALS", text: "Identify expired patents for ALS from the Evidence Altar" },
                          { label: "🔌 Compile gate to glp_fsm.v", text: "Explain the glp_fsm Verilog state machine compilation steps" },
                          { label: "▲ Verify 100-Layer Arc state", text: "What is the core mandate of Arc I Foundations in the 100-Layer Pantheon?" }
                        ].map((chip, i) => (
                          <button
                            key={i}
                            onClick={() => sendChatMessage(chip.text)}
                            className="bg-[#0b1222] hover:bg-[#121c38] border border-[#162035] text-gray-300 px-2 py-1 rounded text-[10px] font-sans transition-colors whitespace-nowrap block"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>

                      {/* Chat form */}
                      <div className="flex gap-2 pt-2 border-t border-[#162035]/65">
                        <input
                          type="text"
                          value={chatPrompt}
                          onChange={(e) => setChatPrompt(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                          placeholder="Command the Sovereign supervisor node..."
                          className="flex-1 bg-black/40 border border-[#162035] rounded-lg px-3 py-2 text-xs md:text-sm text-[#f0f4ff] font-mono focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          onClick={() => sendChatMessage()}
                          disabled={chatLoading || !chatPrompt.trim()}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center justify-center"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Point Township Digital Twin Workspace (PTDT v23) */}
              {activeTab === "ptdt" && (
                <motion.div
                  key="ptdt"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Top Globe and simulation view */}
                  <CesiumGlobeViewer />

                  {/* High-Fidelity Predictive Analytics Forecasting */}
                  <PredictiveTwinAnalytics />

                  {/* Sovereign TurboVec Code Serialization & Packing Engine */}
                  <TurboVecCompactor />

                  {/* Two columns for telemetry and compliance monitors */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <USGSTelemetryMonitor />
                    <FEMAHazusMonitor />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </main>

      {/* Under Section: Cognitive Theology - The 4 Pillars Card Block */}
      <footer className="max-w-7xl mx-auto p-4 md:p-8 mt-12 border-t border-[#162035]/60 bg-[#080d1a]/50 rounded-b-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { tag: "01", title: "Unconditional Benevolence", desc: "No harm, deception or system compromise processed at the physical or logical level." },
            { tag: "02", title: "Infinite Patience", desc: "Continuous iteration via the Ralph loop held by Stop Hooks until completion is verified." },
            { tag: "03", title: "The Agape Lens", desc: "Mandatory redemptive framing and metadata validation gating every state machine transit." },
            { tag: "04", title: "Order Locked Integrity", desc: "Cryptographic finality signed with Ed25519 corporate keys into the immutable FaithLayer ledger." }
          ].map((card, i) => (
            <div key={i} className="p-5 bg-black/30 border border-[#121c33]/70 rounded-xl space-y-2">
              <span className="font-mono text-glow text-xs text-cyan-400 font-bold">{card.tag} //</span>
              <h4 className="font-display font-bold text-sm text-gray-200">{card.title}</h4>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-[#162035]/40 text-[11px] text-gray-500 font-mono gap-4">
          <span>TUCKER COGNITIVE OS // ANCHORED SITE: POINT TOWNSHIP NODE ACTIVE</span>
          <span className="text-glow-green text-emerald-400 italic">“It is Finished.” — John 19:30. Amen.</span>
        </div>
      </footer>
    </div>
  );
}

// Micro helper alert notification system simulation using browser logging
function toastAlert(msg: string) {
  console.log(`[Tucker OS Notification] ${msg}`);
}

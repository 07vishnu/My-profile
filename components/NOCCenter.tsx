import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { 
  Server, Cpu, Database, ShieldAlert, ShieldCheck, 
  Terminal as TerminalIcon, Play, RefreshCw, Zap, CheckCircle2, 
  Activity, Search, Filter, Info, ChevronRight, HardDrive, Wifi 
} from 'lucide-react';

interface NOCNode {
  id: number;
  rack: string;
  slot: number;
  hostname: string;
  ip: string;
  os: string;
  hypervisor: string;
  status: 'OPTIMAL' | 'SYNCING' | 'RE-INDEXING' | 'MAINTENANCE';
  cpuLoad: number;
  ramUsage: number; // in GB
  vmsCount: number;
  diskStatus: 'HEALTHY' | 'VERIFYING';
  lastBackup: string;
}

const ACTION_MESSAGES = {
  vMotion: [
    { text: "[vMotion] Initiating live hot migration request of heavy Database VM...", delay: 200 },
    { text: "[vMotion] Locating optimal target VMware hypervisor host cluster...", delay: 600 },
    { text: "[vMotion] Found destination ESXi cluster node: hcl-esxi-prod-12", delay: 900 },
    { text: "[vMotion] Phase 1/3: Synchronizing raw memory page tables (128 GB memory stack)...", delay: 1400 },
    { text: "[vMotion] Phase 2/3: Hot-shifting live thread instruction pointers context...", delay: 2000 },
    { text: "[vMotion] Phase 3/3: Re-binding network virtual port adapter interfaces...", delay: 2600 },
    { text: "[vMotion] SUCCESS! VM migrated to node 12 with 0ms interruption. Cluster load balanced.", delay: 3000 }
  ],
  rubrik: [
    { text: "[Rubrik] Fetching immutable block manifest index catalog for TENET-PROD-AD...", delay: 200 },
    { text: "[Rubrik] Establishing air-gapped secure sandbox recover clone environment...", delay: 700 },
    { text: "[Rubrik] Scanning snapshot blocks via SHA-256 signatures check...", delay: 1100 },
    { text: "[Rubrik] Signature scan checklist: [COMPLIANT - SIGNED BY MASTER TRUST]", delay: 1500 },
    { text: "[Rubrik] Mounting checkpoint volume directories to isol-host-04...", delay: 2100 },
    { text: "[Rubrik] SUCCESS! Active Directory node successfully simulated, verify status: VALID", delay: 2700 }
  ],
  telemetry: [
    { text: "[Moogsoft] Telemetry flood storm detected on Core Router Stack (VLAN-82)!", delay: 200 },
    { text: "[Moogsoft] Parsing 1,450 incoming SNMP traps and syslog event nodes...", delay: 600 },
    { text: "[Moogsoft] Alert Storm Vector: repetitive VM heartbeat timeout events.", delay: 1100 },
    { text: "[Moogsoft] Deploying regex-guided incident suppressor and consolidation nodes...", delay: 1600 },
    { text: "[Moogsoft] Consolidating 1,450 event instances down to 1 single actionable incident ticket.", delay: 2200 },
    { text: "[Moogsoft] SUCCESS! Event storm suppressed by 93.4%. NOC core dashboard is back to GREEN.", delay: 2800 }
  ],
  wsus: [
    { text: "[WSUS] Triggering active-cluster security patch audit across legacy & modern Wintel nodes...", delay: 200 },
    { text: "[WSUS] Auditing 16,000 hosts. Found 8 nodes missing critical safety patch KB503124...", delay: 800 },
    { text: "[WSUS] Staging cumulative cabinet safety packages on regional distribution nodes...", delay: 1300 },
    { text: "[WSUS] Deploying background WinRM shell executor bundle context...", delay: 1800 },
    { text: "[WSUS] Applying patch KB503124 safely with local reboot suppression flags...", delay: 2400 },
    { text: "[WSUS] SUCCESS! 100% compliance met. All Windows systems hardened and validated.", delay: 3000 }
  ]
};

export const NOCCenter: React.FC = () => {
  // Generate stable mock infrastructure nodes representing the 16,000 servers
  const initialNodes: NOCNode[] = useMemo(() => {
    const arr: NOCNode[] = [];
    const osVersions = ['Windows Server 2022', 'Windows Server 2019', 'Windows Server 2016', 'ESXi 8.0.2', 'ESXi 7.0.3'];
    const racks = ['RACK-A', 'RACK-B', 'RACK-C', 'RACK-D', 'RACK-E', 'RACK-F'];
    
    for (let i = 1; i <= 100; i++) {
      const rack = racks[Math.floor((i - 1) / 17)];
      const slot = ((i - 1) % 16) + 1;
      const staticStatus: NOCNode['status'] = i % 14 === 0 
        ? 'SYNCING' 
        : i % 25 === 0 
        ? 'RE-INDEXING' 
        : i % 33 === 0 
        ? 'MAINTENANCE' 
        : 'OPTIMAL';

      arr.push({
        id: i,
        rack,
        slot,
        hostname: `V-WNT-${rack.slice(-1)}-DB${String(i).padStart(3, '0')}`,
        ip: `10.142.128.${i + 3}`,
        os: osVersions[i % osVersions.length],
        hypervisor: i % 2 === 0 ? 'VMware ESXi vSphere' : 'Microsoft Hyper-V Failover Cluster',
        status: staticStatus,
        cpuLoad: Math.floor(Math.random() * (45 - 12 + 1)) + 12,
        ramUsage: Math.floor(Math.random() * (128 - 16 + 1)) + 16,
        vmsCount: Math.floor(Math.random() * (22 - 4 + 1)) + 4,
        diskStatus: i % 40 === 0 ? 'VERIFYING' : 'HEALTHY',
        lastBackup: `${Math.floor(Math.random() * 5) + 1} hours ago (Rubrik Secure)`
      });
    }
    return arr;
  }, []);

  const [nodes, setNodes] = useState<NOCNode[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<NOCNode>(initialNodes[0]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive Simulator Actions State
  const [currentAction, setCurrentAction] = useState<'vMotion' | 'rubrik' | 'telemetry' | 'wsus' | null>(null);
  const [simulatorLogs, setSimulatorLogs] = useState<string[]>([]);
  const [simulatorProgress, setSimulatorProgress] = useState(0);
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Periodic visual fluctuate to make nodes feel absolutely "live"
  useEffect(() => {
    const timer = setInterval(() => {
      setNodes(prev => prev.map(node => {
        // Only slightly flucutate cpu load and ram usage
        if (node.status === 'OPTIMAL') {
          const deltaCpu = Math.floor(Math.random() * 6) - 3;
          const deltaRam = Math.floor(Math.random() * 4) - 2;
          return {
            ...node,
            cpuLoad: Math.max(5, Math.min(95, node.cpuLoad + deltaCpu)),
            ramUsage: Math.max(8, Math.min(128, node.ramUsage + deltaRam))
          };
        }
        return node;
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Update details section when active node undergoes fluctuation
  useEffect(() => {
    const updated = nodes.find(n => n.id === selectedNode.id);
    if (updated) setSelectedNode(updated);
  }, [nodes]);

  // Handle Simulator execution sequencing with timeouts
  const runSimulatorAction = (actionKey: 'vMotion' | 'rubrik' | 'telemetry' | 'wsus') => {
    if (isSimulatorRunning) return;
    
    setIsSimulatorRunning(true);
    setCurrentAction(actionKey);
    setSimulatorLogs([]);
    setSimulatorProgress(0);

    const steps = ACTION_MESSAGES[actionKey];
    let stepCount = 0;

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimulatorLogs(prev => [...prev, step.text]);
        const progressPercent = Math.min(100, Math.floor(((idx + 1) / steps.length) * 100));
        setSimulatorProgress(progressPercent);

        if (idx === steps.length - 1) {
          setIsSimulatorRunning(false);
        }
      }, step.delay);
    });
  };

  // Auto-scroll simulator logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [simulatorLogs]);

  // Compute node search & status filtering
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchSearch = 
        node.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.ip.includes(searchQuery) ||
        node.os.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.rack.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchFilter = filterStatus === 'ALL' || node.status === filterStatus;
      
      return matchSearch && matchFilter;
    });
  }, [nodes, searchQuery, filterStatus]);

  const statsCount = useMemo(() => {
    const active = nodes.length;
    const optimal = nodes.filter(n => n.status === 'OPTIMAL').length;
    const syncing = nodes.filter(n => n.status === 'SYNCING').length;
    const maintenance = nodes.filter(n => n.status === 'MAINTENANCE').length;
    return { active, optimal, syncing, maintenance };
  }, [nodes]);

  return (
    <div id="noc-center" className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-7xl relative z-10 scroll-mt-20">
      <div className="text-center mb-10 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-google-blue/10 rounded-full text-google-blue text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
          <Activity size={12} className="text-google-blue animate-pulse" />
          Interactive NOC Command Interface
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Virtual NOC Center & Cluster Sandbox
        </h2>
        <p className="text-sm md:text-base text-google-gray max-w-2xl mx-auto font-medium">
          Visualize real-time deployment parameters representing Vishnunath's production systems. Interact with nodes, audit system status profiles, or execute mock disaster recovery tasks.
        </p>
      </div>

      {/* Grid Dashboard Header Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-google-surface/60 border border-google-border rounded-2xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold text-google-gray uppercase tracking-wider">Simulated Environment Area</span>
            <Server size={14} className="text-google-blue" />
          </div>
          <div className="text-xl md:text-2xl font-black text-inherit">16,402 Hosts</div>
          <span className="text-[10px] text-google-blue font-mono font-bold uppercase">SECURE_NOC_STABLE</span>
        </div>
        <div className="p-4 bg-google-surface/60 border border-google-border rounded-2xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold text-google-gray uppercase tracking-wider">Nodes Optimal</span>
            <CheckCircle2 size={14} className="text-google-green" />
          </div>
          <div className="text-xl md:text-2xl font-black text-google-green">{statsCount.optimal}% Sync</div>
          <span className="text-[10px] text-google-green font-mono font-bold uppercase">100% SLA RESPONSIVE</span>
        </div>
        <div className="p-4 bg-google-surface/60 border border-google-border rounded-2xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold text-google-gray uppercase tracking-wider">Active Tasks Syncing</span>
            <RefreshCw size={14} className="text-google-yellow animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="text-xl md:text-2xl font-black text-google-yellow">{statsCount.syncing} Node Clusters</div>
          <span className="text-[10px] text-google-yellow font-mono font-bold uppercase">vMotion Load Adjusting</span>
        </div>
        <div className="p-4 bg-google-surface/60 border border-google-border rounded-2xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold text-google-gray uppercase tracking-wider">Incident Suppression</span>
            <Zap size={14} className="text-google-blue" />
          </div>
          <div className="text-xl md:text-2xl font-black text-inherit">93.4% suppressed</div>
          <span className="text-[10px] text-google-gray font-mono font-bold uppercase">Moogsoft correlator active</span>
        </div>
      </div>

      {/* Main Panel Box */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Columns: Node grid explorer */}
        <div className="lg:col-span-7 bg-google-surface/30 border border-google-border rounded-[24px] p-4 md:p-6 shadow-md backdrop-blur-sm relative overflow-hidden flex flex-col h-full min-h-[580px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-[#1a73e8] mb-1">Grid Telemetry Explorer</h3>
              <p className="text-xs text-google-gray font-medium">Click any host cell to audit its diagnostic logs and parameters.</p>
            </div>
            
            {/* Filtering tools */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-google-gray" />
                <input 
                  type="text" 
                  placeholder="Search hosts..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-google-bg border border-google-border hover:border-google-blue/50 focus:border-google-blue text-inherit outline-none rounded-full px-8 py-1 text-xs focus:ring-1 focus:ring-google-blue transition-all w-36"
                />
              </div>
              <select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-google-bg border border-google-border hover:border-google-blue/50 text-xs font-semibold rounded-full px-3 py-1 text-google-gray outline-none cursor-pointer focus:ring-1 focus:ring-google-blue hover:text-inherit"
              >
                <option value="ALL">All States</option>
                <option value="OPTIMAL">🟢 Optimal</option>
                <option value="SYNCING">🟡 Syncing</option>
                <option value="RE-INDEXING">🔵 Re-indexing</option>
                <option value="MAINTENANCE">⚪ Mainten.</option>
              </select>
            </div>
          </div>

          {/* Interactive Grid Nodes layout */}
          <div className="grid grid-cols-10 gap-1.5 md:gap-2 mb-6 p-4 rounded-xl bg-google-bg/60 border border-google-border flex-1 max-h-[380px] overflow-y-auto no-scrollbar justify-items-center">
            {filteredNodes.map(node => {
              const statusColors = {
                OPTIMAL: 'bg-google-green border-google-green/40 shadow-[0_0_5px_rgba(52,168,83,0.3)]',
                SYNCING: 'bg-google-yellow border-google-yellow/40 shadow-[0_0_5px_rgba(251,188,4,0.3)] animate-pulse',
                'RE-INDEXING': 'bg-google-blue border-google-blue/40 shadow-[0_0_5px_rgba(26,115,232,0.3)]',
                MAINTENANCE: 'bg-google-gray/50 border-google-gray/40'
              };

              const isHostSelected = node.id === selectedNode.id;

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-md border flex items-center justify-center transition-all relative group overflow-hidden ${
                    isHostSelected 
                      ? 'scale-110 !border-google-blue ring-2 ring-google-blue/20 bg-google-blue/10 z-10' 
                      : 'hover:scale-105 bg-google-surface/80 border-google-border hover:border-google-gray/50'
                  }`}
                  title={`${node.hostname} (${node.status})`}
                  aria-label={`Node ${node.hostname} state ${node.status}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusColors[node.status]}`}></span>
                  
                  {/* Subtle hover mini info card */}
                  <span className="absolute bottom-[110%] left-1/2 -translate-x-1/2 bg-[#202124] text-white text-[7px] font-mono rounded px-1.5 py-0.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[130]">
                    {node.hostname}
                  </span>
                </button>
              );
            })}
            {filteredNodes.length === 0 && (
              <div className="col-span-10 py-16 text-center">
                <ShieldAlert className="text-google-gray mx-auto mb-2" size={24} />
                <p className="text-xs text-google-gray font-bold">No simulated cluster hosts match search filter query.</p>
              </div>
            )}
          </div>

          {/* Grid Footer / Legend Key */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-bold text-google-gray border-t border-google-border pt-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-google-green"></span> OPTIMAL (ALIVE)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-google-yellow animate-pulse"></span> SYSTEM IN_FLUX (SYNCING / vMOTION)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-google-blue"></span> STORAGE POOL RE-INDEX</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-google-border"></span> MAINTENANCE STANDBY</span>
            </div>
            <span className="font-mono text-[9px] uppercase text-[#1a73e8]">GRID_SCALE_SYNCED</span>
          </div>
        </div>

        {/* Right 5 Columns: Dynamic Node specs + sandbox actions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Node Specification Details Section */}
          <div className="bg-google-surface/30 border border-google-border rounded-[24px] p-5 shadow-md relative overflow-hidden backdrop-blur-sm">
            <h4 className="font-bold text-xs uppercase tracking-widest text-google-blue mb-4 flex items-center gap-2">
              <Info size={14} /> Audit Node Inspector
            </h4>
            
            <div className="bg-google-bg rounded-xl border border-google-border p-4 space-y-3.5">
              <div className="flex justify-between items-center pb-2.5 border-b border-google-border">
                <div>
                  <span className="text-[8px] font-bold text-google-gray uppercase tracking-widest">Selected Hostname</span>
                  <div className="text-sm font-black font-mono tracking-tight text-inherit flex items-center gap-1.5">
                    {selectedNode.hostname}
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-[8.5px] font-black uppercase rounded-full ${
                  selectedNode.status === 'OPTIMAL' ? 'bg-google-green/10 text-google-green' : 'bg-google-yellow/10 text-google-yellow'
                }`}>
                  {selectedNode.status}
                </span>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-2 gap-3.5 text-xs font-semibold">
                <div>
                  <p className="text-[8px] text-google-gray uppercase tracking-widest mb-0.5">Cluster IP address</p>
                  <p className="font-mono text-xs">{selectedNode.ip}</p>
                </div>
                <div>
                  <p className="text-[8px] text-google-gray uppercase tracking-widest mb-0.5">Domain Architecture</p>
                  <p className="font-mono text-xs text-google-blue">{selectedNode.rack} (SLOT-{selectedNode.slot})</p>
                </div>
                <div>
                  <p className="text-[8px] text-google-gray uppercase tracking-widest mb-0.5">Wintel Core OS Version</p>
                  <p className="text-xs truncate">{selectedNode.os}</p>
                </div>
                <div>
                  <p className="text-[8px] text-google-gray uppercase tracking-widest mb-0.5">Hypervisor Host Manager</p>
                  <p className="text-xs truncate">{selectedNode.hypervisor}</p>
                </div>
              </div>

              {/* Resource Utilization Metrics */}
              <div className="space-y-2.5 pt-2 border-t border-google-border">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-google-gray mb-1">
                    <span>VIRTUAL CPU LOAD</span>
                    <span className="font-mono">{selectedNode.cpuLoad}%</span>
                  </div>
                  <div className="h-1.5 bg-google-border rounded-full overflow-hidden">
                    <div className="h-full bg-google-blue rounded-full transition-all duration-500" style={{ width: `${selectedNode.cpuLoad}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-google-gray mb-1">
                    <span>RAM ASSIGNED POOL</span>
                    <span className="font-mono">{selectedNode.ramUsage}GB / 256GB</span>
                  </div>
                  <div className="h-1.5 bg-google-border rounded-full overflow-hidden">
                    <div className="h-full bg-google-yellow rounded-full transition-all duration-500" style={{ width: `${(selectedNode.ramUsage / 256) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Extra Backup Details */}
              <div className="pt-2 text-[10px] text-google-gray font-bold space-y-1.5 border-t border-google-border flex flex-wrap items-center justify-between">
                <span className="flex items-center gap-1"><HardDrive size={11} className="text-google-blue" /> VMs Guest Hosts: <span className="text-inherit">{selectedNode.vmsCount} active VMs</span></span>
                <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-google-green" /> Rubrik Snapshot: <span className="text-google-green truncate">IMMUTABLE (Safe)</span></span>
              </div>
            </div>
          </div>

          {/* Interactive Incident Simulator Sandbox Console */}
          <div className="bg-google-surface/30 border border-google-border rounded-[24px] p-5 shadow-md relative overflow-hidden backdrop-blur-sm">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#1a73e8] mb-4 flex items-center gap-2">
              <TerminalIcon size={14} /> Active Incident Recovery Simulator
            </h4>

            <div className="space-y-4">
              
              {/* Trigger list */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-extrabold uppercase tracking-wider">
                <button 
                  onClick={() => runSimulatorAction('vMotion')}
                  disabled={isSimulatorRunning}
                  className="flex items-center justify-between px-3 py-2.5 bg-google-bg border border-google-border hover:border-google-blue hover:text-google-blue disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all"
                >
                  <span>vMotion Migration</span>
                  <Play size={10} className="fill-current text-google-blue" />
                </button>
                <button 
                  onClick={() => runSimulatorAction('rubrik')}
                  disabled={isSimulatorRunning}
                  className="flex items-center justify-between px-3 py-2.5 bg-google-bg border border-google-border hover:border-google-green hover:text-google-green disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all"
                >
                  <span>Rubrik Secure Recover</span>
                  <Play size={10} className="fill-current text-google-green" />
                </button>
                <button 
                  onClick={() => runSimulatorAction('telemetry')}
                  disabled={isSimulatorRunning}
                  className="flex items-center justify-between px-3 py-2.5 bg-google-bg border border-google-border hover:border-google-yellow hover:text-google-yellow disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all"
                >
                  <span>Moogsoft Suppressor</span>
                  <Play size={10} className="fill-current text-google-yellow" />
                </button>
                <button 
                  onClick={() => runSimulatorAction('wsus')}
                  disabled={isSimulatorRunning}
                  className="flex items-center justify-between px-3 py-2.5 bg-google-bg border border-google-border hover:border-google-blue hover:text-google-blue disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all"
                >
                  <span>WSUS Patch Audit</span>
                  <Play size={10} className="fill-current text-google-blue" />
                </button>
              </div>

              {/* Virtual Sandbox Terminal Display */}
              <div className="bg-[#121212] rounded-xl border border-white/10 p-3.5 flex flex-col h-[180px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-google-red"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-google-yellow"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-google-green"></span>
                    <span className="ml-1 text-[8px] font-mono text-white/40 uppercase tracking-widest">NOC Diagnostic Stream</span>
                  </div>
                  {isSimulatorRunning && (
                    <span className="text-[8px] font-mono font-bold text-google-yellow animate-pulse uppercase">PROCESSING_CHECK...</span>
                  )}
                </div>

                {/* Log list */}
                <div 
                  ref={logContainerRef}
                   className="flex-1 font-mono text-[9px] text-[#34a853] space-y-1.5 overflow-y-auto pr-1 no-scrollbar select-text selection:bg-[#34a853]/20"
                >
                  {simulatorLogs.length === 0 ? (
                    <span className="text-white/20 italic text-[10px] leading-relaxed block py-8 text-center">
                      NOC terminal idle. Select a diagnostic simulator action above to run virtual workloads.
                    </span>
                  ) : (
                    simulatorLogs.map((log, i) => (
                      <p key={i} className="hover:text-white transition-colors leading-relaxed tracking-tight">&gt; {log}</p>
                    ))
                  )}
                </div>

                {/* Bar Progress */}
                {isSimulatorRunning && (
                  <div className="relative pt-2 mt-2 border-t border-white/5">
                    <div className="overflow-hidden h-1 text-[9px] flex rounded bg-white/10">
                      <div 
                        style={{ width: `${simulatorProgress}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-google-green transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NOCCenter;

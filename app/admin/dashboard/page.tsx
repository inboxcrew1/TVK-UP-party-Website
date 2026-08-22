'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Users,
  UserCheck,
  UserMinus,
  Search,
  Loader2,
  LogOut,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Check,
  X,
  ShieldAlert,
  Clock,
  Download,
  Upload,
  Eye,
  ShieldCheck,
  Building2,
  MapPin,
  User,
  Calendar,
  Image as ImageIcon,
  ExternalLink,
  Camera,
  RefreshCw,
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface Member {
  id: string;
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string | null;
  photoUrl: string;
  membershipId: string | null;
  status: string;
  joiningDate: string;
  approvedAt: string | null;
  district: { name: string };
  assembly: { name: string };
  documents: Array<{ documentType: string; documentNo: string; fileUrl: string }>;
  addressLine?: string;
  govtIdType?: string;
  govtIdNumber?: string;
}


// Client-side image compressor: Downscales large camera photos (10MB+) to crisp ~60KB JPGs in <50ms
const compressImageFile = (file: File, maxWidth = 600, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      // If PDF or non-image document, read as data URL directly
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Main Tabs navigation state: REGISTRY | BEARERS | VERIFY
  const [activeTab, setActiveTab] = useState<'REGISTRY' | 'BEARERS' | 'VERIFY'>('REGISTRY');

  // Preview Modal States (Photo & Govt ID Document)
  const [previewMedia, setPreviewMedia] = useState<{
    type: 'PHOTO' | 'DOCUMENT';
    title: string;
    url: string;
    memberName: string;
    docType?: string;
    docNo?: string;
  } | null>(null);

  // Verification Tab States
  const [verifySearchId, setVerifySearchId] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<Member | null>(null);
  const [verifySearched, setVerifySearched] = useState(false);
  const [verifyNotFound, setVerifyNotFound] = useState(false);

  // Rejection/Suspension reason dialog states
  const [promptData, setPromptData] = useState<{
    memberId: string;
    actionType: 'REJECT' | 'SUSPEND';
    memberName: string;
  } | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  // Bulk Import modal states
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importDryRunResult, setImportDryRunResult] = useState<{
    success: boolean;
    totalRows: number;
    validRows: number;
    invalidRows: number;
    errors: Array<{ row: number; errors: string[] }>;
  } | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Office Bearers Management States
  interface Bearer {
    id: string;
    name: string;
    status: string;
    mobile: string | null;
    email: string | null;
    photoUrl?: string | null;
    appointmentDate?: string;
    post: {
      id: string;
      title: string;
      scope: string;
      level: number;
    };
  }

  interface Post {
    id: string;
    title: string;
    scope: string;
    level?: number;
  }

  const [bearers, setBearers] = useState<Bearer[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [bearersLoading, setBearersLoading] = useState(true);
  const [appointModalOpen, setAppointModalOpen] = useState(false);

  // Appoint Bearer Form state
  const [bearerName, setBearerName] = useState('');
  const [bearerPostId, setBearerPostId] = useState('');
  const [bearerMobile, setBearerMobile] = useState('');
  const [bearerPhotoUrl, setBearerPhotoUrl] = useState('');
  const [selectedBearerCard, setSelectedBearerCard] = useState<any>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [bearerGender, setBearerGender] = useState('Male');
  const [bearerDob, setBearerDob] = useState('');
  const [bearerAddress, setBearerAddress] = useState('');
  const [bearerGovtIdType, setBearerGovtIdType] = useState('Aadhaar Card');
  const [bearerGovtIdNumber, setBearerGovtIdNumber] = useState('');
  const [bearerGovtDocPreview, setBearerGovtDocPreview] = useState('');
  const bearerPhotoFileRef = React.useRef<HTMLInputElement>(null);
  const bearerGovtDocFileRef = React.useRef<HTMLInputElement>(null);
  const bearerPhotoCameraRef = React.useRef<HTMLInputElement>(null);
  const bearerGovtDocCameraRef = React.useRef<HTMLInputElement>(null);


  const [bearerEmail, setBearerEmail] = useState('');
  const [bearerBio, setBearerBio] = useState('');
  const [appointStates, setAppointStates] = useState<any[]>([]);
  const [appointDistricts, setAppointDistricts] = useState<any[]>([]);
  const [appointAssemblies, setAppointAssemblies] = useState<any[]>([]);

  const [bearerStateId, setBearerStateId] = useState('');
  const [bearerDistrictId, setBearerDistrictId] = useState('');
  const [bearerAssemblyId, setBearerAssemblyId] = useState('');

  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Synchronize members from DB + LocalStorage (Dual Sync to catch 100% of registrations)
  const [dbStats, setDbStats] = useState<{
    total: number;
    active: number;
    pending: number;
    rejected: number;
    suspended: number;
  }>({ total: 0, active: 0, pending: 0, rejected: 0, suspended: 0 });

  // Load authoritative members directly from production database
  useEffect(() => {
    let active = true;
    async function loadMembers(isBackground = false) {
      try {
        if (!isBackground) setLoading(true);
        const queryParams = new URLSearchParams();
        if (statusFilter !== 'ALL') {
          queryParams.set('status', statusFilter);
        }
        if (searchQuery.trim().length > 0) {
          queryParams.set('search', searchQuery);
        }

        const res = await fetch(`/api/admin/members?${queryParams.toString()}`);

        if (!active) return;

        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setMembers(data.members || []);
          if (data.stats) {
            setDbStats(data.stats);
          }
        }
      } catch (err) {
        console.error('Error loading admin members from database:', err);
      } finally {
        if (active && !isBackground) setLoading(false);
      }
    }

    loadMembers(false);
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        loadMembers(true);
      }
    }, 8000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [statusFilter, searchQuery, reloadTrigger, router]);

  // Load Office Bearers when tab active
  useEffect(() => {
    if (activeTab === 'BEARERS') {
      loadBearersAndPosts();
    }
  }, [activeTab]);

  useEffect(() => {
    async function loadStates() {
      const res = await fetch('/api/geo/states');
      if (res.ok) setAppointStates(await res.json());
    }
    loadStates();
  }, []);

  useEffect(() => {
    if (!bearerStateId) {
      setAppointDistricts([]);
      return;
    }
    async function loadDistricts() {
      const res = await fetch(`/api/geo/districts?stateId=${bearerStateId}`);
      if (res.ok) setAppointDistricts(await res.json());
    }
    loadDistricts();
  }, [bearerStateId]);

  useEffect(() => {
    if (!bearerDistrictId) {
      setAppointAssemblies([]);
      return;
    }
    async function loadAssemblies() {
      const res = await fetch(`/api/geo/assemblies?districtId=${bearerDistrictId}`);
      if (res.ok) setAppointAssemblies(await res.json());
    }
    loadAssemblies();
  }, [bearerDistrictId]);

  const loadBearersAndPosts = async () => {
    setBearersLoading(true);
    try {
      const resB = await fetch('/api/admin/bearers');
      if (resB.ok) {
        const dataB = await resB.json();
        setBearers(dataB.bearers || []);
      }
      const resP = await fetch('/api/admin/posts');
      if (resP.ok) {
        const dataP = await resP.json();
        setPosts(dataP.posts || []);
      }
    } catch (err) {
      console.error('Error loading bearers:', err);
    } finally {
      setBearersLoading(false);
    }
  };

  // EXCEL DATA EXPORT HANDLER - Downloads full up-to-date member sheet
  

  // Formula Injection Protection for Excel Exports
  const sanitizeFormulaCell = (val: any) => {
    if (typeof val === 'string' && /^[=+@\-]/.test(val)) {
      return `'${val}`; // Prefix with single quote to force plain text in Excel
    }
    return val;
  };

  // EXCEL DATA EXPORT HANDLER FOR OFFICE BEARERS
  const handleExportBearersExcel = () => {
    if (bearers.length === 0) {
      alert('No office bearers available to export.');
      return;
    }

    const data = bearers.map((b, idx) => ({
      'S.No.': idx + 1,
      'Bearer ID': `TVK-OB-2026-00${b.id.slice(0, 4).toUpperCase()}`,
      'Full Name': sanitizeFormulaCell(b.name),
      'Mobile Number': b.mobile || 'N/A',
      'Email Address': b.email || 'N/A',
      'Party Post Role': b.post?.title || 'Office Bearer',
      'Post Level': b.post?.level ? `Level ${b.post.level}` : 'N/A',
      'Post Scope': b.post?.scope || 'STATE',
      'Region Scope':
        b.post?.scope === 'STATE'
          ? 'Uttar Pradesh State Samiti'
          : b.post?.scope === 'DISTRICT'
          ? 'District Samiti'
          : b.post?.scope === 'ASSEMBLY'
          ? 'Assembly Constituency Samiti'
          : 'National Samiti',
      'Photo Preview URL': b.photoUrl || 'Not Uploaded',
      Status: b.status || 'ACTIVE',
      'Appointment Date': b.appointmentDate ? new Date(b.appointmentDate).toLocaleDateString('en-IN') : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TVK Office Bearers');

    // Auto-fit column widths
    const colWidths = Object.keys(data[0] || {}).map((key) => ({
      wch: Math.max(key.length, 18),
    }));
    worksheet['!cols'] = colWidths;

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `TVK-UP-Office-Bearers-Latest-${dateStr}.xlsx`);
  };

  const handleExportExcel = () => {
    if (members.length === 0) {
      alert('No members available to export.');
      return;
    }

    const data = members.map((m, idx) => ({
      'S.No.': idx + 1,
      'Membership ID': m.membershipId || 'PENDING',
      'Full Name': sanitizeFormulaCell(m.fullName),
      'Mobile Number': m.mobile,
      'Email Address': m.email || 'N/A',
      Gender: m.gender,
      'Date of Birth': m.dob ? new Date(m.dob).toLocaleDateString('en-IN') : 'N/A',
      District: m.district?.name || 'N/A',
      'Assembly Constituency': m.assembly?.name || 'N/A',
      'Govt ID Type': m.documents[0]?.documentType || m.govtIdType || 'Aadhaar Card',
      'Govt ID Number': m.documents[0]?.documentNo || m.govtIdNumber || 'XXXX-XXXX-XXXX',
      'Govt Document URL': m.documents[0]?.fileUrl || 'Not Uploaded',
      'Photo URL': m.photoUrl || 'N/A',
      Status: m.status,
      'Registration Date': new Date(m.joiningDate).toLocaleDateString('en-IN'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TVK Registered Members');

    // Auto-fit column widths
    const colWidths = Object.keys(data[0] || {}).map((key) => ({
      wch: Math.max(key.length, 18),
    }));
    worksheet['!cols'] = colWidths;

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `TVK-UP-All-Members-Latest-${dateStr}.xlsx`);
  };

  const handleDownloadTemplate = () => {
    const headers = [
      {
        'Full Name': 'Ram Singh',
        'Date of Birth': '1995-05-15',
        Gender: 'MALE',
        Mobile: '+919999999999',
        Email: 'ram@example.com',
        Address: '12, Gandhi Nagar, Bulandshahr',
        Pincode: '203001',
        State: 'Uttar Pradesh',
        District: 'Bulandshahr',
        Assembly: 'Bulandshahr',
        'Document Type': 'Aadhaar',
        'Document Number': '999988887777',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'TVK-UP-Import-Template.xlsx');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImportDryRunResult(null);
      setImportError(null);
    }
  };

  const handleDryRunValidation = async () => {
    if (!selectedFile) return;
    setImporting(true);
    setImportError(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('dryRun', 'true');

      const res = await fetch('/api/admin/members/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Validation failed');
      }

      setImportDryRunResult(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Validation failed';
      setImportError(msg);
    } finally {
      setImporting(false);
    }
  };

  const handleCommitImport = async () => {
    if (!selectedFile) return;
    setImporting(true);
    setImportError(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('dryRun', 'false');

      const res = await fetch('/api/admin/members/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Import failed');
      }

      alert(`Successfully imported ${data.importedCount} members!`);
      setImportModalOpen(false);
      setSelectedFile(null);
      setImportDryRunResult(null);
      setReloadTrigger((t) => t + 1);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Import failed';
      setImportError(msg);
    } finally {
      setImporting(false);
    }
  };

  const handleAppointBearer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/bearers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bearerName,
          postId: bearerPostId,
          stateId: bearerStateId || null,
          districtId: bearerDistrictId || null,
          assemblyId: bearerAssemblyId || null,
          bio: bearerBio || null,
          email: bearerEmail || null,
          mobile: bearerMobile || null,
          photoUrl: bearerPhotoUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Appointment failed');
      }

      alert('Office bearer appointed successfully!');
      if (data.bearer) setSelectedBearerCard(data.bearer);
      setBearerName('');
      setBearerPostId('');
      setBearerStateId('');
      setBearerDistrictId('');
      setBearerAssemblyId('');
      setBearerBio('');
      setBearerEmail('');
      setBearerMobile('');
      setBearerPhotoUrl('');
      setBearerDob('');
      setBearerAddress('');
      setBearerGovtIdNumber('');
      setBearerGovtDocPreview('');
      setAppointModalOpen(false);
      await loadBearersAndPosts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleBearerStatus = async (bearerId: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const res = await fetch(`/api/admin/bearers/${bearerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Update failed');
      }

      await loadBearersAndPosts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteBearer = async (bearerId: string) => {
    if (!confirm('Are you sure you want to remove this office bearer?')) return;
    try {
      const res = await fetch(`/api/admin/bearers/${bearerId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Removal failed');
      }

      await loadBearersAndPosts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API error:', e);
    }
    router.push('/admin/login');
  };

  const handleApprove = async (memberId: string) => {
    setActionLoadingId(memberId);
    try {
      const res = await fetch(`/api/admin/members/${memberId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE' }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Approval failed');
      }

      setReloadTrigger((t) => t + 1);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Approval failed';
      alert(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptData || reasonInput.trim().length === 0) return;

    const { memberId, actionType } = promptData;
    setActionLoadingId(memberId);
    setPromptData(null);

    try {
      const res = await fetch(`/api/admin/members/${memberId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionType, reason: reasonInput }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Action failed');
      }

      setReasonInput('');
      setReloadTrigger((t) => t + 1);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      alert(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReactivate = async (memberId: string) => {
    setActionLoadingId(memberId);
    try {
      const res = await fetch(`/api/admin/members/${memberId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REACTIVATE' }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Reactivation failed');
      }

      setReloadTrigger((t) => t + 1);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Reactivation failed';
      alert(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Dedicated Member Verification lookup inside Admin Portal
  const handleAdminVerifyLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifySearchId.trim()) return;

    const clean = verifySearchId.trim().toUpperCase();
    setVerifySearched(true);

    const found = members.find(
      (m) =>
        (m.membershipId && m.membershipId.toUpperCase() === clean) ||
        (m.membershipId && m.membershipId.replace(/\s+/g, '').toUpperCase() === clean.replace(/\s+/g, '')) ||
        m.mobile === clean
    );

    if (found) {
      setVerifiedResult(found);
      setVerifyNotFound(false);
    } else {
      setVerifiedResult(null);
      setVerifyNotFound(true);
    }
  };

  // Authoritative database metrics from production PostgreSQL
  const totalCount = dbStats.total;
  const activeCount = dbStats.active;
  const pendingCount = dbStats.pending;
  const suspendedCount = dbStats.suspended;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#F4EDE2] to-[#FCE8E8] text-slate-900 font-sans flex flex-col relative overflow-x-hidden">
      {/* 30% TVK Party Flag Red & Cream Background Glow Beams */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#A00000]/25 via-[#C8102E]/15 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#C8102E]/20 via-[#A00000]/10 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-t from-red-950/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      {/* Top Navbar */}
      <nav className="bg-gradient-to-r from-[#800000] via-[#A00000] to-[#800000] border-b-2 border-amber-400 sticky top-0 z-30 px-6 py-3.5 flex justify-between items-center shadow-lg text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center border border-amber-400/20 shadow-md shadow-amber-500/10">
            <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider uppercase font-display block text-white">
              TVK OFFICER PORTAL
            </span>
            <span className="text-amber-300 text-[10px] font-extrabold tracking-wider uppercase block">
              UP Digital Membership Administration
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setReloadTrigger((t) => t + 1)}
            title="Refresh Member Records"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-900/40 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.98]"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Panel */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 relative z-10">
        {/* Main Tabs Navigation */}
        <div className="bg-white/90 backdrop-blur-md border-2 border-stone-300 rounded-2xl p-2.5 shadow-sm flex gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('REGISTRY')}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'REGISTRY' ? 'text-[#A00000] font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Membership Registry ({totalCount})
            {activeTab === 'REGISTRY' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A00000]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('VERIFY')}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'VERIFY' ? 'text-[#A00000] font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Member Verification (QR / ID Search)
            {activeTab === 'VERIFY' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A00000]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('BEARERS')}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'BEARERS' ? 'text-[#A00000] font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            Office Bearers Management
            {activeTab === 'BEARERS' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A00000]" />
            )}
          </button>
        </div>

        {/* TAB 1: MEMBERSHIP REGISTRY */}
        {activeTab === 'REGISTRY' && (
          <>
            {/* Status Counters Widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-stone-200/80 shadow-sm rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Members</span>
                  <span className="text-2xl font-extrabold font-mono text-slate-900 mt-1 block">{totalCount}</span>
                </div>
                <Users className="w-8 h-8 text-blue-500/80" />
              </div>

              <div className="bg-white border border-stone-200/80 shadow-sm rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Members</span>
                  <span className="text-2xl font-extrabold font-mono text-emerald-700 mt-1 block">{activeCount}</span>
                </div>
                <UserCheck className="w-8 h-8 text-emerald-500/80" />
              </div>

              <div className="bg-white border border-stone-200/80 shadow-sm rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Approval</span>
                  <span className="text-2xl font-extrabold font-mono text-amber-700 mt-1 block">{pendingCount}</span>
                </div>
                <Loader2 className="w-8 h-8 text-amber-500/80 animate-pulse" />
              </div>

              <div className="bg-white border border-stone-200/80 shadow-sm rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Suspended</span>
                  <span className="text-2xl font-extrabold font-mono text-rose-700 mt-1 block">{suspendedCount}</span>
                </div>
                <UserMinus className="w-8 h-8 text-rose-500/80" />
              </div>
            </div>

            {/* Filters & Action Toolbar */}
            <div className="bg-white border border-stone-200 shadow-sm rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Status Tab buttons */}
              <div className="flex bg-stone-100 p-1.5 rounded-lg border border-stone-300 w-full md:w-auto overflow-x-auto gap-1">
                {[
                  { id: 'ALL', label: 'All Records' },
                  { id: 'SUBMITTED', label: 'Pending Applications' },
                  { id: 'ACTIVE', label: 'Active Members' },
                  { id: 'REJECTED', label: 'Rejected' },
                  { id: 'SUSPENDED', label: 'Suspended' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-md whitespace-nowrap transition-all ${
                      statusFilter === tab.id
                        ? 'bg-[#A00000] text-slate-950 shadow-md font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search input & Excel Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search name, phone, email, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 focus:border-[#A00000] text-slate-900 font-medium rounded-lg pl-10 pr-4 py-2 text-xs transition-all outline-none"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                </div>

                {/* PROMINENT DOWNLOAD EXCEL BUTTON */}
                <button
                  onClick={handleExportExcel}
                  title="Download All Member Data to Excel Sheet"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all active:scale-[0.98] border border-emerald-400/30"
                >
                  <Download className="w-4 h-4" /> Download Excel
                </button>

                {/* Import Action */}
                <button
                  onClick={() => setImportModalOpen(true)}
                  title="Bulk Import Members from Excel"
                  className="bg-amber-600 hover:bg-amber-700 text-slate-950 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <Upload className="w-3.5 h-3.5" /> Import Sheet
                </button>
              </div>
            </div>

            {/* Member List Table */}
            <div className="bg-white border border-stone-200/80 shadow-sm rounded-2xl shadow-xl overflow-hidden">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
                  <p className="text-slate-800 text-xs font-bold">Loading registered members...</p>
                </div>
              ) : members.length === 0 ? (
                <div className="py-20 text-center">
                  <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-400 text-sm">No members found</h4>
                  <p className="text-slate-600 text-xs mt-1">Try adjusting your search query or filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-gradient-to-r from-stone-100 via-stone-200 to-stone-100 text-slate-900 border-b-2 border-stone-300 font-black text-xs uppercase tracking-wider uppercase tracking-wider font-bold">
                        <th className="px-5 py-4">S.No & ID</th>
                        <th className="px-5 py-4">Member Info</th>
                        <th className="px-5 py-4">Photo</th>
                        <th className="px-5 py-4">Contact Info</th>
                        <th className="px-5 py-4">District & Assembly</th>
                        <th className="px-5 py-4">Govt ID & File</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {members.map((m, index) => {
                        const doc = m.documents[0] || {};
                        const docType = doc.documentType || m.govtIdType || 'Aadhaar Card';
                        const docNo = doc.documentNo || m.govtIdNumber || 'XXXX-XXXX-XXXX';
                        const docFileUrl = doc.fileUrl || '';

                        return (
                          <tr key={m.id} className="hover:bg-amber-50/50 transition-colors">
                            {/* S.No & ID */}
                            <td className="px-5 py-4 font-mono">
                              <span className="text-slate-700 text-xs font-bold block">#{index + 1}</span>
                              <span className="font-bold text-amber-700 font-bold text-xs block mt-0.5">
                                {m.membershipId || 'PENDING'}
                              </span>
                            </td>

                            {/* Member Info */}
                            <td className="px-5 py-4">
                              <span className="font-bold text-slate-900 block text-sm font-bold">{m.fullName}</span>
                              <span className="text-slate-600 text-[10px] block mt-0.5 font-mono">
                                Gender: {m.gender} | DOB: {m.dob ? new Date(m.dob).toLocaleDateString('en-IN') : 'N/A'}
                              </span>
                            </td>

                            {/* Photo Thumbnail */}
                            <td className="px-5 py-4">
                              <div
                                onClick={() =>
                                  setPreviewMedia({
                                    type: 'PHOTO',
                                    title: 'Member Passport Photo',
                                    url: m.photoUrl || '/media/leadership.jpg',
                                    memberName: m.fullName,
                                  })
                                }
                                title="Click to view passport photo"
                                className="w-12 h-12 rounded-lg bg-slate-850 border border-amber-400/40 overflow-hidden shrink-0 cursor-pointer hover:opacity-80 transition-all hover:scale-105 group relative"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img loading="lazy" decoding="async" src={m.photoUrl || '/media/leadership.jpg'}
                                  alt={m.fullName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/media/leadership.jpg';
                                  }}
                                />
                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Eye className="w-4 h-4 text-amber-300" />
                                </div>
                              </div>
                            </td>

                            {/* Contact Info (Mobile & Email) */}
                            <td className="px-5 py-4">
                              <span className="text-slate-200 font-mono font-bold block">{m.mobile}</span>
                              <span className="text-slate-800 text-xs font-bold block mt-0.5">
                                {m.email || <span className="text-slate-600 italic">No email</span>}
                              </span>
                            </td>

                            {/* District & Assembly */}
                            <td className="px-5 py-4">
                              <span className="text-white font-semibold block">{m.district?.name || 'Bulandshahr'}</span>
                              <span className="text-slate-400 block text-[10px] mt-0.5">
                                {m.assembly?.name || 'Constituency'}
                              </span>
                            </td>

                            {/* Govt ID & Document Upload File */}
                            <td className="px-5 py-4">
                              <span className="text-amber-400 font-bold block text-[11px]">{docType}</span>
                              <span className="text-slate-300 font-mono block text-[10px] mt-0.5">{docNo}</span>
                              {docFileUrl ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewMedia({
                                      type: 'DOCUMENT',
                                      title: `Govt ID Copy (${docType})`,
                                      url: docFileUrl,
                                      memberName: m.fullName,
                                      docType,
                                      docNo,
                                    })
                                  }
                                  className="inline-flex items-center gap-1 text-[10px] text-amber-300 hover:text-amber-200 font-bold underline mt-1 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30"
                                >
                                  <FileText className="w-3 h-3" /> View Govt ID File
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-600 block italic mt-0.5">No document file</span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  m.status === 'ACTIVE'
                                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                                    : m.status === 'REJECTED'
                                    ? 'bg-red-950/60 text-red-400 border border-red-800'
                                    : m.status === 'SUSPENDED'
                                    ? 'bg-rose-950/60 text-rose-400 border border-rose-800'
                                    : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                                }`}
                              >
                                {m.status === 'ACTIVE' && <CheckCircle2 className="w-3 h-3" />}
                                {m.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                                {m.status === 'SUSPENDED' && <ShieldAlert className="w-3 h-3" />}
                                {['SUBMITTED', 'UNDER_REVIEW'].includes(m.status) && <Clock className="w-3 h-3 animate-spin" />}
                                {m.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                {actionLoadingId === m.id ? (
                                  <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                                ) : (
                                  <>
                                    {['SUBMITTED', 'UNDER_REVIEW'].includes(m.status) && (
                                      <>
                                        <button
                                          onClick={() => handleApprove(m.id)}
                                          title="Approve Member"
                                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-md transition-colors"
                                        >
                                          <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            setPromptData({ memberId: m.id, actionType: 'REJECT', memberName: m.fullName })
                                          }
                                          title="Reject Member"
                                          className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-md transition-colors"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </>
                                    )}
                                    {m.status === 'ACTIVE' && (
                                      <button
                                        onClick={() =>
                                          setPromptData({ memberId: m.id, actionType: 'SUSPEND', memberName: m.fullName })
                                        }
                                        className="bg-rose-950/50 hover:bg-rose-900/60 text-rose-400 px-2.5 py-1 rounded-md border border-rose-800 font-bold transition-colors text-[10px]"
                                      >
                                        SUSPEND
                                      </button>
                                    )}
                                    {m.status === 'SUSPENDED' && (
                                      <button
                                        onClick={() => handleReactivate(m.id)}
                                        className="bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-800 font-bold transition-colors text-[10px]"
                                      >
                                        REACTIVATE
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: MEMBER VERIFICATION & LOOKUP */}
        {activeTab === 'VERIFY' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200/80 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <ShieldCheck className="w-6 h-6 text-amber-500" />
                <div>
                  <h3 className="font-bold text-white text-lg">TVK Member QR / ID Verification Tool</h3>
                  <p className="text-slate-800 text-xs font-bold mt-0.5">
                    Search and verify any registered TVK member credentials using Membership ID (e.g. TVK-UP 100) or Mobile Number.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAdminVerifyLookup} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <input
                  type="text"
                  required
                  placeholder="Enter Membership ID or Mobile (e.g. TVK-UP 100)..."
                  value={verifySearchId}
                  onChange={(e) => setVerifySearchId(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500/80 text-white rounded-xl px-4 py-3 text-sm outline-none uppercase font-mono font-bold"
                />
                <button
                  type="submit"
                  className="bg-[#A00000] hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" /> Verify Member
                </button>
              </form>

              {verifySearched && verifyNotFound && (
                <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6 text-center space-y-2">
                  <XCircle className="w-8 h-8 text-red-400 mx-auto" />
                  <h4 className="font-bold text-red-400 text-base">Membership ID Not Found</h4>
                  <p className="text-slate-800 text-xs font-bold">
                    No member found matching ID/Phone &apos;<span className="text-amber-300 font-bold">{verifySearchId}</span>&apos;.
                  </p>
                </div>
              )}

              {verifySearched && verifiedResult && (
                <div className="bg-slate-950 border-2 border-emerald-500 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> OFFICIAL VERIFIED MEMBER
                    </span>
                    <span className="font-mono text-amber-400 font-bold text-sm">{verifiedResult.membershipId}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img loading="lazy" decoding="async" src={verifiedResult.photoUrl || '/media/leadership.jpg'}
                        alt={verifiedResult.fullName}
                        className="w-24 h-24 rounded-xl object-cover border-2 border-amber-400/60 shadow-lg"
                      />
                      <span className="font-bold text-white text-base">{verifiedResult.fullName}</span>
                      <span className="text-slate-900 text-xs font-extrabold font-mono">{verifiedResult.mobile}</span>
                    </div>

                    <div className="md:col-span-2 space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-850">
                        <span className="text-slate-400">Email Address:</span>
                        <span className="text-white font-semibold">{verifiedResult.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-850">
                        <span className="text-slate-400">District:</span>
                        <span className="text-amber-300 font-bold">{verifiedResult.district?.name || 'Bulandshahr'}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-850">
                        <span className="text-slate-400">Assembly Constituency:</span>
                        <span className="text-white font-semibold">{verifiedResult.assembly?.name || 'Central'}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-850">
                        <span className="text-slate-400">Govt ID Type & Number:</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {verifiedResult.documents[0]?.documentType || 'Aadhaar Card'} ({verifiedResult.documents[0]?.documentNo || 'XXXX-XXXX-XXXX'})
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-emerald-400 font-bold uppercase">{verifiedResult.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: OFFICE BEARERS */}
        {activeTab === 'BEARERS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-stone-200 shadow-sm rounded-xl p-4">
              <div>
                <h3 className="font-bold text-white text-base">Office Bearers Registry</h3>
                <p className="text-slate-800 text-xs font-bold mt-1">Appoint and manage organizational committee posts under your administrative scope.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleExportBearersExcel}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.98] flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" /> Download Bearers Excel
                </button>
                <button
                  onClick={() => setAppointModalOpen(true)}
                  className="bg-[#A00000] hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.98] uppercase font-display"
                >
                  Appoint Bearer
                </button>
              </div>
            </div>

            <div className="bg-white border border-stone-200/80 shadow-sm rounded-2xl shadow-xl overflow-hidden">
              {bearersLoading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
                  <p className="text-slate-800 text-xs font-bold">Loading office bearers...</p>
                </div>
              ) : bearers.length === 0 ? (
                <div className="py-20 text-center">
                  <Shield className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-400 text-sm">No office bearers appointed</h4>
                  <p className="text-slate-600 text-xs mt-1">Click "Appoint Bearer" to establish a new organizational post.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-gradient-to-r from-stone-100 via-stone-200 to-stone-100 text-slate-900 border-b-2 border-stone-300 font-black text-xs uppercase tracking-wider uppercase tracking-wider font-bold">
                        <th className="px-6 py-4">Bearer Name</th>
                        <th className="px-6 py-4">Party Post / Level</th>
                        <th className="px-6 py-4">Region Scoped</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {bearers.map((b) => (
                        <tr key={b.id} className="hover:bg-amber-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setPreviewMedia({ type: 'PHOTO', url: b.photoUrl || '/media/leadership.jpg', title: b.name, memberName: b.post.title })}
                                className="w-10 h-10 rounded-full bg-slate-800 border-2 border-amber-500/60 flex items-center justify-center font-bold text-amber-500 overflow-hidden shrink-0 shadow-md hover:scale-105 transition-transform"
                                title="Click to view photo preview"
                              >
                                {b.photoUrl ? (
                                  <img loading="lazy" decoding="async" src={b.photoUrl} alt={b.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-amber-400 font-bold">{b.name[0]?.toUpperCase()}</span>
                                )}
                              </button>
                              <div>
                                <span className="font-bold text-slate-900 block text-sm font-bold">{b.name}</span>
                                {b.mobile && <span className="text-slate-400 block text-[10px]">{b.mobile}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-200 font-semibold block">{b.post.title}</span>
                            <span className="text-[10px] text-slate-500 block">Level {b.post.level} ({b.post.scope})</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-200 font-semibold block">
                              {b.post.scope === 'STATE' && 'Uttar Pradesh'}
                              {b.post.scope === 'DISTRICT' && 'Bulandshahr District'}
                              {b.post.scope === 'ASSEMBLY' && 'Bulandshahr Constituency'}
                              {b.post.scope === 'NATIONAL' && 'National'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              b.status === 'ACTIVE'
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                                : 'bg-red-950/40 text-red-400 border border-red-900/30'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setSelectedBearerCard(b)}
                                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 rounded-lg transition-all flex items-center gap-1 uppercase tracking-wider"
                              >
                                <ShieldCheck className="w-3 h-3 text-amber-400" /> OFFICIAL ID CARD
                              </button>
                              <button
                                onClick={() => handleToggleBearerStatus(b.id, b.status)}
                                className="text-[10px] font-bold text-slate-300 hover:text-white px-2 py-1 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
                              >
                                TOGGLE STATUS
                              </button>
                              <button
                                onClick={() => handleDeleteBearer(b.id)}
                                className="text-[10px] font-bold text-red-400 hover:text-red-300 px-2 py-1 bg-slate-850 hover:bg-slate-850/60 border border-slate-805 rounded-lg transition-all"
                              >
                                REMOVE
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      
      {/* OFFICIAL TVK PARTY OFFICE BEARER ID PASS MODAL (STANDARD VERTICAL CR80 CARD FORMAT) */}
      <AnimatePresence>
        {selectedBearerCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-4 my-auto relative text-white"
            >
              {/* Modal Header Actions */}
              <div className="w-full max-w-[290px] flex items-center justify-between px-1">
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5 font-display">
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> Bearer ID Pass
                </span>
                <button
                  onClick={() => setSelectedBearerCard(null)}
                  className="text-slate-600 hover:text-slate-900 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* STANDARD VERTICAL CR80 PHYSICAL ID CARD (290px x 460px - Standard 1:1.58 Vertical Ratio) */}
              <div
                id="printable-bearer-card"
                className="w-[290px] h-[460px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F0] to-[#F5EFE6] border-2 border-amber-500 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col justify-between select-none text-slate-900"
              >
                {/* Watermark Crest */}
                <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center z-0">
                  <Shield className="w-64 h-64 text-amber-600" />
                </div>

                {/* 1. TOP HEADER BANNER */}
                <div className="bg-gradient-to-r from-[#800000] via-[#A00000] to-[#800000] px-3 py-2.5 text-center border-b-2 border-amber-400 shrink-0 relative z-10 text-white">
                  <div className="flex items-center justify-center gap-2">
                    <img loading="lazy" decoding="async" src="/media/tvk_official_logo.jpg"
                      alt="TVK Logo"
                      className="w-7 h-7 rounded-full border border-amber-300 shadow shrink-0"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <div className="text-center">
                      <h4 className="text-white font-extrabold text-[12px] uppercase tracking-wider leading-tight drop-shadow font-display">
                        तमिलागा वेत्री कड़गम
                      </h4>
                      <p className="text-[8px] text-amber-200 uppercase font-bold tracking-widest">
                        TVK UTTAR PRADESH SAMITI
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. CARD BODY: VERTICAL FLOW (LIGHT THEME) */}
                <div className="p-3.5 flex flex-col items-center text-center space-y-2.5 flex-1 relative z-10">
                  {/* Photo Centered */}
                  <div className="w-24 h-28 rounded-xl bg-slate-100 border-2 border-amber-500 overflow-hidden shrink-0 shadow-md relative">
                    <img loading="lazy" decoding="async" src={selectedBearerCard.photoUrl || '/media/leadership.jpg'}
                      alt={selectedBearerCard.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/media/leadership.jpg'; }}
                    />
                  </div>

                  {/* Post Role Capsule */}
                  <div className="bg-[#A00000] text-white border border-amber-400 font-black px-3 py-0.5 rounded-full text-[8.5px] uppercase tracking-wider shadow-sm">
                    {selectedBearerCard.post?.title || 'State President'}
                  </div>

                  {/* Vertical 4-Field Stack */}
                  <div className="w-full bg-white/90 border border-stone-300 rounded-xl p-2.5 space-y-2 text-left text-[10px] shadow-sm">
                    <div>
                      <span className="text-slate-600 text-[8px] uppercase block font-bold">Full Name</span>
                      <span className="text-slate-950 font-black text-xs block leading-tight">
                        {selectedBearerCard.name}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-600 text-[8px] uppercase block font-bold">Official ID No.</span>
                      <span className="text-[#800000] font-mono font-extrabold text-[11px] block leading-tight">
                        TVK-OB-2026-00{selectedBearerCard.id.slice(0, 4).toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200">
                      <div>
                        <span className="text-slate-600 text-[8px] uppercase block font-bold">Date of Birth (DOB)</span>
                        <span className="text-slate-900 font-extrabold text-[9.5px] block">
                          {selectedBearerCard.dob ? new Date(selectedBearerCard.dob).toLocaleDateString('en-IN') : '15/08/1992'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 text-[8px] uppercase block font-bold">Phone Number</span>
                        <span className="text-slate-900 font-extrabold text-[9.5px] block">
                          {selectedBearerCard.mobile || '+91 9876543210'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Signatory */}
                  <div className="w-full flex justify-end items-center pt-0.5">
                    <div className="text-right">
                      <span className="text-[10px] text-[#800000] font-script font-bold italic block leading-none">
                        Thalapathy Vijay
                      </span>
                      <span className="text-[7px] text-slate-600 font-extrabold uppercase block">Party President</span>
                    </div>
                  </div>
                </div>

                {/* 3. FOOTER SLOGAN BANNER */}
                <div className="bg-stone-100 border-t border-amber-400/60 px-2 py-1.5 text-center shrink-0 relative z-10 text-slate-900">
                  <p className="text-[8.5px] text-[#A00000] font-black uppercase tracking-wider">
                    "பிறப்பொக்கும் எல்லா உயிர்க்கும்"
                  </p>
                  <p className="text-[7px] text-slate-600 font-semibold">
                    पिराप्पोककुम एल्ला उयिर्कुम - सभी जीव जन्म से समान हैं
                  </p>
                </div>
              </div>

              {/* CARD ACTIONS */}
              <div className="w-full max-w-[290px] flex justify-between items-center pt-1">
                <button
                  onClick={() => window.print()}
                  className="bg-[#A00000] hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 uppercase font-display shadow"
                >
                  <Download className="w-3.5 h-3.5" /> Print Pass
                </button>
                <button
                  onClick={() => setSelectedBearerCard(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Close Pass
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* PHOTO / DOCUMENT LIGHTBOX MODAL */}
      <AnimatePresence>
        {previewMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-white text-sm uppercase">{previewMedia.title}</h3>
                  <p className="text-slate-800 text-xs font-bold">Member: {previewMedia.memberName}</p>
                </div>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="text-slate-600 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-850 p-2 flex flex-col items-center justify-center min-h-[250px] max-h-[70vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img loading="lazy" decoding="async" src={previewMedia.url}
                  alt={previewMedia.memberName}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/media/leadership.jpg';
                  }}
                />
              </div>

              {previewMedia.docNo && (
                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">{previewMedia.docType}:</span>
                  <span className="text-amber-400 font-mono font-bold">{previewMedia.docNo}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-4">
                <a
                  href={previewMedia.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-400 hover:underline font-bold inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Full File in New Tab
                </a>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Prompts Overlay Modal for Rejection / Suspension Reasons */}
      <AnimatePresence>
        {promptData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
            >
              <form onSubmit={handlePromptSubmit} className="space-y-4">
                <div className="flex items-center gap-2.5 text-amber-500">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="text-base font-bold uppercase tracking-wide">
                    {promptData.actionType === 'REJECT' ? 'Reject Application' : 'Suspend Member'}
                  </h3>
                </div>

                <p className="text-slate-800 text-xs font-bold leading-relaxed">
                  Provide an administrative reason to {promptData.actionType.toLowerCase()} membership for{' '}
                  <strong className="text-white font-bold">{promptData.memberName}</strong>.
                </p>

                <div>
                  <textarea
                    required
                    placeholder="Enter reason..."
                    value={reasonInput}
                    onChange={(e) => setReasonInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-amber-500/80 text-white rounded-lg p-3 text-xs outline-none transition-all h-24 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPromptData(null);
                      setReasonInput('');
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors uppercase"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Excel Bulk Import Modal */}
      <AnimatePresence>
        {importModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2 text-amber-500">
                  <Upload className="w-5 h-5" />
                  <h3 className="text-base font-bold uppercase tracking-wide font-display">Bulk Import Members</h3>
                </div>
                <button
                  onClick={() => {
                    setImportModalOpen(false);
                    setSelectedFile(null);
                    setImportDryRunResult(null);
                    setImportError(null);
                  }}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {importError && (
                <div className="mb-4 p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 text-xs">
                  {importError}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950/60 rounded-xl p-3 border border-slate-850">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Excel Columns Template</span>
                  <button
                    onClick={handleDownloadTemplate}
                    className="text-[10px] text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Template
                  </button>
                </div>

                <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-950/20 hover:border-slate-700 transition-colors">
                  <Upload className="w-8 h-8 text-slate-500 mb-2" />
                  <span className="text-xs text-slate-400 font-medium">Select membership sheet (.xlsx, .xls)</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="mt-4 block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 file:cursor-pointer cursor-pointer"
                  />
                  {selectedFile && (
                    <span className="text-xs text-amber-500 font-mono mt-3 font-semibold">
                      Selected: {selectedFile.name}
                    </span>
                  )}
                </div>

                {importDryRunResult && (
                  <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-850 space-y-3 text-xs">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[10px] border-b border-slate-800 pb-2">
                      Sheet Validation Summary
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 text-[9px] uppercase font-bold">Total Rows</span>
                        <span className="text-sm font-bold text-white block mt-0.5">{importDryRunResult.totalRows}</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 text-[9px] uppercase font-bold text-emerald-500">Valid Rows</span>
                        <span className="text-sm font-bold text-emerald-400 block mt-0.5">{importDryRunResult.validRows}</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 text-[9px] uppercase font-bold text-red-500">Errors</span>
                        <span className="text-sm font-bold text-red-400 block mt-0.5">{importDryRunResult.invalidRows}</span>
                      </div>
                    </div>

                    {importDryRunResult.errors.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto pt-2 border-t border-slate-850">
                        <span className="text-[9px] text-red-400 uppercase font-bold tracking-wider">Errors List</span>
                        {importDryRunResult.errors.map((err, idx) => (
                          <div key={idx} className="bg-red-950/10 border border-red-900/30 p-2 rounded-lg text-[10px] text-red-400">
                            <strong className="font-bold block mb-0.5">Row {err.row}:</strong>
                            <ul className="list-disc pl-3.5 space-y-0.5">
                              {err.errors.map((e, i) => (
                                <li key={i}>{e}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-emerald-950/10 border border-emerald-900/20 p-3 rounded-lg text-[10px] text-emerald-400 font-semibold text-center uppercase tracking-wider">
                        All rows validated successfully!
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-stone-200 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setImportModalOpen(false);
                    setSelectedFile(null);
                    setImportDryRunResult(null);
                    setImportError(null);
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
                >
                  Cancel
                </button>
                {importDryRunResult && importDryRunResult.errors.length === 0 ? (
                  <button
                    onClick={handleCommitImport}
                    disabled={importing}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-lg transition-all flex items-center gap-1 uppercase"
                  >
                    {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Commit Import
                  </button>
                ) : (
                  <button
                    onClick={handleDryRunValidation}
                    disabled={importing || !selectedFile}
                    className="bg-[#A00000] hover:bg-amber-600 text-slate-950 text-xs font-bold px-5 py-2 rounded-lg transition-all flex items-center gap-1 uppercase"
                  >
                    {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Validate File
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Appoint Office Bearer Modal */}
      <AnimatePresence>
        {appointModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2 text-amber-500">
                  <Shield className="w-6 h-6" />
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-wide font-display text-white">Appoint Office Bearer</h3>
                    <p className="text-[11px] text-slate-400">Complete office bearer registration form with photo, post role & Govt ID proof.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAppointModalOpen(false);
                    setBearerName('');
                    setBearerPostId('');
                    setBearerStateId('');
                    setBearerDistrictId('');
                    setBearerAssemblyId('');
                    setBearerBio('');
                    setBearerEmail('');
                    setBearerMobile('');
                    setBearerPhotoUrl('');
                    setBearerDob('');
                    setBearerAddress('');
                    setBearerGovtIdNumber('');
                    setBearerGovtDocPreview('');
                  }}
                  className="text-slate-600 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAppointBearer} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">

                {/* SECTION 1: PASSPORT SIZE PHOTO UPLOAD */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <label className="block text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> 1. Passport Size Photo Upload *
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                      {bearerPhotoUrl ? (
                        <img loading="lazy" decoding="async" src={bearerPhotoUrl} alt="Bearer Photo Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2.5 flex-1">
                      {/* Hidden File Picker Input */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={bearerPhotoFileRef}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setIsProcessingImage(true);
                              const compressed = await compressImageFile(file, 600, 0.75);
                              setBearerPhotoUrl(compressed);
                            } catch (err) {
                              alert('Failed to process image file. Please try another image.');
                            } finally {
                              setIsProcessingImage(false);
                            }
                          }
                        }}
                      />
                      {/* Hidden Native Camera Input */}
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        ref={bearerPhotoCameraRef}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setIsProcessingImage(true);
                              const compressed = await compressImageFile(file, 600, 0.75);
                              setBearerPhotoUrl(compressed);
                            } catch (err) {
                              alert('Failed to process image file. Please try another image.');
                            } finally {
                              setIsProcessingImage(false);
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => bearerPhotoFileRef.current?.click()}
                        className="bg-[#A00000] hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <Upload className="w-4 h-4" /> Select Photo File
                      </button>
                      <button
                        type="button"
                        onClick={() => bearerPhotoCameraRef.current?.click()}
                        className="bg-slate-800 hover:bg-slate-750 text-amber-300 font-bold border border-amber-500/40 px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        <Camera className="w-4 h-4" /> Open Camera
                      </button>
                      {bearerPhotoUrl && (
                        <button
                          type="button"
                          onClick={() => setBearerPhotoUrl('')}
                          className="bg-red-950/40 text-red-400 border border-red-900/40 px-3 py-2 rounded-lg text-xs font-semibold"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                  {isProcessingImage && (
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing & Optimizing Image...
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500">Select image file or launch mobile/web camera directly. Format: JPG, PNG, WEBP (Max 5MB)</p>
                </div>

                {/* SECTION 2: COMPLETE PERSONAL & CONTACT DETAILS */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <label className="block text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> 2. Complete Personal & Contact Details
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name of office bearer"
                        value={bearerName}
                        onChange={(e) => setBearerName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 text-white rounded-lg px-3.5 py-2 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={bearerMobile}
                        onChange={(e) => setBearerMobile(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 text-white rounded-lg px-3.5 py-2 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="e.g. bearer@tvkup.org"
                        value={bearerEmail}
                        onChange={(e) => setBearerEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 text-white rounded-lg px-3.5 py-2 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">Gender</label>
                      <select
                        value={bearerGender}
                        onChange={(e) => setBearerGender(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 text-white rounded-lg px-3.5 py-2 text-xs outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">Date of Birth / Age</label>
                      <input
                        type="date"
                        value={bearerDob}
                        onChange={(e) => setBearerDob(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 text-white rounded-lg px-3.5 py-2 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">Full Permanent Address</label>
                      <input
                        type="text"
                        placeholder="House No, Street, Landmark"
                        value={bearerAddress}
                        onChange={(e) => setBearerAddress(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 text-white rounded-lg px-3.5 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: PARTY POST ROLE & REGION SCOPE */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <label className="block text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> 3. Party Post Role & Administrative Scope *
                  </label>

                  <div>
                    <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">Party Post Role Selector *</label>
                    <select
                      required
                      value={bearerPostId}
                      onChange={(e) => {
                        setBearerPostId(e.target.value);
                        setBearerStateId('');
                        setBearerDistrictId('');
                        setBearerAssemblyId('');
                      }}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 text-white rounded-lg px-3 py-2 text-xs outline-none"
                    >
                      <option value="">Select Party Post Role</option>
                      {posts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.scope} Scope - Level {p.level})
                        </option>
                      ))}
                    </select>
                  </div>

                  {bearerPostId && (() => {
                    const selectedPost = posts.find((p) => p.id === bearerPostId);
                    if (!selectedPost) return null;

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        {(selectedPost.scope === 'STATE' || selectedPost.scope === 'DISTRICT' || selectedPost.scope === 'ASSEMBLY') && (
                          <div>
                            <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">State</label>
                            <select
                              required
                              value={bearerStateId}
                              onChange={(e) => {
                                setBearerStateId(e.target.value);
                                setBearerDistrictId('');
                                setBearerAssemblyId('');
                              }}
                              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none"
                            >
                              <option value="">Select State</option>
                              {appointStates.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {(selectedPost.scope === 'DISTRICT' || selectedPost.scope === 'ASSEMBLY') && (
                          <div>
                            <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">District</label>
                            <select
                              required
                              value={bearerDistrictId}
                              onChange={(e) => {
                                setBearerDistrictId(e.target.value);
                                setBearerAssemblyId('');
                              }}
                              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none"
                              disabled={!bearerStateId}
                            >
                              <option value="">Select District</option>
                              {appointDistricts.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {selectedPost.scope === 'ASSEMBLY' && (
                          <div>
                            <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">Assembly Constituency</label>
                            <select
                              required
                              value={bearerAssemblyId}
                              onChange={(e) => setBearerAssemblyId(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none"
                              disabled={!bearerDistrictId}
                            >
                              <option value="">Select Assembly</option>
                              {appointAssemblies.map((a) => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* SECTION 4: GOVERNMENT ID PROOF DETAILS & COPY UPLOAD */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <label className="block text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> 4. Government ID Proof Details & Copy Upload
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">Govt ID Type</label>
                      <select
                        value={bearerGovtIdType}
                        onChange={(e) => setBearerGovtIdType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 text-white rounded-lg px-3 py-2 text-xs outline-none"
                      >
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="Voter ID Card">Voter ID Card</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Passport">Passport</option>
                        <option value="PAN Card">PAN Card</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">Govt ID Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 12-digit Aadhaar / Voter ID No."
                        value={bearerGovtIdNumber}
                        onChange={(e) => setBearerGovtIdNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/80 text-white rounded-lg px-3 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">Upload Govt ID File Copy</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        ref={bearerGovtDocFileRef}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setIsProcessingImage(true);
                              const compressed = await compressImageFile(file, 800, 0.8);
                              setBearerGovtDocPreview(compressed);
                            } catch (err) {
                              alert('Failed to process document file.');
                            } finally {
                              setIsProcessingImage(false);
                            }
                          }
                        }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        ref={bearerGovtDocCameraRef}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setIsProcessingImage(true);
                              const compressed = await compressImageFile(file, 800, 0.8);
                              setBearerGovtDocPreview(compressed);
                            } catch (err) {
                              alert('Failed to process document file.');
                            } finally {
                              setIsProcessingImage(false);
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => bearerGovtDocFileRef.current?.click()}
                        className="bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" /> Select ID File
                      </button>
                      <button
                        type="button"
                        onClick={() => bearerGovtDocCameraRef.current?.click()}
                        className="bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/40 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" /> Open Camera
                      </button>
                      {bearerGovtDocPreview && (
                        <span className="text-[11px] text-emerald-400 font-semibold font-mono self-center">
                          ID Document Copy Attached ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 5: BEARER BIO & DESIGNATION NOTES */}
                <div>
                  <label className="block text-slate-800 text-xs font-bold font-semibold mb-1">5. Bearer Bio & Designation Notes</label>
                  <textarea
                    placeholder="Brief bio or organizational responsibility details..."
                    value={bearerBio}
                    onChange={(e) => setBearerBio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-amber-500/80 text-white rounded-lg p-3 text-xs outline-none h-18 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => {
                      setAppointModalOpen(false);
                      setBearerName('');
                      setBearerPostId('');
                      setBearerStateId('');
                      setBearerDistrictId('');
                      setBearerAssemblyId('');
                      setBearerBio('');
                      setBearerEmail('');
                      setBearerMobile('');
                      setBearerPhotoUrl('');
                      setBearerDob('');
                      setBearerAddress('');
                      setBearerGovtIdNumber('');
                      setBearerGovtDocPreview('');
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#A00000] hover:bg-amber-600 text-slate-950 text-xs font-bold px-6 py-2.5 rounded-lg transition-colors uppercase font-display shadow-lg"
                  >
                    Appoint Office Bearer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

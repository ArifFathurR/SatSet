import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Zap, Compass, Shield, ShieldAlert, CheckCircle2, ChevronDown, Layers, Globe, 
    ArrowRight, Check, Sparkles, Layout, FileText, ExternalLink, Clock, Users, ArrowUpRight
} from 'lucide-react';

export default function Welcome({ auth }) {
    const [activeSection, setActiveSection] = useState('home');

    // 1. Setup IntersectionObserver for active section link highlighting
    useEffect(() => {
        const sections = ['home', 'preview', 'advantages', 'features', 'testimonials'];
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px', // trigger when section is in the upper middle area of viewport
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // 2. Setup IntersectionObserver for scroll-reveal animations
    useEffect(() => {
        const revealElements = document.querySelectorAll('.reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once visible to prevent toggling
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -12% 0px', // trigger slightly before item is fully visible
            threshold: 0.05
        });

        revealElements.forEach((el) => observer.observe(el));
        
        return () => observer.disconnect();
    }, []);

    // 3. Custom smooth scroll to target elements
    const handleScrollTo = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            // Update hash without jumping page
            window.history.pushState(null, '', `#${id}`);
        }
    };

    const navLinks = [
        { id: 'features', label: 'Fitur Utama' },
        { id: 'preview', label: 'Preview' },
        { id: 'advantages', label: 'Keunggulan' },
        { id: 'testimonials', label: 'Testimoni' }
    ];

    return (
        <div className="min-h-screen bg-slate-50/40 text-zinc-800 font-sans selection:bg-indigo-600 selection:text-white relative antialiased">
            <Head title="SatSet - Hybrid Kanban & Documentation SaaS" />

            {/* Custom Embedded CSS Styles for Scroll and Animation */}
            <style dangerouslySetInnerHTML={{ __html: `
                html {
                    scroll-behavior: smooth;
                }
                .reveal {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                    will-change: transform, opacity;
                }
                .reveal.active {
                    opacity: 1;
                    transform: translateY(0);
                }
                /* Staggered Delay classes */
                .reveal-delay-50 { transition-delay: 50ms; }
                .reveal-delay-100 { transition-delay: 100ms; }
                .reveal-delay-150 { transition-delay: 150ms; }
                .reveal-delay-200 { transition-delay: 200ms; }
                .reveal-delay-250 { transition-delay: 250ms; }
                .reveal-delay-300 { transition-delay: 300ms; }
                .reveal-delay-400 { transition-delay: 400ms; }
            `}} />

            {/* 1. HEADER / NAVIGATION */}
            <header className="sticky top-0 z-50 border-b border-zinc-150/80 bg-white/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 flex h-16 items-center justify-between">
                    {/* Brand Logo */}
                    <a 
                        href="#home" 
                        onClick={(e) => handleScrollTo(e, 'home')}
                        className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-extrabold text-white shadow-md shadow-indigo-500/20 text-sm">
                            SS
                        </div>
                        <span className="text-sm font-black tracking-wider text-zinc-950 uppercase">SatSet</span>
                    </a>

                    {/* Navigation Center */}
                    <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold text-zinc-500 uppercase tracking-wider h-full">
                        {navLinks.map((link) => (
                            <a 
                                key={link.id}
                                href={`#${link.id}`} 
                                onClick={(e) => handleScrollTo(e, link.id)}
                                className={`hover:text-zinc-950 transition-all h-full flex items-center border-b-2 px-1 relative ${
                                    activeSection === link.id 
                                        ? 'text-indigo-600 border-indigo-600 font-black' 
                                        : 'border-transparent text-zinc-400 font-extrabold hover:border-zinc-200'
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                id="nav-dashboard-btn"
                                href={route('dashboard')}
                                className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    id="nav-login-btn"
                                    href={route('login')}
                                    className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    id="nav-register-btn"
                                    href={route('register')}
                                    className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                                >
                                    Daftar Sekarang
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Grid Pattern Background for Hero */}
            <div className="absolute top-16 left-0 right-0 h-[720px] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0 opacity-60" />

            {/* 2. HERO SECTION ("Tentang website ini") */}
            <section id="home" className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-12 text-center scroll-mt-20">
                {/* Badge pill */}
                <div className="reveal inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 px-3.5 py-1.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-6">
                    <Sparkles size={10} className="text-indigo-600" />
                    <span>Hybrid Kanban & Notes Workspace</span>
                </div>

                <h1 className="reveal reveal-delay-100 text-4xl font-black text-zinc-950 tracking-tight sm:text-5xl leading-[1.08] max-w-3xl mx-auto">
                    Manajemen Proyek <span className="bg-gradient-to-r from-indigo-600 to-indigo-850 bg-clip-text text-transparent">Sat-Set</span> Tanpa Hambatan.
                </h1>

                <p className="reveal reveal-delay-200 max-w-xl mx-auto text-xs sm:text-sm text-zinc-500 leading-relaxed font-medium mt-6">
                    Aplikasi SaaS hibrida yang menggabungkan kecepatan papan Kanban interaktif dengan kebebasan editor dokumen Rich-Text (Tiptap) di setiap kartu tugas. Alternatif Jira dan Notion yang super ringan untuk developer dan agensi digital.
                </p>

                <div className="reveal reveal-delay-300 flex items-center justify-center gap-3 mt-8">
                    {auth.user ? (
                        <Link
                            id="hero-dashboard-btn"
                            href={route('dashboard')}
                            className="rounded-lg bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:scale-[1.02]"
                        >
                            Masuk ke Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                id="hero-register-btn"
                                href={route('register')}
                                className="rounded-lg bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:scale-[1.02]"
                            >
                                Coba Gratis Sekarang
                            </Link>
                            <a
                                id="hero-features-btn"
                                href="#preview"
                                onClick={(e) => handleScrollTo(e, 'preview')}
                                className="text-zinc-650 hover:text-zinc-900 text-xs font-bold transition-colors px-4 py-3 border border-zinc-200 bg-white/80 rounded-lg backdrop-blur-sm hover:border-zinc-300"
                            >
                                Lihat Preview
                            </a>
                        </>
                    )}
                </div>

                {/* Team avatar stack to represent modern community */}
                <div className="reveal reveal-delay-400 flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
                    <div className="flex -space-x-1.5">
                        {['Adit', 'Budi', 'Chandra', 'Dewi', 'Eka'].map((name, i) => (
                            <div 
                                key={name} 
                                title={name}
                                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-zinc-150 text-[8px] font-bold text-zinc-650 shadow-sm uppercase"
                            >
                                {name[0]}
                            </div>
                        ))}
                    </div>
                    <span>Didesain untuk Tim Developer & Agensi Digital Indonesia</span>
                </div>
            </section>

            {/* 3. PRODUCT PREVIEW SECTION ("Section ke dua berisi preview dari web ini") */}
            <section id="preview" className="relative z-10 mx-auto max-w-6xl px-6 py-16 scroll-mt-20">
                <div className="reveal text-center mb-8">
                    <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Live Application Preview</div>
                    <h2 className="text-xl font-extrabold text-zinc-950 sm:text-2xl tracking-tight">Antarmuka Papan Kanban SatSet</h2>
                </div>

                <div className="reveal reveal-delay-150 relative rounded-xl border border-zinc-200/80 bg-white p-2.5 shadow-2xl shadow-zinc-250/20">
                    {/* Mockup browser chrome */}
                    <div className="flex items-center justify-between px-3 pb-3 border-b border-zinc-100">
                        <div className="flex items-center gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-150 rounded px-2 py-0.5 text-[9px] text-zinc-400 font-bold ml-3 w-52 sm:w-80">
                                <Globe size={8} />
                                <span className="truncate">satset.app/w/reqtracker</span>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 text-[9px] text-zinc-405 font-bold uppercase tracking-wider">
                            <span>V1.0 MVP Ready</span>
                        </div>
                    </div>

                    {/* Actual Kanban Board Screenshot mockup inside */}
                    <div className="relative overflow-hidden rounded-b-lg border border-zinc-100 bg-zinc-50">
                        <img 
                            id="screenshot-preview-img"
                            src="/screenshot_kanban.png" 
                            alt="SatSet Kanban Board Preview" 
                            className="w-full object-cover max-h-[500px]"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                document.getElementById('screenshot-fallback').style.display = 'flex';
                            }}
                        />

                        {/* Screenshot fallback inside frame */}
                        <div 
                            id="screenshot-fallback"
                            className="hidden flex-col items-center justify-center p-20 text-center bg-zinc-950 text-zinc-400 font-mono text-[11px] min-h-[300px]"
                        >
                            <p className="text-zinc-650"># SatSet Kanban Board interface initialized...</p>
                            <p className="text-emerald-400 mt-2">✓ Workspace tenant: /w/reqtracker</p>
                            <p className="text-indigo-400">⚡ Dynamic Tiptap WYSIWYG notes inside tasks</p>
                            <p className="mt-4 text-zinc-500">[ screenshot_kanban.png loading status: cached ]</p>
                        </div>

                        {/* Floating explanatory badge */}
                        <div className="absolute bottom-4 right-4 bg-white/95 border border-zinc-200/80 rounded-lg p-3 shadow-md max-w-xs backdrop-blur-sm hidden sm:block hover:scale-105 transition-transform">
                            <div className="flex items-start gap-2">
                                <div className="h-5 w-5 rounded bg-indigo-50 flex items-center justify-center shrink-0">
                                    <Sparkles size={11} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-zinc-950 uppercase tracking-tight">Interactive Workspace</h4>
                                    <p className="text-[9px] text-zinc-500 leading-snug mt-0.5 font-medium">Klik pada kartu tugas untuk membuka kanvas dokumen Rich-Text Tiptap secara instan.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. ADVANTAGES SECTION ("Section 3 berisi perbandingan dengan website serupa") */}
            <section id="advantages" className="bg-white border-t border-zinc-150/80 py-24 scroll-mt-20">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="reveal text-center max-w-2xl mx-auto space-y-3 mb-16">
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Perbandingan Fitur</div>
                        <h2 className="text-2xl font-black text-zinc-950 tracking-tight sm:text-3xl">
                            Mengapa Menggunakan SatSet?
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-medium">
                            SatSet didesain khusus untuk menyelesaikan rasa frustrasi tim pengembang yang terjebak di antara kompleksitas Jira dan ketidakteraturan Notion.
                        </p>
                    </div>

                    {/* Advantages Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* SatSet vs Jira */}
                        <div className="reveal border border-zinc-200/80 rounded-2xl p-6 hover:shadow-lg hover:border-zinc-300 transition-all duration-200 bg-slate-50/30 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                                    <Zap size={18} className="text-rose-600" />
                                </div>
                                <h3 className="text-sm font-extrabold text-zinc-950 uppercase tracking-tight">SatSet vs Jira</h3>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                    Jira terkenal berat, lambat, dan penuh bloatware (fitur berlebih) yang membingungkan. SatSet didesain super ringan dengan navigasi SPA instan (Inertia + React) tanpa reload halaman. Setup cepat tanpa hambatan.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-[10px] font-bold text-rose-600">
                                <span>Lebih Ringan & Cepat ⚡</span>
                            </div>
                        </div>

                        {/* SatSet vs Notion */}
                        <div className="reveal reveal-delay-100 border border-zinc-200/80 rounded-2xl p-6 hover:shadow-lg hover:border-zinc-300 transition-all duration-200 bg-slate-50/30 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                    <Layers size={18} className="text-indigo-600" />
                                </div>
                                <h3 className="text-sm font-extrabold text-zinc-950 uppercase tracking-tight">SatSet vs Notion</h3>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                    Notion memiliki basis data yang sangat fleksibel tetapi tidak memiliki alur kerja status Kanban yang tegas. SatSet mengombinasikan dokumen kaya dengan alur penugasan serta prioritas status yang ketat dan jelas.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-[10px] font-bold text-indigo-600">
                                <span>Manajemen Lebih Terstruktur 📋</span>
                            </div>
                        </div>

                        {/* SatSet vs Trello */}
                        <div className="reveal reveal-delay-200 border border-zinc-200/80 rounded-2xl p-6 hover:shadow-lg hover:border-zinc-300 transition-all duration-200 bg-slate-50/30 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                    <FileText size={18} className="text-emerald-600" />
                                </div>
                                <h3 className="text-sm font-extrabold text-zinc-950 uppercase tracking-tight">SatSet vs Trello</h3>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                    Trello hanyalah papan Kanban dengan kartu deskripsi teks datar yang terbatas. Di SatSet, setiap kartu tugas merupakan kanvas dokumen WYSIWYG penuh (Tiptap) untuk menyimpan panduan teknis, log, dan coretan kode.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                                <span>Dokumen Kaya Terintegrasi 📝</span>
                            </div>
                        </div>
                    </div>

                    {/* Comparison table matrix */}
                    <div className="reveal reveal-delay-150 mt-16 overflow-x-auto rounded-xl border border-zinc-200/80">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-zinc-50 border-b border-zinc-200">
                                    <th className="p-4 font-bold text-zinc-900">Fitur / Kriteria</th>
                                    <th className="p-4 font-bold text-indigo-600 bg-indigo-50/40">SatSet (Hybrid)</th>
                                    <th className="p-4 font-bold text-zinc-400">Jira Software</th>
                                    <th className="p-4 font-bold text-zinc-400">Notion</th>
                                    <th className="p-4 font-bold text-zinc-400">Trello</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-zinc-150">
                                    <td className="p-4 font-bold text-zinc-800">Kecepatan Transisi SPA</td>
                                    <td className="p-4 text-emerald-600 font-bold bg-indigo-50/20">Instan (Inertia React)</td>
                                    <td className="p-4 text-zinc-500">Lambat / Reload</td>
                                    <td className="p-4 text-zinc-500">Sedang</td>
                                    <td className="p-4 text-zinc-500">Cukup Baik</td>
                                </tr>
                                <tr className="border-b border-zinc-150">
                                    <td className="p-4 font-bold text-zinc-800">Dokumentasi di Kartu Tugas</td>
                                    <td className="p-4 text-emerald-600 font-bold bg-indigo-50/20">Editor Tiptap Penuh</td>
                                    <td className="p-4 text-zinc-500">Teks Datar Terbatas</td>
                                    <td className="p-4 text-zinc-500">Dokumen Terpisah</td>
                                    <td className="p-4 text-zinc-500">Markdown Dasar</td>
                                </tr>
                                <tr className="border-b border-zinc-150">
                                    <td className="p-4 font-bold text-zinc-800">Kompleksitas Konfigurasi</td>
                                    <td className="p-4 text-emerald-600 font-bold bg-indigo-50/20">Sangat Rendah (Sat-Set)</td>
                                    <td className="p-4 text-zinc-500">Sangat Tinggi</td>
                                    <td className="p-4 text-zinc-500">Rendah</td>
                                    <td className="p-4 text-zinc-500">Sangat Rendah</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-zinc-800">Workspace Tenant Isolation</td>
                                    <td className="p-4 text-emerald-600 font-bold bg-indigo-50/20">Ya (Slug URL UUID)</td>
                                    <td className="p-4 text-zinc-500">Ya</td>
                                    <td className="p-4 text-zinc-500">Ya</td>
                                    <td className="p-4 text-zinc-500">Terbatas</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* 5. ADDITIONAL KEY FEATURES SECTION */}
            <section id="features" className="bg-slate-50/20 border-t border-zinc-150/80 py-24 scroll-mt-20">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="reveal text-center max-w-2xl mx-auto space-y-3 mb-16">
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Fitur Spesifik</div>
                        <h2 className="text-2xl font-black text-zinc-950 tracking-tight sm:text-3xl">
                            Semua yang Dibutuhkan untuk Mengelola Tim
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <Layout size={16} className="text-indigo-600" />,
                                title: "Kanban Board",
                                desc: "Papan tugas interaktif dengan alur status Backlog, To Do, In Progress, Review, dan Done."
                            },
                            {
                                icon: <FileText size={16} className="text-indigo-600" />,
                                title: "Tiptap Canvas",
                                desc: "Rich Text editor berdaya tinggi di setiap kartu untuk coretan kode dan spek detail."
                            },
                            {
                                icon: <Users size={16} className="text-indigo-600" />,
                                title: "RBAC Access",
                                desc: "Isolasi data workspace dengan kontrol peran Owner, Admin, Member, dan Viewer."
                            },
                            {
                                icon: <Clock size={16} className="text-indigo-600" />,
                                title: "Due Date & Priority",
                                desc: "Pantau tenggat waktu tugas dan prioritaskan mana yang harus dikerjakan terlebih dahulu."
                            }
                        ].map((item, idx) => (
                            <div 
                                key={idx} 
                                className="reveal border border-zinc-200/80 rounded-xl p-5 shadow-sm hover:border-zinc-350 hover:shadow transition-all duration-200 bg-white"
                                style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                                <div className="h-7 w-7 rounded bg-indigo-50 flex items-center justify-center mb-4">
                                    {item.icon}
                                </div>
                                <h4 className="text-xs font-extrabold text-zinc-950 uppercase tracking-tight">{item.title}</h4>
                                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium mt-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. TESTIMONIALS SECTION */}
            <section id="testimonials" className="bg-white border-t border-zinc-150/80 py-24 scroll-mt-20">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="reveal text-center max-w-2xl mx-auto space-y-3 mb-16">
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Testimoni Pengguna</div>
                        <h2 className="text-2xl font-black text-zinc-950 tracking-tight sm:text-3xl">
                            Dicintai oleh Tim Developer Lokal
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                name: 'Aris Setiawan',
                                handle: '@aris_setiawan',
                                role: 'Lead Developer, Agensi Digital',
                                text: 'Menggunakan SatSet sangat menghemat waktu tim kami. Kami tidak perlu lagi berpindah-pindah tab antara Notion untuk dokumentasi teknis dan Jira untuk status tugas. Semua ada di satu kartu Kanban!'
                            },
                            {
                                name: 'Bambang Pratama',
                                handle: '@bambangpratama',
                                role: 'Software Engineer & Freelancer',
                                text: 'Desain minimalis dan performa SPA-nya luar biasa cepat. Sebagai freelancer yang mengelola beberapa klien, isolasi workspace di SatSet membuat pengelolaan proyek klien teratur dan aman.'
                            },
                            {
                                name: 'Citra Kirana',
                                handle: '@citra_dev',
                                role: 'Product Manager, Startup Tech',
                                text: 'Tiptap integration di SatSet benar-benar game-changer. Diskusi spek detail dan coretan script terdokumentasi rapi di dalam kartu tugas. Sangat direkomendasikan bagi tim kecil yang gesit.'
                            }
                        ].map((testimonial, idx) => (
                            <div 
                                key={idx} 
                                className="reveal border border-zinc-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all bg-slate-50/40"
                                style={{ transitionDelay: `${idx * 150}ms` }}
                            >
                                <p className="text-xs text-zinc-500 leading-relaxed italic font-medium">"{testimonial.text}"</p>
                                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-zinc-100">
                                    <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-150 text-[10px] font-bold flex items-center justify-center text-indigo-700 uppercase">
                                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-zinc-950 leading-tight">{testimonial.name}</div>
                                        <div className="text-[9px] text-zinc-400 font-bold">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. CALL TO ACTION SECTION */}
            <section className="bg-zinc-950 text-white py-20 border-t border-zinc-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#312e81_0%,transparent_60%)] opacity-30 pointer-events-none" />
                <div className="reveal relative z-10 mx-auto max-w-4xl px-6 text-center space-y-6">
                    <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white">Siap Bekerja Lebih Cepat dan Sat-Set?</h2>
                    <p className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
                        Daftar sekarang untuk mengelola workspace Anda dan integrasikan Kanban board dengan dokumentasi kaya. Gratis untuk tim hingga 5 anggota.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                        {auth.user ? (
                            <Link
                                id="cta-dashboard-btn"
                                href={route('dashboard')}
                                className="rounded-lg bg-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-700 transition-colors"
                            >
                                Masuk ke Workspace
                            </Link>
                        ) : (
                            <>
                                <Link
                                    id="cta-register-btn"
                                    href={route('register')}
                                    className="rounded-lg bg-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Mulai Sekarang (Gratis)
                                </Link>
                                <Link
                                    id="cta-login-btn"
                                    href={route('login')}
                                    className="text-zinc-300 hover:text-white text-xs font-bold transition-colors px-6 py-3.5 border border-zinc-800 rounded-lg hover:border-zinc-700 bg-transparent"
                                >
                                    Login Tim Anda
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* 8. FOOTER */}
            <footer className="mx-auto max-w-7xl px-6 py-12 border-t border-zinc-200/60 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider gap-4 relative z-10 bg-slate-50/5">
                <p>© {new Date().getFullYear()} SatSet SaaS. Seluruh Hak Cipta Dilindungi.</p>
                <div className="flex gap-6">
                    <a href="#features" onClick={(e) => handleScrollTo(e, 'features')} className="hover:text-zinc-650 transition-colors">Fitur</a>
                    <a href="#advantages" onClick={(e) => handleScrollTo(e, 'advantages')} className="hover:text-zinc-650 transition-colors">Keunggulan</a>
                    <a href="#testimonials" onClick={(e) => handleScrollTo(e, 'testimonials')} className="hover:text-zinc-650 transition-colors">Testimoni</a>
                </div>
            </footer>
        </div>
    );
}

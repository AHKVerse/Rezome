import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Code2, 
  Cpu, 
  Globe, 
  Zap, 
  Award, 
  Mail, 
  Github, 
  Linkedin, 
  Send,
  ChevronDown,
  Terminal,
  Database,
  Bot,
  CircuitBoard,
  Sparkles,
  Menu,
  X,
  Globe2,
  MessageSquare,
  Eye,
  Phone
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }>>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const gyroRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);
  const isMobileRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particleCount = isMobileRef.current ? 25 : 50;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1, alpha: Math.random() * 0.5 + 0.2,
    }));
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobileRef.current) mouseRef.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
    };
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (isMobileRef.current && e.beta !== null && e.gamma !== null) gyroRef.current = { x: Math.max(-1, Math.min(1, e.gamma / 45)), y: Math.max(-1, Math.min(1, e.beta / 45)) };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    let frameCount = 0;
    const animate = () => {
      frameCount++;
      if (isMobileRef.current && frameCount % 2 !== 0) { animationRef.current = requestAnimationFrame(animate); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const input = isMobileRef.current ? gyroRef.current : mouseRef.current;
      particlesRef.current.forEach((particle, i) => {
        const parallaxX = input.x * (i % 3 + 1) * 0.5;
        const parallaxY = input.y * (i % 3 + 1) * 0.5;
        particle.x += particle.vx + parallaxX * 0.02;
        particle.y += particle.vy + parallaxY * 0.02;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 170, ${particle.alpha})`;
        ctx.fill();
      });
      const connectionStep = isMobileRef.current ? 3 : 1;
      const maxDistance = isMobileRef.current ? 80 : 120;
      for (let i = 0; i < particlesRef.current.length; i += connectionStep) {
        for (let j = i + 1; j < particlesRef.current.length; j += connectionStep) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.strokeStyle = `rgba(0, 212, 170, ${0.1 * (1 - distance / maxDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('deviceorientation', handleDeviceOrientation); cancelAnimationFrame(animationRef.current); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />;
};

const FloatingElements = () => {
  const mouseX = useMotionValue(0), mouseY = useMotionValue(0), gyroX = useMotionValue(0), gyroY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig), y = useSpring(mouseY, springConfig), gx = useSpring(gyroX, springConfig), gy = useSpring(gyroY, springConfig);
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      const handleOrientation = (e: DeviceOrientationEvent) => { if (e.beta !== null && e.gamma !== null) { gyroX.set(Math.max(-1, Math.min(1, e.gamma / 45)) * 30); gyroY.set(Math.max(-1, Math.min(1, e.beta / 45)) * 30); } };
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    } else {
      const handleMouseMove = (e: MouseEvent) => { mouseX.set((e.clientX / window.innerWidth - 0.5) * 50); mouseY.set((e.clientY / window.innerHeight - 0.5) * 50); };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY, gyroX, gyroY]);
  const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const moveX = isMobile ? gx : x, moveY = isMobile ? gy : y;
  return (
    <>
      <motion.div className="absolute top-20 right-[10%] w-42 h-42 glass rounded-2xl flex items-center justify-center animate-float hidden md:flex" style={{ x: useTransform(moveX, (v) => v * 1.5), y: useTransform(moveY, (v) => v * 1.5) }}><Code2 className="w-12 h-12 text-[#00d4aa]" /></motion.div>
      <motion.div className="absolute top-40 left-[5%] w-24 h-24 glass rounded-full flex items-center justify-center animate-float-delayed hidden md:flex" style={{ x: useTransform(moveX, (v) => v * -1), y: useTransform(moveY, (v) => v * -1) }}><Cpu className="w-10 h-10 text-[#00d4aa]" /></motion.div>
      <motion.div className="absolute bottom-40 right-[5%] w-28 h-28 glass rounded-2xl flex items-center justify-center animate-float hidden lg:flex" style={{ x: useTransform(moveX, (v) => v * 0.8), y: useTransform(moveY, (v) => v * 0.8) }}><CircuitBoard className="w-10 h-10 text-[#00d4aa]" /></motion.div>
      <motion.div className="absolute bottom-32 left-[8%] w-20 h-20 glass rounded-xl flex items-center justify-center animate-float-delayed hidden lg:flex" style={{ x: useTransform(moveX, (v) => v * -0.5), y: useTransform(moveY, (v) => v * -0.5) }}><Terminal className="w-8 h-8 text-[#00d4aa]" /></motion.div>
    </>
  );
};

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false), [scrolled, setScrolled] = useState(false);
  
  const lang = i18n.resolvedLanguage || i18n.language || 'fa';
  
  const changeLanguage = () => {
    const newLang = lang === 'fa' ? 'en' : 'fa';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.dir = newLang === 'fa' ? 'rtl' : 'ltr';
    window.location.reload();
  };

  useEffect(() => { 
    document.dir = lang === 'fa' ? 'rtl' : 'ltr';
    const handleScroll = () => setScrolled(window.scrollY > 50); 
    window.addEventListener('scroll', handleScroll, { passive: true }); 
    return () => window.removeEventListener('scroll', handleScroll); 
  }, [lang]);

  const navItems = [
    { name: t('nav.home'), href: '#hero' },
    { name: t('nav.skills'), href: '#skills' },
    { name: t('nav.achievements'), href: '#achievements' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'nav-blur border-b border-[#00d4aa]/10' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.a href="#hero" className="text-xl font-bold gradient-text" whileHover={{ scale: 1.05 }}>&lt;Dev /&gt;</motion.a>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (<motion.a key={item.name} href={item.href} className="text-sm text-gray-300 hover:text-[#00d4aa] transition-colors relative group" whileHover={{ y: -2 }}>{item.name}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00d4aa] transition-all group-hover:w-full" /></motion.a>))}
            <motion.button onClick={changeLanguage} className="text-sm text-gray-300 hover:text-[#00d4aa] transition-colors flex items-center gap-1" whileHover={{ y: -2 }}>
              <Globe2 className="w-4 h-4" />
              {lang === 'fa' ? 'EN' : 'فا'}
            </motion.button>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <button className="text-white p-2" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
        <motion.div initial={false} animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} className="md:hidden overflow-hidden">
          <div className="py-4 space-y-4">
            {navItems.map((item) => (<a key={item.name} href={item.href} className="block text-gray-300 hover:text-[#00d4aa] transition-colors" onClick={() => setIsOpen(false)}>{item.name}</a>))}
            <button onClick={changeLanguage} className="flex items-center gap-2 text-gray-300 hover:text-[#00d4aa] transition-colors">
              <Globe2 className="w-4 h-4" />
              {lang === 'fa' ? 'English' : 'فارسی'}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'fa';
  const mouseX = useMotionValue(0), mouseY = useMotionValue(0), gyroX = useMotionValue(0), gyroY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const x = useSpring(mouseX, springConfig), y = useSpring(mouseY, springConfig), gx = useSpring(gyroX, springConfig), gy = useSpring(gyroY, springConfig);
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      const handleOrientation = (e: DeviceOrientationEvent) => { if (e.beta !== null && e.gamma !== null) { gyroX.set(Math.max(-1, Math.min(1, e.gamma / 45)) * 20); gyroY.set(Math.max(-1, Math.min(1, e.beta / 45)) * 20); } };
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    } else {
      const handleMouseMove = (e: MouseEvent) => { mouseX.set((e.clientX / window.innerWidth - 0.5) * 30); mouseY.set((e.clientY / window.innerHeight - 0.5) * 30); };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY, gyroX, gyroY]);
  const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const rotateX = useTransform(isMobile ? gy : y, (v) => v * 0.5), rotateY = useTransform(isMobile ? gx : x, (v) => -v * 0.5);
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FloatingElements />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className={`text-center ${lang === 'fa' ? 'lg:text-right' : 'lg:text-left'}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6"><Sparkles className="w-4 h-4 text-[#00d4aa]" /><span className="text-sm text-gray-300">{t('hero.subtitle')}</span></motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl md:text-7xl font-bold mb-6"><span className="text-white">{t('hero.title')} </span><span className="gradient-text glow-text">{t('hero.name')}</span></motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">{t('hero.description')}</motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={`flex flex-wrap gap-4 ${lang === 'fa' ? 'lg:justify-end' : 'lg:justify-start'} justify-center`}>
              <motion.a href="#contact" className="btn-primary px-8 py-4 rounded-full font-semibold text-black flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Mail className="w-5 h-5" />{t('hero.contactBtn')}</motion.a>
              <motion.a href="#skills" className="px-8 py-4 rounded-full font-semibold border border-[#00d4aa]/30 text-[#00d4aa] hover:bg-[#00d4aa]/10 transition-colors flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Code2 className="w-5 h-5" />{t('hero.skillsBtn')}</motion.a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className={`flex gap-4 mt-8 ${lang === 'fa' ? 'lg:justify-end' : 'lg:justify-start'} justify-center`}>
              <motion.a href="mailto:Amiyhossen@gmail.com" className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-[#00d4aa] hover:border-[#00d4aa]/50 transition-colors" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}><Mail className="w-5 h-5" /></motion.a>
              <motion.a href="https://github.com/AHKVerse" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-[#00d4aa] hover:border-[#00d4aa]/50 transition-colors" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}><Github className="w-5 h-5" /></motion.a>
              <motion.a href="https://www.linkedin.com/in/amirhossein-keramati" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-[#00d4aa] hover:border-[#00d4aa]/50 transition-colors" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}><Linkedin className="w-5 h-5" /></motion.a>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="relative flex justify-center lg:justify-end" style={{ perspective: 1000 }}>
            <motion.div className="relative" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 bg-[#00d4aa]/20 rounded-3xl blur-3xl animate-pulse-glow" />
              <div className="relative w-80 h-80 md:w-[28rem] md:h-[28rem] glass-strong rounded-3xl p-2 animate-border-glow">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#00d4aa]/20 to-[#00a884]/20 flex items-center justify-center">
                  <div className="text-center">
                    <img src="/profile.webp" alt={t('hero.name')} className="w-56 h-56 md:w-80 md:h-80 mx-auto mb-4 rounded-full object-cover border-4 border-[#00d4aa] ring-4 ring-[#00d4aa]/30" onError={(e) => { e.currentTarget.style.display = 'none'; const fallback = e.currentTarget.nextElementSibling as HTMLElement; if (fallback) fallback.style.display = 'flex'; }} />
                    <div className="w-56 h-56 md:w-80 md:h-80 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#00a884] flex items-center justify-center glow-green" style={{ display: 'none' }}><Code2 className="w-28 h-28 md:w-40 md:h-40 text-black" /></div>
                    <p className="text-[#00d4aa] font-semibold">{t('profile.role')}</p>
                  </div>
                </div>
              </div>
              <motion.div className="absolute -top-4 -right-4 glass px-4 py-2 rounded-full flex items-center gap-2" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}><Bot className="w-4 h-4 text-[#00d4aa]" /><span className="text-xs font-medium">{t('badges.ai_ml')}</span></motion.div>
              <motion.div className="absolute -bottom-4 -left-4 glass px-4 py-2 rounded-full flex items-center gap-2" animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}><Zap className="w-4 h-4 text-[#00d4aa]" /><span className="text-xs font-medium">{t('badges.embedded')}</span></motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 text-gray-500"><span className="text-xs">{t('hero.scrollText')}</span><ChevronDown className="w-5 h-5" /></motion.div>
      </motion.div>
    </section>
  );
};

const SkillsSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const skillCategories = [
    { title: t('skills.categories.ml_dl'), icon: Bot, skills: [
      t('skills.skills.machine_learning'), t('skills.skills.deep_learning'), t('skills.skills.reinforcement_learning'),
      t('skills.skills.generative_ai'), t('skills.skills.neural_networks'), t('skills.skills.tensorflow'),
      t('skills.skills.pytorch'), t('skills.skills.keras'), t('skills.skills.scikit_learn'), t('skills.skills.model_training')
    ]},
    { title: t('skills.categories.nlp_llm'), icon: MessageSquare, skills: [
      t('skills.skills.nlp'), t('skills.skills.transformers'), t('skills.skills.llms'), t('skills.skills.fine_tuning'),
      t('skills.skills.embeddings'), t('skills.skills.prompt_engineering'), t('skills.skills.rag'), t('skills.skills.langchain'),
      t('skills.skills.ai_agents'), t('skills.skills.n8n'), t('skills.skills.hugging_face')
    ]},
    { title: t('skills.categories.computer_vision'), icon: Eye, skills: [
      t('skills.skills.computer_vision'), t('skills.skills.opencv'), t('skills.skills.yolo'), t('skills.skills.object_detection'),
      t('skills.skills.image_segmentation'), t('skills.skills.image_classification'), t('skills.skills.vision_model_training')
    ]},
    { title: t('skills.categories.programming'), icon: Code2, skills: [
      t('skills.skills.python'), t('skills.skills.cpp'), t('skills.skills.csharp'), 
       t('skills.skills.git'), t('skills.skills.linux'),
      t('skills.skills.jupyter'), t('skills.skills.vscode')
    ]},
    { title: t('skills.categories.web_backend'), icon: Globe, skills: [
      t('skills.skills.django'), t('skills.skills.fastapi'), t('skills.skills.react'), t('skills.skills.html_css'),
      t('skills.skills.bootstrap'), t('skills.skills.rest_api'), t('skills.skills.mysql'), t('skills.skills.postgresql')
    ]},
    { title: t('skills.categories.hardware_iot'), icon: Cpu, skills: [
      t('skills.skills.embedded_systems'), t('skills.skills.arduino'), t('skills.skills.raspberry'), t('skills.skills.esp32'),
      t('skills.skills.micropython'), t('skills.skills.electronics'), t('skills.skills.iot')
    ]},
  ];
  return (
    <section id="skills" className="relative py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-[#00d4aa] text-sm font-semibold tracking-wider uppercase">{t('skills.title')}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">{t('skills.heading')} <span className="gradient-text">{t('skills.highlight')}</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('skills.description')}</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div key={category.title} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.1 }} className="card-3d glass-strong rounded-2xl p-8 glow-border">
              <div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center"><category.icon className="w-6 h-6 text-[#00d4aa]" /></div><h3 className="text-xl font-bold">{category.title}</h3></div>
              <div className="flex flex-wrap gap-3">{category.skills.map((skill) => (<span key={skill} className="px-4 py-2 glass rounded-full text-sm text-gray-300">{skill}</span>))}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AchievementsSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const achievements = [
    { year: t('achievements.items.award1_year'), title: t('achievements.items.award1_title'), description: t('achievements.items.award1_desc'), icon: Award },
    { year: t('achievements.items.award2_year'), title: t('achievements.items.award2_title'), description: t('achievements.items.award2_desc'), icon: CircuitBoard },
    { year: t('achievements.items.award3_year'), title: t('achievements.items.award3_title'), description: t('achievements.items.award3_desc'), icon: Bot },
    { year: t('achievements.items.award4_year'), title: t('achievements.items.award4_title'), description: t('achievements.items.award4_desc'), icon: Zap },
    { year: t('achievements.items.award5_year'), title: t('achievements.items.award5_title'), description: t('achievements.items.award5_desc'), icon: Award },

  ];
  return (
    <section id="achievements" className="relative py-32" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="text-[#00d4aa] text-sm font-semibold tracking-wider uppercase">{t('achievements.title')}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">{t('achievements.heading')} <span className="gradient-text">{t('achievements.highlight')}</span></h2>
        </motion.div>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <motion.div key={achievement.year} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} className="flex items-start gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#00d4aa]/10 flex items-center justify-center shrink-0 glow-green">
                <achievement.icon className="w-6 h-6 md:w-7 md:h-7 text-[#00d4aa]" />
              </div>
              <motion.div className="flex-1 glass rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-800/50 hover:border-[#00d4aa]/30 transition-colors" whileHover={{ scale: 1.01 }}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[#00d4aa] font-bold text-sm md:text-base">{achievement.year}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-1">{achievement.title}</h3>
                <p className="text-gray-400 text-sm md:text-base">{achievement.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const mouseX = useMotionValue(0), mouseY = useMotionValue(0), gyroX = useMotionValue(0), gyroY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const x = useSpring(mouseX, springConfig), y = useSpring(mouseY, springConfig), gx = useSpring(gyroX, springConfig), gy = useSpring(gyroY, springConfig);
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      const handleOrientation = (e: DeviceOrientationEvent) => { if (e.beta !== null && e.gamma !== null) { gyroX.set(Math.max(-1, Math.min(1, e.gamma / 45)) * 15); gyroY.set(Math.max(-1, Math.min(1, e.beta / 45)) * 15); } };
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    } else {
      const handleMouseMove = (e: MouseEvent) => { mouseX.set((e.clientX / window.innerWidth - 0.5) * 20); mouseY.set((e.clientY / window.innerHeight - 0.5) * 20); };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY, gyroX, gyroY]);
  const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const rotateX = useTransform(isMobile ? gy : y, (v) => v * 0.5), rotateY = useTransform(isMobile ? gx : x, (v) => -v * 0.5);
  const stats = [{ value: '3+', label: t('about.stats.experience') }, { value: '10+', label: t('about.stats.projects') }, { value: '3', label: t('about.stats.awards') }, { value: '5+', label: t('about.stats.techs') }];
  const paragraphs = t('about.paragraphs', { returnObjects: true }) as string[];
  return (
    <section id="about" className="relative py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }} className="relative flex justify-center" style={{ perspective: 1000 }}>
            <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                <div className="absolute inset-0 rounded-full border-2 border-[#00d4aa]/20 animate-pulse-glow" />
                <div className="absolute inset-2 rounded-full border border-[#00d4aa]/10" />
                <div className="absolute inset-4 rounded-full glass-strong overflow-hidden glow-border">
                  <div className="w-full h-full bg-gradient-to-br from-[#00d4aa]/20 to-[#00a884]/20 flex items-center justify-center p-4">
                    <div className="text-center">
                      <img src="/profile.webp" alt={t('hero.name')} className="w-40 h-40 md:w-48 md:h-48 mx-auto mb-3 rounded-full object-cover border-4 border-[#00d4aa] ring-4 ring-[#00d4aa]/30" onError={(e) => { e.currentTarget.style.display = 'none'; const fallback = e.currentTarget.nextElementSibling as HTMLElement; if (fallback) fallback.style.display = 'flex'; }} />
                      <div className="w-40 h-40 md:w-48 md:h-48 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#00a884] flex items-center justify-center glow-green" style={{ display: 'none' }}><Code2 className="w-20 h-20 md:w-24 md:h-24 text-black" /></div>
                      <p className="text-[#00d4aa] font-semibold">{t('hero.name')}</p>
                      <p className="text-gray-400 text-xs">{t('profile.role')}</p>
                    </div>
                  </div>
                </div>
                <motion.div className="absolute -top-2 -right-2 w-10 h-10 glass rounded-xl flex items-center justify-center" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}><Database className="w-5 h-5 text-[#00d4aa]" /></motion.div>
                <motion.div className="absolute -bottom-2 -left-2 w-9 h-9 glass rounded-lg flex items-center justify-center" animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}><Terminal className="w-4 h-4 text-[#00d4aa]" /></motion.div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
            <span className="text-[#00d4aa] text-sm font-semibold tracking-wider uppercase">{t('about.title')}</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">{t('about.heading')} <span className="gradient-text">{t('about.highlight')}</span></h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
              {stats.map((stat, index) => (<motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }} className="text-center"><div className="text-3xl font-bold gradient-text">{stat.value}</div><div className="text-xs text-gray-500 mt-1">{stat.label}</div></motion.div>))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <section id="contact" className="relative py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-[#00d4aa] text-sm font-semibold tracking-wider uppercase">{t('contact.title')}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">{t('contact.heading')} <span className="gradient-text">{t('contact.highlight')}</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('contact.description')}</p>
        </motion.div>
        <div className="flex justify-center">
          <motion.div initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="space-y-8 w-full max-w-2xl">
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">{t('contact.info.title')}</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center"><Mail className="w-6 h-6 text-[#00d4aa]" /></div><div><p className="text-sm text-gray-500">{t('contact.info.email')}</p><a href="mailto:Amiyhossen@gmail.com" className="text-white hover:text-[#00d4aa] transition-colors">Amiyhossen@gmail.com</a></div></div>
                <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center"><Phone className="w-6 h-6 text-[#00d4aa]" /></div><div><p className="text-sm text-gray-500">{t('contact.info.phone')}</p><a href="tel:09217438035" className="text-white hover:text-[#00d4aa] transition-colors">09217438035</a></div></div>
                <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center"><Github className="w-6 h-6 text-[#00d4aa]" /></div><div><p className="text-sm text-gray-500">{t('contact.info.github')}</p><a href="https://github.com/AHKVerse" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#00d4aa] transition-colors">github.com/AHKVerse</a></div></div>
                <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center"><Linkedin className="w-6 h-6 text-[#00d4aa]" /></div><div><p className="text-sm text-gray-500">{t('contact.info.linkedin')}</p><a href="https://www.linkedin.com/in/amirhossein-keramati" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#00d4aa] transition-colors">linkedin.com/in/amirhossein-keramati</a></div></div>
              </div>
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4"><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4aa] opacity-75" /><span className="relative inline-flex rounded-full h-3 w-3 bg-[#00d4aa]" /></span><span className="text-[#00d4aa] font-semibold">{t('contact.availability.title')}</span></div>
              <p className="text-gray-400 text-sm">{t('contact.availability.text')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="relative py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left"><span className="text-xl font-bold gradient-text">&lt;Dev /&gt;</span><p className="text-gray-500 text-sm mt-2">{t('footer.tagline')}</p></div>
          <div className="flex gap-6">
            <motion.a href="mailto:Amiyhossen@gmail.com" className="text-gray-400 hover:text-[#00d4aa] transition-colors" whileHover={{ scale: 1.1, y: -2 }}><Mail className="w-5 h-5" /></motion.a>
            <motion.a href="https://github.com/AHKVerse" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00d4aa] transition-colors" whileHover={{ scale: 1.1, y: -2 }}><Github className="w-5 h-5" /></motion.a>
            <motion.a href="https://www.linkedin.com/in/amirhossein-keramati" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00d4aa] transition-colors" whileHover={{ scale: 1.1, y: -2 }}><Linkedin className="w-5 h-5" /></motion.a>
          </div>
          <p className="text-gray-600 text-sm">© 1403 {t('hero.name')}. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export function App() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      <ParticleBackground />
      <Navigation />
      <main className="relative z-10">
        <HeroSection />
        <SkillsSection />
        <AchievementsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

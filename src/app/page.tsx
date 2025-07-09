"use client";

import React, {
  useLayoutEffect,
  useRef,
  useState,
  CSSProperties,
  useEffect,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import AnimatedBackground from "@/components/animated-bg";
import NameForm from "@/components/NameForm";
import StudentIdForm from "@/components/StudentIdForm";
import InterestForm from "@/components/InterestForm";

// Register the GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// --- Type Definitions ---
interface Config {
  theme: "system" | "light" | "dark";
  animate: boolean;
  snap: boolean;
  start: number;
  end: number;
  scroll: boolean;
  debug: boolean;
}

interface CustomCSSProperties extends CSSProperties {
  "--count"?: number;
  "--i"?: number;
  "--start"?: number;
  "--end"?: number;
  "--hue"?: number;
}

// --- Main App Component ---
const App: React.FC = () => {
  // --- Configuration ---
  const [config] = useState<Config>({
    theme: "light",
    animate: true,
    snap: true,
    start: gsap.utils.random(0, 100, 1),
    end: gsap.utils.random(900, 1000, 1),
    scroll: true,
    debug: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const listItemsRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const nameFormRef = useRef<HTMLDivElement>(null);
  const studentIdFormRef = useRef<HTMLDivElement>(null);
  const interestFormRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    interests: [] as string[],
  });

  const handleNameSubmit = (name: string) => {
    setFormData((prev) => ({ ...prev, name }));
    studentIdFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStudentIdSubmit = (studentId: string) => {
    setFormData((prev) => ({ ...prev, studentId }));
    interestFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInterestsSubmit = (interests: string[]) => {
    const finalData = { ...formData, interests };
    setFormData(finalData);
    console.log("Form data submitted:", finalData);
    alert("Thank you for submitting!");
  };

  // --- Animation Logic ---
  useLayoutEffect(() => {
    // Set initial data attributes and CSS variables from config
    document.documentElement.dataset.theme = config.theme;
    document.documentElement.dataset.syncScrollbar = String(config.scroll);
    document.documentElement.dataset.animate = String(config.animate);
    document.documentElement.dataset.snap = String(config.snap);
    document.documentElement.dataset.debug = String(config.debug);
    document.documentElement.style.setProperty("--start", String(config.start));
    document.documentElement.style.setProperty("--hue", String(config.start));
    document.documentElement.style.setProperty("--end", String(config.end));

    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();
    window.addEventListener("resize", setVh);

    // GSAP animations will only run if CSS animations are not supported OR if config.animate is true
    const isCssAnimationSupported = CSS.supports(
      "(animation-timeline: scroll())"
    );

    if (!isCssAnimationSupported && config.animate) {
      const ctx = gsap.context(() => {
        const items = listItemsRef.current;
        if (items.length === 0) return;

        // Set initial opacity for items
        gsap.set(items, {
          opacity: (i) => (i === 0 ? 1 : 0.2),
        });

        // Timeline for dimming and brightening items on scroll
        const dimmer = gsap
          .timeline()
          .to(items.slice(1), { opacity: 1, stagger: 0.5 })
          .to(
            items.slice(0, items.length - 1),
            { opacity: 0.2, stagger: 0.5 },
            0
          );

        ScrollTrigger.create({
          trigger: items[0],
          endTrigger: items[items.length - 1],
          start: "center center",
          end: "center center",
          animation: dimmer,
          scrub: 0.2,
        });

        // Timeline for changing the --hue CSS variable for scrollbar color
        const scroller = gsap
          .timeline()
          .fromTo(
            document.documentElement,
            { "--hue": config.start },
            { "--hue": config.end, ease: "none" }
          );

        ScrollTrigger.create({
          trigger: items[0],
          endTrigger: items[items.length - 1],
          start: "center center",
          end: "center center",
          animation: scroller,
          scrub: 0.2,
        });

        // Animation for the scrollbar chroma (color intensity) entry
        gsap.fromTo(
          document.documentElement,
          { "--chroma": 0 },
          {
            "--chroma": 0.3,
            ease: "none",
            scrollTrigger: {
              scrub: 0.2,
              trigger: items[0],
              start: "center center+=40",
              end: "center center",
            },
          }
        );

        // Animation for the scrollbar chroma (color intensity) exit
        gsap.fromTo(
          document.documentElement,
          { "--chroma": 0.3 },
          {
            "--chroma": 0,
            ease: "none",
            scrollTrigger: {
              scrub: 0.2,
              trigger: items[items.length - 2],
              start: "center center",
              end: "center center-=40",
            },
          }
        );
      }, mainRef);

      // Cleanup function
      return () => {
        ctx.revert();
        window.removeEventListener("resize", setVh);
      };
    } else if (!config.animate) {
      // If animations are disabled via config, ensure everything is visible
      gsap.set(listItemsRef.current, { opacity: 1 });
      gsap.set(document.documentElement, { "--chroma": 0 });
    }
  }, [config]);

  // --- Data for the list ---
  const listContent = [
    "design.",
    "prototype.",
    "solve.",
    "build.",
    "develop.",
    "debug.",
    "learn.",
    "cook.",
    "ship.",
    "prompt.",
    "collaborate.",
    "create.",
    "inspire.",
    "follow.",
    "innovate.",
    "test.",
    "optimize.",
    "teach.",
    "visualize.",
    "transform.",
    "scale.",
    "do it.",
  ];

  return (
    <>
      <style>{`
        /* --- Google Fonts and Layers --- */
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        @import url('https://unpkg.com/normalize.css') layer(normalize);

        @layer normalize, base, demo, stick, effect, scrollbar, debug;
        
        /* --- Debug Layer --- */
        @layer debug {
          [data-debug='true'] li { outline: 0.05em dashed currentColor; }
          [data-debug='true'] :is(h2, li:last-of-type) { outline: 0.05em dashed canvasText; }
        }

        /* --- Scrollbar Layer --- */
        @layer scrollbar {
          @property --hue { syntax: '<number>'; inherits: false; initial-value: 0; }
          @property --chroma { syntax: '<number>'; inherits: true; initial-value: 0; }

          [data-sync-scrollbar='true'] { scrollbar-color: oklch(var(--lightness) var(--chroma) var(--hue)) #0000; }
          
          @supports (animation-timeline: scroll()) and (animation-range: 0% 100%) {
            [data-sync-scrollbar='true'][data-animate='true'] {
              timeline-scope: --list;
              scrollbar-color: oklch(var(--lightness) var(--chroma, 0) var(--hue)) #0000;
              animation-name: change, chroma-on, chroma-off;
              animation-fill-mode: both;
              animation-timing-function: linear;
              animation-range: entry 50% exit 50%, entry 40% entry 50%, exit 30% exit 40%;
              animation-timeline: --list;
            }
            [data-sync-scrollbar='true'][data-animate='true'] ul { view-timeline: --list; }
          }
          @keyframes change { to { --hue: var(--end); } }
          @keyframes chroma-on { to { --chroma: 0.3; } }
          @keyframes chroma-off { to { --chroma: 0; } }
        }

        /* --- Effect Layer --- */
        @layer effect {
          :root {
            --start: 0; --end: 360; --lightness: 65%; --base-chroma: 0.3;
          }
          [data-theme='dark'] { --lightness: 75%; }
          [data-theme='light'] { --lightness: 65%; }
          @media (prefers-color-scheme: dark) { :root { --lightness: 75%; } }
          
          ul { --step: calc((var(--end) - var(--start)) / (var(--count) - 1)); }
          li:not(:last-of-type) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * var(--i)))); }

          @supports (animation-timeline: scroll()) and (animation-range: 0% 100%) {
            [data-animate='true'] li {
              opacity: 0.2;
              animation-name: brighten;
              animation-fill-mode: both;
              animation-timing-function: linear;
              animation-range: cover calc(50% - 1lh) calc(50% + 1lh);
              animation-timeline: view();
            }
            [data-animate='true'] li:first-of-type { --start-opacity: 1; }
            [data-animate='true'] li:last-of-type { --brightness: 1; --end-opacity: 1; }
          }
          @keyframes brighten {
            0% { opacity: var(--start-opacity, 0.2); }
            50% { opacity: 1; filter: brightness(var(--brightness, 1.2)); }
            100% { opacity: var(--end-opacity, 0.2); }
          }
        }

        /* --- Sticky Layout Layer --- */
        @layer stick {
          .page-container {
            scroll-snap-type: y mandatory;
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
            overflow-y: scroll;
          }
          .page-section {
            scroll-snap-align: start;
            scroll-snap-stop: always;
          }
          .content-section { --font-level: 6; display: flex; line-height: 1.25; width: 100%; padding-left: 5rem; }
          .final-section { min-height: 100vh; display: flex; place-items: center; width: 100%; justify-content: center; }
          .final-section h2 { --font-level: 6; }
          main { width: 100%; }
          .content-section h2 { position: sticky; top: calc(50% - 0.5lh); font-size: inherit; margin: 0; display: inline-block; height: fit-content; font-weight: 600; }
          ul { font-weight: 600; padding-inline: 0; margin: 0; list-style-type: none; }
          [data-snap='true'] { scroll-snap-type: y proximity; }
          [data-snap='true'] li { scroll-snap-align: center; }
          h2, li:last-of-type { background: linear-gradient(canvasText 50%, color-mix(in oklch, canvas, canvasText 25%)); background-clip: text; color: #0000; }
        }

        /* --- Demo Base Styles Layer --- */
        @layer demo {
          header { min-height: 100vh; display: flex; place-items: center; width: 100%; padding-inline: 5rem; }
          footer { padding-block: 2rem; opacity: 0.5; text-align: center; }
          h1 { --font-size-min: 24; --font-level: 8; text-wrap: pretty; line-height: 0.8; margin: 0; background: linear-gradient(canvasText 60%, color-mix(in oklch, canvas, canvasText)); background-clip: text; color: #0000; }
        }

        /* --- Base Styles Layer --- */
        @layer base {
          :root { --font-size-min: 14; --font-size-max: 20; --font-ratio-min: 1.1; --font-ratio-max: 1.33; --font-width-min: 375; --font-width-max: 1500; }
          html { color-scheme: light dark; }
          [data-theme='light'] { color-scheme: light only; }
          [data-theme='dark'] { color-scheme: dark only; }
          
          .fluid {
            --fluid-min: calc(var(--font-size-min) * pow(var(--font-ratio-min), var(--font-level, 0)));
            --fluid-max: calc(var(--font-size-max) * pow(var(--font-ratio-max), var(--font-level, 0)));
            --fluid-preferred: calc((var(--fluid-max) - var(--fluid-min)) / (var(--font-width-max) - var(--font-width-min)));
            --fluid-type: clamp(
              (var(--fluid-min) / 16) * 1rem,
              ((var(--fluid-min) / 16) * 1rem) - (((var(--fluid-preferred) * var(--font-width-min)) / 16) * 1rem) + (var(--fluid-preferred) * 100vi),
              (var(--fluid-max) / 16) * 1rem
            );
            font-size: var(--fluid-type);
          }
          *, *:after, *:before { box-sizing: border-box; }
          body { display: grid; place-items: center; background: light-dark(white, black); min-height: 100vh; font-family: 'Geist', 'SF Pro Text', 'SF Pro Icons', 'AOS Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif, system-ui; }
          body::before {
            --size: 45px; --line: color-mix(in hsl, canvasText, transparent 70%); content: ''; height: 100vh; width: 100vw; position: fixed;
            background: linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size)) 50% 50% / var(--size) var(--size), linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% / var(--size) var(--size);
            mask: linear-gradient(-20deg, transparent 50%, white); top: 0; transform-style: flat; pointer-events: none; z-index: -1;
          }
          .bear-link { color: canvasText; position: fixed; top: 1rem; left: 1rem; width: 48px; aspect-ratio: 1; display: grid; place-items: center; opacity: 0.8; transition: opacity 0.3s; }
          .bear-link:is(:hover, :focus-visible) { opacity: 1; }
          .bear-link svg { width: 75%; }
          .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
        }
      `}</style>
      <div ref={mainRef} className="overflow-x-clip">
        <header className="page-section">
          <AnimatePresence onExitComplete={() => setIsLoaded(true)}>
            {isLoading && (
              <motion.div
                className="fixed inset-0 h-full bg-[#f8f9fa] z-50 flex justify-center items-center"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full"
                  animate={{
                    backgroundColor: [
                      "#4285F4",
                      "#DB4437",
                      "#F4B400",
                      "#0F9D58",
                      "#4285F4",
                    ],
                    scale: [1, 1.2, 1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  exit={{
                    scale: 30,
                    transition: {
                      duration: 0.8,
                      ease: [0.6, 0.01, -0.05, 0.9],
                    },
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="sync">
            {isLoaded && (
              <div>
                <motion.div
                  className="text-center"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.05,
                      },
                    },
                  }}
                >
                  <h2
                    className="text-6xl md:text-8xl font-bold tracking-tighter flex"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {"Animo.dev".split("").map((char, index) => {
                      const colors = [
                        "text-[#4285F4]",
                        "text-[#DB4437]",
                        "text-[#F4B400]",
                        "text-[#0F9D58]",
                        "text-[#4285F4]",
                        "text-gray-800",
                        "text-gray-800",
                        "text-gray-800",
                      ];
                      const colorClass = colors[index] || "text-gray-800";

                      return (
                        <motion.span
                          key={index}
                          className={colorClass}
                          variants={{
                            hidden: {
                              y: 50,
                              opacity: 0,
                              scale: 0.5,
                              filter: "blur(10px)",
                            },
                            visible: {
                              y: 0,
                              opacity: 1,
                              scale: 1,
                              filter: "blur(0px)",
                              transition: {
                                type: "spring",
                                damping: 15,
                                stiffness: 200,
                              },
                            },
                          }}
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                  </h2>
                </motion.div>

                <motion.div
                  className="absolute bottom-8 left-1/2 -translate-x-1/2"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ChevronDown />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatedBackground />
        </header>
        <main>
          <section className="content-section fluid page-section">
            <h2 className="fluid">
              <span aria-hidden="true">you can&nbsp;</span>
              <span className="sr-only">you can ship things.</span>
            </h2>
            <ul
              aria-hidden="true"
              style={{ "--count": listContent.length } as CustomCSSProperties}
            >
              {listContent.map((item, index) => (
                <li
                  key={item}
                  ref={(el) => {
                    if (el) listItemsRef.current[index] = el;
                  }}
                  style={{ "--i": index } as CustomCSSProperties}
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <div
            ref={nameFormRef}
            className="h-[100dvh] flex items-center justify-center page-section"
          >
            <NameForm onSubmit={handleNameSubmit} />
          </div>

          <div
            ref={studentIdFormRef}
            className="h-[100dvh] flex items-center justify-center page-section"
          >
            <StudentIdForm onSubmit={handleStudentIdSubmit} />
          </div>

          <div
            ref={interestFormRef}
            className="h-[100dvh] flex items-center justify-center page-section"
          >
            <InterestForm
              value={formData.interests}
              onSubmit={handleInterestsSubmit}
            />
          </div>
        </main>
        <footer className="page-section">@tyronscott_ 2024</footer>
      </div>
    </>
  );
};

export default App;

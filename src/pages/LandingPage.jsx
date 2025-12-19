import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "../lib/lenis.jsx";
import usePrefersReducedMotion from "../lib/usePrefersReducedMotion.js";
import LuxuryButton from "../components/LuxuryButton.jsx";

gsap.registerPlugin(ScrollTrigger);

function Container({ className = "", children }) {
  return <div className={`mx-auto max-w-6xl px-4 ${className}`.trim()}>{children}</div>;
}

function Hairline() {
  return <div className="h-px w-full bg-ivory/10" />;
}

export default function LandingPage() {
  const nav = useNavigate();
  const lenis = useLenis();
  const reducedMotion = usePrefersReducedMotion();

  const heroRef = useRef(null);
  const heroMediaRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroMetaRef = useRef(null);

  const projectsWrapRef = useRef(null);
  const projectsTrackRef = useRef(null);

  const journeyRef = useRef(null);
  const [journeyStep, setJourneyStep] = useState(0);
  const journeyStepRef = useRef(0);

  const projects = useMemo(
    () => [
      { title: "Graphite Minimal", tag: "Modern / Minimal", meta: "Detail-driven, clean volume." },
      { title: "Soft Pink Accents", tag: "Warm / Calm", meta: "White spaces, pink highlights." },
      { title: "Courtyard Light", tag: "Air & Light", meta: "Daylight-first planning." },
      { title: "Quiet Luxury", tag: "Craft / Finish", meta: "Tight joints, soft textures." },
      { title: "Seamless Living", tag: "Flow / Plan", meta: "Layout that feels effortless." },
    ],
    []
  );

  const steps = useMemo(
    () => [
      {
        title: "Consult",
        desc: "Kebutuhan, gaya, dan batasan budget — kita rapikan dari awal.",
        hint: "Kickoff → scope",
      },
      {
        title: "Design",
        desc: "Layout, fasad, dan moodboard. Keputusan cepat, dokumentasi rapi.",
        hint: "Concept → 3D",
      },
      {
        title: "Materials",
        desc: "Material dipilih dengan alasan: durability, maintenance, dan look.",
        hint: "Spec → samples",
      },
      {
        title: "Build",
        desc: "Eksekusi terukur: progress jelas, kualitas dicek berlapis.",
        hint: "Timeline → QA",
      },
      {
        title: "Handover",
        desc: "Serah-terima rapi, dokumentasi lengkap, siap ditempati.",
        hint: "As-built → warranty",
      },
    ],
    []
  );

  // Smooth scroll sync with ScrollTrigger
  useLayoutEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const t = setTimeout(() => ScrollTrigger.refresh(), 0);
    return () => {
      clearTimeout(t);
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  // Animations
  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // HERO: pin + transform to editorial
      if (heroRef.current && heroMediaRef.current && heroTitleRef.current && heroMetaRef.current) {
        gsap.set(heroMediaRef.current, { transformOrigin: "50% 50%" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=1200",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          heroMediaRef.current,
          { scale: 1.08, y: 0, filter: "blur(0px)" },
          { scale: 0.86, y: 70, filter: "blur(1px)", ease: "none" },
          0
        )
          .fromTo(
            heroTitleRef.current,
            { y: 0, opacity: 1 },
            { y: -40, opacity: 0.18, ease: "none" },
            0
          )
          .fromTo(
            heroMetaRef.current,
            { y: 0, opacity: 1 },
            { y: -24, opacity: 0, ease: "none" },
            0.05
          );
      }

      // PROJECTS: pinned horizontal scroll
      if (projectsWrapRef.current && projectsTrackRef.current) {
        const wrap = projectsWrapRef.current;
        const track = projectsTrackRef.current;

        const getX = () => {
          const total = track.scrollWidth;
          const vw = window.innerWidth;
          return Math.min(0, vw - total); // negative
        };

        gsap.set(track, { x: 0 });

        gsap.to(track, {
          x: () => getX(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => `+=${Math.max(900, track.scrollWidth)}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // JOURNEY: pinned steps + active state
      if (journeyRef.current) {
        const count = steps.length;

        ScrollTrigger.create({
          trigger: journeyRef.current,
          start: "top top",
          end: `+=${count * 520}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.max(0, Math.min(count - 1, Math.round(self.progress * (count - 1))));
            if (idx !== journeyStepRef.current) {
              journeyStepRef.current = idx;
              setJourneyStep(idx);
            }
          },
        });
      }
    });

    return () => ctx.revert();
  }, [reducedMotion, steps.length]);

  return (
    <div className="w-full">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-obsidian" />
          <div className="absolute inset-0 opacity-90 bg-[radial-gradient(900px_600px_at_18%_18%,rgba(255,77,166,0.22),transparent_62%),radial-gradient(1000px_700px_at_78%_78%,rgba(247,247,251,0.08),transparent_68%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/0 via-obsidian/40 to-obsidian" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(247,247,251,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(247,247,251,.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>

        <Container className="relative pt-16 sm:pt-20 pb-16">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <div className="text-xs tracking-luxe uppercase text-muted">
                Team Adhit · Custom Build
              </div>

              <h1
                ref={heroTitleRef}
                className="mt-4 text-[40px] leading-[1.02] sm:text-[64px] lg:text-[86px] font-semibold text-ivory"
              >
                Seamless custom home.
                <span className="block text-ivory/80">Built with calm precision.</span>
              </h1>

              <p ref={heroMetaRef} className="mt-6 max-w-xl text-muted text-base sm:text-lg">
                Scroll to explore: projects, build journey, and the details that make a home feel premium —
                without noise.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <LuxuryButton variant="accent" onClick={() => nav("/configurator")} className="px-5 py-3">
                  Start Build
                </LuxuryButton>
                <LuxuryButton
                  variant="secondary"
                  onClick={() => {
                    const el = document.getElementById("projects");
                    el?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
                  }}
                  className="px-5 py-3"
                >
                  View Work
                </LuxuryButton>
              </div>

              <div className="mt-10 flex items-center gap-4 text-xs text-muted">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rolex" />
                  Brand palette — gray / white / pink
                </span>
                <span className="h-px w-8 bg-ivory/15" />
                <span>Immersive, modern layout</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div
                ref={heroMediaRef}
                className="relative rounded-xl2 overflow-hidden border border-ivory/10 shadow-soft"
              >
                <div className="aspect-[4/5] bg-graphite">
                  <div className="absolute inset-0 opacity-90 bg-[radial-gradient(500px_500px_at_30%_20%,rgba(247,247,251,0.10),transparent_60%),radial-gradient(600px_500px_at_70%_80%,rgba(255,77,166,0.16),transparent_62%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/20 to-obsidian/0" />
                  <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_24%,black_82%,transparent)] opacity-[0.35] [background-image:linear-gradient(to_right,rgba(247,247,251,.18)_1px,transparent_1px)] [background-size:18px_18px]" />

                  <div className="absolute left-4 top-4 right-4 flex items-center justify-between">
                    <div className="text-[10px] tracking-luxe uppercase text-ivory/80">Project Preview</div>
                    <div className="text-[10px] tracking-luxe uppercase text-rolex">IMMERSIVE</div>
                  </div>

                  <div className="absolute left-4 bottom-4 right-4">
                    <div className="text-sm text-ivory">Graphite / Ivory / Blush</div>
                    <div className="mt-2 flex items-center gap-2 text-[10px] tracking-luxe uppercase text-muted">
                      <span className="h-2 w-16 rounded-full bg-rolex/70" />
                      <span>Scroll to continue</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* PROOF STRIP */}
      <section className="relative bg-obsidian">
        <Container className="py-10">
          <Hairline />
          <div className="grid sm:grid-cols-4 gap-6 py-8">
            {[
              { k: "Proses transparan", v: "Scope → spec → build" },
              { k: "Material terkurasi", v: "Durable & easy care" },
              { k: "Detail finishing", v: "Tight joints & clean lines" },
              { k: "Progress jelas", v: "Tracking & review" },
            ].map((i) => (
              <div key={i.k} className="rounded-xl2 border border-ivory/10 bg-graphite/30 p-5">
                <div className="text-[10px] tracking-luxe uppercase text-rolex">{i.k}</div>
                <div className="mt-2 text-sm text-ivory/85">{i.v}</div>
              </div>
            ))}
          </div>
          <Hairline />
        </Container>
      </section>

      {/* PROJECTS HORIZONTAL */}
      <section id="projects" ref={projectsWrapRef} className="relative bg-obsidian overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_bottom,rgba(247,247,251,.12)_1px,transparent_1px)] [background-size:100%_44px]" />

        <Container className="pt-16 pb-10">
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="text-xs tracking-luxe uppercase text-muted">Selected work</div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-ivory">
                Projects that feel fast, clean, and premium.
              </h2>
              <p className="mt-4 max-w-2xl text-muted">
                Gallery ini sengaja dibuat “scroll → horizontal” biar berasa immersive seperti referensi.
              </p>
            </div>

            <LuxuryButton
              variant="secondary"
              onClick={() => nav("/configurator")}
              className="hidden sm:inline-flex px-5 py-3"
            >
              Price Config
            </LuxuryButton>
          </div>
        </Container>

        <div className="relative">
          <div ref={projectsTrackRef} className="flex gap-6 px-4 pb-16 will-change-transform">
            {projects.map((p, idx) => (
              <article
                key={p.title}
                className="min-w-[78vw] sm:min-w-[460px] lg:min-w-[520px] rounded-xl2 border border-ivory/10 bg-graphite/30 overflow-hidden shadow-soft"
              >
                <div className="relative aspect-[16/10] bg-graphite">
                  <div className="absolute inset-0 opacity-95 bg-[radial-gradient(600px_420px_at_25%_20%,rgba(255,77,166,0.18),transparent_60%),radial-gradient(600px_450px_at_80%_80%,rgba(247,247,251,0.10),transparent_64%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/30 to-obsidian/0" />
                  <div className="absolute left-5 top-5 text-[10px] tracking-luxe uppercase text-ivory/80">
                    {String(idx + 1).padStart(2, "0")} · {p.tag}
                  </div>
                  <div className="absolute right-5 top-5 text-[10px] tracking-luxe uppercase text-rolex">
                    Feature
                  </div>
                  <div className="absolute left-5 bottom-5 right-5">
                    <div className="text-xl font-semibold text-ivory">{p.title}</div>
                    <div className="mt-2 text-sm text-muted">{p.meta}</div>
                  </div>
                </div>

                <div className="p-6 flex items-center justify-between gap-4">
                  <div className="text-xs tracking-luxe uppercase text-muted">Explore</div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rolex" />
                    <span className="text-xs text-ivory/75">Scroll →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section ref={journeyRef} className="relative bg-obsidian">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(247,247,251,.10)_1px,transparent_1px)] [background-size:84px_84px]" />
        <Container className="pt-16 pb-16 relative">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <div className="text-xs tracking-luxe uppercase text-muted">Build journey</div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-ivory">
                One flow. Clear decisions. No chaos.
              </h2>
              <p className="mt-4 text-muted">
                Bagian ini “pinned” supaya kamu bisa fokus ke setiap step, seperti editorial storytelling.
              </p>

              <div className="mt-8 space-y-3">
                {steps.map((s, i) => {
                  const active = i === journeyStep;
                  return (
                    <button
                      key={s.title}
                      onClick={() => {
                        journeyRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
                      }}
                      className={`w-full text-left rounded-xl2 border px-5 py-4 transition ${
                        active
                          ? "border-rolex/60 bg-graphite/45"
                          : "border-ivory/10 bg-graphite/25 hover:bg-graphite/35 hover:border-ivory/20"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-sm font-semibold text-ivory">{s.title}</div>
                        <div className="text-[10px] tracking-luxe uppercase text-muted">{s.hint}</div>
                      </div>
                      <div className="mt-2 text-sm text-muted">{s.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-xl2 border border-ivory/10 bg-graphite/30 overflow-hidden shadow-soft">
                <div className="relative aspect-[16/11] bg-graphite">
                  <div className="absolute inset-0 opacity-95 bg-[radial-gradient(650px_520px_at_25%_25%,rgba(255,77,166,0.20),transparent_60%),radial-gradient(750px_540px_at_70%_80%,rgba(247,247,251,0.12),transparent_65%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-obsidian/30 to-obsidian/0" />

                  <div className="absolute left-6 top-6 right-6 flex items-center justify-between">
                    <div className="text-[10px] tracking-luxe uppercase text-ivory/80">Active step</div>
                    <div className="text-[10px] tracking-luxe uppercase text-rolex">
                      {String(journeyStep + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="absolute left-6 bottom-6 right-6">
                    <div className="text-2xl font-semibold text-ivory">{steps[journeyStep]?.title}</div>
                    <div className="mt-2 text-muted">{steps[journeyStep]?.desc}</div>

                    <div className="mt-5 flex items-center gap-3">
                      {steps.map((_, i) => (
                        <span
                          key={i}
                          className={`h-1 rounded-full transition-all ${
                            i <= journeyStep ? "w-12 bg-rolex/80" : "w-8 bg-ivory/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs tracking-luxe uppercase text-muted">
                      Transparency · tracking · approval flow
                    </div>
                    <LuxuryButton variant="accent" onClick={() => nav("/configurator")} className="px-5 py-3">
                      Start from spec
                    </LuxuryButton>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {[
                  { k: "Documentation", v: "Setiap keputusan tercatat." },
                  { k: "Quality checks", v: "Layered QA sepanjang build." },
                  { k: "Timeline", v: "Milestone jelas & realistis." },
                  { k: "Budget clarity", v: "Estimasi lebih stabil." },
                ].map((x) => (
                  <div key={x.k} className="rounded-xl2 border border-ivory/10 bg-graphite/25 p-5">
                    <div className="text-[10px] tracking-luxe uppercase text-rolex">{x.k}</div>
                    <div className="mt-2 text-sm text-muted">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* MATERIALS */}
      <section className="relative bg-obsidian">
        <Container className="py-16">
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="text-xs tracking-luxe uppercase text-muted">Materials & details</div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-ivory">
                Clean surfaces. Tight details. Soft pink accents.
              </h2>
            </div>
            <div className="hidden md:block text-sm text-muted max-w-sm">
              Minimal, tapi tetap “berasa” mahal: bukan ramai, tapi rapi.
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-12 gap-6">
            <div className="md:col-span-7 rounded-xl2 border border-ivory/10 bg-graphite/30 overflow-hidden shadow-soft">
              <div className="relative aspect-[16/10] bg-graphite">
                <div className="absolute inset-0 opacity-95 bg-[radial-gradient(700px_420px_at_28%_22%,rgba(247,247,251,0.12),transparent_60%),radial-gradient(640px_500px_at_78%_80%,rgba(255,77,166,0.16),transparent_62%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/30 to-obsidian/0" />
                <div className="absolute left-6 bottom-6 right-6">
                  <div className="text-[10px] tracking-luxe uppercase text-rolex">Signature</div>
                  <div className="mt-2 text-xl font-semibold text-ivory">Facade & lighting composition</div>
                  <div className="mt-2 text-muted">Kontras graphite + ivory, highlight pink tipis.</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 grid gap-6">
              {[
                { k: "Wood", v: "Warm texture, easy maintenance." },
                { k: "Stone", v: "Durable, clean edge finishing." },
                { k: "Paint", v: "Neutral white, consistent tone." },
                { k: "Hardware", v: "Soft sheen, no visual noise." },
              ].map((x) => (
                <div key={x.k} className="rounded-xl2 border border-ivory/10 bg-graphite/25 p-6">
                  <div className="text-[10px] tracking-luxe uppercase text-rolex">{x.k}</div>
                  <div className="mt-2 text-sm text-muted">{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative bg-obsidian">
        <Container className="py-16">
          <div className="text-xs tracking-luxe uppercase text-muted">Trust</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-ivory">Calm process, confident results.</h2>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { q: "“Prosesnya enak, nggak bikin pusing. Setiap keputusan jelas dan cepat.”", n: "Client · Custom Build" },
              { q: "“Finishing rapi banget. Detail kecilnya kerasa premium.”", n: "Owner · Renovation" },
              { q: "“Estimasi lebih stabil karena semua spec dibahas dari awal.”", n: "Client · New Home" },
            ].map((t) => (
              <div key={t.n} className="rounded-xl2 border border-ivory/10 bg-graphite/25 p-6">
                <div className="text-ivory/85">{t.q}</div>
                <div className="mt-4 text-[10px] tracking-luxe uppercase text-rolex">{t.n}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-obsidian" />
        <div className="absolute inset-0 opacity-90 bg-[radial-gradient(900px_600px_at_20%_30%,rgba(255,77,166,0.18),transparent_62%),radial-gradient(900px_700px_at_85%_75%,rgba(247,247,251,0.10),transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/0 via-obsidian/35 to-obsidian" />

        <Container className="relative py-20">
          <div className="rounded-xl2 border border-ivory/10 bg-graphite/30 p-8 sm:p-12 shadow-soft">
            <div className="text-xs tracking-luxe uppercase text-muted">Next step</div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-semibold text-ivory">
              Start with specs.
              <span className="block text-ivory/80">We’ll make it seamless.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-muted text-base sm:text-lg">
              Masuk ke configurator untuk memilih ukuran, material, dan estimasi awal. Kalau mau konsultasi dulu,
              kita bisa mulai dari sana.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <LuxuryButton variant="accent" onClick={() => nav("/configurator")} className="px-6 py-3">
                Open Configurator
              </LuxuryButton>
              <LuxuryButton
                variant="secondary"
                onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })}
                className="px-6 py-3"
              >
                Back to top
              </LuxuryButton>
            </div>

            <div className="mt-8 text-[10px] tracking-luxe uppercase text-muted">
              © Team Adhit. All rights reserved.
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

import React from 'react';
import { ShieldCheck, Award, FileText, CheckCircle2, FlaskConical, Eye, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function QualityPage() {
  const testingSteps = [
    {
      title: "Thread Count & Weight Check",
      desc: "Checking cotton weave structure to conform strictly to EN 14079 gauze standards.",
      icon: Eye
    },
    {
      title: "Bio-Burden Assessment",
      desc: "Pre-sterilization microbial counts are checked to ensure cleanliness before EO exposure.",
      icon: FlaskConical
    },
    {
      title: "Sterility Verification",
      desc: "Ethylene Oxide (EO) gas levels and biological indicator tapes are validated for sterile batches.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="bg-surface dark:bg-slate-900 transition-colors py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-primary dark:text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3.5 py-1.5 rounded-full">
            Compliance & Standards
          </span>
          <h1 className="text-4xl font-heading font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Quality Assurance Certificate (QAC)
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            MediTex operates state-of-the-art sterile manufacturing environments certified under global healthcare benchmarks.
          </p>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm space-y-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center text-primary dark:text-blue-400">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">ISO 13485:2016 Certified</h2>
            <p className="text-sm text-gray-600 dark:text-gray-450 leading-relaxed">
              Our quality management system is certified for the design, manufacturing, and distribution of sterile and non-sterile surgical medical dressings. We maintain rigorous documentation control and process traceability from raw harvest to hospital receipt.
            </p>
            <ul className="space-y-3 text-sm text-gray-550 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-secondary flex-shrink-0" />
                <span>Annual auditing by recognized European notified bodies</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-secondary flex-shrink-0" />
                <span>Complete batch record archiving for 10+ years</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm space-y-6">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">CE Compliance & EU MDR</h2>
            <p className="text-sm text-gray-600 dark:text-gray-450 leading-relaxed">
              MediTex products meet the stringent expectations set by the European Union Medical Device Regulation (EU 2017/745). This guarantees conformity on bio-compatibility, low linting properties, and reliable fluid retention dynamics.
            </p>
            <ul className="space-y-3 text-sm text-gray-550 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-secondary flex-shrink-0" />
                <span>Declaration of Conformity available for all sterile bandages</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-secondary flex-shrink-0" />
                <span>Unique Device Identification (UDI) compliance labeling</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Manufacturing Protocol Workflow */}
        <div className="bg-gradient-to-br from-primary to-blue-800 rounded-3xl text-white p-8 md:p-12 mb-20 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="relative z-10 space-y-8">
            <div className="max-w-2xl">
              <h3 className="text-sm font-bold text-teal-300 uppercase tracking-widest mb-2">Internal Validation Procedures</h3>
              <h4 className="text-3xl font-heading font-extrabold">State-of-the-Art Laboratory Auditing</h4>
              <p className="text-blue-100 mt-3 text-sm leading-relaxed">
                Before leaving our manufacturing headquarters, each production batch undergoes a series of strict verification workflows to confirm physical, chemical, and biological stability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {testingSteps.map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-teal-300">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-base">{step.title}</h5>
                    <p className="text-xs text-blue-100 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quote Call To Action */}
        <div className="bg-white dark:bg-slate-800 border border-gray-150/60 dark:border-slate-700/60 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="space-y-1 mb-6 md:mb-0">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Require Certification Copies?</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Request certifications, CE files, or cleanroom registration certificates with your quote basket.</p>
          </div>
          <Link
            href="/quote-request"
            className="inline-flex justify-center items-center gap-1.5 px-6 py-3 bg-primary text-white hover:bg-opacity-95 rounded-full font-bold text-sm transition-all transform hover:-translate-y-0.5"
          >
            Go to Quote Cart
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

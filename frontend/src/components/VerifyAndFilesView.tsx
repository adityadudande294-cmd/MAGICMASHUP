import {
  ShieldCheck,
  FolderOpen,
  UploadCloud,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface VerifyAndFilesViewProps {
  viewType: 'Verify' | 'Files';
  onNavigateToCompare: () => void;
}

export const VerifyAndFilesView: React.FC<VerifyAndFilesViewProps> = ({
  viewType,
  onNavigateToCompare
}) => {
  if (viewType === 'Verify') {
    return (
      <div className="flex-1 h-screen overflow-y-auto bg-[#070B12] text-slate-100 p-8 flex flex-col justify-center items-center">
        <div className="max-w-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Consensus & Hallucination Verifier
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automatically cross-verifies factual claims made by GPT-4o, Claude 3.5 Sonnet, and Gemini Pro to highlight agreements and detect subtle hallucinations.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Multi-LLM Consensus Check</span>
            </div>
            <p className="text-slate-400">
              When all active models agree on facts, claims are marked with high consensus confidence.
            </p>
            <div className="flex items-center gap-2 text-amber-400 font-semibold pt-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Divergence Alerts</span>
            </div>
            <p className="text-slate-400">
              Conflicting statistics or dates between models are highlighted for review.
            </p>
          </div>

          <button
            onClick={onNavigateToCompare}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white text-xs font-bold shadow-lg transition-all"
          >
            Open Compare Studio to Test Consensus →
          </button>

          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <img
              src="/ampexweb-logo.png"
              alt="Ampexweb"
              className="h-4.5 w-4.5 rounded object-contain bg-white/95 p-0.5"
            />
            <span>Powered by <strong className="text-slate-300">Ampexweb</strong> · An Ampexweb Product</span>
          </div>
        </div>
      </div>
    );
  }

  // Files view
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#070B12] text-slate-100 p-8 flex flex-col justify-center items-center">
      <div className="max-w-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <FolderOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Enterprise Knowledge & File Insights
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Upload PDF reports, CSV datasets, and source code repositories to evaluate how each LLM parses and processes complex context.
        </p>

        <div className="p-8 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-3xl bg-slate-900/60 transition-colors flex flex-col items-center cursor-pointer">
          <UploadCloud className="w-10 h-10 text-slate-500 mb-2" />
          <span className="text-xs font-semibold text-slate-200">
            Drag and drop documents here, or browse files
          </span>
          <span className="text-[11px] text-slate-500 mt-1">
            Supports PDF, DOCX, TXT, CSV, MD, JSON (Max 50MB)
          </span>
        </div>

        <button
          onClick={onNavigateToCompare}
          className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-medium transition-all"
        >
          Return to Compare Studio
        </button>

        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <img
            src="/ampexweb-logo.png"
            alt="Ampexweb"
            className="h-4.5 w-4.5 rounded object-contain bg-white/95 p-0.5"
          />
          <span>Powered by <strong className="text-slate-300">Ampexweb</strong> · An Ampexweb Product</span>
        </div>
      </div>
    </div>
  );
};
